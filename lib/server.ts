import { application } from "express";
import app from "./config/app";
import env from './environment';
import{Server} from 'socket.io';



const PORT = env.getPort();
const server=app.listen(PORT, () => {
   console.log('Express server listening on port ' + PORT);
});
const io = new Server(server);

const connectedUser = new Set();
io.on('connection', (socket) => {
   console.log('Connected successfully', socket.id);
   connectedUser.add(socket.id);
   io.emit('connected-user', connectedUser.size);
   socket.on('disconnect', () => {
      console.log('Disconnected successfully', socket.id);
      connectedUser.delete(socket.id);
      io.emit('connected-user', connectedUser.size);
   });
   socket.on('message', (data) => {
      console.log(data);
      socket.broadcast.emit('message-receive', data);
   });
}); 



