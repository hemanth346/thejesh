const container = document.getElementById("news-container");
const refreshBtn = document.getElementById("refresh");

// Google News RSS (no API key)
const RSS_URL = "https://news.google.com/rss/search?q=AI+Automation&hl=en-IN&gl=IN&ceid=IN:en";

// Small helper: safely get text from an XML node
const text = (el, sel) => {
  const n = el.querySelector(sel);
  return n ? (n.textContent || "").trim() : "";
};

async function fetchRSS(url) {
  // Try normal fetch (works because we added host_permissions)
  const res = await fetch(url);
  if (!res.ok) throw new Error("Network response was not ok");
  return await res.text();
}

function renderItems(xmlString) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlString, "application/xml");
  const parseError = xml.querySelector("parsererror");
  if (parseError) throw new Error("Invalid XML received");

  const items = xml.querySelectorAll("item");
  container.innerHTML = "";

  if (!items.length) {
    container.innerHTML = `<div class="small">No headlines found right now.</div>`;
    return;
  }

  // Show up to 10 headlines
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
  } catch (err) {
    // Friendly message in the UI; no scary errors for the user
    container.innerHTML = `<div>Could not load news. Please click “Refresh”.</div>`;
    // (Any console error is harmless for users; the UI stays clean.)
  }
}

refreshBtn.addEventListener("click", loadNews);
loadNews();
