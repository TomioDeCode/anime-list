import { mongoose } from "../connection";
import { Endpoint } from "../../interface/endpoint";

const endpointSchema = new mongoose.Schema<Endpoint>({
  name: { type: String, required: true },
  url: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  checkInterval: { type: Number, required: true },
  timeout: { type: Number, required: true },
  status: {
    type: String,
    enum: ["active", "warning", "down"],
    required: true,
  },
  lastChecked: { type: Date, required: true },
  responseTime: { type: Number, required: true },
  availability: { type: Number, required: true },
});

const Endpoint = mongoose.model<Endpoint>("Endpoint", endpointSchema);

export { Endpoint };
