import { connectDB } from "@/db/mongodb";
import WalletEvent from "@/models/WalletEvent";
import { NextResponse } from "next/server";

// app/api/wallet/event-stats
export async function POST(req: Request) {
  try {
    // Google Pub/Sub sends body as { message: { data: base64String } }
    const body = await req.json();

    if (!body.message?.data) {
      return NextResponse.json({ error: "Invalid Pub/Sub message" }, { status: 400 });
    }

    // Decode base64 payload
    const decoded = Buffer.from(body.message.data, "base64").toString("utf-8");
    const event = JSON.parse(decoded);

    console.log("📩 Wallet Event Received:", event);

        // Connect & Save
    await connectDB();
      const walletEvent = new WalletEvent({
        objectId: event.objectId,
        classId: event.classId,
        eventType: event.eventType,
        timestamp: new Date(event.timestamp),
      });
      await walletEvent.save();

    /**
     * Example event structure:
     * {
     *   "eventType": "SAVE",
     *   "objectId": "issuerId.demoEventObject.user123",
     *   "classId": "issuerId.demoEventClass",
     *   "timestamp": "2025-09-02T10:00:00Z"
     * }
     */

    // 🔹 Store in your DB (Mongo/Postgres/etc.)
    // Example (pseudo):
    // await db.walletEvents.create({
    //   objectId: event.objectId,
    //   classId: event.classId,
    //   eventType: event.eventType,
    //   timestamp: new Date(event.timestamp),
    // });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ Wallet Event Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
