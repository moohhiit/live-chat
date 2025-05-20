import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from "cors"

const app = express();
const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin:"*"
    }
})

app.use(cors());

io.on('connection' , (socket)=>{
  console.log('User connected:', socket.id);

  // Create a Room 
  socket.on("join-room" , (room_name , name)=>{
    console.log(room_name , name)
    socket.join(room_name);
    socket.to(room_name).emit('message' , {text : `${name} Join the room` , sender : 'System'})
  })
  
  
  // Send Message to Room 
  socket.on('sendmessageinroom' , (roomName ,message_data)=>{
    console.log("Room Message Trigerd")
    socket.to(roomName).emit('message' , message_data)
  })



  socket.on('new_user' , (data)=>{
    console.log("New User Connected" , data )
    socket.broadcast.emit('rev_user' , data)
  })
  // socket.broadcast.emit('receive_message' , {{ text: input, sender: name }?})
  socket.on('send_message', (data) => {
    socket.broadcast.emit('receive_message', data); // Send to others
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
})



app.get('/', (req, res) => {
  res.send('Hello world');
});

server.listen(3001, () => {
  console.log('server running at http://localhost:3001');
});