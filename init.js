// constants
const TICK_RATE = 2000;
const RAIN_CHANCE = 0.2;
const ICONS = ["fish", "poop", "weather"];
const SCENES = ["day", "rain"];
const DAY_LENGTH = 11;
const NIGHT_LENGTH = 4;

const getNextHungerTime = (clock) =>
  Math.floor(Math.random() * 3) + 4 + clock;

const getNextDieTime = (clock) =>
  Math.floor(Math.random() * 2) + 3 + clock;

const getNextPoopTime = (clock) =>
  Math.floor(Math.random() * 3) + 5 + clock;

// buttons.js
const toggleHighlighted = (icon, show) => {
  document
    .querySelector(`.${ICONS[icon]}-icon`)
    .classList.toggle("highlighted", show);
};

function initButtons(handleUserAction) {
  let selectedIcon = 0;

  const updateIcon = (selected, reducer) => {
    toggleHighlighted(selected, false);
    selected = reducer(selected) % ICONS.length;
    toggleHighlighted(selected, true);
    return selected;
  };
  function buttonClick({ target }) {
    if (target.classList.contains("left-btn")) {
      selectedIcon = updateIcon(selectedIcon, (x) => x + ICONS.length - 1);
    } else if (target.classList.contains("right-btn")) {
      selectedIcon = updateIcon(selectedIcon, (x) => x + 1);
    } else {
      handleUserAction(ICONS[selectedIcon]);
    }
  }

  document.querySelector(".buttons").addEventListener("click", buttonClick);
}

//ui

const modFox = (state) =>
  (document.querySelector(".fox").className = `fox fox-${state}`);

const modScene = (state) =>
  (document.querySelector(".game").className = `game ${state}`);

const tooglePoopBag = (show) =>
  document.querySelector(".poop-bag").classList.toggle("hidden", !show);

const writeModal = (text = "") => {
  document.querySelector(
    ".modal"
  ).innerHTML = `<div class="modal-inner">${text}</div>`;
};

//game state

const changeSettings = (fox, scene) => {
  modFox(fox);

  // scene is optional
  if (scene) {
    modScene(scene);
  }
};

//#region tick events
const startGame = (state) => {
  state.times[Events.WAKE] = state.clock + 3;
  changeSettings("egg", "day");
  writeModal();
};

const wake = (state) => {
  state.times[Events.WAKE] = -1;
  state.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
  changeSettings("idling", SCENES[state.scene]);
  state.times[Events.SLEEP] = state.clock + DAY_LENGTH;
  state.times[Events.HUNGRY] = getNextHungerTime(state.clock);
};

const clearTimes = (state) => {
  Object.keys(state.times).forEach((keyTime) => (state.times[keyTime] = -1));
};

const sleep = (state) => {
  changeSettings("sleep", "night");
  clearTimes(state);
  state.times[Events.WAKE] = state.clock + NIGHT_LENGTH;
};

const hungry = (state) => {
  state.times[Events.DIE] = getNextDieTime(state.clock);
  state.times[Events.HUNGRY] = -1;
  changeSettings("hungry");
};

const die = (state) => {
  changeSettings("dead", "dead");
  clearTimes(state);
  writeModal("The fox died :( <br/> Press the middle button to start");
};

const changeWeather = (state) => {
  state.scene = (state.scene + 1) % SCENES.length;
  modScene(SCENES[state.scene]);
  determineFoxState(state);
};

const cleanPoop = (state) => {
  state.times[Events.DIE] = -1;
  tooglePoopBag(true);
  state.times[Events.HUNGRY] = getNextHungerTime(state.clock);
};

const poop = (state) => {
  state.times[Events.POOP] = -1;
  state.times[Events.DIE] = getNextDieTime(state.clock);
  changeSettings("pooping");
};
const feed = (state) => {
  state.times[Events.DIE] = -1;
  state.times[Events.START_CELEBRATE] = state.clock + 2;
  changeSettings("eating");
  state.times[Events.START_POOP] = getNextPoopTime(state.clock);
};
const celebrate = (state) => {
  changeSettings("celebrate");
  state.times[Events.START_CELEBRATE] = -1;
  state.times[Events.END_CELEBRATE] = state.clock + 2;
};

