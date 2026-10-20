const chapters = [
  {
    title: "Version control & Git",
    label: "Getting started",
    duration: "5 min",
    description: "Get oriented: what version control does, what Git tracks, and how the pieces fit together.",
    sections: [
      { heading: "A better way to work", text: "Version control records changes to files over time. It helps you compare versions, return to earlier work, and collaborate without passing around multiple copies of the same folder." },
      { heading: "Git is not GitHub", text: "Git is a distributed version control system. Every clone contains the repository's history, so many operations work offline. Git manages versions; GitHub, GitLab, and similar services host repositories and add collaboration features." },
      { heading: "The three areas", list: ["Working tree — the files you are editing.", "Staging area (index) — the changes selected for the next commit.", "Repository — the committed project history."] },
      { heading: "Your first commands", code: "mkdir git-practice\ncd git-practice\ngit init\ngit status", language: "bash", note: "The working tree is where you edit; the staging area is where you select; a commit saves the staged snapshot." }
    ],
    exercise: "Create a practice folder, initialize a repository, and check its status. In your own words, explain how Git differs from a hosting service."
  },
  {
    title: "Repositories & commits",
    label: "Save your first snapshot",
    duration: "6 min",
    description: "Create a file, stage it, and save your first meaningful snapshot.",
    sections: [
      { heading: "A commit is a snapshot", text: "A commit saves the staged changes as one coherent point in your project's history. Start by adding a README to the repository you created in Chapter 1." },
      { heading: "Create and commit", code: "echo \"# Git Practice\" > README.md\ngit status\ngit add README.md\ngit status\ngit commit -m \"Add project readme\"\ngit status", language: "bash" },
      { heading: "Inspect the result", code: "git log -1\ngit show", language: "bash" },
      { heading: "Write useful messages", list: ["Good: Add setup instructions", "Good: Fix date parsing for empty input", "Good: Remove unused sample data", "Avoid: changes, update, or stuff — they do not explain the intent."] }
    ],
    exercise: "Add a short description and a list of goals to README.md. Stage and commit those edits separately from the initial file creation."
  },
  {
    title: "Changes & staging",
    label: "Choose what goes in",
    duration: "6 min",
    description: "Review the difference between your working files and the changes selected for a commit.",
    sections: [
      { heading: "Inspect before committing", text: "Check the project state often. Git keeps unstaged edits separate from the changes already selected for the next commit." },
      { heading: "Review and stage", code: "git status\ngit diff\ngit add README.md\ngit diff --staged\ngit commit -m \"Document project goals\"", language: "bash" },
      { heading: "Stage intentionally", text: "You can stage a file or a specific path. `git add .` stages changes under the current directory. It is convenient, but review `git status` first so generated files or secrets are not included accidentally." },
      { heading: "Unstage without losing edits", code: "git restore --staged README.md", language: "bash", note: "This removes the file from the staging area. Your working-tree edits are kept." }
    ],
    exercise: "Make changes to two files. Stage only one, inspect the staged diff, and commit it. Then stage and commit the other file."
  },
  {
    title: "Ignore files & review",
    label: "Keep the repo tidy",
    duration: "7 min",
    description: "Keep generated and local files out of version control, and learn to inspect project history.",
    sections: [
      { heading: "Ignore local and generated files", text: "Add patterns to a `.gitignore` file for things like build output, editor settings, and local environment files." },
      { heading: "A starter .gitignore", code: "# Build output\ndist/\nbuild/\n\n# Local environment and secrets\n.env\n.env.*\n!.env.example\n\n# Operating system files\n.DS_Store\nThumbs.db", language: "gitignore" },
      { heading: "Already tracked?", text: "Ignore rules do not remove files that Git already tracks. To stop tracking a file while keeping your local copy, remove it from the index." },
      { heading: "Review changes and history", code: "git rm --cached path/to/file\ngit diff\ngit diff --staged\ngit log --oneline --decorate\ngit show <commit-id>", language: "bash", note: "Never commit passwords, API keys, or real secrets—even to a practice repository." }
    ],
    exercise: "Create a temporary file matching one of your ignore rules. Check `git status` to confirm it is ignored. Do not use real credentials."
  },
  {
    title: "Branches & parallel work",
    label: "Work in parallel",
    duration: "6 min",
    description: "Use branches to develop a change independently, then switch between lines of work.",
    sections: [
      { heading: "A branch is a pointer", text: "A branch is a movable name pointing to a commit. Branches let you develop a feature or fix without changing the main line of work." },
      { heading: "Create a feature branch", code: "git branch\ngit switch -c feature/add-intro\n\n# Edit a file, then save the change\ngit add README.md\ngit commit -m \"Add project introduction\"", language: "bash" },
      { heading: "Switch between branches", code: "git switch main\ngit branch", language: "bash" },
      { heading: "Name branches clearly", text: "The shorthand `git switch -c` creates and switches to a branch. Use descriptive names such as `feature/search-filter` or `fix/login-validation`." }
    ],
    exercise: "Create `docs/add-usage`, add a Usage section to the README, and commit it. Switch back to `main` and confirm the change is not there yet."
  },
  {
    title: "Merge & resolve conflicts",
    label: "Bring work together",
    duration: "8 min",
    description: "Integrate a finished branch and resolve conflicts when two changes overlap.",
    sections: [
      { heading: "Merge a finished branch", text: "Switch to the destination branch, then merge the branch containing the work." },
      { heading: "Merge the change", code: "git switch main\ngit merge feature/add-intro", language: "bash" },
      { heading: "When Git finds a conflict", text: "If two branches edit the same part of a file, Git marks the conflicting sections. Open the file, choose the intended final content, and remove all conflict markers." },
      { heading: "Conflict markers look like this", code: "<<<<<<< HEAD\ncontent on the current branch\n=======\ncontent being merged\n>>>>>>> feature-branch", language: "text" },
      { heading: "Finish or cancel the merge", code: "git add path/to/conflicted-file\ngit status\ngit commit\n\n# To cancel an in-progress merge instead:\ngit merge --abort", language: "bash", note: "Git may create the merge commit automatically after you stage the resolution; follow the instructions Git prints." }
    ],
    exercise: "Create two branches that change the same line differently. Merge one into the other, resolve the conflict, and confirm the final file has no conflict markers."
  },
  {
    title: "Remotes & collaboration",
    label: "Share your work",
    duration: "8 min",
    description: "Connect a local repository to a remote, publish a branch, and follow a pull request workflow.",
    sections: [
      { heading: "Connect a remote", text: "A remote is a named connection to another copy of a repository. A hosted repository URL is commonly named `origin`." },
      { heading: "Inspect and connect", code: "git remote -v\ngit remote add origin <repository-url>", language: "bash" },
      { heading: "Fetch, pull, and push", code: "git fetch origin\ngit pull\ngit push -u origin feature/add-intro", language: "bash", note: "`git pull` fetches and integrates changes. To inspect remote updates before integrating, use `git fetch` first." },
      { heading: "A typical pull request flow", list: ["Create a feature branch.", "Make focused commits.", "Push the branch.", "Open a pull request for review.", "Address feedback and run checks.", "Merge using your team's chosen policy."] },
      { heading: "Set upstream once", text: "After the first push with `-u`, later pushes from that branch can usually use `git push`." }
    ],
    exercise: "If you have a hosted repository, clone it and push a small documentation branch. Otherwise, inspect `git remote -v` in a repository you use."
  },
  {
    title: "Undo mistakes safely",
    label: "Choose the right undo",
    duration: "8 min",
    description: "Pick the right recovery command based on whether a change is edited, staged, or already shared.",
    sections: [
      { heading: "Discard unstaged edits", text: "Restore a file from the index. This loses uncommitted edits to that file." },
      { heading: "Restore a file", code: "git restore path/to/file", language: "bash" },
      { heading: "Unstage but keep edits", code: "git restore --staged path/to/file", language: "bash" },
      { heading: "Reverse a shared commit", code: "git revert <commit-id>", language: "bash", note: "Revert creates a new commit that reverses the previous one. It is usually safer for changes that have already been shared." },
      { heading: "Amend a local commit", code: "git commit --amend", language: "bash", note: "Amending changes the commit. Avoid amending commits that other people may already have based work on." },
      { heading: "Inspect before undoing", code: "git status\ngit log --oneline -5\ngit diff", language: "bash" }
    ],
    exercise: "Create an uncommitted edit and unstage a staged file. Practice the safe commands. Do not rewrite history on a shared branch."
  },
  {
    title: "History & recovery",
    label: "Find your way back",
    duration: "7 min",
    description: "Trace where changes came from and locate recent local commits and branch movements.",
    sections: [
      { heading: "Explore the project timeline", code: "git log --oneline --graph --decorate --all\ngit log -- path/to/file\ngit blame path/to/file\ngit show <commit-id>", language: "bash" },
      { heading: "Inspect an earlier file version", code: "git show <commit-id>:path/to/file", language: "bash", note: "This prints the file version from that commit without switching your current branch." },
      { heading: "Find recent local movements", code: "git reflog", language: "bash" },
      { heading: "Know what reflog can do", text: "Reflog records recent movements of local branch and `HEAD` references. It can help locate a commit after a local branch move or reset. Entries are local and eventually expire, so reflog is not a substitute for backups." }
    ],
    exercise: "Find the commit that last changed a file, inspect its diff, and use `git show <commit-id>:path/to/file` to view an earlier version."
  },
  {
    title: "Tags & releases",
    label: "Mark a release",
    duration: "5 min",
    description: "Mark important commits with tags and understand a straightforward release workflow.",
    sections: [
      { heading: "Tag an important commit", text: "Tags name important commits, commonly software releases. An annotated tag includes a message and metadata." },
      { heading: "Create and inspect an annotated tag", code: "git tag -a v1.0.0 -m \"Release version 1.0.0\"\ngit show v1.0.0", language: "bash" },
      { heading: "Publish tags", code: "git push origin v1.0.0\n\n# Push every local tag only when intended:\ngit push origin --tags", language: "bash" },
      { heading: "A basic release checklist", list: ["Review the changes.", "Run the project tests.", "Update release notes.", "Tag the release commit.", "Publish the tag through your hosting service."] }
    ],
    exercise: "Create an annotated tag on a practice repository and inspect it with `git show`."
  },
  {
    title: "Your daily workflow",
    label: "Put it all together",
    duration: "6 min",
    description: "Bring the core commands into a repeatable, review-friendly rhythm.",
    sections: [
      { heading: "A focused change from start to finish", code: "git switch main\ngit pull\ngit switch -c feature/short-description\n# edit and test\ngit status\ngit diff\ngit add <specific-files>\ngit diff --staged\ngit commit -m \"Describe the change\"\ngit push -u origin feature/short-description", language: "bash" },
      { heading: "Then collaborate", text: "Open a pull request, request review, address feedback, and merge according to your team's policy." },
      { heading: "Habits that pay off", list: ["Commit small, related changes.", "Inspect status and diffs before committing.", "Use branches for independent work.", "Pull or fetch regularly when collaborating.", "Do not commit secrets, personal credentials, or unnecessary generated files.", "Avoid rewriting public or shared history.", "Agree with your team on merge, squash, or rebase policies."] }
    ],
    exercise: "Practice the workflow in a repository you control. Before each commit, inspect both `git status` and the staged diff."
  },
  {
    title: "Capstone & quick reference",
    label: "Show what you know",
    duration: "20 min",
    description: "Put the pieces together in a small documentation project, then keep the command cheat sheet close.",
    sections: [
      { heading: "Capstone: build a small project", list: ["Initialize a repository and add a README.", "Add a `.gitignore` appropriate for the project.", "Make at least three focused commits.", "Create a feature branch and add a new section.", "Create and resolve a merge conflict in a practice file.", "Review history using `git log --graph`.", "Create an annotated version tag.", "If a hosted remote is available, push the branch and tag and open a pull request."] },
      { heading: "Quick reference", table: [["Goal", "Command"], ["Check working tree", "git status"], ["Review unstaged edits", "git diff"], ["Stage a file", "git add <file>"], ["Review staged edits", "git diff --staged"], ["Commit staged edits", "git commit -m \"message\""], ["List branches", "git branch"], ["Create and switch branch", "git switch -c <branch>"], ["Switch branch", "git switch <branch>"], ["Merge a branch", "git merge <branch>"], ["View compact history", "git log --oneline --graph --decorate"], ["Download remote updates", "git fetch"], ["Fetch and integrate updates", "git pull"], ["Publish current branch", "git push"], ["Reverse a commit safely", "git revert <commit-id>"]] },
      { heading: "Ready for the next repo?", list: ["Explain working tree, staging area, and repository.", "Review staged and unstaged changes separately.", "Create, switch, merge, and delete a branch.", "Resolve a conflict without leaving markers behind.", "Explain the difference between fetch and pull.", "Choose a safe undo command for an uncommitted edit versus a shared commit."] }
    ],
    exercise: "Complete the capstone steps in a practice repository. Use the checklist to identify anything you want to revisit."
  }
];

