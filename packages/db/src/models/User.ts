import { mongoose } from "../connection";
import { User } from "../../interface/user";

const userSchema = new mongoose.Schema<User>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], required: true },
});

const User = mongoose.model<User>("User", userSchema);

export { User };
