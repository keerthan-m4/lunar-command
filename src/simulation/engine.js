
export const INITIAL_RESOURCES = {
  oxygen: 82,
  water: 76,
  food: 91,
  power: 88,
  shielding: 75,
  greenhouse: 65,
  crewHealth: 100
};

export const INITIAL_CREW = [
  {
    id: 1,
    name: "Commander Alex",
    role: "Mission Commander",
    specialty: "Mission decisions",
    health: 96,
    stamina: 90,
    morale: 92
  },
  {
    id: 2,
    name: "Dr. Maya Chen",
    role: "Medical Officer",
    specialty: "Crew health",
    health: 98,
    stamina: 88,
    morale: 95
  },
  {
    id: 3,
    name: "Engineer Ryan",
    role: "Systems Engineer",
    specialty: "Habitat maintenance",
    health: 94,
    stamina: 86,
    morale: 89
  },
  {
    id: 4,
    name: "Scientist Aisha",
    role: "Science Officer",
    specialty: "Research and greenhouse",
    health: 97,
    stamina: 91,
    morale: 94
  }
];

export const INITIAL_HISTORY = [
  { day: "01", oxygen: 100, power: 100 },
  { day: "02", oxygen: 97, power: 96 },
  { day: "03", oxygen: 94, power: 94 },
  { day: "04", oxygen: 91, power: 92 },
  { day: "05", oxygen: 88, power: 90 },
  { day: "06", oxygen: 85, power: 89 },
  { day: "07", oxygen: 82, power: 88 }
];

export const FIRST_EVENT = {
  title: "Solar panel efficiency declining",
  severity: "MEDIUM",
  system: "POWER",
  description:
    "Dust accumulation and changing sunlight angles are reducing solar panel efficiency.",
  options: [
    {
      label: "Deploy cleaning rover",
      detail: "Restore solar efficiency using the maintenance rover.",
      effects: { power: 8, greenhouse: -2 }
    },
    {
      label: "Switch to energy conservation",
      detail: "Reduce non-essential energy consumption.",
      effects: { power: 5, crewHealth: -1 }
    },
    {
      label: "Use battery reserves",
      detail: "Maintain operations using stored energy.",
      effects: { power: -5, crewHealth: 2 }
    }
  ]
};

const EVENTS = [
  {
    title: "Water recycling malfunction",
    severity: "HIGH",
    system: "WATER",
    description:
      "The water recovery unit is malfunctioning. The habitat is losing valuable recycled water.",
    options: [
      {
        label: "Repair recycling unit",
        detail: "Use spare components to restore water recovery.",
        effects: { water: 12, power: -6 }
      },
      {
        label: "Activate emergency reserves",
        detail: "Use stored water to maintain the crew supply.",
        effects: { water: 7, food: -2 }
      },
      {
        label: "Reduce water consumption",
        detail: "Restrict water usage until repairs are possible.",
        effects: { water: 4, crewHealth: -3 }
      }
    ]
  },
  {
    title: "Life support filter warning",
    severity: "CRITICAL",
    system: "OXYGEN",
    description:
      "The habitat's air filtration system is showing abnormal pressure. Oxygen availability could become unstable.",
    options: [
      {
        label: "Replace filter immediately",
        detail: "Use the backup filtration cartridge.",
        effects: { oxygen: 14, power: -7 }
      },
      {
        label: "Activate backup life support",
        detail: "Switch to the secondary oxygen system.",
        effects: { oxygen: 8, power: -4 }
      },
      {
        label: "Reduce oxygen demand",
        detail: "Restrict physical activity inside the habitat.",
        effects: { oxygen: 5, crewHealth: -4 }
      }
    ]
  },
  {
    title: "Greenhouse temperature anomaly",
    severity: "MEDIUM",
    system: "GREENHOUSE",
    description:
      "Temperature fluctuations are affecting the greenhouse environment and may reduce future food production.",
    options: [
      {
        label: "Restore temperature control",
        detail: "Use additional energy to stabilize greenhouse conditions.",
        effects: { greenhouse: 12, power: -7 }
      },
      {
        label: "Reduce greenhouse operations",
        detail: "Conserve energy at the cost of food production.",
        effects: { power: 5, greenhouse: -5 }
      },
      {
        label: "Manual environmental adjustment",
        detail: "Crew members perform manual greenhouse maintenance.",
        effects: { greenhouse: 7, crewHealth: -2 }
      }
    ]
  },
  {
    title: "Solar radiation storm detected",
    severity: "CRITICAL",
    system: "SHIELDING",
    description:
      "A solar radiation event is approaching. The crew must improve protection inside the habitat.",
    options: [
      {
        label: "Move crew to storm shelter",
        detail: "Use the reinforced shelter for maximum protection.",
        effects: { shielding: 15, power: -5 }
      },
      {
        label: "Deploy additional shielding",
        detail: "Reinforce exposed habitat sections.",
        effects: { shielding: 10, greenhouse: -3 }
      },
      {
        label: "Continue normal operations",
        detail: "Avoid consuming additional resources but accept increased exposure.",
        effects: { shielding: -12, crewHealth: -8 }
      }
    ]
  },
  {
    title: "Habitat power failure",
    severity: "HIGH",
    system: "POWER",
    description:
      "A power distribution fault has reduced energy availability. Critical systems need immediate attention.",
    options: [
      {
        label: "Repair power distribution",
        detail: "Restore the damaged electrical connection.",
        effects: { power: 14, oxygen: -2 }
      },
      {
        label: "Activate backup batteries",
        detail: "Use emergency battery storage.",
        effects: { power: 9, shielding: -2 }
      },
      {
        label: "Shut down non-essential systems",
        detail: "Protect critical systems by reducing energy demand.",
        effects: { power: 6, greenhouse: -5 }
      }
    ]
  }
];

