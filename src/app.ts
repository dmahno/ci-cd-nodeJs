// High priority
// Require and configure dotenv at the very begining
// To make env varaibles available in all modules
import * as dotenv from "dotenv";
dotenv.config();
// All other imports
import express, { Application } from 'express';
import api from "./api"

// Initiate express middleware
const app: Application = express();

// Add express json parser as middleware
app.use(express.json());

// Initiate api module
// To handle all respective endpoints
app.use("/api", api);

// Trigger up the app
const port: string | undefined = process.env.APP_PORT;
app.listen(port, () => console.log(`CI-CD Server running on port ${port}`));