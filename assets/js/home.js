(() => {
const home = document.querySelector("#home");
const homeContent = document.querySelector("#home-content");
const themeButton = document.querySelector("#theme-button");
const sourceUrl = document.currentScript?.dataset.markdownSrc;

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function parseHomepage(markdown) {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const coursesHeading = lines.findIndex((line) => line.trim() === "## Courses");
  const title = lines.find((line) => /^#\s+/.test(line));
  const subtitle = lines.find((line) => /^##\s+/.test(line) && line.trim() !== "## Courses");
  const eyebrow = lines.find((line) => /^>\s+/.test(line));
  const titleIndex = lines.indexOf(title);
  const subtitleIndex = lines.indexOf(subtitle);
  const eyebrowIndex = lines.indexOf(eyebrow);
  const description = lines
    .slice(Math.max(titleIndex, subtitleIndex, eyebrowIndex) + 1, coursesHeading)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ");

  if (coursesHeading < 0 || !title || !subtitle || !eyebrow || !description) {
    throw new Error("The Markdown homepage is missing its title, introduction, or courses section.");
  }

  const courseSections = lines.slice(coursesHeading + 1).join("\n").split(/^###\s+/m).slice(1);
  if (!courseSections.length) throw new Error("The Markdown homepage does not contain any courses.");

  const courses = courseSections.map((section) => {
    const [courseTitle, ...metadataLines] = section.trim().split("\n");
    const fields = {};

    metadataLines.forEach((line) => {
      const field = line.match(/^- \*\*(Status|Link|Icon|Icon label|Description|Details):\*\* (.+)$/);
      if (field) fields[field[1].toLowerCase().replace(" ", "")] = field[2].trim();
    });

    const course = {
      title: courseTitle.trim(),
      status: fields.status,
      link: fields.link,
      icon: fields.icon,
      iconLabel: fields.iconlabel,
      description: fields.description,
      details: fields.details
    };

    if (!course.title || !["available", "coming soon"].includes(course.status) ||
        !["git", "horror", "placeholder"].includes(course.icon) ||
        !course.iconLabel || !course.description || !course.details) {
      throw new Error(`Course "${course.title || "Untitled"}" has missing or invalid Markdown fields.`);
    }
    if (course.status === "available" && !course.link) {
      throw new Error(`Available course "${course.title}" is missing its link.`);
    }
    if (course.link) {
      const url = new URL(course.link, window.location.href);
      if (url.origin !== window.location.origin || course.link.trim().startsWith("//")) {
        throw new Error(`Course "${course.title}" has an invalid link.`);
      }
    }

    return course;
  });

  return {
    eyebrow: eyebrow.replace(/^>\s+/, "").trim(),
    title: title.replace(/^#\s+/, "").trim(),
    subtitle: subtitle.replace(/^##\s+/, "").trim(),
    description,
    courses
  };
}

function renderCourse(course) {
  const available = course.status === "available";
  const cardTag = available ? "a" : "article";
  const cardClass = available ? "course-card course-card-live" : "course-card course-card-soon";
  const status = available
    ? '<span class="card-status available"><span></span> Available</span>'
    : '<span class="card-status">Coming soon</span>';
  const details = course.details.split(" · ")
    .map(escapeHtml)
    .join(' <span class="meta-divider">·</span> ');
  const href = available ? ` href="${escapeHtml(course.link)}"` : "";

  return `<${cardTag} class="${cardClass}"${href}>
    <span class="card-topline"><span class="course-icon ${course.icon}-icon" aria-hidden="true">${escapeHtml(course.iconLabel)}</span>${status}</span>
    <span class="course-title">${escapeHtml(course.title)}</span>
    <span class="course-description">${escapeHtml(course.description)}</span>
    <span class="card-bottom"><span>${details}</span><span class="${available ? "card-arrow" : "lock-icon"}" aria-hidden="true">${available ? "↗" : "···"}</span></span>
  </${cardTag}>`;
}

function renderHomepage(markdown) {
  const content = parseHomepage(markdown);
  const availableCount = content.courses.filter((course) => course.status === "available").length;

  homeContent.innerHTML = `<section class="intro" aria-labelledby="page-title">
    <p class="eyebrow">${escapeHtml(content.eyebrow)}</p>
    <h1 id="page-title">${escapeHtml(content.title)}<br><span>${escapeHtml(content.subtitle)}</span></h1>
    <p class="intro-copy">${escapeHtml(content.description)}</p>
    <div class="section-tabs" role="group" aria-label="Filter courses">
      <button class="tab is-active" type="button" data-filter="all" aria-pressed="true">All courses <span>${String(content.courses.length).padStart(2, "0")}</span></button>
      <button class="tab" type="button" data-filter="available" aria-pressed="false">Available now <span>${String(availableCount).padStart(2, "0")}</span></button>
    </div>
  </section>
  <section class="course-grid" aria-label="Training courses">
    ${content.courses.map(renderCourse).join("")}
  </section>`;

  const filterButtons = [...homeContent.querySelectorAll("[data-filter]")];
  const courseCards = [...homeContent.querySelectorAll(".course-card")];
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

  document.title = `${content.title.replace(/[.!?]+$/, "")} — Training Library`;
  home.setAttribute("aria-busy", "false");
}

async function loadHomepage() {
  try {
    if (!sourceUrl) throw new Error("The Markdown source path is not configured.");
    const response = await fetch(new URL(sourceUrl, window.location.href));
    if (!response.ok) throw new Error(`Markdown request failed with HTTP ${response.status}.`);
    renderHomepage(await response.text());
  } catch (error) {
    homeContent.innerHTML = "";
    const message = document.createElement("p");
    message.setAttribute("role", "alert");
    message.textContent = `Could not load the Markdown homepage. ${error.message} Open index.md directly or serve the library over HTTP.`;
    homeContent.append(message);
    home.setAttribute("aria-busy", "false");
  }
}

if (home && homeContent) loadHomepage();

if (themeButton) {
  themeButton.addEventListener("click", () => {
    const dark = document.body.dataset.theme !== "dark";
    document.body.dataset.theme = dark ? "dark" : "light";
    themeButton.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    localStorage.setItem("git-training-theme", dark ? "dark" : "light");
  });

  if (localStorage.getItem("git-training-theme") === "dark") {
    document.body.dataset.theme = "dark";
    themeButton.setAttribute("aria-label", "Switch to light theme");
  }
}
})();
