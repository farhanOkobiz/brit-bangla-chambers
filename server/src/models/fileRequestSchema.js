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
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    file_url: [
      {
        type: String, // e.g. "/uploads/file1.pdf"
      },
    ],
  },
  { timestamps: true }
);

export const FileRequest = mongoose.model("FileRequest", FileRequestSchema);
