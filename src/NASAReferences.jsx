import {
  Sun,
  Thermometer,
  Droplets,
  ShieldAlert,
  Radio,
  ExternalLink,
  FlaskConical
} from "lucide-react";

import "./NASAReferences.css";

const references = [
  {
    icon: Sun,
    category: "LIGHTING & POWER",
    title: "The Sun stays low near the lunar poles",
    fact: "At the lunar poles, the Sun remains close to the horizon. Nearby terrain can cast long, moving shadows, so illumination and solar-power opportunities depend strongly on the exact location.",
    relevance: "Why it matters: solar generation can vary with terrain, orientation and time.",
    source: "NASA — Shadows near the Moon's South Pole",
    url: "https://science.nasa.gov/resource/shadows-near-the-moons-south-pole/"
  },
  {
    icon: Thermometer,
    category: "THERMAL ENVIRONMENT",
    title: "Permanently shadowed regions can be extremely cold",
    fact: "NASA reports temperatures below −246°C in some permanently shadowed lunar polar regions. This is a local extreme, not a representative temperature for every south-pole site.",
    relevance: "Why it matters: equipment and habitat systems need thermal management.",
    source: "NASA — Weather on the Moon",
    url: "https://science.nasa.gov/moon/weather-on-the-moon/"
  },
  {
    icon: Droplets,
    category: "WATER ICE",
    title: "Water ice exists in some permanently shadowed regions",
    fact: "NASA observations support the presence of water ice at the lunar poles. Its distribution, depth and concentration vary, so a nearby shadowed crater should not be treated as a guaranteed water supply.",
    relevance: "Why it matters: prospecting and resource extraction require site-specific measurements.",
    source: "NASA — Moon Water and Ices",
    url: "https://science.nasa.gov/moon/moon-water-and-ices/"
  },
  {
    icon: ShieldAlert,
    category: "RADIATION",
    title: "The Moon lacks a global magnetic field and substantial atmosphere",
    fact: "The lunar surface is exposed to solar wind and other space radiation. A habitat would need appropriate shielding and procedures for solar particle events.",
    relevance: "Why it matters: radiation protection is a mission-design requirement, not a simple percentage gauge.",
    source: "NASA — Solar Wind on the Moon",
    url: "https://science.nasa.gov/moon/solar-wind/"
  },
  {
    icon: Radio,
    category: "COMMUNICATIONS",
    title: "Terrain can interrupt direct-to-Earth communications",
    fact: "At the lunar south pole, Earth can appear low on the horizon or be blocked by local terrain. Surface geometry can affect radio links and contribute to interference or data loss.",
    relevance: "Why it matters: communication planning may require relay coverage and careful site selection.",
    source: "NASA — Lunar Surface Propagation",
    url: "https://www.nasa.gov/glenn/glenn-expertise-space-exploration/scan/lunar-surface-propagation/"
  }
];

export default function NASAReferences() {
  return (
    <div className="nasa-science-section">
      <div className="nasa-science-heading">
        <div>
          <span className="section-kicker">
            09 / SCIENCE & ENGINEERING CONTEXT
          </span>
          <h3>NASA Science & Sources</h3>
          <p>
            Research-backed lunar environment facts and how they relate to
            the LUNAR COMMAND survival scenario.
          </p>
        </div>

        <div className="nasa-source-mark">
          <FlaskConical size={22} />
          <span>REFERENCE LIBRARY</span>
        </div>
      </div>

      <div className="nasa-science-notice">
        <strong>Important distinction</strong>
        <p>
          NASA references below describe observed or researched lunar
          conditions. Resource percentages, crew statistics, event effects
          and daily consumption rates elsewhere in this simulator are
          illustrative gameplay assumptions, not measured NASA telemetry
          or validated life-support engineering predictions.
        </p>
      </div>

      <div className="nasa-reference-grid">
        {references.map((item) => {
          const Icon = item.icon;

          return (
            <article className="nasa-reference-card" key={item.category}>
              <div className="nasa-reference-top">
                <span className="nasa-reference-icon">
                  <Icon size={19} />
                </span>

                <span className="nasa-reference-category">
                  {item.category}
                </span>

                <span className="nasa-evidence-label">
                  NASA REFERENCE
                </span>
              </div>

              <h4>{item.title}</h4>
              <p>{item.fact}</p>

              <div className="nasa-relevance">
                {item.relevance}
              </div>

              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
              >
                {item.source}
                <ExternalLink size={14} />
              </a>
            </article>
          );
        })}
      </div>

      <div className="nasa-method-note">
        <strong>How to read this simulator</strong>
        <p>
          NASA source links support the environmental context. They do not
          validate the simulator's numerical resource model. The current
          model uses simplified, illustrative values to demonstrate
          trade-offs between survival systems.
        </p>
      </div>
    </div>
  );
}