const toggleHighlighted = (icon, show) => {
  document
    .querySelector(`.${ICONS[icon]}-icon`)
    .classList.toggle("highlighted", show);
};

export default function initButtons(handleUserAction) {
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
