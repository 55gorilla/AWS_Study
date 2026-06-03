# AWS 資格学習ポータル — デザイン & 運用仕様

CLF-C02 / SAA-C03 の学習用ポータル。**ビルド不要の静的サイト（HTML / CSS / 素のJS）**で、
Cloudflare Workers + Cloudflare Access で配信している（公開・アクセス管理は `運用ガイド.md` を参照）。

---

## 1. 単一ソースの原則（最重要）

サイト構造の正典は **`js/app.js` の `NAV_GROUPS`** ただ一つ。以下はすべてここから自動生成される:

- 全ページ共通の**サイドバー**（＋検索ボックス、現在地ハイライト、学習済みドット）
- ホームの**統計ストリップ**（総ページ数 / ドメイン数 / CLF・SAA対象数 / 学習率）
- ホームの**学習ドメイン**カード（ページ数・CLF/SAA内訳・ドメイン別進捗バー）
- ホームの**新着**（`NEW_IDS` に含まれるページを自動表示）
- 全ページ下部の**前へ / 次へ**ナビ（`NAV_GROUPS` の並び順＝学習動線）
- **学習進捗バー**（CLF / SAA、localStorage の `awsProgress` と連動）

→ ページHTML側にサイドバーを書かない。`<nav class="sidebar" id="sidebar"></nav>` の空要素を置くだけ。

### app.js の主な関数
| 関数 | 役割 |
|---|---|
| `renderSidebar()` | サイドバー＋検索を生成。`/` キーで検索フォーカス |
| `renderStats()` | ホーム `#statStrip` に統計を描画 |
| `renderNew()` | ホーム `#newRow` に新着を描画（0件で `#newSection` 非表示） |
| `renderDomainGrid()` | ホーム `#domainGrid` にドメインカード（進捗付き）を描画 |
| `updateBars()` | CLF/SAA 進捗バー更新 |
| `injectPrevNext()` | `.main-inner` 末尾に前後ナビを注入 |
| `injectScrollTop()` | トップへ戻るボタンを注入 |
| `initChatWidget()` | ページ本文を根拠にするGemini AIチャット |

`NAV_GROUPS` の item: `{ id, dir:'services'|'concepts', icon, label, levels:'clf'|'saa'|'clf saa', enabled, file?, noProgress? }`

---

## 2. デザイントークン（`css/style.css :root`）

サイト全体は **ティール系ワントーン・ランプ（明→暗）** で統一。前景（文字・枠・塗り）は下記5ソリッド色のみ、
淡色面（バッジ地・tip地・success地など）は `rgba(...)` の低不透明度で表現し、色相をティール一族に保つ。
本文テキスト `--text #16191F` とグレー類（`--muted #6B7280` / `--border #E2E8F0` / `--bg #F0F2F5` / 白）は
可読性のためニュートラルとして維持する。

| トークン | 色 | 役割 |
|---|---|---|
| `--accent-br` | `#00D7CA`（T1） | 最も明るい強調（学習済みドット／nav active／ロゴ地／hover発光） |
| `--orange` | `#00B3A7`（T2） | 主アクセント（旧オレンジの役割）／**CLFバッジ** |
| `--blue` | `#008A81`（T3） | リンク・副アクセント |
| `--dark` | `#00615A`（T4） | ヘッダー地・見出しテキスト／**SAAバッジ** |
| `--darker` | `#003834`（T5） | サイドバー地・最も濃い強調・error |

- セマンティック色も全面ティール化（緑=学習済み→T1、橙=試験Tips→T1枠、赤=error→T4/T5）。
- バッジ: `.badge-clf`（**明 T2**）/ `.badge-saa`（**濃 T4**）で濃淡区別。CLF=Cloud Practitioner、SAA=Solutions Architect Associate。
- サービス関連図（`js/service-graph.js` の `DOMAIN_COLORS`）はティール15段の明度ランプ。分類はグループ枠でも表現。
- 角丸 `--radius 8px` ／ 影 `--shadow` `--shadow-md` ／ サイドバー幅 `--sidebar-w 264px` ／ ヘッダ高 `--header-h 56px`
- レスポンシブ: 768px 以下でサイドバーをドロワー化（ハンバーガー `#menuBtn`）。

