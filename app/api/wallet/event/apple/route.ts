import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { PKPass } from "passkit-generator";

export async function GET() {
  try {
    // Paths to certs
    const certPath = path.join(process.cwd(), "certs", "pass-cert.pem");
    const keyPath = path.join(process.cwd(), "certs", "pass-key.pem");
    const wwdrPath = path.join(process.cwd(), "certs", "wwdr.pem");

    // Load certs
    const cert = fs.readFileSync(certPath);
    const key = fs.readFileSync(keyPath);
    const wwdr = fs.readFileSync(wwdrPath);

    // Create new pass
    const pass = new PKPass(
      {
        model: {
          // Base info for the pass.json
          // @ts-ignore;
          passTypeIdentifier: "pass.com.yourcompany.eventticket",
          teamIdentifier: "ABCD1234XY", // Your Apple Team ID
          organizationName: "Akkii Event Company",
          description: "Rock Concert 2025",
          serialNumber: "TICKET-12345",
          formatVersion: 1,
          eventTicket: {
            primaryFields: [
              {
                key: "event",
                label: "Event",
                value: "Rock Concert 2025",
              },
            ],
          },
          barcode: {
            message: "TICKET-12345",
            format: "PKBarcodeFormatQR",
            messageEncoding: "iso-8859-1",
          },
        },
      },
      {
        cert,
        key,
        wwdr,
        password: process.env.PASS_CERT_PASSWORD, // password for .p12 converted key
      }
    );

    // Add images required by Apple Wallet
    pass.addBuffer("icon.png", fs.readFileSync("public/wallet/icon.png"));
    pass.addBuffer("logo.png", fs.readFileSync("public/wallet/logo.png"));
    pass.addBuffer("strip.png", fs.readFileSync("public/wallet/strip.png"));

    // Generate pkpass
    // @ts-ignore
    const buffer = pass.generate();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": 'attachment; filename="event.pkpass"',
      },
    });
  } catch (err: any) {
    console.error("Apple Wallet Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
