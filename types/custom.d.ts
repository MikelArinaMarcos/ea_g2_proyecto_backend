// types/custom.d.ts

declare namespace Express {
    interface Request {
      logout(callback: (err: Error) => void): void;
      user?: any;
    }
  }
  