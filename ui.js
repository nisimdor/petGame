export const modFox = (state) =>
  (document.querySelector(".fox").className = `fox fox-${state}`);

export const modScene = (state) =>
  (document.querySelector(".game").className = `game ${state}`);

export const tooglePoopBag = (show) =>
  document.querySelector(".poop-bag").classList.toggle("hidden", !show);

export const writeModal = (text = "") => {
  document.querySelector(
    ".modal"
  ).innerHTML = `<div class="modal-inner">${text}</div>`;
};
