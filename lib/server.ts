import app from './config/app';
import env from './environment';
import { Server } from 'socket.io';
import WebSocket from 'ws';
import { HttpsProxyAgent } from 'https-proxy-agent';
import User from './models/users/schema';
import { AuthJWT } from './middlewares/authJWT';

const authJWT = new AuthJWT();
const PORT = env.getPort();
const agent = new HttpsProxyAgent('http://168.63.76.32:3128');

const server = app.listen(PORT, () => {
  console.log('Express server listening on port ' + PORT);
});

const io = new Server(server);
//const wss = new WebSocket.Server({ server, clientTracking: true, agent });

const connectedUser = new Set();

  //wss.use((socket, next) => {
io.use((socket, next) => {
  console.log(socket.handshake, socket.handshake.auth.token);
  authJWT.verifyTokenSocket(socket, next);
});
//wss.on('connection', (socket) => {
io.on('connection', (socket) => {
  console.log('Connected successfully', socket.id, socket.handshake.time);
  connectedUser.add(socket.id);
  //wss.emit('connected-user', connectedUser.size);
  io.emit('connected-user', connectedUser.size);
  socket.on('disconnect', () => {
    console.log('Disconnected successfully', socket.id);
    connectedUser.delete(socket.id);
    io.emit('connected-user', connectedUser.size);
    //wss.emit('connected-user', connectedUser.size);
  });

  socket.on('manual-disconnect', () => {
    console.log('Manual disconnect requested', socket.id);
    socket.disconnect();
  });

  socket.on('message', async (data) => {
    const user = await User.findById(data.id);
    data.userName = user.name;

    console.log(data);
    //wss.broadcast.emit('message-receive', data);
    socket.broadcast.emit('message-receive', data);
  });
});
