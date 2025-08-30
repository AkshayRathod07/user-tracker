
import { google } from "googleapis";
import fs from "fs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  try {
    const keyPath = path.join(process.cwd(), process.env.GOOGLE_WALLET_KEY!);

  const auth = new google.auth.GoogleAuth({
      keyFile: keyPath,
      scopes: ["https://www.googleapis.com/auth/wallet_object.issuer"],
    });

    const client = await auth.getClient();
    const wallet = google.walletobjects({ version: "v1", auth });

    const issuerId = process.env.ISSUER_ID!;
    const classId = `${issuerId}.demoEventClass`;
    const objectId = `${issuerId}.demoEventObject.user123`;

    // 🔹 Check if class exists first
    let eventClass;
    try {
      eventClass = await wallet.eventticketclass.get({ resourceId: classId });
    } catch (err: any) {
      if (err.code === 404) {
        // 1️⃣ Create class if not found
        eventClass = await wallet.eventticketclass.insert({
          requestBody: {
            id: classId,
            issuerName: "akkii Event Company",
            reviewStatus: "APPROVED", // or "APPROVED" if already verified
            eventName: {
              defaultValue: {
                language: "en-US",
                value: "Rock Concert 2025",
              },
            },
            logo: {
              sourceUri: {
                uri: "https://plus.unsplash.com/premium_photo-1683910767532-3a25b821f7ae?q=80&w=1016&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Public HTTPS image
              },
            },
          },
        });
      } else {
        throw err;
      }
    }

    // 🔹 Create object (idempotent – handle conflict)
    let eventObject;
    try {
      eventObject = await wallet.eventticketobject.get({ resourceId: objectId });
    } catch (err: any) {
      if (err.code === 404) {
        eventObject = await wallet.eventticketobject.insert({
          requestBody: {
            id: objectId,
            classId,
            state: "active",
            heroImage: {
              sourceUri: { uri: "https://plus.unsplash.com/premium_photo-1683910767532-3a25b821f7ae?q=80&w=1016&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, // Public HTTPS image
              contentDescription: {
                defaultValue: {
                  language: "en-US",
                  value: "Event Banner",
                },
              },
            },
            barcode: {
              type: "qrCode",
              value: "TICKET-12345",
            },
          },
        });
      } else {
        throw err;
      }
    }

    // Read issuer key file
    const keyFile = fs.readFileSync(keyPath, "utf-8");
    const keyData = JSON.parse(keyFile);
    const privateKey = keyData.private_key;
    const issuerEmail = keyData.client_email;

    // JWT payload for Save to Google Wallet
    const jwtPayload = {
      iss: issuerEmail,
      aud: "google",
      origins: ["*"],
      typ: "savetowallet",
      payload: {
        eventTicketObjects: [eventObject.data ?? eventObject],
      },
    };

    // Sign JWT
    const token = jwt.sign(jwtPayload, privateKey, { algorithm: "RS256" });
    const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

    return NextResponse.json({
      class: eventClass.data ?? eventClass,
      object: eventObject.data ?? eventObject,
      saveUrl,
    });
  } catch (err: any) {
    console.error("Wallet API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
