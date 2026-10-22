const guide = document.querySelector("#guide");
const guideContent = document.querySelector("#guide-content");
const guideToc = document.querySelector("#guide-toc-list");
const sourceUrl = document.currentScript.dataset.markdownSrc;

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function safeHref(value) {
  try {
    const url = new URL(value, window.location.href);
    if (["http:", "https:", "mailto:"].includes(url.protocol) ||
        (url.protocol === window.location.protocol && !value.trim().startsWith("//"))) {
      return escapeHtml(value);
    }
  } catch {
    return "";
  }
  return "";
}

function renderInline(text) {
  const pattern = /(`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let html = "";
  let offset = 0;

  for (const match of text.matchAll(pattern)) {
    html += escapeHtml(text.slice(offset, match.index));
    const token = match[0];

    if (token.startsWith("`")) {
      html += `<code>${escapeHtml(token.slice(1, -1))}</code>`;
    } else if (token.startsWith("[")) {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      const href = safeHref(link[2]);
      html += href ? `<a href="${href}">${renderInline(link[1])}</a>` : escapeHtml(link[1]);
    } else if (token.startsWith("**")) {
      html += `<strong>${renderInline(token.slice(2, -2))}</strong>`;
    } else {
      html += `<em>${renderInline(token.slice(1, -1))}</em>`;
    }

    offset = match.index + token.length;
  }

  return html + escapeHtml(text.slice(offset));
}

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

function isBlockStart(line) {
  return /^(#{1,6}\s|>\s?|[-*+]\s|\d+\.\s|```|---+$)/.test(line);
}

function parseMarkdown(markdown) {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*$/);
    if (heading) {
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2] });
      index += 1;
    } else if (line === "---" || /^-{3,}$/.test(line)) {
      blocks.push({ type: "rule" });
      index += 1;
    } else if (line.startsWith("```")) {
      const codeLines = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push({ type: "code", text: codeLines.join("\n") });
    } else if (/^>\s?/.test(line)) {
      const quote = [];
      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quote.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push({ type: "quote", text: quote.join(" ") });
    } else if (/^[-*+]\s|^\d+\.\s/.test(line)) {
      const ordered = /^\d+\.\s/.test(line);
      const items = [];
      while (index < lines.length && (/^[-*+]\s|^\d+\.\s/.test(lines[index].trim()))) {
        items.push(lines[index].trim().replace(/^([-*+]|\d+\.)\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "list", ordered, items });
    } else {
      const paragraph = [line];
      index += 1;
      while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index].trim())) {
        paragraph.push(lines[index].trim());
        index += 1;
      }
      blocks.push({ type: "paragraph", text: paragraph.join(" ") });
    }
  }

  return blocks;
}

function renderBlock(block) {
  if (block.type === "heading") {
    const id = slugify(block.text);
    const text = renderInline(block.text);
    if (block.level === 1) return `<h1>${text}</h1>`;
    if (block.level === 2) return `<h2 id="${escapeHtml(id)}">${text}</h2>`;
    return `<h${block.level}>${text}</h${block.level}>`;
  }
  if (block.type === "rule") return "<hr>";
  if (block.type === "code") return `<pre><code>${escapeHtml(block.text)}</code></pre>`;
  if (block.type === "quote") return `<blockquote class="guide-callout">${renderInline(block.text)}</blockquote>`;
  if (block.type === "list") {
    const checklist = block.items.every((item) => /^\[[ xX]\]\s/.test(item));
    const tag = block.ordered ? "ol" : "ul";
    const className = checklist ? ' class="guide-checklist"' : "";
    const items = block.items.map((item) => {
      const content = checklist ? item.replace(/^\[[ xX]\]\s/, "") : item;
      return `<li>${renderInline(content)}</li>`;
    }).join("");
    return `<${tag}${className}>${items}</${tag}>`;
  }
  if (block.text.startsWith("**Topics:**")) {
    const topics = block.text.replace(/^\*\*Topics:\*\*\s*/, "").split(" · ");
    return `<div class="guide-meta" aria-label="Guide topics">${topics.map((topic) => `<span>${renderInline(topic)}</span>`).join("")}</div>`;
  }
  if (block.text.startsWith("**Working principle:**")) {
    return `<div class="guide-callout">${renderInline(block.text.replace(/^\*\*Working principle:\*\*/, "<strong>Working principle:</strong>"))}</div>`;
  }
  return `<p>${renderInline(block.text)}</p>`;
}

function renderGuide(markdown) {
  const blocks = parseMarkdown(markdown);
  const title = blocks.find((block) => block.type === "heading" && block.level === 1);
  if (!title) throw new Error("The Markdown guide does not have a level-one title.");

  const sections = [];
  let intro = [];
  let section = null;
  let hasLead = false;

  blocks.forEach((block) => {
    if (block.type === "heading" && block.level === 2) {
      section = { heading: block, blocks: [] };
      sections.push(section);
    } else if (section) {
      section.blocks.push(block);
    } else {
      if (block.type === "paragraph" && !hasLead && block.text.startsWith("A practical field guide")) {
        block.className = "guide-lede";
        hasLead = true;
      }
      intro.push(block);
    }
  });

  if (!sections.length) throw new Error("The Markdown guide does not contain any level-two sections.");

  guideContent.innerHTML = `${intro.map(renderBlock).join("")}${sections.map(({ heading, blocks: contentBlocks }) => (
    `<section class="guide-section" aria-labelledby="${escapeHtml(slugify(heading.text))}">${renderBlock(heading)}${contentBlocks.map(renderBlock).join("")}</section>`
  )).join("")}`;

  const lead = guideContent.querySelector("p");
  if (lead && hasLead) lead.classList.add("guide-lede");
  guideToc.innerHTML = sections.map(({ heading }) => {
    const id = slugify(heading.text);
    return `<li><a href="#${escapeHtml(id)}">${renderInline(heading.text)}</a></li>`;
  }).join("");

  const plainTitle = title.text.replace(/[*`[\]]/g, "");
  document.title = `${plainTitle} — Training Library`;
  guide.setAttribute("aria-busy", "false");
}

async function loadGuide() {
  try {
    const response = await fetch(new URL(sourceUrl, window.location.href));
    if (!response.ok) throw new Error(`Markdown request failed with HTTP ${response.status}.`);
    renderGuide(await response.text());
  } catch (error) {
    guideContent.innerHTML = "";
    const message = document.createElement("p");
    message.setAttribute("role", "alert");
    message.textContent = `Could not load the Markdown field guide. ${error.message} Open the Markdown source directly or serve the library over HTTP.`;
    guideContent.append(message);
    guide.setAttribute("aria-busy", "false");
  }
}

loadGuide();
