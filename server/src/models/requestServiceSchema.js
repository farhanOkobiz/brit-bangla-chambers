import mongoose from "mongoose";
const { Schema, model } = mongoose;

const requestServiceSchema = new Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userMessage: {
      name: String,
      email: String,
      phone: String,
      nid: String,
      presentAddress: String,
      permanentAddress: String,
      issueType: String,
      message: String,
      attachments: [String],
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
      createdAt: { type: Date, default: Date.now },
    },
    status: {
      type: String,
      enum: ["pending", "sent_to_advocate", "accepted", "rejected"],
      default: "pending",
    },
    adminForwarded: {
      type: Boolean,
      default: false,
    },
    forwardedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Advocate",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

requestServiceSchema.post("findOneAndDelete", async function (doc) {
  if (doc?.userMessageId) {
    const count = await RequestService.countDocuments({
      userMessageId: doc.userMessageId,
    });

    if (count === 0) {
      await RequestForAdvocate.findByIdAndDelete(doc.userMessageId);
    }
  }
});

export default model("RequestService", requestServiceSchema);
