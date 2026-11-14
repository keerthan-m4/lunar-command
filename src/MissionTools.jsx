import { useState } from "react";
import {
  Save, FolderOpen, Trash2, Download, SlidersHorizontal,
  CheckCircle2, HardDrive, ShieldCheck
} from "lucide-react";
import "./MissionTools.css";

const SLOT_COUNT = 3;

export default function MissionTools({
  saveSlots,
  onSave,
  onLoad,
  onDelete,
  onExport,
  compactMode,
  onCompactMode,
  reducedMotion,
  onReducedMotion,
  savedAt
}) {
  const [labels, setLabels] = useState(["Primary mission", "Backup mission", "Experiment"]);
  const formatDate = value => value
    ? new Date(value).toLocaleString()
    : "Empty slot";

  return (
    <section className="mission-tools panel">
      <div className="panel-heading">
        <div>
          <span className="section-kicker">MISSION UTILITIES</span>
          <h3>Save, restore & settings</h3>
        </div>
        <HardDrive size={20} color="#43d9ed" />
      </div>

      <div className="tools-autosave">
        <span className="tools-status"><CheckCircle2 size={16} /> AUTOSAVE ENABLED</span>
        <span>Latest browser save: {formatDate(savedAt)}</span>
      </div>
      <p className="tools-note">
        Your active mission is automatically saved in this browser. Save slots and backups
        are stored locally on this device; they do not sync between computers.
      </p>

      <div className="save-slot-grid">
        {Array.from({ length: SLOT_COUNT }, (_, index) => {
          const slot = saveSlots[index];
          return (
            <article className="save-slot" key={index}>
              <div className="save-slot-title">
                <strong>SLOT 0{index + 1}</strong>
                <span className={slot ? "slot-filled" : "slot-empty"}>
                  {slot ? "SAVED" : "EMPTY"}
                </span>
              </div>
              <label className="slot-label">
                Save name
                <input
                  value={labels[index]}
                  maxLength={28}
                  onChange={event => setLabels(previous =>
                    previous.map((value, itemIndex) => itemIndex === index ? event.target.value : value)
                  )}
                  aria-label={`Name for save slot ${index + 1}`}
                />
              </label>
              <p className="slot-meta">
                {slot
                  ? `${slot.label} · Day ${slot.snapshot.day}/30 · ${formatDate(slot.savedAt)}`
                  : "No saved mission in this slot."}
              </p>
              <div className="slot-actions">
                <button type="button" onClick={() => onSave(index, labels[index])}>
                  <Save size={14} /> Save
                </button>
                <button type="button" disabled={!slot} onClick={() => onLoad(index)}>
                  <FolderOpen size={14} /> Load
                </button>
                <button
                  type="button"
                  className="slot-delete"
                  disabled={!slot}
                  onClick={() => {
                    if (window.confirm(`Delete ${slot?.label || "this save"}?`)) onDelete(index);
                  }}
                  aria-label={`Delete save slot ${index + 1}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="tools-bottom">
        <div>
          <div className="tools-subheading"><SlidersHorizontal size={17} /> DISPLAY SETTINGS</div>
          <label className="setting-toggle">
            <input type="checkbox" checked={compactMode} onChange={event => onCompactMode(event.target.checked)} />
            <span>Compact dashboard spacing</span>
          </label>
          <label className="setting-toggle">
            <input type="checkbox" checked={reducedMotion} onChange={event => onReducedMotion(event.target.checked)} />
            <span>Reduce interface motion</span>
          </label>
        </div>
        <button className="export-button" type="button" onClick={onExport}>
          <Download size={16} /> Export mission backup
        </button>
      </div>

      <div className="tools-footnote">
        <ShieldCheck size={15} />
        <span>Backups contain simulated mission state only. No personal account or cloud sync is used.</span>
      </div>
    </section>
  );
}