const clamp = value => Math.max(0, Math.min(100, value));

export function getEventForDay(day) {
  const index = (Math.floor(day / 3) - 3) % EVENTS.length;
  return EVENTS[(index + EVENTS.length) % EVENTS.length];
}

export function applyResourceDecision(resources, option) {
  const updated = { ...resources };

  Object.entries(option.effects || {}).forEach(([key, change]) => {
    if (key in updated) {
      updated[key] = clamp(updated[key] + change);
    }
  });

  return updated;
}

export function applyCrewDecision(crew, event, option) {
  const updatedCrew = crew.map(member => ({ ...member }));

  if (!event) return updatedCrew;

  const effects = option.effects || {};

  if (event.system === "SHIELDING") {
    const shieldingChange = effects.shielding || 0;

    updatedCrew.forEach(member => {
      if (shieldingChange < 0) {
        member.health = clamp(member.health - 8);
        member.morale = clamp(member.morale - 4);
      } else if (shieldingChange > 0) {
        member.health = clamp(member.health + 2);
        member.morale = clamp(member.morale + 2);
      }
    });
  }

  if (effects.crewHealth < 0) {
    updatedCrew.forEach(member => {
      member.health = clamp(member.health + effects.crewHealth);
    });
  }

  if (effects.crewHealth > 0) {
    updatedCrew.forEach(member => {
      member.health = clamp(member.health + effects.crewHealth);
    });
  }

  return updatedCrew;
}

export function restCrewMember(crew, id) {
  return crew.map(member =>
    member.id === id
      ? {
          ...member,
          stamina: clamp(member.stamina + 15),
          morale: clamp(member.morale + 5),
          health: clamp(member.health + 2)
        }
      : member
  );
}

function getSolarOutput(day) {
  const solarCycle = [7, 6, 5, 2, 6, 7, 4];
  return solarCycle[(day - 1) % solarCycle.length];
}

function calculateDailyResources(resources, day) {
  const updated = { ...resources };

  const oxygenUse = 3;
  const waterUse = 2.5;
  const foodUse = 2.5;

  const greenhouseFoodProduction =
    resources.greenhouse * 0.025;

  const greenhousePowerUse =
    resources.greenhouse * 0.02;

  const solarGeneration = getSolarOutput(day);
  const totalPowerDemand = 5.5 + greenhousePowerUse;

  updated.oxygen = clamp(updated.oxygen - oxygenUse);
  updated.water = clamp(updated.water - waterUse);

  updated.food = clamp(
    updated.food - foodUse + greenhouseFoodProduction
  );

  updated.power = clamp(
    updated.power + solarGeneration - totalPowerDemand
  );

  return updated;
}

function updateCrewDaily(crew, resources) {
  return crew.map(member => {
    let healthChange = 0;
    let staminaChange = -2;
    let moraleChange = -1;

    if (resources.oxygen < 20) healthChange -= 5;
    if (resources.water < 20) healthChange -= 4;
    if (resources.food < 15) healthChange -= 3;
    if (resources.shielding < 20) healthChange -= 2;
    if (resources.power < 15) healthChange -= 4;

    if (resources.oxygen < 20 || resources.water < 20) {
      staminaChange -= 3;
    }

    if (resources.food < 15) {
      staminaChange -= 2;
      moraleChange -= 2;
    }

    return {
      ...member,
      health: clamp(member.health + healthChange),
      stamina: clamp(member.stamina + staminaChange),
      morale: clamp(member.morale + moraleChange)
    };
  });
}

function averageCrewHealth(crew) {
  if (!crew.length) return 0;

  return Math.round(
    crew.reduce((sum, member) => sum + member.health, 0) / crew.length
  );
}

export function simulateDay(resources, day, crew = INITIAL_CREW) {
  const updatedResources = calculateDailyResources(resources, day);
  const updatedCrew = updateCrewDaily(crew, updatedResources);

  updatedResources.crewHealth = averageCrewHealth(updatedCrew);

  const criticalSystems = ["oxygen", "water", "food", "power"];

  const failedResource = criticalSystems.find(
    key => updatedResources[key] <= 0
  );

  const failed =
    Boolean(failedResource) ||
    updatedResources.crewHealth <= 0 ||
    updatedCrew.some(member => member.health <= 0);

  const completed = day >= 29 && !failed;

  let message = `Day ${day + 1} simulation complete. Crew and habitat systems updated.`;

  if (failed) {
    message = failedResource
      ? `MISSION FAILURE: ${failedResource.toUpperCase()} reserves depleted.`
      : "MISSION FAILURE: Crew health has reached zero.";
  } else if (completed) {
    message = "MISSION SUCCESS: The crew survived all 30 mission days!";
  } else if (updatedResources.crewHealth < 50) {
    message = "WARNING: Crew health is declining. Review essential resources.";
  } else if (updatedResources.power < 25) {
    message = "WARNING: Power reserves are critically low.";
  }

  return {
    resources: updatedResources,
    crew: updatedCrew,
    failed,
    completed,
    message
  };
}

export function getMissionScore(resources, crew = []) {
  const resourceValues = [
    resources.oxygen,
    resources.water,
    resources.food,
    resources.power,
    resources.shielding,
    resources.greenhouse
  ];

  const crewValues = crew.flatMap(member => [
    member.health,
    member.stamina,
    member.morale
  ]);

  const values = [
    ...resourceValues,
    resources.crewHealth,
    ...crewValues
  ];

  if (!values.length) return 0;

  return Math.round(
    values.reduce((sum, value) => sum + value, 0) / values.length
  );
}
