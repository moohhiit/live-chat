import { useEffect, useState } from "react";
import "./App.css"
import socket from "./Component/socket";


function App() {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [userList, setuserList] = useState([])



  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      const sysmesg = { text: `New user join ${name}`, sender: 'System' }
      socket.emit("new_user", sysmesg)

      setSubmitted(true);
    }
  };


  const handleSendMessage = (e) => {
    e.preventDefault();


    if (input.trim() !== "") {
      const newMsg = { text: input, sender: name };
      setMessages(prev => [...prev, newMsg]);
      socket.emit("send_message", newMsg);
      setInput("");
    }


  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages(prev => [...prev, data]);
    });
    socket.on("rev_user", (user) => {
      setMessages(prev => [...prev, user])
    })
    return () => {
      socket.off("rev_user");
      socket.off("receive_message");
    };
  }, []);

  return (
    <div className="flex   ">
      {!submitted ? (
        <div className="flex items-center justify-center min-h-screen ">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm"
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-black">Enter Your Name</h2>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col w-full  h-[85vh] bg-white rounded-xl shadow-md p-4">

          <h2 className="text-xl font-semibold mb-2 text-center text-black">Welcome, {name}!</h2>
          <div className="flex-1 overflow-y-auto border rounded p-3 space-y-3 mb-3">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center">No messages yet. Start chatting!</p>
            ) : (
              messages.map((msg, index) => (

                <div
                  key={index}
                  className={`flex ${msg.sender === name ? "justify-end" : msg.sender === "System" ? "justify-center" : "justify-start"}`}
                >
                  {
                    msg.sender === "System" ? <p className="text-gray-500 text-center">{msg.text}</p> :
                      <div
                        className={`text-sm p-2 rounded-lg max-w-[80%] break-words ${msg.sender === name
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
                          }`}
                      >

                        <strong>{msg.sender}:</strong> {msg.text}
                      </div>
                  }

                </div>
              ))
            )}
          </div>
          <form onSubmit={handleSendMessage} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
