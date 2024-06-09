import { application } from "express";
import app from "./config/app";
import env from './environment';
import{Server} from 'socket.io';
import User from './models/users/schema';
import {AuthJWT} from './middlewares/authJWT';


const authJWT :AuthJWT = new AuthJWT();
const PORT = env.getPort();
const server=app.listen(PORT, () => {
   console.log('Express server listening on port ' + PORT);
});
const io = new Server(server);
   
const connectedUser = new Set();

io.use((socket, next) => {
   console.log(socket.handshake, socket.handshake.auth.token);
   authJWT.verifyTokenSocket(socket, next)

});

io.on('connection', (socket) => {
   console.log('Connected successfully', socket.id, socket.handshake.time);
   connectedUser.add(socket.id);
   io.emit('connected-user', connectedUser.size);
   socket.on('disconnect', () => {
      console.log('Disconnected successfully', socket.id);
      connectedUser.delete(socket.id);
      io.emit('connected-user', connectedUser.size);
   });

   socket.on('manual-disconnect', () => {
      console.log('Manual disconnect requested', socket.id);
      socket.disconnect();
  });

   socket.on('message', async(data) => {
      const user = await User.findById(data.id)
      data.userName=user.name;
         
      console.log(data);
      socket.broadcast.emit('message-receive', data );
   });
}); 



