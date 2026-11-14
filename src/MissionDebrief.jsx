import {
  Trophy,
  AlertTriangle,
  Users,
  Activity,
  RotateCcw,
  CheckCircle2
} from "lucide-react";

const RESOURCE_LABELS = [
  ["oxygen", "Oxygen"],
  ["water", "Water"],
  ["food", "Food"],
  ["power", "Power"],
  ["shielding", "Radiation shielding"],
  ["greenhouse", "Greenhouse"],
];

function getCrewStatus(member) {
  if (member.health <= 0) return "Critical";
  if (member.health < 40) return "Needs attention";
  if (member.health < 70) return "Recovering";
  return "Stable";
}

export default function MissionDebrief({
  success,
  message,
  day,
  score,
  resources,
  crew,
  incidentCount,
  onReset
}) {
  const survivingCrew = crew.filter(member => member.health > 0).length;
  const title = success ? "MISSION ACCOMPLISHED" : "MISSION FAILED";

  return (
    <section className="panel" style={{ margin: "28px 0", padding: 24 }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 18
      }}>
        {success
          ? <Trophy size={30} color="#55d6a0" />
          : <AlertTriangle size={30} color="#ff7777" />}
        <div>
          <span className="section-kicker">FINAL MISSION REPORT</span>
          <h2 style={{ margin: "5px 0", color: success ? "#55d6a0" : "#ff7777" }}>
            {title}
          </h2>
        </div>
      </div>

      <p className="event-description">{message}</p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 12,
        margin: "22px 0"
      }}>
        <div className="emergency-status-card">
          <Activity size={19} />
          <div className="section-kicker">SURVIVAL SCORE</div>
          <strong className="emergency-number">{score}/100</strong>
        </div>

        <div className="emergency-status-card">
          <Users size={19} />
          <div className="section-kicker">CREW SURVIVING</div>
          <strong className="emergency-number">
            {survivingCrew}/{crew.length}
          </strong>
        </div>

        <div className="emergency-status-card">
          <CheckCircle2 size={19} />
          <div className="section-kicker">MISSION DAY</div>
          <strong className="emergency-number">{day}/30</strong>
        </div>

        <div className="emergency-status-card">
          <AlertTriangle size={19} />
          <div className="section-kicker">INCIDENTS RESOLVED</div>
          <strong className="emergency-number">{incidentCount}</strong>
        </div>
      </div>

      <div className="panel-heading">
        <div>
          <span className="section-kicker">LIFE SUPPORT</span>
          <h3>Final resource levels</h3>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 14,
        margin: "14px 0 24px"
      }}>
        {RESOURCE_LABELS.map(([key, label]) => (
          <div key={key}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#c5d0dc",
              fontSize: 13,
              marginBottom: 6
            }}>
              <span>{label}</span>
              <strong>{Math.round(resources[key] ?? 0)}%</strong>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill cyan"
                style={{
                  width: `${Math.max(0, Math.min(100, resources[key] ?? 0))}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="panel-heading">
        <div>
          <span className="section-kicker">CREW STATUS</span>
          <h3>Astronaut condition</h3>
        </div>
      </div>

      <div className="incident-list" style={{ marginTop: 12 }}>
        {crew.map(member => (
          <div className="incident-item" key={member.id}>
            <div className="incident-icon">
              <Users size={18} />
            </div>

            <div className="incident-info">
              <strong>{member.name}</strong>
              <span>
                Health {member.health}% · Stamina {member.stamina}% · Morale {member.morale}%
              </span>
            </div>

            <span className={`incident-badge ${
              member.health < 40 ? "critical" : member.health < 70 ? "high" : "medium"
            }`}>
              {getCrewStatus(member)}
            </span>
          </div>
        ))}
      </div>

      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        marginTop: 24
      }}>
        <button className="reset-button" onClick={onReset}>
          <RotateCcw size={16} /> Start new mission
        </button>
      </div>

      <p style={{
        color: "#8293a5",
        fontSize: 11,
        marginTop: 16
      }}>
        Educational simulation report. Values are simulated gameplay results, not live NASA telemetry.
      </p>
    </section>
  );
}