import { Schema, model } from "mongoose";

const usersSchema = new Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  phone: { type: String, require: true },
  address: { type: String, require: true },
  city: { type: String, require: true },
  country: { type: String, require: true },
  zcode: { type: String, require: true },
  subcontinent: { type: String, require: true },
  vatNumber: { type: String, require: true },
  checkflag: { type: String, require: true },
  password: { type: String, require: true },
  permission: { type: String, require: true },
  note: { type: String, requir: true },
  date: { type: String, requir: true },
  credit: { type: String, requir: true },
  status: { type: String, requir: true },
  profile: { type: String, requir: true },
});
export const Users = model("users", usersSchema);
