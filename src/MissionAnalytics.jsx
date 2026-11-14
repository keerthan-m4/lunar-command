
import {
  Activity, Clock, AlertTriangle, ShieldCheck,
  TrendingDown, HeartPulse
} from "lucide-react";
import "./MissionAnalytics.css";

function calculateRunway(value, dailyUse) {
  if (value <= 0) return 0;
  if (dailyUse <= 0) return Infinity;
  return Math.floor(value / dailyUse);
}

export default function MissionAnalytics({ resources, day, score }) {
  const averageSolar = 5.28;
  const oxygenDays = calculateRunway(resources.oxygen, 3);
  const waterDays = calculateRunway(resources.water, 2.5);

  const foodDailyUse = Math.max(
    0.1,
    2.5 - resources.greenhouse * 0.025
  );

  const foodDays = calculateRunway(resources.food, foodDailyUse);

  const powerDemand = 5.5 + resources.greenhouse * 0.02;
  const netPowerLoss = powerDemand - averageSolar;

  const powerDays = netPowerLoss > 0
    ? calculateRunway(resources.power, netPowerLoss)
    : Infinity;

  const forecasts = [
    { name: "Oxygen", value: oxygenDays, current: resources.oxygen },
    { name: "Water", value: waterDays, current: resources.water },
    { name: "Food", value: foodDays, current: resources.food },
    { name: "Power", value: powerDays, current: resources.power }
  ];

  const finiteForecasts = forecasts.filter(item => Number.isFinite(item.value));
  const weakest = finiteForecasts.reduce(
    (a, b) => a.value <= b.value ? a : b,
    finiteForecasts[0]
  );

  const risks = [
    { name: "Oxygen supply", value: resources.oxygen },
    { name: "Water reserves", value: resources.water },
    { name: "Food reserves", value: resources.food },
    { name: "Power capacity", value: resources.power },
    { name: "Radiation protection", value: resources.shielding },
    { name: "Greenhouse capacity", value: resources.greenhouse },
    { name: "Crew health", value: resources.crewHealth }
  ];

  const critical = risks.filter(item => item.value < 25);
  const warning = risks.filter(item => item.value >= 25 && item.value < 50);

  const riskLevel = critical.length > 0
    ? "CRITICAL"
    : warning.length > 0
      ? "WARNING"
      : "STABLE";

  const readiness = Math.round(
    risks.reduce((sum, item) => sum + item.value, 0) / risks.length
  );

  const formatDays = value =>
    Number.isFinite(value) ? `${value} days` : "Stable";

  return (
    <section className="analytics-section">
      <div className="section-heading">
        <div>
          <span className="section-kicker">07 / MISSION INTELLIGENCE</span>
          <h3>Survival analytics</h3>
        </div>
        <span className="telemetry">
          <span /> SIMULATED FORECAST
        </span>
      </div>

      <div className="analytics-overview">
        <div className="analytics-card readiness-card">
          <div className="analytics-card-title">
            <ShieldCheck size={19} />
            MISSION READINESS
          </div>
          <strong>{readiness}%</strong>
          <div className="analytics-track">
            <div style={{ width: `${readiness}%` }} />
          </div>
          <span>Average condition across seven systems</span>
        </div>

        <div className="analytics-card risk-card">
          <div className="analytics-card-title">
            <AlertTriangle size={19} />
            OVERALL RISK
          </div>
          <strong className={`risk-${riskLevel.toLowerCase()}`}>
            {riskLevel}
          </strong>
          <span>
            {critical.length} critical · {warning.length} warning systems
          </span>
        </div>

        <div className="analytics-card score-card">
          <div className="analytics-card-title">
            <Activity size={19} />
            MISSION SCORE
          </div>
          <strong>{score}%</strong>
          <span>Current mission performance · Day {day}</span>
        </div>
      </div>

      <div className="panel forecast-panel">
        <div className="panel-heading">
          <div>
            <span className="section-kicker">RESOURCE PROJECTION</span>
            <h3>Estimated survival runway</h3>
          </div>
          <Clock size={19} color="#43d9ed" />
        </div>

        <div className="forecast-grid">
          {forecasts.map(item => (
            <div className="forecast-item" key={item.name}>
              <div className="forecast-name">
                <span>{item.name}</span>
                <strong>{formatDays(item.value)}</strong>
              </div>
              <div className="analytics-track">
                <div
                  className={item.value < 10 ? "danger-fill" : ""}
                  style={{
                    width: `${Math.min(100, item.value / 30 * 100)}%`
                  }}
                />
              </div>
              <small>Current reserve: {item.current.toFixed(1)}%</small>
            </div>
          ))}
        </div>

        <div className="forecast-note">
          <TrendingDown size={17} />
          <span>
            {weakest
              ? `${weakest.name} is projected to become depleted first, in approximately ${weakest.value} days if current assumptions continue.`
              : "No resource depletion projection is currently available."}
          </span>
        </div>
      </div>

      <div className="content-grid analytics-bottom">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">SYSTEM DIAGNOSTICS</span>
              <h3>Resource risk report</h3>
            </div>
            <AlertTriangle size={19} color="#f5aa5e" />
          </div>

          <div className="risk-list">
            {risks.map(item => (
              <div className="risk-row" key={item.name}>
                <span>{item.name}</span>
                <strong className={
                  item.value < 25 ? "risk-critical" :
                  item.value < 50 ? "risk-warning" : "risk-stable"
                }>
                  {item.value.toFixed(1)}%
                </strong>
              </div>
            ))}
          </div>
        </div>

        <div className="panel crew-analysis">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">CREW SURVIVAL</span>
              <h3>Human performance</h3>
            </div>
            <HeartPulse size={20} color="#43d9ed" />
          </div>

          <div className="crew-score">
            {resources.crewHealth.toFixed(1)}%
          </div>

          <div className="analytics-track">
            <div style={{ width: `${resources.crewHealth}%` }} />
          </div>

          <p>
            Crew health is affected by oxygen, water, food availability
            and emergency decisions in this simulation.
          </p>

          <div className="crew-status">
            {resources.crewHealth >= 70
              ? "CREW CONDITION: GOOD"
              : resources.crewHealth >= 40
                ? "CREW CONDITION: CAUTION"
                : "CREW CONDITION: CRITICAL"}
          </div>
        </div>
      </div>

      <p className="analytics-disclaimer">
        Forecasts use simplified gameplay consumption and production
        assumptions. They are not engineering predictions or NASA telemetry.
      </p>
    </section>
  );
}
