
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Wrench,
  Wind,
  Stethoscope,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

const EVENTS = [
  {
    title: "Micrometeorite impact",
    type: "SURFACE HAZARD",
    severity: "HIGH",
    description: "A small impact near the habitat has damaged an external utility line.",
    icon: AlertTriangle,
    options: [
      {
        label: "Send repair rover",
        detail: "Repair the line using the maintenance rover.",
        effects: { power: -5, shielding: 5 }
      },
      {
        label: "Isolate damaged section",
        detail: "Protect the habitat while reducing available power.",
        effects: { power: -3, oxygen: 2 }
      }
    ]
  },
  {
    title: "Dust accumulation detected",
    type: "ENVIRONMENTAL EVENT",
    severity: "MEDIUM",
    description: "Fine lunar dust has accumulated on exposed solar panels and reduced their output.",
    icon: Wind,
    options: [
      {
        label: "Clean solar panels",
        detail: "Use the rover to clean the panels.",
        effects: { power: 8, stamina: -3 }
      },
      {
        label: "Conserve energy",
        detail: "Reduce non-essential energy consumption.",
        effects: { power: 4, greenhouse: -3 }
      }
    ]
  },
  {
    title: "Greenhouse equipment fault",
    type: "SYSTEM MALFUNCTION",
    severity: "MEDIUM",
    description: "A nutrient delivery pump has stopped working in the greenhouse.",
    icon: Sprout,
    options: [
      {
        label: "Repair the pump",
        detail: "Restore greenhouse production.",
        effects: { greenhouse: 8, power: -4 }
      },
      {
        label: "Use stored food",
        detail: "Protect the crew's food supply temporarily.",
        effects: { food: 5, greenhouse: -4 }
      }
    ]
  },
  {
    title: "Crew member exhaustion",
    type: "MEDICAL EVENT",
    severity: "HIGH",
    description: "A crew member is showing signs of fatigue after repeated maintenance work.",
    icon: Stethoscope,
    options: [
      {
        label: "Schedule medical rest",
        detail: "Give the crew time to recover.",
        effects: { health: 3, stamina: 12, morale: 6 }
      },
      {
        label: "Redistribute workload",
        detail: "Share tasks among the crew.",
        effects: { stamina: 5, morale: 3, power: -2 }
      }
    ]
  },
  {
    title: "External equipment malfunction",
    type: "TECHNICAL EVENT",
    severity: "HIGH",
    description: "An external sensor array has stopped transmitting reliable readings.",
    icon: Wrench,
    options: [
      {
        label: "Run diagnostics",
        detail: "Use habitat power to investigate the fault.",
        effects: { power: -4, shielding: 3 }
      },
      {
        label: "Switch to backup sensors",
        detail: "Use the secondary monitoring system.",
        effects: { power: -2, oxygen: -1 }
      }
    ]
  },
  {
    title: "Radiation shelter inspection",
    type: "CREW SAFETY EVENT",
    severity: "MEDIUM",
    description: "A routine inspection identifies a weak point in the habitat's radiation shelter.",
    icon: ShieldCheck,
    options: [
      {
        label: "Reinforce the shelter",
        detail: "Use materials to improve radiation protection.",
        effects: { shielding: 9, power: -3 }
      },
      {
        label: "Limit external activity",
        detail: "Reduce exposure while planning repairs.",
        effects: { shielding: 3, stamina: -2 }
      }
    ]
  }
];

const clamp = value => Math.max(0, Math.min(100, value));

function getRisk(resources, crew) {
  const weakResources = [
    resources.oxygen,
    resources.water,
    resources.food,
    resources.power,
    resources.shielding
  ].filter(value => value < 35).length;

  const tiredCrew = crew.filter(
    member => member.stamina < 40 || member.health < 50
  ).length;

  return Math.min(0.75, 0.25 + weakResources * 0.08 + tiredCrew * 0.06);
}

