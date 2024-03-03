import "dotenv/config";
import express from "express";
import cors from "cors";
import { router } from "./routes/user";
const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(router);
app.listen(PORT, () => console.log(`Listo por el puerto ${PORT}`));