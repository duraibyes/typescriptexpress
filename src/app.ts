import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import * as middlewares from './middlewares';
import api from './api';
import connectDb from './config/db';
import multer from 'multer';

require('dotenv').config();
connectDb();

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(express.json());
// app.use(express.static('/public')); image can be called without public url 
app.use(express.static(__dirname));
// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