## 3. コンポーネント目録（再利用する）
`stat-strip`/`stat`・`new-row`/`new-chip`・`progress-card`・`domain-card`(アコーディオン)・
`section`/`section-title`・`card`・`feature-grid`/`feature-item`・`key-point`・`exam-tip`・
`table-wrap`+`table`・`chip-row`/`chip`・`prevnext`・`scrolltop`・`tab-bar`/`tab-content`・
`decision-frame`（比較）・`.mermaid`（関連図。ノード改行は `<br/>`）。

## 4. ページ骨格テンプレート（services / concepts 共通・`../` 相対）
```html
<!DOCTYPE html><html lang="ja"><head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>サービス名 | AWS 資格学習ポータル</title>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body data-page="ページID">
<div id="overlay" class="overlay"></div>
<header class="header"> …ロゴ・ハンバーガー… </header>
<div class="layout">
  <nav class="sidebar" id="sidebar"></nav>   <!-- 空。app.jsが生成 -->
  <main class="main"><div class="main-inner">
    <nav class="breadcrumb">…</nav>
    <div class="page-title"><h1>…<span class="badge badge-saa">SAA</span></h1><p class="desc">…</p></div>
    …本文（section / feature-grid / table-wrap / exam-tip / 関連ページ chip-row）…
  </div></main>
</div>
<script src="../js/app.js"></script>
</body></html>
```
`data-page` は `NAV_GROUPS` の `id` と一致させる（進捗記録・現在地ハイライトのキー）。

---

## 5. ドキュメント追加時の手順（チェックリスト）

1. **素材を置く**: `知見/<サービス名>.rtfd/`（テキスト＋スクショ）を追加。
2. **ページ作成**: `services/<id>.html`（概念は `concepts/<id>.html`）を §4 テンプレで作成。
   画像は `../知見/<サービス名>.rtfd/<file>` を参照。`data-page="<id>"` を設定。
3. **正典へ1行追加**: `js/app.js` の `NAV_GROUPS` の該当グループに item を追加（必要なら新グループ＋
   `DOMAIN_ICONS` も）。→ サイドバー・統計・ドメイン・前後ナビは自動更新。
4. **新着**: 新規IDを `js/app.js` の `NEW_IDS` に追加（定着したら削除＝新着から自動で消える）。
5. **ノード関連図に追加（サービスの場合）**: `js/service-graph-data.js` に1エントリ追加
   （`summary` / `detail[]` / `exam[]` / `related[]`）。`related` は実在IDのみ。名前/アイコン/レベル/詳細URLは
   `NAV_GROUPS` から自動解決されるため重複記載は不要。→ `concepts/service-graph.html` のグラフに自動反映。
6. **関連図・Mermaid（任意・大物のみ）**: `concepts/service-map.html` の Mermaid 全体図・典型アーキ・比較表に追記。
   サービス相互の位置づけが変わる追加のときだけでよい。
7. **公開**: `git add -A && git commit && git push` → **Cloudflare が自動デプロイ**（1〜2分）。

### サービス関連図ページ（`concepts/service-graph.html`）
- インタラクティブなノード学習ページ。ノードクリックでカード（概要/詳細/試験暗記/関連）を表示し、
  関連chipで別カードへジャンプ（`#id` ディープリンク対応）。
- メタ情報は `app.js` が公開する `window.AWS_NAV_GROUPS` から解決（単一ソース）。学習内容は
  `js/service-graph-data.js`。描画は `js/service-graph.js`＋Cytoscape(CDN)。
- カバレッジ検証: `SERVICE_GRAPH` の id/`related` が NAV_GROUPS の有効サービスに一致するかを監査する。

> 触らなくてよいもの: 各ページのサイドバー（空 nav のまま）、ホームの統計/新着/ドメイン（全自動）。
> これが本ポータルの設計意図＝「足すのはページ＋NAV_GROUPS 1行」。

詳細な公開・アクセス管理・AIチャットのキー運用は `運用ガイド.md` を参照。
