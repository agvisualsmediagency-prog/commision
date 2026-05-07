import { useState, useEffect } from "react";

const T = {
  bg: "#000000",
  card: "#0a0a0a",
  cardAlt: "#0f0f0f",
  surface: "#141414",
  border: "#1a1a1a",
  borderLight: "#252525",
  orange: "#ff6b2c",
  orangeLight: "#ff8a54",
  orangeDim: "rgba(255,107,44,0.10)",
  orangeGlow: "rgba(255,107,44,0.04)",
  blue: "#3b82f6",
  blueLight: "#60a5fa",
  blueDim: "rgba(59,130,246,0.10)",
  blueGlow: "rgba(59,130,246,0.04)",
  white: "#ffffff",
  text: "#f0f0f0",
  sub: "#888899",
  dim: "#444455",
  green: "#22c55e",
  greenDim: "rgba(34,197,94,0.10)",
  red: "#ef4444",
  redDim: "rgba(239,68,68,0.08)",
  purple: "#a855f7",
  purpleDim: "rgba(168,85,247,0.10)",
};

const fmt = n => "$" + Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const fmtK = n => n >= 10000 ? "$" + (n / 1000).toFixed(1).replace(/\.0$/, "") + "K" : fmt(n);
const fmtPct = n => n.toFixed(1).replace(/\.0$/, "") + "%";

// ─── COMPONENTS ───

function Pill({ label, amount, color, bg, sub: subtitle }) {
  return (
    <div style={{
      flex: 1, background: bg, borderRadius: 10, padding: "10px 6px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
      border: `1px solid ${color}15`, position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 30, height: 2, background: color, borderRadius: "0 0 2px 2px",
      }} />
      <span style={{ fontSize: 9, color, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 2 }}>{label}</span>
      <span style={{ fontSize: 15, fontWeight: 700, color: T.white }}>{fmt(amount)}</span>
      {subtitle && <span style={{ fontSize: 9, color: T.dim }}>{subtitle}</span>}
    </div>
  );
}

