import mongoose from "mongoose";

export interface IConfig<T = unknown>{
  key: string;
  value: T;
  description?: string;
}

const configSchema = new mongoose.Schema<IConfig>({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  description: { type: String },
});


export default mongoose.models.Config || mongoose.model<IConfig>("Config", configSchema); 