console.log("script.js loaded");

const JSON_URL = "verbs.json";

async function fetchData() {
  const res = await fetch(JSON_URL);
  return await res.json();
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/* ========== ✅ トップページ用(index.html) ========== */
if (document.getElementById("prefixes")) {
  document.getElementById("prefixes").innerHTML = `<p>読み込み中...</p>`;
  document.getElementById("roots").innerHTML = `<p>読み込み中...</p>`;

  fetchData().then(data => {
    const prefixes = [...new Set(data.map(d => d["接頭辞"]))].sort((a,b)=>a.localeCompare(b,'de'));
    const roots = [...new Set(data.map(d => d["基幹"]))].sort((a,b)=>a.localeCompare(b,'de'));

    const prefixLinks = prefixes.map(p => `<a href="list.html?prefix=${p}">${p}</a>`).join(" / ");
    const rootLinks = roots.map(r => `<a href="list.html?root=${r}">${r}</a>`).join(" / ");

    document.getElementById("prefixes").innerHTML = `<h2>接頭辞</h2>${prefixLinks}`;
    document.getElementById("roots").innerHTML = `<h2>基幹部分</h2>${rootLinks}`;
  }).catch(err => {
    console.error(err);
    document.getElementById("prefixes").innerHTML = `<p>データの読み込みに失敗しました。</p>`;
  });
}

// list.html（個別一覧ページ）
if (document.getElementById("verbs")) {
  document.getElementById("verbs").innerHTML = `<p>読み込み中...</p>`;

  fetchData()
    .then(data => {
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

      // 各単語カード生成
      const cardsHTML = filtered
        .map(item => {
          return `
          <div class="verb-card">
            <div class="header">
              <h1>${item["単語"]}</h1>
              <div class="etymology">${item["接頭辞"]} + ${item["基幹"]}</div>
            </div>

            <div class="meaning-jp">${item["意味"]}</div>
            <div class="meaning-en">${item["英訳"]}</div>

            <div class="detail-section">
              <div class="detail-item">
                <span class="detail-label">構成 :</span>
                <span class="detail-value">${item["接頭辞"]}（${item["接頭辞基本意味"] || ""}） + ${item["基幹"]}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">語感 :</span>
                <span class="detail-value">${item["語感"] || ""}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">構文 :</span>
                <span class="detail-value"><span class="german-term">${item["構文"] || ""}</span></span>
              </div>
              <div class="detail-item">
                <span class="detail-label">活用 :</span>
                <span class="detail-value"><span class="german-term">${item["活用"] || ""}</span></span>
              </div>
            </div>

            <div class="example-section">
              ${item["例文1"] ? `
              <div class="example-box">
                <div class="vertical-line"></div>
                <div class="example-content">
                  <p class="german-sentence">${item["例文1"]}</p>
                  <p class="japanese-translation">（${item["日本語訳1"]}）</p>
                </div>
              </div>` : ""}

              ${item["例文2"] ? `
              <div class="example-box">
                <div class="vertical-line"></div>
                <div class="example-content">
                  <p class="german-sentence">${item["例文2"]}</p>
                  <p class="japanese-translation">（${item["日本語訳2"]}）</p>
                </div>
              </div>` : ""}
            </div>

            ${item["派生語"] ? `
            <div class="noun-form">
              <span class="abc-icon">🔤</span>
              <span class="german-term">${item["派生語"]}</span>
            </div>` : ""}
          </div>
          `;
        })
        .join("");

      document.getElementById("verbs").innerHTML =
        cardsHTML || `<p>該当する単語がありません。</p>`;
    })
    .catch(err => {
      console.error(err);
      document.getElementById("verbs").innerHTML = `<p>データの読み込みに失敗しました。</p>`;
    });
}
