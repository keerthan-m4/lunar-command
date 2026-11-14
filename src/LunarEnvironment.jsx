import { useState } from "react";
import {
  MapPin, Sun, Snowflake, Droplets, Mountain,
  ShieldCheck, ExternalLink, Radio
} from "lucide-react";
import "./LunarEnvironment.css";

const sites = {
  pole: {
    title: "Lunar South Pole",
    type: "EXPLORATION REGION",
    description:
      "The lunar south pole has a complex lighting environment. Nearby elevated areas may receive extended sunlight, while crater interiors can remain permanently shadowed.",
    detail: "Approximate map position: left side of Shackleton Crater's rim.",
  },
  crater: {
    title: "Shackleton Crater",
    type: "PERMANENTLY SHADOWED REGION NEARBY",
    description:
      "Shackleton Crater is an important target for lunar exploration. Its shadowed interior is of scientific interest because extremely cold conditions may preserve water ice.",
    detail: "Crater diameter: approximately 19 km.",
  },
  habitat: {
    title: "Proposed Habitat",
    type: "SIMULATED MISSION LOCATION",
    description:
      "This is the conceptual location of the LUNAR COMMAND habitat. It is a gameplay marker, not an actual NASA-selected landing site.",
    detail: "Location is illustrative and not geographically certified.",
  },
};

export default function LunarEnvironment() {
  const [selectedSite, setSelectedSite] = useState("pole");

  const activeSite = sites[selectedSite];

  return (
    <section className="environment-section">
      <div className="section-heading">
        <div>
          <span className="section-kicker">05 / LUNAR ENVIRONMENT</span>
          <h3>South pole exploration map</h3>
        </div>
        <span className="telemetry">
          <span /> NASA REFERENCE DATA
        </span>
      </div>

      <div className="environment-layout">
        <div className="environment-map-panel">
          <div className="environment-map-header">
            <div>
              <span className="section-kicker">LUNAR RECONNAISSANCE ORBITER</span>
              <h4>South Pole Illumination Map</h4>
            </div>
            <span className="map-tag">88°S – 90°S</span>
          </div>

          <div className="lunar-map">
            <img
              src="https://assets.science.nasa.gov/dynamicimage/assets/science/psd/photojournal/pia/pia13/pia13720/PIA13720.jpg?crop=faces%2Cfocalpoint&fit=clip&h=1214&w=1214"
              alt="NASA Lunar South Pole illumination map"
            />

            <button
              className={`map-marker pole-marker ${selectedSite === "pole" ? "selected" : ""}`}
              onClick={() => setSelectedSite("pole")}
              title="Lunar South Pole"
            >
              <MapPin size={17} />
              <span>South Pole</span>
            </button>

            <button
              className={`map-marker crater-marker ${selectedSite === "crater" ? "selected" : ""}`}
              onClick={() => setSelectedSite("crater")}
              title="Shackleton Crater"
            >
              <MapPin size={17} />
              <span>Shackleton</span>
            </button>

            <button
              className={`map-marker habitat-marker ${selectedSite === "habitat" ? "selected" : ""}`}
              onClick={() => setSelectedSite("habitat")}
              title="Proposed Habitat"
            >
              <MapPin size={17} />
              <span>Habitat*</span>
            </button>
          </div>

          <div className="map-legend">
            <span><i className="legend-pole" /> South Pole</span>
            <span><i className="legend-crater" /> Crater</span>
            <span><i className="legend-habitat" /> Simulated habitat</span>
          </div>

          <p className="map-credit">
            NASA/GSFC/Arizona State University · PIA13720
          </p>
        </div>

        <div className="environment-details">
          <div className="site-information">
            <span className="section-kicker">SELECTED LOCATION</span>
            <span className="site-type">{activeSite.type}</span>
            <h4>{activeSite.title}</h4>
            <p>{activeSite.description}</p>
            <div className="site-detail">{activeSite.detail}</div>
          </div>

          <div className="environment-fact">
            <div className="fact-icon blue"><Sun size={20} /></div>
            <div>
              <span>POLAR LIGHTING</span>
              <strong>Low-angle sunlight</strong>
              <p>Some elevated areas receive extended illumination.</p>
            </div>
          </div>

          <div className="environment-fact">
            <div className="fact-icon purple"><Snowflake size={20} /></div>
            <div>
              <span>EXTREME COLD</span>
              <strong>−203°C</strong>
              <p>Some permanently shadowed surfaces can reach this temperature.</p>
            </div>
          </div>

          <div className="environment-fact">
            <div className="fact-icon green"><Droplets size={20} /></div>
            <div>
              <span>WATER ICE</span>
              <strong>Evidence detected</strong>
              <p>NASA missions have found evidence of water ice near lunar poles.</p>
            </div>
          </div>

          <div className="environment-fact">
            <div className="fact-icon orange"><Mountain size={20} /></div>
            <div>
              <span>TERRAIN</span>
              <strong>Rugged crater landscape</strong>
              <p>Slopes, craters and shadows complicate landing and navigation.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="environment-warning">
        <ShieldCheck size={19} />
        <div>
          <strong>Mission planning note</strong>
          <p>
            The habitat marker is illustrative. Environmental facts are
            NASA-referenced; no live surface sensors or real-time telemetry
            are connected.
          </p>
        </div>
      </div>

      <div className="nasa-sources">
        <span><Radio size={15} /> RESEARCH SOURCES</span>
        <a
          href="https://science.nasa.gov/photojournal/south-pole-illumination-map/"
          target="_blank"
          rel="noreferrer"
        >
          NASA Illumination Map <ExternalLink size={13} />
        </a>
        <a
          href="https://www.nasa.gov/reference/moonbase-environment/"
          target="_blank"
          rel="noreferrer"
        >
          NASA Moon Base Environment <ExternalLink size={13} />
        </a>
        <a
          href="https://science.nasa.gov/mission/lro/about/"
          target="_blank"
          rel="noreferrer"
        >
          Lunar Reconnaissance Orbiter <ExternalLink size={13} />
        </a>
      </div>
    </section>
  );
}