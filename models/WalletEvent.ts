import mongoose, { Schema, model, models } from "mongoose";

const WalletEventSchema = new Schema(
  {
    objectId: { type: String, required: true },
    classId: { type: String, required: true },
    eventType: { type: String, required: true }, // SAVE, DELETE, STATE_CHANGED
    timestamp: { type: Date, required: true },
  },
  { timestamps: true } // auto adds createdAt, updatedAt
);

export default models.WalletEvent || model("WalletEvent", WalletEventSchema);
