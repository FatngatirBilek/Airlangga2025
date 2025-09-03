import mongoose, { Schema, Document } from "mongoose";

export interface IDashboardState extends Document {
  enabled: boolean;
}

const DashboardStateSchema = new Schema<IDashboardState>({
  enabled: { type: Boolean, required: true, default: false },
});

export default mongoose.models.DashboardState ||
  mongoose.model<IDashboardState>("DashboardState", DashboardStateSchema);
