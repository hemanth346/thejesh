const container = document.getElementById("news-container");
const refreshBtn = document.getElementById("refresh");

const RSS_URL = "https://news.google.com/rss/search?q=AI+Automation&hl=en-IN&gl=IN&ceid=IN:en";

const text = (el, sel) => {
  const n = el.querySelector(sel);
  return n ? (n.textContent || "").trim() : "";
};

async function fetchRSS(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Network error");
  return await res.text();
}

function renderItems(xmlString) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlString, "application/xml");

  const items = xml.querySelectorAll("item");
  container.innerHTML = "";

  items.forEach((item, i) => {
    if (i >= 10) return;
    const title = text(item, "title");
    const link = text(item, "link");
    const pubDate = text(item, "pubDate");

    const div = document.createElement("div");
    div.className = "news-item";
    div.innerHTML = `
      <a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a>
      <div class="small">${pubDate}</div>
    `;
    container.appendChild(div);
  });
}

async function loadNews() {
  container.textContent = "Loading...";
  try {
    const xml = await fetchRSS(RSS_URL);
    renderItems(xml);
  } catch {
    container.innerHTML = `<div>⚠️ Could not load news. Try again.</div>`;
  }
}

refreshBtn.addEventListener("click", loadNews);
loadNews();
