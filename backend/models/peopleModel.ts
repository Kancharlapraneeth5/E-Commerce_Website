import { Document } from "mongoose";

export interface IPeople extends Document {
  username: string;
  password: string;
  role: string;
}
