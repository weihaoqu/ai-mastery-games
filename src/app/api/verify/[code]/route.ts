import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const CERTS_FILE = path.join(DATA_DIR, "certificates.json");

interface CertificateRecord {
  code: string;
  playerName: string;
  date: string;
  overallScore: number;
  masteryLevel: string;
  gameName: string;
  createdAt: string;
}

async function readCertificates(): Promise<CertificateRecord[]> {
  try {
    const data = await fs.readFile(CERTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const certs = await readCertificates();
    const cert = certs.find(
      (c) => c.code.toUpperCase() === code.toUpperCase()
    );

    if (!cert) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    return NextResponse.json({
      code: cert.code,
      playerName: cert.playerName,
      date: cert.date,
      overallScore: cert.overallScore,
      masteryLevel: cert.masteryLevel,
      gameName: cert.gameName,
      verified: true,
    });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
