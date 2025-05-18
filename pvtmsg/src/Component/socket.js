import { io } from "socket.io-client";

const socket = io("http://10.176.96.81:8083")

export default socket