const chapterList = document.querySelector("#chapter-list");
const lesson = document.querySelector("#lesson");
const search = document.querySelector("#search");
const progressCount = document.querySelector("#progress-count");
const progressFill = document.querySelector("#progress-fill");
const progressBar = document.querySelector("#progress-bar");
const breadcrumbCurrent = document.querySelector("#breadcrumb-current");
const menuButton = document.querySelector("#menu-button");
const sidebar = document.querySelector("#sidebar");
const themeButton = document.querySelector("#theme-button");
const completed = new Set(JSON.parse(localStorage.getItem("git-training-completed") || "[]"));
let currentChapter = 0;

function persistProgress() {
  localStorage.setItem("git-training-completed", JSON.stringify([...completed]));
}

function updateProgress() {
  const count = completed.size;
  progressCount.textContent = `${count} / ${chapters.length}`;
  progressFill.style.width = `${(count / chapters.length) * 100}%`;
  progressBar.setAttribute("aria-valuenow", String(count));
}

function buildChapterList() {
  chapterList.innerHTML = `${chapters.map((chapter, index) => `
    <li>
      <button type="button" data-chapter="${index}" aria-label="Chapter ${String(index + 1).padStart(2, "0")}: ${chapter.title}">
        <span class="chapter-number">${String(index + 1).padStart(2, "0")}</span>
        <span class="chapter-title">${chapter.title}</span>
        <span class="chapter-done" aria-hidden="true">${completed.has(index) ? "✓" : ""}</span>
      </button>
    </li>`).join("")}<li class="no-results" hidden>No chapters found.</li>`;
  updateProgress();
}

