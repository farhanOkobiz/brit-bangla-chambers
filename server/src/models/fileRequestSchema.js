// models/fileRequestSchema.js

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
      type: Schema.Types.ObjectId,
      ref: "CaseFile",
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
    file_url: [
      {
        type: String, // e.g. "/uploads/file1.pdf"
        default: [],
      },
    ],
    
  },
  { timestamps: true }
);

export const FileRequest = mongoose.model("FileRequest", FileRequestSchema);
