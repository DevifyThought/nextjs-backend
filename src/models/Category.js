import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    status: { type: String, required: true },
    imageUrl: { type: String, required: true }, 
    imagePublicId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
