import mongoose, { Schema, Document } from "mongoose";

interface ISuara extends Document {
  nama: string;
  nomor: string;
  suara: string;
}
const suaraSchema: Schema = new Schema(
  {
    nama: { type: String, required: true },
    nomor: { type: String, required: true },
    suara: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const Suara =
  mongoose.models.Suara || mongoose.model<ISuara>("Suara", suaraSchema);

export default Suara;