function renderBlock(block) {
  if (block.heading && !block.table) return `<h2>${block.heading}</h2>${block.text ? `<p>${block.text}</p>` : ""}${block.list ? `<ul>${block.list.map((item) => `<li>${item}</li>`).join("")}</ul>` : ""}${block.code ? `<div class="code-wrap"><div class="code-label"><span>${block.language || "text"}</span><button type="button" class="copy-button">Copy</button></div><pre><code>${escapeHtml(block.code)}</code></pre></div>` : ""}${block.note ? `<aside class="callout"><span class="callout-icon" aria-hidden="true">✳</span><span>${block.note}</span></aside>` : ""}`;
  if (block.table) return `<h2>${block.heading}</h2><div class="table-scroll"><table><thead><tr>${block.table[0].map((cell) => `<th>${cell}</th>`).join("")}</tr></thead><tbody>${block.table.slice(1).map((row) => `<tr>${row.map((cell, index) => `<td>${index === 1 ? `<code>${escapeHtml(cell)}</code>` : cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  return "";
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function renderChapter(index) {
  currentChapter = index;
  const chapter = chapters[index];
  breadcrumbCurrent.textContent = chapter.label.toUpperCase();
  document.title = `${chapter.title} — Git Training`;
  [...chapterList.querySelectorAll("button")].forEach((button, buttonIndex) => {
    if (buttonIndex === index) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  lesson.innerHTML = `
    <div class="eyebrow">Chapter ${String(index + 1).padStart(2, "0")} <span aria-hidden="true">·</span> ${chapter.label}</div>
    <h1>${chapter.title}</h1>
    <p class="lesson-lede">${chapter.description}</p>
    <div class="lesson-meta"><span>◷ <strong>${chapter.duration}</strong></span><span>⌘ <strong>Hands-on lesson</strong></span></div>
    <div class="lesson-content">${chapter.sections.map(renderBlock).join("")}
      <div class="exercise"><div class="exercise-heading"><span aria-hidden="true">✓</span> Try it yourself</div><p>${chapter.exercise}</p></div>
    </div>
    <div class="lesson-actions">
      <button type="button" class="complete-button ${completed.has(index) ? "is-done" : ""}" id="complete-button">${completed.has(index) ? "✓ Completed" : "✓ Mark as complete"}</button>
      <div class="lesson-nav-buttons">
        <button type="button" class="prev-button" id="prev-button" ${index === 0 ? "disabled" : ""}>← Previous</button>
        <button type="button" class="next-button" id="next-button" ${index === chapters.length - 1 ? "disabled" : ""}>Next chapter →</button>
      </div>
    </div>`;
  lesson.querySelector("#complete-button").addEventListener("click", toggleComplete);
  lesson.querySelector("#prev-button").addEventListener("click", () => goToChapter(currentChapter - 1));
  lesson.querySelector("#next-button").addEventListener("click", () => goToChapter(currentChapter + 1));
  lesson.querySelectorAll(".copy-button").forEach((button) => button.addEventListener("click", () => copyCode(button)));
  sidebar.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goToChapter(index) {
  if (index >= 0 && index < chapters.length) renderChapter(index);
}

function toggleComplete() {
  if (completed.has(currentChapter)) completed.delete(currentChapter);
  else completed.add(currentChapter);
  persistProgress();
  buildChapterList();
  renderChapter(currentChapter);
}

async function copyCode(button) {
  const code = button.closest(".code-wrap").querySelector("code").textContent;
  try {
    await navigator.clipboard.writeText(code);
    button.textContent = "Copied!";
    window.setTimeout(() => { button.textContent = "Copy"; }, 1400);
  } catch {
    button.textContent = "Copy unavailable";
    window.setTimeout(() => { button.textContent = "Copy"; }, 1800);
  }
}

chapterList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-chapter]");
  if (button) goToChapter(Number(button.dataset.chapter));
});

search.addEventListener("input", () => {
  const query = search.value.trim().toLowerCase();
  const items = [...chapterList.querySelectorAll("li:not(.no-results)")];
  let firstMatch = -1;
  items.forEach((item, index) => {
    const match = !query || chapters[index].title.toLowerCase().includes(query) || chapters[index].label.toLowerCase().includes(query) || chapters[index].description.toLowerCase().includes(query);
    item.querySelector("button").hidden = !match;
    if (match && firstMatch < 0) firstMatch = index;
  });
  chapterList.querySelector(".no-results").hidden = !query || firstMatch >= 0;
});

menuButton.addEventListener("click", () => {
  const open = sidebar.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(open));
});

themeButton.addEventListener("click", () => {
  const dark = document.body.dataset.theme !== "dark";
  document.body.dataset.theme = dark ? "dark" : "light";
  themeButton.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  localStorage.setItem("git-training-theme", dark ? "dark" : "light");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== search && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    search.focus();
  }
  if (event.key === "Escape") {
    search.blur();
    sidebar.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  }
});

const savedTheme = localStorage.getItem("git-training-theme");
if (savedTheme === "dark") {
  document.body.dataset.theme = "dark";
  themeButton.setAttribute("aria-label", "Switch to light theme");
}

buildChapterList();
renderChapter(0);
