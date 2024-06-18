import app from './config/app';
import env from './environment';
import { Server } from 'socket.io';
import User from './models/users/schema';
import { AuthJWT } from './middlewares/authJWT';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';

const authJWT = new AuthJWT();
const PORT = env.getPort();

// Configurar sesión
app.use(session({
  secret: env.getSessionSecret(),
  resave: false,
  saveUninitialized: true
}));

// Inicializar passport
app.use(passport.initialize());
app.use(passport.session());

// Configurar la estrategia de Google
passport.use(new GoogleStrategy({
  clientID: env.getGoogleClientID(),
  clientSecret: env.getGoogleClientSecret(),
  callbackURL: env.getGoogleCallbackURL()
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({ googleId: profile.id, name: profile.displayName });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Rutas de autenticación
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
});

const server = app.listen(PORT, () => {
  console.log('Express server listening on port ' + PORT);
});

const io = new Server(server);

const connectedUser = new Set();

io.use((socket, next) => {
  console.log(socket.handshake, socket.handshake.auth.token);
  authJWT.verifyTokenSocket(socket, next);
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

  socket.on('message', async (data) => {
    const user = await User.findById(data.id);
    data.userName = user.name;

    console.log(data);
    socket.broadcast.emit('message-receive', data);
  });
});
