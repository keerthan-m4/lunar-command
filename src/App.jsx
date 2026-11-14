import { useState, useCallback } from "react";
import {
  Activity, BatteryCharging, Droplets, Wind, Wheat,
  ShieldAlert, Satellite, Radio, Zap, Moon, ChevronRight,
  AlertTriangle, CheckCircle2, Clock3, Users, Target, RefreshCw,
  ShieldCheck, Sprout, Siren, History, Shield, HeartPulse
} from "lucide-react";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

import {
  INITIAL_RESOURCES,
  INITIAL_CREW,
  FIRST_EVENT,
  applyResourceDecision,
  applyCrewDecision,
  restCrewMember,
  simulateDay,
  getEventForDay,
  getMissionScore
} from "./simulation/engine";

import LunarEnvironment from "./LunarEnvironment";
import MissionAnalytics from "./MissionAnalytics";
import CrewManagement from "./CrewManagement";
import MissionEvents from "./MissionEvents";
import NASAReferences from "./NASAReferences";
import MissionDebrief from "./MissionDebrief";
import "./App.css";

const clamp = value => Math.max(0, Math.min(100, value));

function ResourceCard({ title, value, icon: Icon, color, description }) {
  return (
    <div className="resource-card">
      <div className="resource-top">
        <div className={`resource-icon ${color}`}>
          <Icon size={19} />
        </div>
        <span className="resource-label">{title}</span>
        <span className="resource-live">LIVE</span>
      </div>

      <div className="resource-value">
        {value}<span>%</span>
      </div>

      <div className="progress-track">
        <div
          className={`progress-fill ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>

      <div className="resource-bottom">
        <span>{description}</span>
        <span>{value > 25 ? "STABLE" : "LOW"}</span>
      </div>
    </div>
  );
}

function EmergencyPanel({
  event,
  missionEnded,
  eventMessage,
  applyDecision,
  day
}) {
  if (missionEnded) {
    return (
      <div className="event-success">
        <CheckCircle2 size={30} />
        <h4>Mission report available</h4>
        <p>{eventMessage}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-success">
        <CheckCircle2 size={30} />
        <h4>All systems stable</h4>
        <p>
          {eventMessage ||
            "No active emergency. Continue monitoring the habitat."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={`emergency-severity ${event.severity.toLowerCase()}`}>
        <Siren size={17} />
        <span>{event.severity} THREAT</span>
        <span className="emergency-day">DAY {day}</span>
      </div>

      <div className="emergency-system">
        <Shield size={15} />
        AFFECTED SYSTEM: {event.system}
      </div>

      <h4>{event.title}</h4>
      <p className="event-description">{event.description}</p>

      <div className="emergency-priority">
        <strong>SELECT RESPONSE</strong>
        <span>Choose the best survival strategy</span>
      </div>

      <div className="choice-list">
        {event.options.map((option, index) => (
          <button
            className="choice-button"
            key={index}
            onClick={() => applyDecision(option)}
          >
            <span>
              <strong>{option.label}</strong>
              <small>{option.detail}</small>
            </span>
            <ChevronRight size={18} />
          </button>
        ))}
      </div>
    </>
  );
}

export default function App() {
  const [day, setDay] = useState(1);
  const [resources, setResources] = useState({ ...INITIAL_RESOURCES });
  const [crew, setCrew] = useState(
    INITIAL_CREW.map(member => ({ ...member }))
  );
  const [event, setEvent] = useState(FIRST_EVENT);
  const [eventMessage, setEventMessage] = useState("");
  const [historyData, setHistoryData] = useState([
    {
      day: "01",
      oxygen: INITIAL_RESOURCES.oxygen,
      power: INITIAL_RESOURCES.power
    }
  ]);
  const [missionEnded, setMissionEnded] = useState(false);
  const [incidentHistory, setIncidentHistory] = useState([]);
  const [recoveryLog, setRecoveryLog] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [randomEventPending, setRandomEventPending] = useState(false);

  const score = getMissionScore(resources, crew);

  const navigateTo = section => {
    setActiveSection(section);
    document.getElementById(section)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  const handleRandomEventPending = useCallback(pending => {
    setRandomEventPending(pending);
  }, []);

  const applyDecision = option => {
    if (!event) return;

    const resolvedEvent = event;

    const updatedResources = applyResourceDecision(resources, option);
    const updatedCrew = applyCrewDecision(crew, resolvedEvent, option);

    const averageHealth = Math.round(
      updatedCrew.reduce((sum, member) => sum + member.health, 0) /
      Math.max(updatedCrew.length, 1)
    );

    updatedResources.crewHealth = averageHealth;

    setResources(updatedResources);
    setCrew(updatedCrew);

    setIncidentHistory(prev => [
      {
        id: `${Date.now()}-${prev.length}`,
        day,
        title: resolvedEvent.title,
        severity: resolvedEvent.severity,
        system: resolvedEvent.system,
        decision: option.label
      },
      ...prev
    ]);

    setEventMessage(`Response executed: ${option.label}`);
    setEvent(null);
  };

  const handleRest = id => {
    if (recoveryLog.some(entry => entry.id === id && entry.day === day)) {
      return;
    }

    const updatedCrew = restCrewMember(crew, id);

    const averageHealth = Math.round(
      updatedCrew.reduce((sum, member) => sum + member.health, 0) /
      Math.max(updatedCrew.length, 1)
    );

    setCrew(updatedCrew);
    setResources(prev => ({
      ...prev,
      crewHealth: averageHealth
    }));

    setRecoveryLog(prev => [
      ...prev,
      { id, day }
    ]);
  };

  const handleMissionEvent = effects => {
    const updatedResources = { ...resources };
    const updatedCrew = crew.map(member => ({ ...member }));

    Object.entries(effects || {}).forEach(([key, value]) => {
      if (
        ["oxygen", "water", "food", "power", "shielding", "greenhouse"].includes(key)
      ) {
        updatedResources[key] = clamp(updatedResources[key] + value);
      }

      if (["health", "stamina", "morale"].includes(key)) {
        updatedCrew.forEach(member => {
          member[key] = clamp(member[key] + value);
        });
      }
    });

    updatedResources.crewHealth = Math.round(
      updatedCrew.reduce((sum, member) => sum + member.health, 0) /
      Math.max(updatedCrew.length, 1)
    );

    setResources(updatedResources);
    setCrew(updatedCrew);
    setEventMessage("Random mission event resolved. Systems updated.");
  };

  const advanceDay = () => {
    if (
      missionEnded ||
      event ||
      randomEventPending ||
      day >= 30
    ) return;

    const result = simulateDay(resources, day, crew);
    const nextDay = day + 1;

    setResources(result.resources);
    setCrew(result.crew);
    setDay(nextDay);

    setHistoryData(prev => [
      ...prev.slice(-6),
      {
        day: String(nextDay).padStart(2, "0"),
        power: result.resources.power,
        oxygen: result.resources.oxygen
      }
    ]);

    setEventMessage(result.message);

    if (result.failed || result.completed) {
      setMissionEnded(true);
      setEvent(null);
    } else if (nextDay % 3 === 0) {
      setEvent(getEventForDay(nextDay));
    }
  };

  const resetMission = () => {
    setDay(1);
    setResources({ ...INITIAL_RESOURCES });
    setCrew(INITIAL_CREW.map(member => ({ ...member })));
    setEvent(FIRST_EVENT);
    setEventMessage("New lunar mission initialized.");

    setHistoryData([
      {
        day: "01",
        oxygen: INITIAL_RESOURCES.oxygen,
        power: INITIAL_RESOURCES.power
      }
    ]);

    setMissionEnded(false);
    setIncidentHistory([]);
    setRecoveryLog([]);
    setRandomEventPending(false);

    navigateTo("overview");
  };

  const activeThreat = event?.severity || "NONE";

  const navigation = [
    { id: "overview", label: "Mission Overview", icon: Activity },
    { id: "environment", label: "Lunar Environment", icon: Satellite },
    { id: "resources", label: "Resource Systems", icon: BatteryCharging },
    { id: "crew", label: "Crew Management", icon: Users },
    { id: "emergency", label: "Emergency Center", icon: ShieldAlert },
    { id: "events", label: "Mission Events", icon: AlertTriangle },
    { id: "science", label: "NASA Science & Sources", icon: Satellite },
    { id: "analytics", label: "Mission Analytics", icon: Target },
    { id: "history", label: "Mission History", icon: History }
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Moon size={24} />
          </div>
          <div>
            <h1>LUNAR<span>COMMAND</span></h1>
            <small>MISSION CONTROL SYSTEM</small>
          </div>
        </div>

        <div className="side-section">OPERATIONS</div>

        {navigation.map(item => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => navigateTo(item.id)}
              type="button"
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}

        <div className="sidebar-bottom">
          <div className="connection">
            <span /> SYSTEMS ONLINE
          </div>
          <div className="mission-id">MISSION ID: LC-2026-001</div>
          <div className="sidebar-note">
            Inspired by NASA lunar exploration goals.
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            OPERATIONS <ChevronRight size={14} /> OVERVIEW
          </div>

          <div className="top-right">
            <span className="sim-label">
              <Radio size={14} /> SIMULATION MODE
            </span>
            <div className="avatar">MC</div>
          </div>
        </header>

        <section className="welcome" id="overview">
          <div>
            <div className="eyebrow">
              <span /> LUNAR SOUTH POLE · MISSION ACTIVE
            </div>
            <h2>Mission <span>Control.</span></h2>
            <p>
              Monitor your lunar habitat. Protect your crew. Complete the mission.
            </p>
          </div>

          <div className="mission-date">
            <Moon size={28} />
            <div>
              <strong>DAY {String(day).padStart(2, "0")} / 30</strong>
              <small>MISSION TIMELINE</small>
            </div>
          </div>
        </section>

        <section className="hero-panel">
          <div className="hero-image">
            <div className="hero-overlay">
              <div className="hero-tag">
                <span /> HABITAT STATUS: OPERATIONAL
              </div>
              <h3>Humanity's next<br />frontier awaits.</h3>
              <p>One base. Four astronauts. Thirty days to survive.</p>
            </div>

            <div className="hero-coordinates">
              89.9°S · LUNAR SOUTH POLE
            </div>
          </div>

          <div className="hero-stats">
            <div>
              <Users size={19} />
              <strong>04</strong>
              <span>CREW MEMBERS</span>
            </div>
            <div>
              <Target size={19} />
              <strong>30</strong>
              <span>MISSION DAYS</span>
            </div>
            <div>
              <Activity size={19} />
              <strong>{score}%</strong>
              <span>MISSION SCORE</span>
            </div>
          </div>
        </section>

        <div id="environment" className="navigation-anchor">
          <LunarEnvironment />
        </div>

        <section className="section-heading" id="resources">
          <div>
            <span className="section-kicker">01 / LIFE SUPPORT</span>
            <h3>Resource monitoring</h3>
          </div>
          <span className="telemetry">
            <span /> SIMULATED TELEMETRY
          </span>
        </section>

        <section className="resource-grid">
          <ResourceCard title="Oxygen" value={resources.oxygen} icon={Wind} color="cyan" description="Life support reserve" />
          <ResourceCard title="Water" value={resources.water} icon={Droplets} color="blue" description="Available supply" />
          <ResourceCard title="Food" value={resources.food} icon={Wheat} color="orange" description="Stored provisions" />
          <ResourceCard title="Power" value={resources.power} icon={Zap} color="yellow" description="Battery capacity" />
          <ResourceCard title="Radiation shield" value={resources.shielding} icon={ShieldCheck} color="blue" description="Protection capacity" />
          <ResourceCard title="Greenhouse" value={resources.greenhouse} icon={Sprout} color="green" description="Food production capacity" />
        </section>

        <section className="section-heading">
          <div>
            <span className="section-kicker">02 / CREW VITALS</span>
            <h3>Astronaut health</h3>
          </div>
          <span className="telemetry">
            <span /> CREW MONITORING
          </span>
        </section>

        <section className="panel crew-health-panel">
          <div className="resource-top">
            <div className="resource-icon cyan">
              <HeartPulse size={19} />
            </div>
            <span className="resource-label">Crew health index</span>
            <strong style={{ marginLeft: "auto" }}>
              {resources.crewHealth}%
            </strong>
          </div>

          <div className="progress-track" style={{ marginTop: 15 }}>
            <div
              className="progress-fill cyan"
              style={{ width: `${resources.crewHealth}%` }}
            />
          </div>

          <p className="event-description" style={{ marginBottom: 0, marginTop: 12 }}>
            Crew health is calculated from the individual astronaut health values.
          </p>
        </section>

        <section className="section-heading" id="crew">
          <div>
            <span className="section-kicker">03 / CREW OPERATIONS</span>
            <h3>Crew Management</h3>
          </div>
          <span className="telemetry">
            <span /> FOUR ASTRONAUTS
          </span>
        </section>

        <CrewManagement
          crew={crew}
          day={day}
          onRest={handleRest}
          recoveryLog={recoveryLog}
        />

        <section className="section-heading" id="emergency">
          <div>
            <span className="section-kicker">04 / EMERGENCY OPERATIONS</span>
            <h3>Emergency Control Center</h3>
          </div>
          <span className="telemetry">
            <span /> RESPONSE SYSTEM
          </span>
        </section>

        <section className="emergency-dashboard">
          <div className="emergency-status-card">
            <div className="emergency-card-heading">
              <Siren size={20} />
              <span>THREAT MONITOR</span>
            </div>

            <div className={`threat-indicator ${activeThreat.toLowerCase()}`}>
              {activeThreat === "NONE" ? "NO ACTIVE THREAT" : activeThreat}
            </div>

            <p>
              {event
                ? `${event.system} system requires attention.`
                : "No active emergency response required."}
            </p>
          </div>

          <div className="emergency-status-card">
            <div className="emergency-card-heading">
              <ShieldCheck size={20} />
              <span>CREW PROTECTION</span>
            </div>
            <strong className="emergency-number">{resources.crewHealth}%</strong>
            <p>Current simulated crew health index.</p>
          </div>

          <div className="emergency-status-card">
            <div className="emergency-card-heading">
              <History size={20} />
              <span>INCIDENTS RESOLVED</span>
            </div>
            <strong className="emergency-number">{incidentHistory.length}</strong>
            <p>Recorded emergency responses.</p>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel event-panel">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">05 / COMMAND DECISIONS</span>
                <h3>Active emergency</h3>
              </div>
              <AlertTriangle size={20} className="warning-icon" />
            </div>

            <EmergencyPanel
              event={event}
              missionEnded={missionEnded}
              eventMessage={eventMessage}
              applyDecision={applyDecision}
              day={day}
            />
          </div>

          <div className="panel chart-panel">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">06 / TELEMETRY</span>
                <h3>Resource trends</h3>
              </div>
              <span className="chart-period">MISSION HISTORY</span>
            </div>

            <div className="chart-legend">
              <span><i className="legend-cyan" /> Oxygen</span>
              <span><i className="legend-orange" /> Power</span>
            </div>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData}>
                  <defs>
                    <linearGradient id="oxygenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#35d7ee" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#35d7ee" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f6a84b" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f6a84b" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid stroke="#263443" strokeDasharray="3 5" vertical={false} />
                  <XAxis dataKey="day" stroke="#758497" tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} stroke="#758497" tickLine={false} axisLine={false} />

                  <Tooltip contentStyle={{
                    background: "#111e2b",
                    border: "1px solid #304052",
                    borderRadius: 8
                  }} />

                  <Area type="monotone" dataKey="oxygen" stroke="#35d7ee" fill="url(#oxygenGradient)" strokeWidth={2} />
                  <Area type="monotone" dataKey="power" stroke="#f6a84b" fill="url(#powerGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="section-heading" id="history">
          <div>
            <span className="section-kicker">07 / MISSION LOG</span>
            <h3>Emergency incident history</h3>
          </div>
          <span className="telemetry">
            {incidentHistory.length} RECORDED
          </span>
        </section>

        <section className="panel incident-panel">
          {incidentHistory.length === 0 ? (
            <div className="event-success">
              <CheckCircle2 size={28} />
              <h4>No incidents recorded yet</h4>
              <p>Resolved emergency decisions will appear here.</p>
            </div>
          ) : (
            <div className="incident-list">
              {incidentHistory.map(incident => (
                <div className="incident-item" key={incident.id}>
                  <div className="incident-icon">
                    <AlertTriangle size={18} />
                  </div>
                  <div className="incident-info">
                    <strong>{incident.title}</strong>
                    <span>
                      DAY {incident.day} · {incident.system} · {incident.decision}
                    </span>
                  </div>
                  <span className={`incident-badge ${incident.severity.toLowerCase()}`}>
                    {incident.severity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="section-heading" id="events">
          <div>
            <span className="section-kicker">08 / DYNAMIC EVENTS</span>
            <h3>Mission Event System</h3>
          </div>
          <span className="telemetry">
            <span /> EVENT MONITOR
          </span>
        </section>

        <MissionEvents
          day={day}
          resources={resources}
          crew={crew}
          onPendingChange={handleRandomEventPending}
          onApply={handleMissionEvent}
        />

        <section id="science" className="navigation-anchor">
          <NASAReferences />
        </section>

        {missionEnded && (
          <MissionDebrief
            success={eventMessage.startsWith("MISSION SUCCESS")}
            message={eventMessage}
            day={day}
            score={score}
            resources={resources}
            crew={crew}
            incidentCount={incidentHistory.length}
            onReset={resetMission}
          />
        )}

        <div id="analytics" className="navigation-anchor">
          <MissionAnalytics
            resources={resources}
            day={day}
            score={score}
          />
        </div>

        <section className="bottom-actions">
          <div className="mission-message">
            <Clock3 size={18} />
            <span>
              {randomEventPending
                ? "Resolve the pending mission event before advancing."
                : "Every decision changes your mission outcome."}
            </span>
          </div>

          <div className="action-buttons">
            <button className="reset-button" onClick={resetMission}>
              <RefreshCw size={16} /> Reset
            </button>

            <button
              className="advance-button"
              onClick={advanceDay}
              disabled={
                !!event ||
                randomEventPending ||
                missionEnded ||
                day >= 30
              }
            >
              Advance one day <ChevronRight size={17} />
            </button>
          </div>
        </section>

        <footer>
          LUNAR COMMAND © 2026
          <span>EDUCATIONAL SIMULATION · NOT LIVE NASA TELEMETRY</span>
        </footer>
      </main>
    </div>
  );
}