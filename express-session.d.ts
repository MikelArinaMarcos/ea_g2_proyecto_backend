// types/express-session.d.ts
import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    passport?: {
      user?: any;
    };
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    logout(callback: (err: Error) => void): void;
    user?: any;
  }
}
