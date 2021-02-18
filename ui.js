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