const endCelebrate = (state) => {
  state.times[Events.END_CELEBRATE] = -1;
  tooglePoopBag(false);
};

const determineFoxState = (state) => {
  console.log(state.current);
  if (state.current === "idling") {
    if (SCENES[state.scene] === "rain") {
      changeSettings("rain");
    } else {
      changeSettings("idling");
    }
  }
};
//#endregion

const gameState = {
  current: "init",
  clock: 1,
  times: {
    [Events.START_CELEBRATE]: -1,
    [Events.END_CELEBRATE]: -1,
    [Events.WAKE]: -1,
    [Events.SLEEP]: -1,
    [Events.DIE]: -1,
    [Events.HUNGRY]: -1,
    [Events.START_POOP]: -1,
  },
  states: {
    init: {
      "*": {
        target: "hatching",
        actions: [startGame],
      },
    },
    hatching: {
      [Events.WAKE]: {
        target: "idling",
        actions: [wake],
      },
    },
    idling: {
      [Events.SLEEP]: {
        target: "sleeping",
        actions: [sleep],
      },
      [Events.HUNGRY]: {
        target: "hungry",
        actions: [hungry],
      },
      [Events.START_POOP]: {
        target: "pooping",
        actions: [poop],
      },
      [Events.WEATHER]: {
        actions: [changeWeather],
      },
      [Events.DIE]: {
        target: "dead",
        actions: [die],
      },
    },
    hungry: {
      [Events.FISH]: {
        target: "feeding",
        actions: [feed],
      },
      [Events.WEATHER]: {
        actions: [changeWeather],
      },
      [Events.DIE]: {
        target: "dead",
        actions: [die],
      },
    },
    feeding: {
      [Events.START_CELEBRATE]: {
        target: "celebrating",
        actions: [celebrate],
      },
      [Events.WEATHER]: {
        actions: [changeWeather],
      },
    },
    celebrating: {
      [Events.END_CELEBRATE]: {
        target: "idling",
        actions: [endCelebrate, determineFoxState],
      },
      [Events.WEATHER]: {
        actions: [changeWeather],
      },
    },
    pooping: {
      [Events.POOP]: {
        target: "celebrating",
        actions: [cleanPoop, celebrate],
      },
      [Events.WEATHER]: {
        actions: [changeWeather],
      },
      [Events.DIE]: {
        target: "dead",
        actions: [die],
      },
    },
    sleeping: {
      [Events.WAKE]: {
        target: "idling",
        actions: [wake],
      },
      [Events.WEATHER]: {
        actions: [changeWeather],
      },
    },
    dead: {
      "*": {
        target: "hatching",
        actions: [startGame],
      },
    },
  },
  tick() {
    this.clock++;
    let currentClock = this.clock;
    let event = Object.keys(this.times).find(
      (key) => this.times[key] !== -1 && this.times[key] <= currentClock
    );

    console.log(currentClock, event, this.times);
    if (event) {
      handleUserAction(event);
    }
    return this.clock;
  },
};

function handleUserAction(event) {
  let currentState = gameState.states[gameState.current];
  if (currentState) {
    // if we have a wildcard event or a defined event
    let handler = currentState[event] || currentState["*"];
    if (handler) {
      gameState.current = handler.target || gameState.current;
      (handler.actions || []).forEach((f) => f(gameState));
    }
  }
}



async function init() {
  console.log("starting game");
  initButtons(handleUserAction);
  let nextTimeToTick = Date.now();

  function nextAminationFrame() {
    const now = Date.now();

    if (nextTimeToTick <= now) {
      gameState.tick();
      nextTimeToTick = now + TICK_RATE;
    }
    requestAnimationFrame(nextAminationFrame);
  }

  requestAnimationFrame(nextAminationFrame);
}

init();
