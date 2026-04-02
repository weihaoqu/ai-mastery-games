"use client";

import { useEffect, useState, useCallback } from "react";
import { basePath } from "@/lib/basePath";

interface CaseRecord {
  caseId: string;
  caseTitle: string;
  caseType: string;
  isCorrect: boolean;
  score: number;
  timeSpent: number;
}

interface ScoreRecord {
  id: string;
  anonymousId: string;
  game: string;
  difficulty: string;
  score: number;
  dimensions: {
    prompting: number;
    concepts: number;
    tools: number;
    criticalThinking: number;
    ethics: number;
  };
  masteryLevel: string;
  cases: CaseRecord[];
  analysis: string;
  createdAt: string;
}

interface ApiResponse {
  total: number;
  records: ScoreRecord[];
}

interface EventStats {
  totalEvents: number;
  uniqueUsers: number;
  uniqueSessions: number;
  eventCounts: Record<string, number>;
  topPages: [string, number][];
  deviceSplit: { mobile: number; desktop: number };
}

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [eventStats, setEventStats] = useState<EventStats | null>(null);
  const [error, setError] = useState("");
  const [filterGame, setFilterGame] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchData = useCallback(async (adminKey: string) => {
    try {
      const res = await fetch(`${basePath}/api/scores?key=${adminKey}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      if (json.records) {
        setData(json);
        setAuthenticated(true);
        setError("");
        // Also fetch event stats
        try {
          const evtRes = await fetch(`${basePath}/api/events?key=${adminKey}`);
          if (evtRes.ok) setEventStats(await evtRes.json());
        } catch { /* ignore */ }
      } else {
        setError("Invalid admin key");
      }
    } catch {
      setError("Failed to connect");
    }
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem("admin-key");
    if (stored) fetchData(stored);
  }, [fetchData]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    sessionStorage.setItem("admin-key", key);
    fetchData(key);
  }

  function downloadCSV() {
    const storedKey = sessionStorage.getItem("admin-key") || key;
    window.open(`${basePath}/api/scores?key=${storedKey}&format=csv`, "_blank");
  }

  const filtered = data?.records.filter((r) => {
    if (filterGame !== "all" && r.game !== filterGame) return false;
    if (filterDifficulty !== "all" && r.difficulty !== filterDifficulty) return false;
    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || [];

  // Aggregate stats
  const avgScore = filtered.length > 0
    ? Math.round(filtered.reduce((s, r) => s + r.score, 0) / filtered.length)
    : 0;
  const gameCounts = filtered.reduce<Record<string, number>>((acc, r) => {
    acc[r.game] = (acc[r.game] || 0) + 1;
    return acc;
  }, {});
  const uniquePlayers = new Set(filtered.map((r) => r.anonymousId)).size;

  if (!authenticated) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f0", fontFamily: "system-ui, sans-serif" }}>
        <form onSubmit={handleLogin} style={{ background: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", width: "320px" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "#1e3a12" }}>Admin Dashboard</h1>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter admin key"
            style={{ width: "100%", padding: "0.75rem", border: "2px solid #ddd", borderRadius: "8px", fontSize: "1rem", marginBottom: "0.75rem", boxSizing: "border-box" }}
          />
          {error && <p style={{ color: "#e06820", fontSize: "0.875rem", marginBottom: "0.5rem" }}>{error}</p>}
          <button type="submit" style={{ width: "100%", padding: "0.75rem", background: "#3ba85a", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: 600, cursor: "pointer" }}>
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f0", fontFamily: "system-ui, sans-serif", padding: "1.5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e3a12" }}>
            AI Mastery Games — Admin
          </h1>
          <button onClick={downloadCSV} style={{ padding: "0.5rem 1rem", background: "#3ba85a", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
            Download CSV
          </button>
        </div>

        {/* Stats cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          <StatCard label="Total Sessions" value={filtered.length} />
          <StatCard label="Unique Players" value={uniquePlayers} />
          <StatCard label="Avg Score" value={avgScore} />
          {Object.entries(gameCounts).map(([game, count]) => (
            <StatCard key={game} label={game} value={count} />
          ))}
        </div>

        {/* Engagement Stats */}
        {eventStats && (
          <div style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1e3a12", marginBottom: "0.75rem" }}>Engagement</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
              <StatCard label="Total Events" value={eventStats.totalEvents} />
              <StatCard label="Unique Visitors" value={eventStats.uniqueUsers} />
              <StatCard label="Sessions" value={eventStats.uniqueSessions} />
              <StatCard label="Mobile" value={eventStats.deviceSplit.mobile} />
              <StatCard label="Desktop" value={eventStats.deviceSplit.desktop} />
            </div>
            {Object.keys(eventStats.eventCounts).length > 0 && (
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                {Object.entries(eventStats.eventCounts).sort((a, b) => b[1] - a[1]).map(([evt, count]) => (
                  <div key={evt} style={{ background: "white", borderRadius: "6px", padding: "0.5rem 0.75rem", fontSize: "0.8rem", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                    <span style={{ fontWeight: 600, color: "#3ba85a" }}>{count}</span>{" "}
                    <span style={{ color: "#666" }}>{evt.replace(/_/g, " ")}</span>
                  </div>
                ))}
              </div>
            )}
            {eventStats.topPages.length > 0 && (
              <details style={{ background: "white", borderRadius: "8px", padding: "0.75rem 1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: "0.875rem", color: "#1e3a12" }}>Top Pages</summary>
                <div style={{ marginTop: "0.5rem" }}>
                  {eventStats.topPages.map(([page, count]) => (
                    <div key={page} style={{ display: "flex", justifyContent: "space-between", padding: "0.25rem 0", fontSize: "0.8rem", borderBottom: "1px solid #f0f0f0" }}>
                      <span style={{ color: "#333" }}>{page}</span>
                      <span style={{ fontWeight: 600, color: "#3ba85a" }}>{count}</span>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}

        <SkillGaps records={filtered} />
        <ScoreDistribution records={filtered} />
        <GameAvgScores records={filtered} />

        {/* Filters */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          <select value={filterGame} onChange={(e) => setFilterGame(e.target.value)} style={selectStyle}>
            <option value="all">All Games</option>
            <option value="detective">Detective</option>
            <option value="arena">Arena</option>
            <option value="turing">Turing</option>
            <option value="escape">Escape Room</option>
            <option value="hunter">Hunter</option>
            <option value="ethics">Ethics Quest</option>
            <option value="tycoon">Tycoon</option>
            <option value="pipeline">Pipeline</option>
            <option value="tumble">Tumble</option>
          </select>
          <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)} style={selectStyle}>
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
          <span style={{ fontSize: "0.875rem", color: "#666", alignSelf: "center" }}>
            Showing {filtered.length} of {data?.total || 0} records
          </span>
        </div>

        {/* Records table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            <thead>
              <tr style={{ background: "#3ba85a", color: "white", textAlign: "left" }}>
                <th style={thStyle}>Time</th>
                <th style={thStyle}>Game</th>
                <th style={thStyle}>Difficulty</th>
                <th style={thStyle}>Score</th>
                <th style={thStyle}>Level</th>
                <th style={thStyle}>Cases</th>
                <th style={thStyle}>Analysis</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const correct = r.cases?.filter((c) => c.isCorrect).length ?? 0;
                const total = r.cases?.length ?? 0;
                const isExpanded = expandedId === r.id;
                return (
                  <Fragment key={r.id}>
                    <tr
                      onClick={() => setExpandedId(isExpanded ? null : r.id)}
                      style={{ borderBottom: "1px solid #eee", cursor: "pointer", background: isExpanded ? "#f0fdf4" : undefined }}
                    >
                      <td style={tdStyle}>{new Date(r.createdAt).toLocaleString()}</td>
                      <td style={tdStyle}>
                        <span style={{ ...badgeStyle, background: gameColors[r.game] || "#ddd" }}>{r.game}</span>
                      </td>
                      <td style={tdStyle}>{r.difficulty}</td>
                      <td style={{ ...tdStyle, fontWeight: 700, color: r.score >= 80 ? "#16a34a" : r.score >= 50 ? "#ca8a04" : "#dc2626" }}>
                        {r.score}
                      </td>
                      <td style={tdStyle}>{r.masteryLevel}</td>
                      <td style={tdStyle}>{total > 0 ? `${correct}/${total}` : "—"}</td>
                      <td style={{ ...tdStyle, maxWidth: "300px", fontSize: "0.8rem", color: "#555" }}>
                        {r.analysis || "—"}
                      </td>
                    </tr>
                    {isExpanded && r.cases && r.cases.length > 0 && (
                      <tr>
                        <td colSpan={7} style={{ padding: "0.75rem 1rem", background: "#f9fafb" }}>
                          <div style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.5rem", color: "#1e3a12" }}>
                            Scenario Breakdown (Player: {r.anonymousId.slice(0, 8)}...)
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "0.5rem" }}>
                            {r.cases.map((c, i) => (
                              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.6rem", background: c.isCorrect ? "#f0fdf4" : "#fef2f2", borderRadius: "6px", border: `1px solid ${c.isCorrect ? "#bbf7d0" : "#fecaca"}` }}>
                                <span>{c.isCorrect ? "\u2705" : "\u274C"}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontWeight: 600, fontSize: "0.8rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {c.caseTitle || c.caseId}
                                  </div>
                                  <div style={{ fontSize: "0.7rem", color: "#888" }}>
                                    {c.caseType && <span style={{ marginRight: "0.5rem" }}>{c.caseType}</span>}
                                    {c.score}pts · {c.timeSpent}s
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div style={{ marginTop: "0.75rem", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.5rem" }}>
                            {Object.entries(r.dimensions).map(([dim, val]) => (
                              <div key={dim} style={{ textAlign: "center", padding: "0.4rem", background: "white", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
                                <div style={{ fontSize: "1rem", fontWeight: 700, color: "#3ba85a" }}>{val}</div>
                                <div style={{ fontSize: "0.65rem", color: "#888", textTransform: "capitalize" }}>{dim}</div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "#999" }}>
                    No records yet. Play some games first!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ background: "white", borderRadius: "8px", padding: "1rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#3ba85a" }}>{value}</div>
      <div style={{ fontSize: "0.8rem", color: "#888", textTransform: "capitalize" }}>{label}</div>
    </div>
  );
}

import { Fragment } from "react";

function SkillGaps({ records }: { records: ScoreRecord[] }) {
  if (records.length === 0) return null;

  const dims = ["prompting", "concepts", "tools", "criticalThinking", "ethics"] as const;
  const avgs = dims.map((dim) => {
    const sum = records.reduce((s, r) => s + (r.dimensions[dim] || 0), 0);
    return { dim, avg: Math.round(sum / records.length) };
  }).sort((a, b) => a.avg - b.avg);

  const barColor = (v: number) => v < 40 ? "#dc2626" : v < 60 ? "#ca8a04" : "#16a34a";
  const dimLabels: Record<string, string> = {
    prompting: "Prompting", concepts: "Concepts", tools: "Tools",
    criticalThinking: "Critical Thinking", ethics: "Ethics",
  };

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1e3a12", marginBottom: "0.75rem" }}>Class Skill Gaps</h2>
      <div style={{ background: "white", borderRadius: "8px", padding: "1rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        {avgs.map(({ dim, avg }) => (
          <div key={dim} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <span style={{ width: "120px", fontSize: "0.8rem", fontWeight: 600, color: "#333", textAlign: "right" }}>
              {dimLabels[dim]}
            </span>
            <div style={{ flex: 1, background: "#f0f0f0", borderRadius: "4px", height: "24px", position: "relative" }}>
              <div style={{ width: `${avg}%`, background: barColor(avg), borderRadius: "4px", height: "100%", transition: "width 0.5s ease" }} />
            </div>
            <span style={{ width: "40px", fontSize: "0.875rem", fontWeight: 700, color: barColor(avg) }}>{avg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreDistribution({ records }: { records: ScoreRecord[] }) {
  if (records.length === 0) return null;

  const buckets = Array(10).fill(0);
  for (const r of records) {
    const idx = Math.min(9, Math.floor(r.score / 10));
    buckets[idx]++;
  }
  const maxCount = Math.max(...buckets, 1);
  const labels = ["0-9", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70-79", "80-89", "90-100"];

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1e3a12", marginBottom: "0.75rem" }}>Score Distribution</h2>
      <div style={{ background: "white", borderRadius: "8px", padding: "1rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "120px" }}>
          {buckets.map((count, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
              {count > 0 && (
                <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "#666", marginBottom: "2px" }}>{count}</span>
              )}
              <div style={{
                width: "100%",
                height: `${(count / maxCount) * 100}%`,
                minHeight: count > 0 ? "4px" : "0",
                background: i < 4 ? "#dc2626" : i < 6 ? "#ca8a04" : "#16a34a",
                borderRadius: "3px 3px 0 0",
              }} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
          {labels.map((label) => (
            <div key={label} style={{ flex: 1, textAlign: "center", fontSize: "0.6rem", color: "#888" }}>{label}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GameAvgScores({ records }: { records: ScoreRecord[] }) {
  if (records.length === 0) return null;

  const gameNames: Record<string, string> = {
    detective: "Detective", arena: "Arena", turing: "Turing", escape: "Escape",
    hunter: "Hunter", ethics: "Ethics", tycoon: "Tycoon", pipeline: "Pipeline", tumble: "Tumble",
  };

  const byGame: Record<string, number[]> = {};
  for (const r of records) {
    if (!byGame[r.game]) byGame[r.game] = [];
    byGame[r.game].push(r.score);
  }

  const avgs = Object.entries(byGame)
    .map(([game, scores]) => ({ game, avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length), count: scores.length }))
    .sort((a, b) => a.avg - b.avg);

  const barColor = (v: number) => v < 40 ? "#dc2626" : v < 60 ? "#ca8a04" : "#16a34a";

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1e3a12", marginBottom: "0.75rem" }}>Avg Score by Game</h2>
      <div style={{ background: "white", borderRadius: "8px", padding: "1rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        {avgs.map(({ game, avg, count }) => (
          <div key={game} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <span style={{ width: "80px", fontSize: "0.8rem", fontWeight: 600, color: "#333", textAlign: "right", textTransform: "capitalize" }}>
              {gameNames[game] || game}
            </span>
            <div style={{ flex: 1, background: "#f0f0f0", borderRadius: "4px", height: "20px", position: "relative" }}>
              <div style={{ width: `${avg}%`, background: barColor(avg), borderRadius: "4px", height: "100%", transition: "width 0.5s ease" }} />
            </div>
            <span style={{ width: "60px", fontSize: "0.8rem", fontWeight: 600, color: "#666" }}>{avg} ({count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const gameColors: Record<string, string> = {
  detective: "#dbeafe",
  arena: "#fef3c7",
  turing: "#d1fae5",
  escape: "#fce7f3",
  hunter: "#e0e7ff",
  ethics: "#fef9c3",
  tycoon: "#ede9fe",
  pipeline: "#ccfbf1",
  tumble: "#fce7f3",
};

const thStyle: React.CSSProperties = { padding: "0.75rem 1rem", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" };
const tdStyle: React.CSSProperties = { padding: "0.6rem 1rem", fontSize: "0.875rem" };
const badgeStyle: React.CSSProperties = { padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 600, textTransform: "capitalize" };
const selectStyle: React.CSSProperties = { padding: "0.5rem 1rem", border: "2px solid #ddd", borderRadius: "8px", fontSize: "0.875rem", background: "white" };
