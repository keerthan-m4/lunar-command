
import {
  HeartPulse, Battery, Smile, UserRound, Bed,
  Stethoscope, ShieldCheck
} from "lucide-react";
import "./CrewManagement.css";

function getStatus(value) {
  if (value < 30) return "Critical";
  if (value < 60) return "Warning";
  return "Stable";
}

function CrewMetric({ label, value, icon: Icon }) {
  const status = getStatus(value);

  return (
    <div className="crew-metric">
      <div className="crew-metric-heading">
        <span><Icon size={14} /> {label}</span>
        <strong>{value}%</strong>
      </div>
      <div className="crew-track">
        <div
          className={`crew-fill ${status.toLowerCase()}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function CrewManagement({
  crew,
  day,
  onRest,
  recoveryLog
}) {
  const average = key =>
    Math.round(
      crew.reduce((sum, person) => sum + person[key], 0) /
      Math.max(crew.length, 1)
    );

  return (
    <section className="crew-management">
      <div className="crew-summary">
        <div className="crew-summary-item">
          <UserRound size={19} />
          <span>CREW MEMBERS</span>
          <strong>{String(crew.length).padStart(2, "0")} / 04</strong>
        </div>

        <div className="crew-summary-item">
          <HeartPulse size={19} />
          <span>AVERAGE HEALTH</span>
          <strong>{average("health")}%</strong>
        </div>

        <div className="crew-summary-item">
          <Battery size={19} />
          <span>AVERAGE STAMINA</span>
          <strong>{average("stamina")}%</strong>
        </div>

        <div className="crew-summary-item">
          <Smile size={19} />
          <span>AVERAGE MORALE</span>
          <strong>{average("morale")}%</strong>
        </div>
      </div>

      <div className="crew-card-grid">
        {crew.map(member => {
          const restedToday = recoveryLog.some(
            entry => entry.id === member.id && entry.day === day
          );

          return (
            <article className="crew-card" key={member.id}>
              <div className="crew-card-top">
                <div className="crew-avatar">
                  <UserRound size={25} />
                </div>
                <span className="crew-member-number">
                  CREW 0{member.id}
                </span>
              </div>

              <h4>{member.name}</h4>
              <p className="crew-role">{member.role}</p>

              <p className="crew-specialty">
                <ShieldCheck size={13} /> {member.specialty}
              </p>

              <div className="crew-metrics">
                <CrewMetric label="Health" value={member.health} icon={HeartPulse} />
                <CrewMetric label="Stamina" value={member.stamina} icon={Battery} />
                <CrewMetric label="Morale" value={member.morale} icon={Smile} />
              </div>

              <div className="crew-card-footer">
                <span className={`crew-status ${getStatus(member.health).toLowerCase()}`}>
                  {getStatus(member.health)}
                </span>

                <button
                  className="crew-rest-button"
                  onClick={() => onRest(member.id)}
                  disabled={restedToday}
                >
                  <Bed size={15} />
                  {restedToday ? "Rested today" : "Schedule rest"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="crew-medical-note">
        <Stethoscope size={18} />
        <div>
          <strong>Medical monitoring</strong>
          <p>
            Individual astronaut health, stamina and morale are updated
            by the mission simulation. Rest improves condition. Critical
            life-support shortages and radiation incidents can affect health.
          </p>
        </div>
      </div>
    </section>
  );
}
