import { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
}

export const UserSchema = new Schema<UserDocument>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
