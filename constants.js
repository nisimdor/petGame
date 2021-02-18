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
