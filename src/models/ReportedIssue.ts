import mongoose from "mongoose";

export interface IReportedIssue {
  id: string;
  email: string;
  title: string;
  description: string;
  status: "pending" | "resolved" | "closed";
  createdAt: Date;
}

const reportedIssueSchema = new mongoose.Schema<IReportedIssue>({
  email: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const ReportedIssue =
  mongoose.models.ReportedIssue ??
  mongoose.model<IReportedIssue>("ReportedIssue", reportedIssueSchema);

export default ReportedIssue;