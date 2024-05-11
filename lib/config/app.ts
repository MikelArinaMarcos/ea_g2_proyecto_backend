import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import environment from "../environment";
import { UserRoutes } from "../routes/user";
import { ActivityRoutes } from "../routes/activity";
import { CommentRoutes } from "../routes/comment";
import {AuthRoutes} from "../routes/auth";
import{Server} from "socket.io";

class App {

   public app: express.Application;
   public mongoUrl: string = 'mongodb://127.0.0.1:27017/' + environment.getDBName();
   private io: Server;


   
   private user_routes: UserRoutes = new UserRoutes();
   private activity_routes: ActivityRoutes = new ActivityRoutes();
   private comment_routes: CommentRoutes = new CommentRoutes();
   private auth_routes: AuthRoutes= new AuthRoutes();
   


   constructor() {
      this.app = express();
      this.config();
      this.mongoSetup();
      this.user_routes.route(this.app);
      this.auth_routes.route(this.app);
      this.activity_routes.route(this.app);
      this.comment_routes.route(this.app);
      //this.setupSockets(this.io);
   }
  
   
   

   private config(): void {
      // support application/json type post data
      this.app.use(bodyParser.json());
      //support application/x-www-form-urlencoded post data
      this.app.use(bodyParser.urlencoded({ extended: false }));
      // Enable CORS for all origins
      this.app.use(cors());
   }

   private mongoSetup(): void {
      mongoose.connect(this.mongoUrl)
          .then(() => {
              console.log("MongoDB connected successfully.");
          })
          .catch((err) => {
              console.error("MongoDB connection error:", err);
          });
  }

  private setupSockets(io: Server) : void {
   
   this.io = io;
   
   const connectedUser = new Set();
   this.io.on('connection', (socket) => {
      console.log('Connected successfully', socket.id);
      connectedUser.add(socket.id);
      this.io.emit('connected-user', connectedUser.size);
      socket.on('disconnect', () => {
         console.log('Disconnected successfully', socket.id);
         connectedUser.delete(socket.id);
         this.io.emit('connected-user', connectedUser.size);
      });
      socket.on('Message', (data: any) => {
         console.log(data);
         socket.broadcast.emit('message-receive', data);
      });
   }); 
}

}
export default new App().app;