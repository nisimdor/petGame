
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
