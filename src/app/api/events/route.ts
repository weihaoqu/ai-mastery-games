import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const EVENTS_FILE = path.join(DATA_DIR, "events.jsonl");
const ADMIN_KEY = process.env.ADMIN_KEY || "aimasterygames2026";

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const events = body.events;

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: "No events provided" }, { status: 400 });
    }

    // Cap at 100 events per batch to prevent abuse
    const batch = events.slice(0, 100);

    await ensureDataDir();

    const lines = batch.map((evt: unknown) => JSON.stringify(evt)).join("\n") + "\n";
    await fs.appendFile(EVENTS_FILE, lines);

    return NextResponse.json({ received: batch.length }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to store events" }, { status: 500 });
  }
}

interface EventRecord {
  event: string;
  timestamp: string;
  anonymousId: string;
  sessionId: string;
  page: string;
  props?: Record<string, string | number | boolean>;
  device?: {
    viewport?: string;
    mobile?: boolean;
    language?: string;
  };
}

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (key !== ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let events: EventRecord[] = [];
    try {
      const raw = await fs.readFile(EVENTS_FILE, "utf-8");
      events = raw.trim().split("\n").filter(Boolean).map((l) => JSON.parse(l));
    } catch {
      // file doesn't exist yet
    }

    // Aggregate stats
    const eventCounts: Record<string, number> = {};
    const uniqueUsers = new Set<string>();
    const uniqueSessions = new Set<string>();
    const pageViews: Record<string, number> = {};
    let mobileCount = 0;
    let desktopCount = 0;

    for (const e of events) {
      eventCounts[e.event] = (eventCounts[e.event] || 0) + 1;
      if (e.anonymousId) uniqueUsers.add(e.anonymousId);
      if (e.sessionId) uniqueSessions.add(e.sessionId);
      if (e.event === "page_view" && e.props?.path) {
        const p = String(e.props.path);
        pageViews[p] = (pageViews[p] || 0) + 1;
      }
      if (e.device?.mobile === true) mobileCount++;
      else if (e.device?.mobile === false) desktopCount++;
    }

    return NextResponse.json({
      totalEvents: events.length,
      uniqueUsers: uniqueUsers.size,
      uniqueSessions: uniqueSessions.size,
      eventCounts,
      topPages: Object.entries(pageViews)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20),
      deviceSplit: { mobile: mobileCount, desktop: desktopCount },
    });
  } catch {
    return NextResponse.json({ error: "Failed to read events" }, { status: 500 });
  }
}
