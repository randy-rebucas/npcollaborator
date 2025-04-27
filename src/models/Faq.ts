import mongoose, { Schema } from "mongoose";

export interface IFaq {
  id: string;
  question: string;
  answer: string;
  createdAt: Date;
}

const faqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { timestamps: true }
);

const Faq =
  mongoose.models.Faq ??
  mongoose.model<IFaq>("Faq", faqSchema);

export default Faq;