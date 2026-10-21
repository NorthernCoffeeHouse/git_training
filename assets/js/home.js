const filterButtons = [...document.querySelectorAll("[data-filter]")];
const courseCards = [...document.querySelectorAll(".course-card")];
const themeButton = document.querySelector("#theme-button");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    courseCards.forEach((card) => {
      card.hidden = filter === "available" && !card.classList.contains("course-card-live");
    });
  });
});

themeButton.addEventListener("click", () => {
  const dark = document.body.dataset.theme !== "dark";
  document.body.dataset.theme = dark ? "dark" : "light";
  themeButton.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  localStorage.setItem("git-training-theme", dark ? "dark" : "light");
});

const savedTheme = localStorage.getItem("git-training-theme");
if (savedTheme === "dark") {
  document.body.dataset.theme = "dark";
  themeButton.setAttribute("aria-label", "Switch to light theme");
}
