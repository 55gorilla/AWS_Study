/* AWS 資格学習ポータル — サービス関連図（ノード学習）
   - メタ情報（名前/アイコン/グループ/レベル/詳細URL）は app.js が公開する
     window.AWS_NAV_GROUPS を正典として再利用する（単一ソース）。
   - 学習コンテンツ（概要/詳細/試験暗記/関連）は window.SERVICE_GRAPH（service-graph-data.js）。
*/
(function () {
  'use strict';

  const NAV = window.AWS_NAV_GROUPS;
  const DATA = window.SERVICE_GRAPH;
  const container = document.getElementById('cy');
  if (!NAV || !DATA || !container || typeof cytoscape === 'undefined') {
    if (container) container.innerHTML = '<p style="padding:24px;color:#b91c1c">グラフを初期化できませんでした（スクリプトの読み込み順をご確認ください）。</p>';
    return;
  }

  /* ── NAV_GROUPS から id→メタ を構築 ── */
  const META = {};      // id -> { name, icon, group, levels }
  NAV.forEach(g => g.items.forEach(it => {
    if (!it.enabled) return;
    META[it.id] = { name: it.label, icon: it.icon, group: g.title, levels: it.levels, file: it.file || it.id, dir: it.dir };
  }));
  function hrefOf(id) { const m = META[id]; return m ? '../' + m.dir + '/' + m.file + '.html' : '#'; }
  function isSaaOnly(levels) { return levels.includes('saa') && !levels.includes('clf'); }

  /* ── ドメイン別カラー（グループ名→色） ── */
  const DOMAIN_COLORS = {
    '基礎概念': '#64748B', 'Well-Architected': '#0EA5E9', 'コンピューティング': '#FF9900',
    'ストレージ': '#3F8624', 'データベース': '#2965CC', 'ネットワーキング': '#8C4FFF',
    'データ分析': '#14B8A6', 'アプリケーション統合': '#E7157B', '監視・管理': '#0073BB',
    'セキュリティ': '#DD344C', 'ガバナンス・コンプライアンス': '#7C3AED', '移行・転送': '#D97706',
    '開発者ツール': '#059669', '機械学習・AI': '#9333EA', 'エンドユーザー / ハイブリッド': '#475569',
  };
  const colorOf = grp => DOMAIN_COLORS[grp] || '#6B7280';

  /* ── ノード・エッジ生成（related の無向ユニオン） ── */
  const ids = Object.keys(DATA).filter(id => META[id]);
  const nodes = ids.map(id => ({
    data: {
      id, label: META[id].icon + ' ' + META[id].name,
      group: META[id].group, color: colorOf(META[id].group),
      saa: isSaaOnly(META[id].levels) ? 1 : 0,
    },
  }));
  const seen = new Set();
  const edges = [];
  ids.forEach(id => (DATA[id].related || []).forEach(r => {
    if (!META[r] || !DATA[r]) return;            // 実在＆データ有りのみ
    const key = [id, r].sort().join('::');
    if (seen.has(key)) return;
    seen.add(key);
    // cross=1 … ドメイン跨ぎの関連（レイアウトで長く伸ばし、ドメインを離す）
    const cross = META[id].group !== META[r].group ? 1 : 0;
    edges.push({ data: { id: 'e-' + key, source: id, target: r, cross } });
  }));

  /* ── レイアウト定義 ──
     fcose が使えれば「ドメイン内は近く・ドメイン間は遠く」で自然にクラスタ化。
     未ロード時は従来 cose にフォールバック（間隔は広めに調整）。 */
  const hasFcose = typeof window.cytoscapeFcose !== 'undefined';
  if (hasFcose) { try { cytoscape.use(window.cytoscapeFcose); } catch (e) { /* 二重登録は無視 */ } }
  const layoutOpts = hasFcose
    ? {
        name: 'fcose', quality: 'proof', animate: false, randomize: true,
        padding: 48, packComponents: true, nodeSeparation: 150, numIter: 3500,
        nodeRepulsion: 13000, gravity: 0.18, gravityRange: 3.6,
        idealEdgeLength: e => (e.data('cross') ? 200 : 70),
        edgeElasticity: e => (e.data('cross') ? 0.08 : 0.5),
      }
    : {
        name: 'cose', animate: false, padding: 40, nodeRepulsion: 16000,
        idealEdgeLength: 120, nestingFactor: 1.1, gravity: 0.2, componentSpacing: 120,
      };

  /* ── Cytoscape 初期化 ── */
  const cy = cytoscape({
    container,
    elements: { nodes, edges },
    minZoom: 0.2, maxZoom: 2.5, wheelSensitivity: 0.25,
    style: [
      { selector: 'node', style: {
        'background-color': 'data(color)', 'label': 'data(label)',
        'color': '#1F2937', 'font-size': '9px', 'font-weight': 600,
        'text-valign': 'bottom', 'text-halign': 'center', 'text-margin-y': 3,
        'text-wrap': 'wrap', 'text-max-width': '84px',
        'min-zoomed-font-size': 7,                 // 引いた時はラベルを描かない＝重なり解消
        'width': 22, 'height': 22, 'border-width': 2, 'border-color': '#fff',
        'text-background-color': '#fff', 'text-background-opacity': 0.9,
        'text-background-padding': 2, 'text-background-shape': 'roundrectangle',
        'transition-property': 'width height border-color font-size', 'transition-duration': '120ms',
      }},
      { selector: 'node[saa = 1]', style: { 'shape': 'round-diamond', 'width': 20, 'height': 20 } },
      { selector: 'edge', style: {
        'width': 1.2, 'line-color': '#CBD5E1', 'curve-style': 'haystack', 'opacity': 0.5,
      }},
      { selector: 'node.hover', style: {
        'border-color': '#FF9900', 'border-width': 3, 'font-size': '11px',
        'min-zoomed-font-size': 0, 'z-index': 60,
      }},
      { selector: '.faded', style: { 'opacity': 0.07, 'text-opacity': 0.04 } },
      { selector: 'node.sel', style: {
        'border-width': 4, 'border-color': '#FF9900', 'width': 40, 'height': 40,
        'font-size': '13px', 'min-zoomed-font-size': 0, 'z-index': 99,
      }},
      { selector: 'edge.hl', style: { 'line-color': '#FF9900', 'opacity': 0.95, 'width': 2.5 } },
      { selector: '.hidden', style: { 'display': 'none' } },
    ],
    layout: layoutOpts,
  });

  /* ── ホバーで対象だけラベルを大きく ── */
  cy.on('mouseover', 'node', e => e.target.addClass('hover'));
  cy.on('mouseout', 'node', e => e.target.removeClass('hover'));

  /* ── カードパネル ── */
  const panel = document.getElementById('sgCard');
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const lvlBadges = lv =>
    (lv.includes('clf') ? '<span class="badge badge-clf">CLF</span>' : '') +
    (lv.includes('saa') ? '<span class="badge badge-saa">SAA</span>' : '');

  function renderCard(id) {
    const m = META[id], d = DATA[id];
    if (!m || !d) return;
    const list = arr => (arr || []).map(x => '<li>' + esc(x) + '</li>').join('');
    const rel = (d.related || []).filter(r => META[r] && DATA[r]).map(r =>
      '<button type="button" class="sg-rel" data-id="' + r + '">' + esc(META[r].icon + ' ' + META[r].name) + '</button>'
    ).join('');
    panel.innerHTML =
      '<button type="button" class="sg-card-close" aria-label="閉じる">✕</button>' +
      '<div class="sg-card-head" style="border-color:' + colorOf(m.group) + '">' +
        '<div class="sg-card-icon" style="background:' + colorOf(m.group) + '">' + m.icon + '</div>' +
        '<div><div class="sg-card-name">' + esc(m.name) + ' ' + lvlBadges(m.levels) + '</div>' +
        '<div class="sg-card-group">' + esc(m.group) + '</div></div>' +
      '</div>' +
      '<p class="sg-summary">' + esc(d.summary || '') + '</p>' +
      (d.detail && d.detail.length ? '<div class="sg-sec"><h4>📘 詳しい解説</h4><ul>' + list(d.detail) + '</ul></div>' : '') +
      (d.exam && d.exam.length ? '<div class="sg-sec sg-exam"><h4>🔶 試験対策（暗記）</h4><ul>' + list(d.exam) + '</ul></div>' : '') +
      (rel ? '<div class="sg-sec"><h4>🔗 関連サービス</h4><div class="sg-rel-row">' + rel + '</div></div>' : '') +
      '<a class="sg-fulllink" href="' + hrefOf(id) + '">📄 詳細ページを開く →</a>';
    panel.classList.add('open');
    // 関連ボタン → カードジャンプ
    panel.querySelectorAll('.sg-rel').forEach(b =>
      b.addEventListener('click', () => openCard(b.dataset.id)));
    panel.querySelector('.sg-card-close').addEventListener('click', closeCard);
  }

  function highlight(id) {
    cy.batch(() => {
      cy.elements().addClass('faded');
      cy.elements().removeClass('sel hl');
      const n = cy.$id(id);
      if (!n.length) return;
      const nb = n.closedNeighborhood();
      nb.removeClass('faded');
      n.addClass('sel');
      n.connectedEdges().addClass('hl').removeClass('faded');
    });
  }

  let current = null;
  function openCard(id) {
    if (!META[id] || !DATA[id]) return;
    current = id;
    renderCard(id);
    highlight(id);
    const n = cy.$id(id);
    if (n.length) cy.animate({ center: { eles: n }, zoom: Math.max(cy.zoom(), 1) }, { duration: 250 });
    if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
  }
  function closeCard() {
    current = null;
    panel.classList.remove('open');
    cy.elements().removeClass('faded sel hl');
    history.replaceState(null, '', location.pathname);
  }

  cy.on('tap', 'node', e => openCard(e.target.id()));
  cy.on('tap', e => { if (e.target === cy && current) closeCard(); });

  /* ── ドメイン凡例（フィルタ） ── */
  const legend = document.getElementById('sgLegend');
  const groupsInUse = [...new Set(ids.map(id => META[id].group))];
  const active = new Set();
  legend.innerHTML = groupsInUse.map(g =>
    '<button type="button" class="sg-leg" data-g="' + esc(g) + '">' +
    '<span class="sg-leg-dot" style="background:' + colorOf(g) + '"></span>' + esc(g) + '</button>'
  ).join('');
  function applyFilter() {
    cy.batch(() => {
      cy.nodes().forEach(n => {
        const show = active.size === 0 || active.has(n.data('group'));
        n.toggleClass('hidden', !show);
      });
      cy.edges().forEach(ed => {
        const hide = ed.source().hasClass('hidden') || ed.target().hasClass('hidden');
        ed.toggleClass('hidden', hide);
      });
    });
  }
  legend.querySelectorAll('.sg-leg').forEach(b => b.addEventListener('click', () => {
    const g = b.dataset.g;
    if (active.has(g)) { active.delete(g); b.classList.remove('on'); }
    else { active.add(g); b.classList.add('on'); }
    applyFilter();
  }));

  /* ── ページ内検索 ── */
  const search = document.getElementById('sgSearch');
  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    if (!q) { if (!current) cy.elements().removeClass('faded'); else highlight(current); return; }
    cy.batch(() => {
      cy.elements().addClass('faded');
      const hit = cy.nodes().filter(n => (n.id() + ' ' + n.data('label')).toLowerCase().includes(q));
      hit.removeClass('faded');
      hit.connectedEdges().removeClass('faded');
    });
  });

  /* ── リセット ── */
  document.getElementById('sgReset').addEventListener('click', () => {
    active.clear();
    legend.querySelectorAll('.sg-leg.on').forEach(b => b.classList.remove('on'));
    search.value = '';
    applyFilter();
    closeCard();
    cy.animate({ fit: { padding: 30 } }, { duration: 250 });
  });

  /* ── ディープリンク（#id） ── */
  function fromHash() {
    const id = decodeURIComponent(location.hash.replace(/^#/, ''));
    if (id && META[id] && DATA[id]) openCard(id);
  }
  cy.ready(() => { cy.fit(undefined, 30); fromHash(); });
  window.addEventListener('hashchange', fromHash);

  /* ── ステータス（ノード/エッジ数） ── */
  const stat = document.getElementById('sgStat');
  if (stat) stat.textContent = nodes.length + ' サービス・' + edges.length + ' 関連';
})();