function InputField({ label, value, onChange, hint, prefix = "$" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 10, color: T.sub, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>{label}</label>
      <div style={{ position: "relative" }}>
        {prefix && (
          <span style={{
            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
            fontSize: 14, color: T.dim, fontWeight: 600,
          }}>{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          style={{
            background: T.bg, border: `1px solid ${T.border}`, color: T.white,
            padding: prefix ? "11px 14px 11px 30px" : "11px 14px",
            borderRadius: 10, fontSize: 15, fontWeight: 600, width: "100%",
            outline: "none", boxSizing: "border-box", fontFamily: "inherit",
            transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = T.orange}
          onBlur={e => e.target.style.borderColor = T.border}
        />
      </div>
      {hint && <span style={{ fontSize: 10, color: T.dim }}>{hint}</span>}
    </div>
  );
}

function Seg({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 3, background: T.bg, borderRadius: 10, padding: 3 }}>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          flex: 1, padding: "9px 6px", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700,
          cursor: "pointer", transition: "all 0.25s ease",
          background: value === o.value
            ? `linear-gradient(135deg, ${T.orange}, ${T.orangeLight})`
            : "transparent",
          color: value === o.value ? T.bg : T.dim,
          letterSpacing: 0.3,
        }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Stepper({ label, value, onChange, min = 0, max = 50 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 13, color: T.sub }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center" }}>
        <button onClick={() => onChange(Math.max(min, value - 1))} style={{
          width: 36, height: 36, border: `1px solid ${T.border}`, borderRadius: "10px 0 0 10px",
          background: T.card, color: T.sub, fontSize: 18, cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center", transition: "all 0.15s",
        }}>−</button>
        <div style={{
          width: 48, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
          background: T.bg, border: `1px solid ${T.border}`, borderLeft: "none", borderRight: "none",
          color: T.white, fontWeight: 700, fontSize: 16,
        }}>{value}</div>
        <button onClick={() => onChange(Math.min(max, value + 1))} style={{
          width: 36, height: 36, border: `1px solid ${T.border}`, borderRadius: "0 10px 10px 0",
          background: T.card, color: T.sub, fontSize: 18, cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center", transition: "all 0.15s",
        }}>+</button>
      </div>
    </div>
  );
}

function Toggle({ on, onToggle, label, sublabel, color = T.orange }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{label}</div>
        {sublabel && <div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>{sublabel}</div>}
      </div>
      <button onClick={onToggle} style={{
        width: 48, height: 26, borderRadius: 13, border: "none", cursor: "pointer",
        background: on ? color : T.border, position: "relative", transition: "background 0.25s",
      }}>
        <div style={{
          width: 20, height: 20, borderRadius: "50%", background: T.white,
          position: "absolute", top: 3, left: on ? 25 : 3, transition: "left 0.25s ease",
          boxShadow: on ? `0 0 8px ${color}60` : "none",
        }} />
      </button>
    </div>
  );
}

function Bar({ label, value, maxValue, color }) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: T.sub, fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 14, color, fontWeight: 700 }}>{fmtK(value)}</span>
      </div>
      <div style={{ height: 6, background: T.surface, borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${Math.min(pct, 100)}%`,
          background: `linear-gradient(90deg, ${color}, ${color}aa)`,
          borderRadius: 3, transition: "width 0.5s ease",
        }} />
      </div>
    </div>
  );
}

function SectionTag({ children, color = T.orange }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      fontSize: 10, letterSpacing: 2, color, fontWeight: 800,
      textTransform: "uppercase", paddingLeft: 2, marginTop: 6,
    }}>
      <div style={{ width: 8, height: 2, background: color, borderRadius: 1 }} />
      {children}
    </div>
  );
}

function Card({ children, glow }) {
  return (
    <div style={{
      background: T.card, borderRadius: 14, padding: 18,
      border: `1px solid ${T.border}`,
      ...(glow ? {
        background: `linear-gradient(135deg, ${glow}08, ${T.card})`,
        border: `1px solid ${glow}20`,
      } : {}),
    }}>
      {children}
    </div>
  );
}

function ResultBlock({ esteban, andres, ag, total, shooter, note, hasShooter }) {
  return (
    <Card glow={T.orange}>
      {note && <div style={{ fontSize: 12, color: T.orange, fontWeight: 700, marginBottom: 14, lineHeight: 1.4 }}>{note}</div>}
      <div style={{ display: "flex", gap: 5, marginBottom: 12, flexWrap: "wrap" }}>
        {hasShooter && <Pill label="Shooter" amount={shooter || 0} color={T.purple} bg={T.purpleDim} sub="Flat fee" />}
        <Pill label="Esteban" amount={esteban} color={T.blue} bg={T.blueDim} />
        <Pill label="Andrés" amount={andres} color={T.orange} bg={T.orangeDim} />
        <Pill label="AG" amount={ag} color={T.white} bg="rgba(255,255,255,0.04)" sub="30%" />
      </div>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderTop: `1px solid ${T.border}`, paddingTop: 10,
      }}>
        <span style={{ fontSize: 10, color: T.dim, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>Total</span>
        <span style={{ fontSize: 18, fontWeight: 700, color: T.white }}>{fmt(total)}</span>
      </div>
    </Card>
  );
}

// ─── MAIN ───

export default function AGCalculator() {
  const [tab, setTab] = useState("current");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Current retainer prices
  const [asPrice, setAsPrice] = useState(2000);
  const [lpvPrice, setLpvPrice] = useState(1200);
  const [lhPrice, setLhPrice] = useState(1200);

  // New retainer
  const [nrPrice, setNrPrice] = useState(2000);
  const [nrSeller, setNrSeller] = useState("andres");
  const [nrHasShooter, setNrHasShooter] = useState(false);
  const [nrShooterCost, setNrShooterCost] = useState(800);

  // Real estate
  const [rePrice, setRePrice] = useState(360);
  const [reSeller, setReSeller] = useState("andres");
  const [reHasShooter, setReHasShooter] = useState(false);
  const [reShooterCost, setReShooterCost] = useState(120);

  // Simulator
  const [simRetainers, setSimRetainers] = useState(10);
  const [simRetainerAvg, setSimRetainerAvg] = useState(2500);
  const [simREJobs, setSimREJobs] = useState(12);
  const [simREAvg, setSimREAvg] = useState(400);
  const [simHasShooter, setSimHasShooter] = useState(false);
  const [simShooterRetainer, setSimShooterRetainer] = useState(800);
  const [simShooterRE, setSimShooterRE] = useState(120);
  const [simNewREPct, setSimNewREPct] = useState(30);
  const [simIncludeCurrent, setSimIncludeCurrent] = useState(true);

  // ─── CURRENT RETAINERS ───
  const current = [
    { name: "A&S", esteban: asPrice * 0.8, andres: 0, ag: asPrice * 0.2, total: asPrice },
    { name: "La Pura Vida", esteban: 0, andres: lpvPrice * 0.8, ag: lpvPrice * 0.2, total: lpvPrice },
    { name: "Luxury Homes", esteban: lhPrice * 0.35, andres: lhPrice * 0.35, ag: lhPrice * 0.3, total: lhPrice },
    { name: "Alora", esteban: 0, andres: 0, ag: 200, total: 200 },
    { name: "AG Marketing", esteban: 0, andres: 0, ag: 0, total: 0, internal: true },
  ];
  const cTotE = current.reduce((s, r) => s + r.esteban, 0);
  const cTotA = current.reduce((s, r) => s + r.andres, 0);
  const cTotAG = current.reduce((s, r) => s + r.ag, 0);
  const cTotAll = current.reduce((s, r) => s + r.total, 0);

  // ─── NEW RETAINER CALCS ───
  const calcRetainer = (price, seller, hasShooter, shooterCost) => {
    const ag = price * 0.30;

    if (hasShooter) {
      // Hired shooter: AG 30%, shooter flat fee, rest 50/50
      const profit = price - ag - shooterCost;
      const half = Math.max(0, profit / 2);
      return {
        m1: { esteban: half, andres: half, ag, shooter: shooterCost, total: price },
        ongoing: { esteban: half, andres: half, ag, shooter: shooterCost, total: price },
        hasShooter: true,
      };
    }

    // No shooter — original commission model
    // Month 1: seller 60%, other 10%, AG 30%
    const m1 = seller === "andres"
      ? { esteban: price * 0.10, andres: price * 0.60, ag, total: price }
      : { esteban: price * 0.70, andres: 0, ag, total: price };

    // Month 2+: Esteban 50%, Andrés 25%, AG 25%... wait, using 25/45 we discussed
    // Actually sticking with original: Esteban 50%, Andrés 20%, AG 30%
    const ongoing = { esteban: price * 0.50, andres: price * 0.20, ag, total: price };

    return { m1, ongoing, hasShooter: false };
  };

  const nr = calcRetainer(nrPrice, nrSeller, nrHasShooter, nrShooterCost);

  // ─── REAL ESTATE CALCS ───
  const calcRE = (price, seller, jobNum, hasShooter, shooterCost, bothWork = false) => {
    const ag = price * 0.30;

    if (hasShooter) {
      // Hired shooter: AG 30%, shooter flat fee, rest 50/50
      const profit = price - ag - shooterCost;
      const half = Math.max(0, profit / 2);
      return { esteban: half, andres: half, ag, shooter: shooterCost, total: price, hasShooter: true };
    }

    // No shooter — original commission model
    const rem = price - ag;
    let sellerPct = jobNum === 1 ? 0.50 : jobNum === 2 ? 0.10 : 0;
    const sellerComm = price * sellerPct;
    const fulfillPool = rem - sellerComm;

    if (bothWork && jobNum === 1) {
      const half = fulfillPool / 2;
      if (seller === "andres") return { esteban: half, andres: sellerComm + half, ag, total: price, hasShooter: false };
      return { esteban: sellerComm + half, andres: half, ag, total: price, hasShooter: false };
    }

    if (seller === "andres") return { esteban: fulfillPool, andres: sellerComm, ag, total: price, hasShooter: false };
    return { esteban: sellerComm + fulfillPool, andres: 0, ag, total: price, hasShooter: false };
  };

  // ─── SIMULATOR ───
  const simCalc = () => {
    let agT = 0, andresT = 0, estebanT = 0, shooterT = 0, rev = 0;

    if (simIncludeCurrent) {
      agT += cTotAG; andresT += cTotA; estebanT += cTotE; rev += cTotAll;
    }

    const retRev = simRetainers * simRetainerAvg;
    const reRev = simREJobs * simREAvg;
    rev += retRev + reRev;

    if (simHasShooter) {
      // Hired shooter model: AG 30%, shooter paid, 50/50 split
      const retAG = retRev * 0.30;
      const retShooter = simRetainers * simShooterRetainer;
      const retProfit = retRev - retAG - retShooter;
      agT += retAG;
      shooterT += retShooter;
      andresT += Math.max(0, retProfit / 2);
      estebanT += Math.max(0, retProfit / 2);

      const reAG = reRev * 0.30;
      const reShooter = simREJobs * simShooterRE;
      const reProfit = reRev - reAG - reShooter;
      agT += reAG;
      shooterT += reShooter;
      andresT += Math.max(0, reProfit / 2);
      estebanT += Math.max(0, reProfit / 2);
    } else {
      // Original model
      const retAG = retRev * 0.30;
      agT += retAG;
      andresT += retRev * 0.20;
      estebanT += retRev * 0.50;

      const newJobs = Math.round(simREJobs * (simNewREPct / 100));
      const existJobs = simREJobs - newJobs;

      const existRev = existJobs * simREAvg;
      agT += existRev * 0.30;
      estebanT += existRev * 0.70;

      const newRev = newJobs * simREAvg;
      agT += newRev * 0.30;
      andresT += newRev * 0.50;
      estebanT += newRev * 0.20;
    }

    return { ag: agT, andres: andresT, esteban: estebanT, shooter: shooterT, revenue: rev };
  };

  const sim = simCalc();
  const simMax = Math.max(sim.ag, sim.andres, sim.esteban, sim.shooter, 1);

  const tabs = [
    { id: "current", label: "Current" },
    { id: "retainer", label: "Retainer" },
    { id: "re", label: "Real Estate" },
    { id: "sim", label: "Simulator" },
  ];

  return (
    <div style={{
      fontFamily: "'Outfit', 'DM Sans', sans-serif", background: T.bg, color: T.text,
      minHeight: "100vh", padding: "20px 16px", maxWidth: 480, margin: "0 auto",
      opacity: mounted ? 1 : 0, transition: "opacity 0.4s ease",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: 30, paddingTop: 10 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 10,
          padding: "5px 16px", borderRadius: 24,
          background: `linear-gradient(135deg, ${T.orangeDim}, ${T.blueDim})`,
          border: `1px solid ${T.orange}20`,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.orange, boxShadow: `0 0 10px ${T.orange}80` }} />
          <span style={{ fontSize: 10, letterSpacing: 3, color: T.white, fontWeight: 800, textTransform: "uppercase" }}>AG Visuals</span>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.blue, boxShadow: `0 0 10px ${T.blue}80` }} />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1.15, letterSpacing: -0.5 }}>
          Revenue Split
          <br />
          <span style={{
            background: `linear-gradient(135deg, ${T.orange}, ${T.blue})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Calculator</span>
        </h1>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: 3, marginBottom: 24, background: T.card, borderRadius: 12, padding: 3, border: `1px solid ${T.border}` }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "11px 4px", border: "none", borderRadius: 10,
            fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.25s ease",
            background: tab === t.id
              ? `linear-gradient(135deg, ${T.orange}, ${T.orangeLight})`
              : "transparent",
            color: tab === t.id ? "#000" : T.dim, letterSpacing: 0.3,
          }}>{t.label}</button>
        ))}
      </div>

      {/* ═══ CURRENT ═══ */}
      {tab === "current" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {current.map((r, i) => (
            <Card key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: r.internal ? 0 : 10 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</span>
                {r.name === "Alora" ? (
                  <span style={{ fontSize: 12, color: T.orange, fontWeight: 600 }}>Flat $200</span>
                ) : r.internal ? (
                  <span style={{ fontSize: 12, color: T.dim }}>Internal</span>
                ) : (
                  <input type="number"
                    value={i === 0 ? asPrice : i === 1 ? lpvPrice : lhPrice}
                    onChange={e => { const v = parseFloat(e.target.value) || 0; [setAsPrice, setLpvPrice, setLhPrice][i](v); }}
                    style={{
                      background: T.bg, border: `1px solid ${T.border}`, color: T.white,
                      width: 100, textAlign: "right", padding: "6px 10px", fontSize: 14,
                      borderRadius: 8, outline: "none", fontFamily: "inherit", fontWeight: 600,
                    }}
                  />
                )}
              </div>
              {!r.internal && (
                <div style={{ display: "flex", gap: 5 }}>
                  <Pill label="Esteban" amount={r.esteban} color={T.blue} bg={T.blueDim} />
                  <Pill label="Andrés" amount={r.andres} color={T.orange} bg={T.orangeDim} />
                  <Pill label="AG" amount={r.ag} color={T.white} bg="rgba(255,255,255,0.04)" />
                </div>
              )}
            </Card>
          ))}

          {/* Totals */}
          <Card glow={T.orange}>
            <div style={{ fontSize: 10, letterSpacing: 2.5, color: T.orange, fontWeight: 800, marginBottom: 14, textTransform: "uppercase" }}>Monthly Totals</div>
            {[
              { l: "Esteban", a: cTotE, c: T.blue },
              { l: "Andrés", a: cTotA, c: T.orange },
              { l: "AG Visuals", a: cTotAG, c: T.white },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: T.sub, fontSize: 13 }}>{r.l}</span>
                <span style={{ color: r.c, fontWeight: 700, fontSize: 14 }}>{fmt(r.a)}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 10, marginTop: 4, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700, fontSize: 13 }}>Total Revenue</span>
              <span style={{ fontWeight: 800, fontSize: 17 }}>{fmt(cTotAll)}</span>
            </div>
          </Card>
        </div>
      )}

      {/* ═══ NEW RETAINER ═══ */}
      {tab === "retainer" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <InputField label="Monthly Retainer Price" value={nrPrice} onChange={setNrPrice} />
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 10, color: T.sub, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Who sold?</label>
                <Seg options={[{ value: "andres", label: "Andrés" }, { value: "esteban", label: "Esteban" }]} value={nrSeller} onChange={setNrSeller} />
              </div>
            </div>
          </Card>

          <Card>
            <Toggle on={nrHasShooter} onToggle={() => setNrHasShooter(!nrHasShooter)} label="Hired Shooter" sublabel="Flips to 50/50 profit split" color={T.purple} />
            {nrHasShooter && (
              <div style={{ marginTop: 14 }}>
                <InputField label="Shooter Monthly Rate" value={nrShooterCost} onChange={setNrShooterCost} hint="Flat fee per retainer client" />
              </div>
            )}
          </Card>

          {!nrHasShooter ? (
            <>
              <SectionTag>Month 1 — Sales Bonus</SectionTag>
              <ResultBlock {...nr.m1} hasShooter={false}
                note={nrSeller === "andres" ? "Andrés sells → AG 30% · Andrés 60% · Esteban 10%" : "Esteban sells + fulfills → AG 30% · Esteban 70%"} />
              <SectionTag color={T.sub}>Month 2+ — Ongoing</SectionTag>
              <ResultBlock {...nr.ongoing} hasShooter={false} note="Ongoing: Esteban 50% · Andrés 20% · AG 30%" />
            </>
          ) : (
            <>
              <SectionTag color={T.purple}>Hired Shooter — 50/50 Split</SectionTag>
              <ResultBlock {...nr.ongoing} hasShooter={true} shooter={nrShooterCost}
                note="AG 30% → Shooter paid → Remaining profit split 50/50" />
            </>
          )}
        </div>
      )}

      {/* ═══ REAL ESTATE ═══ */}
      {tab === "re" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <InputField label="Job Price" value={rePrice} onChange={setRePrice} />
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 10, color: T.sub, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Who sold?</label>
                <Seg options={[{ value: "andres", label: "Andrés" }, { value: "esteban", label: "Esteban" }]} value={reSeller} onChange={setReSeller} />
              </div>
            </div>
          </Card>

          <Card>
            <Toggle on={reHasShooter} onToggle={() => setReHasShooter(!reHasShooter)} label="Hired Shooter" sublabel="50/50 after AG + shooter cost" color={T.purple} />
            {reHasShooter && (
              <div style={{ marginTop: 14 }}>
                <InputField label="Shooter Rate Per Job" value={reShooterCost} onChange={setReShooterCost} hint="Flat fee per shoot" />
              </div>
            )}
          </Card>

          {reHasShooter ? (
            <>
              <SectionTag color={T.purple}>All Jobs — 50/50 Split</SectionTag>
              <ResultBlock {...calcRE(rePrice, reSeller, 1, true, reShooterCost)} hasShooter={true} shooter={reShooterCost}
                note="AG 30% → Shooter paid → Profit split 50/50" />
            </>
          ) : (
            <>
              <SectionTag color={T.dim}>Existing Agent</SectionTag>
              <ResultBlock {...calcRE(rePrice, reSeller, 3, false, 0)} note="No sales commission — fulfiller gets all after AG 30%" />
              <SectionTag>New Agent — 1st Job (Solo)</SectionTag>
              <ResultBlock {...calcRE(rePrice, reSeller, 1, false, 0)}
                note={`${reSeller === "andres" ? "Andrés" : "Esteban"} sells → 50% commission on 1st job`} />
              <SectionTag>New Agent — 1st Job (Both Work)</SectionTag>
              <ResultBlock {...calcRE(rePrice, reSeller, 1, false, 0, true)} note="50% sales commission + fulfillment split 50/50" />
              <SectionTag color={T.sub}>New Agent — 2nd Job</SectionTag>
              <ResultBlock {...calcRE(rePrice, reSeller, 2, false, 0)} note="Seller gets 10% commission, fulfiller gets rest" />
              <SectionTag color={T.dim}>New Agent — 3rd+ Job</SectionTag>
              <ResultBlock {...calcRE(rePrice, reSeller, 3, false, 0)} note="No commission — same as existing agent" />
            </>
          )}
        </div>
      )}

      {/* ═══ SIMULATOR ═══ */}
      {tab === "sim" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card>
            <Toggle on={simIncludeCurrent} onToggle={() => setSimIncludeCurrent(!simIncludeCurrent)} label="Include current retainers" sublabel={simIncludeCurrent ? `A&S · LPV · LH · Alora = ${fmtK(cTotAll)}` : "Off"} />
          </Card>

          <Card>
            <Toggle on={simHasShooter} onToggle={() => setSimHasShooter(!simHasShooter)} label="Hired Shooter Mode" sublabel="50/50 profit split after AG + shooter" color={T.purple} />
          </Card>

          <Card>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <SectionTag>Retainer Clients</SectionTag>
              <Stepper label="# of clients" value={simRetainers} onChange={setSimRetainers} max={30} />
              <InputField label="Avg retainer price" value={simRetainerAvg} onChange={setSimRetainerAvg} />
              {simHasShooter && (
                <InputField label="Shooter cost / retainer" value={simShooterRetainer} onChange={setSimShooterRetainer} hint="Monthly flat fee per client" />
              )}
            </div>
          </Card>

          <Card>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <SectionTag color={T.blue}>Real Estate Jobs</SectionTag>
              <Stepper label="# jobs / month" value={simREJobs} onChange={setSimREJobs} max={50} />
              <InputField label="Avg job price" value={simREAvg} onChange={setSimREAvg} />
              {simHasShooter ? (
                <InputField label="Shooter cost / job" value={simShooterRE} onChange={setSimShooterRE} />
              ) : (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: T.sub, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>% New agents</span>
                    <span style={{ fontSize: 13, color: T.white, fontWeight: 700 }}>{simNewREPct}%</span>
                  </div>
                  <input type="range" min={0} max={100} step={5} value={simNewREPct}
                    onChange={e => setSimNewREPct(parseInt(e.target.value))}
                    style={{ width: "100%", accentColor: T.orange }} />
                </div>
              )}
            </div>
          </Card>

          {/* RESULTS */}
          <div style={{
            background: `linear-gradient(135deg, ${T.orangeGlow}, ${T.blueGlow}, ${T.card})`,
            borderRadius: 16, padding: 22, border: `1px solid ${T.orange}18`,
          }}>
            <div style={{ fontSize: 10, letterSpacing: 2.5, color: T.orange, fontWeight: 800, marginBottom: 6, textTransform: "uppercase" }}>
              Monthly Projection
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, marginBottom: 20 }}>
              {fmtK(sim.revenue)}
              <span style={{ fontSize: 14, color: T.sub, fontWeight: 400, marginLeft: 6, letterSpacing: 0 }}>/mo</span>
            </div>

            <Bar label="Esteban" value={sim.esteban} maxValue={simMax} color={T.blue} />
            <Bar label="Andrés" value={sim.andres} maxValue={simMax} color={T.orange} />
            <Bar label="AG Visuals (30%)" value={sim.ag} maxValue={simMax} color={T.white} />
            {simHasShooter && <Bar label="Shooter(s)" value={sim.shooter} maxValue={simMax} color={T.purple} />}

            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 14, marginTop: 10 }}>
              {[
                { l: "Esteban", a: sim.esteban, c: T.blue },
                { l: "Andrés", a: sim.andres, c: T.orange },
                { l: "AG Visuals", a: sim.ag, c: T.white },
                ...(simHasShooter ? [{ l: "Shooter(s)", a: sim.shooter, c: T.purple }] : []),
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: T.sub }}>{r.l}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: r.c }}>{fmtK(r.a)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${T.border}`, paddingTop: 8, marginTop: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>Total Revenue</span>
                <span style={{ fontWeight: 800, fontSize: 17 }}>{fmtK(sim.revenue)}</span>
              </div>
            </div>
          </div>

          {/* Annual */}
          <Card>
            <div style={{ fontSize: 10, letterSpacing: 2.5, color: T.blue, fontWeight: 800, marginBottom: 14, textTransform: "uppercase" }}>Annual Projection</div>
            {[
              { l: "Total Revenue", a: sim.revenue * 12, c: T.white },
              { l: "Andrés", a: sim.andres * 12, c: T.orange },
              { l: "Esteban", a: sim.esteban * 12, c: T.blue },
              { l: "AG Visuals", a: sim.ag * 12, c: T.white },
              ...(simHasShooter ? [{ l: "Shooter(s)", a: sim.shooter * 12, c: T.purple }] : []),
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: T.sub }}>{r.l}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: r.c }}>{fmtK(r.a)}</span>
              </div>
            ))}
          </Card>
        </div>
      )}

      <div style={{ textAlign: "center", padding: "28px 0 12px" }}>
        <span style={{
          fontSize: 10, letterSpacing: 2, fontWeight: 700, textTransform: "uppercase",
          background: `linear-gradient(135deg, ${T.orange}, ${T.blue})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>AG Visuals · Revenue Model 2026</span>
      </div>
    </div>
  );
}
