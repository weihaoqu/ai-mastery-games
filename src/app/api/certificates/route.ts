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

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // already exists
  }
}

async function readCertificates(): Promise<CertificateRecord[]> {
  try {
    const data = await fs.readFile(CERTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeCertificates(certs: CertificateRecord[]) {
  await ensureDataDir();
  await fs.writeFile(CERTS_FILE, JSON.stringify(certs, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const record: CertificateRecord = {
      code: body.code,
      playerName: body.playerName,
      date: body.date,
      overallScore: body.overallScore,
      masteryLevel: body.masteryLevel,
      gameName: body.gameName,
      createdAt: new Date().toISOString(),
    };

    const certs = await readCertificates();
    certs.push(record);
    await writeCertificates(certs);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save certificate" }, { status: 500 });
  }
}
