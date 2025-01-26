import { mongoose } from "../connection";
import { Notification } from "../../interface/notification";

const notificationSchema = new mongoose.Schema<Notification>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  endpoint: { type: mongoose.Schema.Types.ObjectId, ref: "Endpoint" },
  type: {
    type: String,
    enum: ["down", "slowResponse", "recovered"],
  },
  message: { type: String },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

const Notification = mongoose.model<Notification>(
  "Notification",
  notificationSchema
);

export { Notification };
