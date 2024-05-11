//Entry point for our server
import express from 'express'; //in json I set type: module to use this syntax
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';

connectDB();

const port = process.env.port || 5000
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => console.log(`Server started on route ${port}`));