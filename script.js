const JSON_URL = "./verbs.json";

async function fetchData() {
  const res = await fetch(JSON_URL);
  if (!res.ok) throw new Error("JSONの読み込みに失敗しました");
  return await res.json();
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

document.addEventListener("DOMContentLoaded", async () => {
  const prefixesEl = document.getElementById("prefixes");
  const rootsEl = document.getElementById("roots");
  const verbsEl = document.getElementById("verbs");

  const data = await fetchData().catch(err => {
    console.error(err);
    if (prefixesEl) prefixesEl.innerHTML = "読み込みに失敗しました。";
    if (verbsEl) verbsEl.innerHTML = "データの読み込みに失敗しました。";
    return null;
  });

  if (!data) return;

  // --- トップページ(index.html) ---
  if (prefixesEl && rootsEl) {
    const groups = { 分離: new Set(), 非分離: new Set(), 両方: new Set() };

    data.forEach(d => {
      if (d["接頭辞"] && d["分離性"]) {
        groups[d["分離性"]].add(d["接頭辞"]);
      }
    });

    const labels = {
      分離: { icon: "🟩", text: "分離（trennbar）" },
      非分離: { icon: "🟥", text: "非分離（untrennbar）" },
      両方: { icon: "🟨", text: "両方（teils trennbar）" }
    };

    const prefixHTML = Object.entries(groups).map(([type, set]) => {
      const sorted = [...set].sort((a, b) => a.localeCompare(b, "de"));
      return `
        <div class="prefix-section">
          <h3>${labels[type].icon} ${labels[type].text}</h3>
          <div class="prefix-grid">
            ${sorted.map(p => `<a href="list.html?prefix=${p}">${p}</a>`).join(" / ")}
          </div>
        </div>`;
    }).join("");

    prefixesEl.innerHTML = `<h2>接頭辞</h2>${prefixHTML}`;

    const roots = [...new Set(data.map(d => d["基幹"]))].sort((a, b) => a.localeCompare(b, "de"));
    const rootsHTML = `<h2>基幹部分</h2><div class="root-grid">${roots.map(r =>
      `<a href="list.html?root=${r}">${r}</a>`).join(" / ")}</div>`;
    rootsEl.innerHTML = rootsHTML;
  }

  // --- list.html ---
  if (verbsEl) {
    const prefix = getQueryParam("prefix");
    const root = getQueryParam("root");

    let filtered = [];
    let title = "";

    if (prefix) {
      filtered = data.filter(d => d["接頭辞"] === prefix);
      title = `接頭辞: ${prefix}`;
    } else if (root) {
      filtered = data.filter(d => d["基幹"] === root);
      title = `基幹部分: ${root}`;
    }

    document.getElementById("title").textContent = title;

    const prefixColors = {
      ab: "#e8f5e9",
      an: "#e3f2fd",
      auf: "#e8eaf6",
      aus: "#e0f2f1",
      dar: "#f3e5f5",
      her: "#fbe9e7",
      ein: "#fff8e1",
      fest: "#fce4ec",
      um: "#eceff1",
      vor: "#e1f5fe",
      zurück: "#f3e5f5",
      zusammen: "#e0f2f1",
      nach: "#fce4ec",
      bei: "#f1f8e9",
      bereit: "#e0f7fa",
      be: "#efebe9",
      ent: "#fce4ec",
      ver: "#f5f5f5",
      zu: "#efebe9"
    };

    const sepLabel = {
      分離: `<div class="label-trennbar">🟩 分離（trennbar）</div>`,
      非分離: `<div class="label-untrennbar">🟥 非分離（untrennbar）</div>`,
      両方: `<div class="label-teils">🟨 両方（teils trennbar）</div>`
    };

    const listHTML = filtered.map(item => {
      const prefix = item["接頭辞"] || "";
      const prefixMeaning = item["接頭辞基本意味"] || "";
      const core = item["基幹"] || "";
      const composition = prefix && core ? `${prefix} + ${core}` : "";
      const bgColor = prefixColors[prefix] || "#f7f7f7";
      const sep = sepLabel[item["分離性"]] || "";

      return `
        <div class="card" style="background: linear-gradient(to right, ${bgColor}, #fff);">
          <div class="card-header">
            <h2>${item["単語"]}</h2>
            <div class="etymology">${composition}</div>
          </div>

          ${sep}

          <div class="meaning-jp">${item["意味"]}</div>
          <div class="meaning-en">${item["英訳"]}</div>

          <div class="detail-section">
            <div><b>構成：</b> ${prefix}（${prefixMeaning}） + ${core}</div>
            <div><b>語感：</b> ${item["語感"] || ""}</div>
            <div><b>構文：</b> <i>${item["構文"] || ""}</i></div>
            <div><b>活用：</b> <i>${item["活用"] || ""}</i></div>
          </div>

          <div class="example-section">
            ${item["例文1"] ? `
              <div class="example-box">
                <div class="vertical-line"></div>
                <div>
                  <p>${item["例文1"]}</p>
                  <p class="japanese-translation">（${item["日本語訳1"]}）</p>
                </div>
              </div>` : ""}
            ${item["例文2"] ? `
              <div class="example-box">
                <div class="vertical-line"></div>
                <div>
                  <p>${item["例文2"]}</p>
                  <p class="japanese-translation">（${item["日本語訳2"]}）</p>
                </div>
              </div>` : ""}
          </div>

          ${item["派生語"] ? `<div class="noun-form">🔤 ${item["派生語"]}</div>` : ""}
        </div>
      `;
    }).join("");

    verbsEl.innerHTML = listHTML || "<p>該当する単語がありません。</p>";
  }
});
