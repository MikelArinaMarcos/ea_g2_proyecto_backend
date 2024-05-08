import app from "./config/app";
import env from './environment';
import {Server} from 'Socket.io';

const PORT = env.getPort();
app.listen(PORT, () => {
   console.log('Express server listening on port ' + PORT);
});

const io =require('socket.io')(Server);

io.on('connection',(socket)=>{
   console.log('Connected successfully', socket.id);
});