import jsPDF from "jspdf";
import QRCode from "qrcode";
import { basePath } from "./basePath";

export interface CertificateData {
  playerName: string;
  date: string;
  overallScore: number;
  masteryLevel: string;
  masteryLabel: string;
  dimensions: {
    prompting: number;
    concepts: number;
    tools: number;
    criticalThinking: number;
    ethics: number;
  };
  dimensionLabels: {
    prompting: string;
    concepts: string;
    tools: string;
    criticalThinking: string;
    ethics: string;
  };
  gameName: string;
}

interface VerificationRecord {
  code: string;
  playerName: string;
  date: string;
  overallScore: number;
  masteryLevel: string;
  gameName: string;
  createdAt: string;
}

const VERIFICATION_KEY = "ai-mastery-certificates";

function generateVerificationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function saveVerification(record: VerificationRecord): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(VERIFICATION_KEY);
    const records: VerificationRecord[] = raw ? JSON.parse(raw) : [];
    records.push(record);
    localStorage.setItem(VERIFICATION_KEY, JSON.stringify(records));
  } catch {
    // silently fail
  }
}

export async function generateCertificate(data: CertificateData): Promise<Blob> {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297;
  const H = 210;

  // -- Background --
  doc.setFillColor(10, 10, 26); // #0a0a1a cyber-dark
  doc.rect(0, 0, W, H, "F");

  // Subtle inner card
  doc.setFillColor(17, 17, 39); // #111127 cyber-card
  doc.roundedRect(12, 12, W - 24, H - 24, 4, 4, "F");

  // Border glow effect (double border)
  doc.setDrawColor(0, 240, 255); // cyan
  doc.setLineWidth(0.8);
  doc.roundedRect(12, 12, W - 24, H - 24, 4, 4, "S");
  doc.setDrawColor(0, 240, 255);
  doc.setLineWidth(0.3);
  doc.roundedRect(15, 15, W - 30, H - 30, 3, 3, "S");

  // Corner accents
  const accentLen = 15;
  doc.setDrawColor(255, 0, 229); // magenta
  doc.setLineWidth(1);
  // top-left
  doc.line(12, 20, 12, 20 + accentLen);
  doc.line(20, 12, 20 + accentLen, 12);
  // top-right
  doc.line(W - 12, 20, W - 12, 20 + accentLen);
  doc.line(W - 20, 12, W - 20 - accentLen, 12);
  // bottom-left
  doc.line(12, H - 20, 12, H - 20 - accentLen);
  doc.line(20, H - 12, 20 + accentLen, H - 12);
  // bottom-right
  doc.line(W - 12, H - 20, W - 12, H - 20 - accentLen);
  doc.line(W - 20, H - 12, W - 20 - accentLen, H - 12);

  // -- Title --
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0, 240, 255);
  doc.text("AI MASTERY GAMES", W / 2, 30, { align: "center" });

  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("Certificate of Achievement", W / 2, 42, { align: "center" });

  // Decorative line under title
  doc.setDrawColor(0, 240, 255);
  doc.setLineWidth(0.5);
  doc.line(W / 2 - 50, 46, W / 2 + 50, 46);

  // -- Game & Date --
  doc.setFontSize(9);
  doc.setTextColor(156, 163, 175); // gray-400
  doc.text(`${data.gameName}  |  ${data.date}`, W / 2, 54, { align: "center" });

  // -- Player name --
  doc.setFontSize(9);
  doc.setTextColor(156, 163, 175);
  doc.text("Awarded to", W / 2, 66, { align: "center" });

  doc.setFontSize(26);
  doc.setTextColor(0, 255, 136); // cyber-green
  doc.setFont("helvetica", "bold");
  doc.text(data.playerName, W / 2, 78, { align: "center" });

  // -- Score & Mastery side by side --
  const leftCol = W / 2 - 50;
  const rightCol = W / 2 + 50;

  doc.setFontSize(36);
  doc.setTextColor(0, 240, 255);
  doc.text(String(data.overallScore), leftCol, 100, { align: "center" });
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text("OVERALL SCORE", leftCol, 106, { align: "center" });

  doc.setFontSize(16);
  doc.setTextColor(255, 0, 229); // magenta
  doc.text(data.masteryLabel.toUpperCase(), rightCol, 98, { align: "center" });
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text("MASTERY LEVEL", rightCol, 106, { align: "center" });

  // -- Dimension scores as horizontal bars --
  const dimEntries: [string, string, number][] = [
    ["prompting", data.dimensionLabels.prompting, data.dimensions.prompting],
    ["concepts", data.dimensionLabels.concepts, data.dimensions.concepts],
    ["tools", data.dimensionLabels.tools, data.dimensions.tools],
    ["criticalThinking", data.dimensionLabels.criticalThinking, data.dimensions.criticalThinking],
    ["ethics", data.dimensionLabels.ethics, data.dimensions.ethics],
  ];

  const barStartX = 60;
  const barWidth = 140;
  const barHeight = 5;
  let barY = 118;

  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text("SKILL DIMENSIONS", W / 2, barY - 4, { align: "center" });

  for (const [, label, score] of dimEntries) {
    // Label
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 220);
    doc.text(label, barStartX - 2, barY + 3.5, { align: "right" });

    // Bar background
    doc.setFillColor(42, 42, 74); // cyber-border
    doc.roundedRect(barStartX, barY, barWidth, barHeight, 1.5, 1.5, "F");

    // Bar fill
    const fillWidth = (score / 100) * barWidth;
    if (fillWidth > 0) {
      doc.setFillColor(0, 240, 255);
      doc.roundedRect(barStartX, barY, Math.max(fillWidth, 3), barHeight, 1.5, 1.5, "F");
    }

    // Score number
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(String(score), barStartX + barWidth + 4, barY + 3.5);

    barY += 9;
  }

  // -- Verification code & QR --
  const verificationCode = generateVerificationCode();
  const verificationUrl = `https://ai-mastery.games/verify/${verificationCode}`;

  const verificationRecord = {
    code: verificationCode,
    playerName: data.playerName,
    date: data.date,
    overallScore: data.overallScore,
    masteryLevel: data.masteryLevel,
    gameName: data.gameName,
    createdAt: new Date().toISOString(),
  };

  saveVerification(verificationRecord);

  // Also save to server API (best effort)
  try {
    fetch(`${basePath}/api/certificates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(verificationRecord),
    });
  } catch {
    // server save failed, localStorage still has it
  }

  // QR code
  try {
    const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
      width: 200,
      margin: 1,
      color: { dark: "#00F0FF", light: "#111127" },
    });
    doc.addImage(qrDataUrl, "PNG", W - 55, H - 52, 25, 25);
  } catch {
    // QR generation failed, skip it
  }

  // Verification text
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 130);
  doc.text(`Verification: ${verificationCode}`, W - 42.5, H - 23, { align: "center" });

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(80, 80, 110);
  doc.text("ai-mastery.games", W / 2, H - 20, { align: "center" });

  return doc.output("blob");
}
