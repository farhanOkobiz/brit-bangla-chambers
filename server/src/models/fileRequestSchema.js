import mongoose, { Schema } from "mongoose";

const FileRequestSchema = new Schema(
  {
    client_id: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    advocate_id: {
      type: Schema.Types.ObjectId,
      ref: "Advocate",
      required: true,
    },
    case_id: {
      type: String,
      required: true,
    },
    case_number: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    // Updated documents structure to match caseFileSchema
    documents: [
      {
        documentTitle: {
          type: String,
          required: true,
          trim: true,
          maxlength: 100,
        },
        documentUrl: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export const FileRequest = mongoose.model("FileRequest", FileRequestSchema);
