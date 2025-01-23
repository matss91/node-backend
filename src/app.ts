import 'dotenv/config'
import express, {Express, NextFunction, Request, Response} from 'express';
import connectDB from './config/db';
import router from './routes';
import createHttpError from 'http-errors';
import cors from 'cors';

interface ResponseError extends Error {
    status: number;
  }
const app: Express = express();
const allowedOrigins = ['http://localhost:5173'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(options));

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api',router);

app.use(function(req: Request, res: Response, next : NextFunction){
    const err = createHttpError(404, 'Not Found');
    next(err);
  });

app.use(function(err : ResponseError, req : Request, res : Response, next : NextFunction) {
  
    return res.status(err.status || 500).json({
      ok : false,
      msg : err.message
      });
  });

app.listen(process.env.PORT, ()=> {
console.log(`Server running in https://localhost:${process.env.PORT}`);
});