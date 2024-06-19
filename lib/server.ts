import app from './config/app';
import env from './environment';
import { Server } from 'socket.io';
import WebSocket from 'ws';
import { HttpsProxyAgent } from 'https-proxy-agent';
import User from './models/users/schema';
import { AuthJWT } from './middlewares/authJWT';

const authJWT = new AuthJWT();
const PORT = env.getPort();
const agent = new HttpsProxyAgent('https://front.spotfinder.duckdns.org');

const server = app.listen(PORT, () => {
  console.log('Express server listening on port ' + PORT);
});

const io = new Server(server);
const wss = new WebSocket.Server({ server, clientTracking: true, agent });

const connectedUser = new Set();

  wss.use((socket, next) => {
  console.log(socket.handshake, socket.handshake.auth.token);
  authJWT.verifyTokenSocket(socket, next);
});
wss.on('connection', (socket) => {
  console.log('Connected successfully', socket.id, socket.handshake.time);
  connectedUser.add(socket.id);
  wss.emit('connected-user', connectedUser.size);
  socket.on('disconnect', () => {
    console.log('Disconnected successfully', socket.id);
    connectedUser.delete(socket.id);
    wss.emit('connected-user', connectedUser.size);
  });

  socket.on('manual-disconnect', () => {
    console.log('Manual disconnect requested', socket.id);
    socket.disconnect();
  });

  socket.on('message', async (data) => {
    const user = await User.findById(data.id);
    data.userName = user.name;

    console.log(data);
    wss.broadcast.emit('message-receive', data);
  
  });
});
