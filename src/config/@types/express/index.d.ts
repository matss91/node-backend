import { Types } from "mongoose";
import {Express,Request} from 'express';
// to make the file a module and avoid the TypeScript error
export {}

declare global {
  namespace Express {
    export interface Request {
      user: {
        _id? : Types.ObjectId
      };
    }
  }
}