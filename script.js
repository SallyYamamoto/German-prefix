console.log("script.js loaded");

const JSON_URL = "verbs.json";

async function fetchData() {
  const res = await fetch(JSON_URL);
  const data = await res.json();
  console.log("JSON loaded:", data.length);
  return data;
}

// --- index.html ---
if (document.getElementById("prefixes")) {
  console.log("Index page detected");

  fetchData().then(data => {
    const prefixes = [...new Set(data.map(d => d["接頭辞"]))].sort();
    const roots = [...new Set(data.map(d => d["基幹"]))].sort();

    document.getElementById("prefixes").innerHTML =
      "<h2>接頭辞</h2><p>" +
      prefixes.map(p => `<a href='list.html?prefix=${p}'>${p}</a>`).join(" / ") +
      "</p>";

    document.getElementById("roots").innerHTML =
      "<h2>基幹部分</h2><p>" +
      roots.map(r => `<a href='list.html?root=${r}'>${r}</a>`).join(" / ") +
      "</p>";
  });
}

// --- list.html ---
if (document.getElementById("verbs")) {
  console.log("List page detected");

  const params = new URLSearchParams(window.location.search);
  const prefix = params.get("prefix");
  const root = params.get("root");

  fetchData().then(data => {
    let filtered = [];
    if (prefix) filtered = data.filter(d => d["接頭辞"] === prefix);
    if (root) filtered = data.filter(d => d["基幹"] === root);

    document.getElementById("title").textContent = prefix
      ? `接頭辞: ${prefix}`
      : `基幹部分: ${root}`;

    const html = filtered.map(item => `<li>${item["単語"]} — ${item["意味"]}</li>`).join("");
    document.getElementById("verbs").innerHTML = html || "<li>該当する単語がありません。</li>";
  });
}
