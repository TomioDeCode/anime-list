import { mongoose } from "../connection";
import { MonitorLog } from "../../interface/monitorLog";

const monitorLogSchema = new mongoose.Schema<MonitorLog>({
  endpoint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Endpoint",
    required: true,
  },
  timestamp: { type: Date, required: true },
  statusCode: { type: Number, required: true },
  responseTime: { type: Number, required: true },
  success: { type: Boolean, required: true },
  errorMessage: { type: String, required: false },
  errorType: { type: String, required: false },
});

const MonitorLog = mongoose.model<MonitorLog>("MonitorLog", monitorLogSchema);

export { MonitorLog };