export default function MissionEvents({
  day,
  resources,
  crew,
  onPendingChange,
  onApply
}) {
  const [activeEvent, setActiveEvent] = useState(null);
  const [eventLog, setEventLog] = useState([]);
  const [lastCheckedDay, setLastCheckedDay] = useState(7);

  useEffect(() => {
    if (day <= lastCheckedDay) return;

    setLastCheckedDay(day);

    const risk = getRisk(resources, crew);

    if (Math.random() < risk) {
      const selected = EVENTS[Math.floor(Math.random() * EVENTS.length)];

      setActiveEvent({
        ...selected,
        id: `${day}-${Date.now()}`,
        day
      });
    }
  }, [day, resources, crew, lastCheckedDay]);

  useEffect(() => {
    onPendingChange(Boolean(activeEvent));
  }, [activeEvent, onPendingChange]);

  const resolveEvent = option => {
    if (!activeEvent) return;

    const resolved = {
      day: activeEvent.day,
      title: activeEvent.title,
      severity: activeEvent.severity,
      decision: option.label
    };

    onApply(option.effects);

    setEventLog(previous => [resolved, ...previous]);
    setActiveEvent(null);
  };

  return (
    <div className="panel" style={{ marginBottom: 24 }}>
      <div className="panel-heading">
        <div>
          <span className="section-kicker">08 / DYNAMIC EVENTS</span>
          <h3>Mission event monitor</h3>
        </div>
        <AlertTriangle size={20} className="warning-icon" />
      </div>

      {activeEvent ? (
        <div
          style={{
            border: "1px solid #704c35",
            background: "#241d1b",
            borderRadius: 12,
            padding: 18
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#f5b45d",
              marginBottom: 12
            }}
          >
            <activeEvent.icon size={22} />
            <strong>{activeEvent.type}</strong>
            <span style={{ marginLeft: "auto", fontSize: 11 }}>
              DAY {activeEvent.day}
            </span>
          </div>

          <h4 style={{ color: "#f4f6f8", margin: "8px 0" }}>
            {activeEvent.title}
          </h4>

          <p style={{ color: "#aab6c2", lineHeight: 1.6 }}>
            {activeEvent.description}
          </p>

          <div
            style={{
              color: "#f5b45d",
              fontSize: 11,
              letterSpacing: 1,
              margin: "18px 0 10px"
            }}
          >
            SELECT YOUR RESPONSE
          </div>

          <div className="choice-list">
            {activeEvent.options.map((option, index) => (
              <button
                className="choice-button"
                key={index}
                onClick={() => resolveEvent(option)}
              >
                <span>
                  <strong>{option.label}</strong>
                  <small>{option.detail}</small>
                </span>
                <ChevronRight size={18} />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="event-success">
          <CheckCircle2 size={26} />
          <h4>No pending random events</h4>
          <p>
            Continue the mission. New events may occur as each day advances.
          </p>
        </div>
      )}

      <div style={{ marginTop: 22 }}>
        <div className="panel-heading">
          <div>
            <span className="section-kicker">EVENT RECORD</span>
            <h3>Resolved events</h3>
          </div>
          <span className="chart-period">
            {eventLog.length} RESOLVED
          </span>
        </div>

        {eventLog.length === 0 ? (
          <p style={{ color: "#8798a9", fontSize: 12 }}>
            No random events resolved yet.
          </p>
        ) : (
          <div className="incident-list">
            {eventLog.map((entry, index) => (
              <div className="incident-item" key={`${entry.day}-${index}`}>
                <div className="incident-icon">
                  <CheckCircle2 size={18} />
                </div>

                <div className="incident-info">
                  <strong>{entry.title}</strong>
                  <span>
                    DAY {entry.day} · {entry.decision}
                  </span>
                </div>

                <span
                  className={`incident-badge ${entry.severity.toLowerCase()}`}
                >
                  {entry.severity}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
