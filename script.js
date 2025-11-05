body {
  font-family: 'Hiragino Sans', 'Meiryo', 'Yu Gothic', sans-serif;
  color: #000;
  background: #fff;
  margin: 0;
  padding: 20px;
  line-height: 1.5;
}

/* 一覧ページ */
.columns {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 1rem;
}
.prefix-grid, .root-grid {
  display: flex;
  flex-wrap: wrap;
  gap: .3rem;
}
.prefix-grid a, .root-grid a {
  text-decoration: none;
  color: #007bff;
}
.prefix-grid a:hover, .root-grid a:hover {
  text-decoration: underline;
}

/* 各カード（list.html） */
.verb-card {
  max-width: 520px;
  margin: 40px auto;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0,0,0,0.1);
  background-color: #fff;
}
.header {
  text-align: center;
  margin-bottom: 15px;
}
h1 {
  font-size: 2.4em;
  font-weight: 500;
  margin: 0 0 4px 0;
  display: inline-block;
  border-bottom: 1px solid #000;
  padding-bottom: 3px;
}
.etymology {
  font-size: 1.1em;
  color: #007bff;
  font-style: italic;
}

/* 意味 */
.meaning-jp {
  font-size: 1.3em;
  font-weight: bold;
  margin: 18px 0 6px 0;
}
.meaning-en {
  font-style: italic;
  margin-bottom: 20px;
}

/* 詳細 */
.detail-item {
  display: flex;
  margin-bottom: 6px;
}
.detail-label {
  width: 80px;
  font-weight: normal;
  margin-right: 10px;
}
.detail-value {
  flex: 1;
}
.german-term {
  font-family: 'Consolas', monospace;
  font-style: italic;
}

/* 例文 */
.example-section {
  margin-top: 25px;
}
.example-box {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
}
.vertical-line {
  border-left: 1px solid #000;
  margin-right: 10px;
  min-height: 2.5em;
}
.japanese-translation {
  font-size: .9em;
  color: #333;
  margin: 0;
  line-height: 1.2;
}

/* 派生語 */
.noun-form {
  margin-top: 15px;
  display: flex;
  align-items: center;
}
.abc-icon {
  color: #007bff;
  margin-right: 5px;
}
