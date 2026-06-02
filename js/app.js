/* AWS 資格学習ポータル — app.js v3（サイドバー動的生成） */

(function () {
  'use strict';

  /* ── 全ページ定義（サイドバー・進捗計算の正典） ──
     dir     : 'concepts' | 'services'
     levels  : 'clf' | 'saa' | 'clf saa'
     enabled : ページが作成済みなら true（false はグレーアウト表示）
  */
  const NAV_GROUPS = [
    {
      title: '基礎概念',
      items: [
        { id: 'cloud-benefits',        dir: 'concepts', icon: '☁️', label: 'クラウドの利点',        levels: 'clf',     enabled: true, file: 'aws-cloud-benefits' },
        { id: 'shared-responsibility', dir: 'concepts', icon: '🤝', label: '責任共有モデル',        levels: 'clf',     enabled: true },
        { id: 'on-premise-cloud',      dir: 'concepts', icon: '🏢', label: 'オンプレミスとクラウド', levels: 'clf saa', enabled: true },
        { id: 'global-infra',          dir: 'concepts', icon: '🌍', label: 'グローバルインフラ',     levels: 'clf',     enabled: true },
        { id: 'aws-operations',        dir: 'concepts', icon: '🖱', label: 'AWSの運用方法',          levels: 'clf',     enabled: true },
        { id: 'aws-caf',               dir: 'concepts', icon: '📋', label: 'AWS CAF',               levels: 'clf',     enabled: true },
        { id: 'service-map',           dir: 'concepts', icon: '🗺', label: 'サービスマップ',         levels: 'clf saa', enabled: true, noProgress: true },
        { id: 'service-graph',         dir: 'concepts', icon: '🕸', label: 'サービス関連図（学習）',  levels: 'clf saa', enabled: true, noProgress: true },
      ],
    },
    {
      title: 'Well-Architected',
      items: [
        { id: 'well-architected',      dir: 'concepts', icon: '🏛', label: 'フレームワーク概要',     levels: 'clf saa', enabled: true },
        { id: 'wa-security',           dir: 'concepts', icon: '🛡', label: 'セキュリティの柱',       levels: 'clf saa', enabled: true },
        { id: 'wa-reliability',        dir: 'concepts', icon: '🔁', label: '信頼性の柱',             levels: 'clf saa', enabled: true },
        { id: 'wa-performance',        dir: 'concepts', icon: '⚡', label: 'パフォーマンス効率の柱',  levels: 'clf saa', enabled: true },
        { id: 'wa-cost',               dir: 'concepts', icon: '💰', label: 'コスト最適化の柱',       levels: 'clf saa', enabled: true },
        { id: 'wa-operational',        dir: 'concepts', icon: '🛠', label: '運用上の優秀性の柱',     levels: 'clf saa', enabled: true },
      ],
    },
    {
      title: 'コンピューティング',
      items: [
        { id: 'ec2',                   dir: 'services', icon: '🖥', label: 'Amazon EC2',            levels: 'clf saa', enabled: true },
        { id: 'ec2-purchase-options',  dir: 'services', icon: '🏷', label: 'EC2 購入オプション',     levels: 'clf saa', enabled: true },
        { id: 'lambda',                dir: 'services', icon: '⚡', label: 'Lambda / API GW',        levels: 'clf saa', enabled: true },
        { id: 'auto-scaling',          dir: 'services', icon: '📈', label: 'Auto Scaling',          levels: 'saa',     enabled: true },
        { id: 'ecs-fargate-eks',       dir: 'services', icon: '🐳', label: 'ECS / Fargate / EKS',   levels: 'clf saa', enabled: true },
        { id: 'app-runner',            dir: 'services', icon: '🏃', label: 'App Runner',            levels: 'saa',     enabled: true },
        { id: 'batch',                 dir: 'services', icon: '📦', label: 'AWS Batch',             levels: 'saa',     enabled: true },
        { id: 'elastic-beanstalk',     dir: 'services', icon: '🌱', label: 'Elastic Beanstalk',     levels: 'clf saa', enabled: true },
        { id: 'lightsail',             dir: 'services', icon: '🚀', label: 'Amazon Lightsail',      levels: 'clf',     enabled: true },
      ],
    },
    {
      title: 'ストレージ',
      items: [
        { id: 's3',                    dir: 'services', icon: '🪣', label: 'Amazon S3',             levels: 'clf saa', enabled: true },
        { id: 'ebs',                   dir: 'services', icon: '💿', label: 'Amazon EBS',            levels: 'clf saa', enabled: true },
        { id: 'efs',                   dir: 'services', icon: '📁', label: 'Amazon EFS',            levels: 'saa',     enabled: true },
        { id: 'fsx',                   dir: 'services', icon: '📂', label: 'Amazon FSx',            levels: 'saa',     enabled: true },
        { id: 'storage-gateway',       dir: 'services', icon: '🔌', label: 'Storage Gateway',       levels: 'clf saa', enabled: true },
      ],
    },
    {
      title: 'データベース',
      items: [
        { id: 'dynamodb',              dir: 'services', icon: '📊', label: 'DynamoDB',              levels: 'clf saa', enabled: true },
        { id: 'rds',                   dir: 'services', icon: '🗃', label: 'Amazon RDS',            levels: 'clf saa', enabled: true },
        { id: 'aurora',                dir: 'services', icon: '✨', label: 'Amazon Aurora',         levels: 'saa',     enabled: true },
        { id: 'redshift',              dir: 'services', icon: '📉', label: 'Amazon Redshift',       levels: 'saa',     enabled: true },
        { id: 'elasticache',           dir: 'services', icon: '⚡', label: 'ElastiCache',           levels: 'saa',     enabled: true },
        { id: 'memorydb',              dir: 'services', icon: '🧠', label: 'MemoryDB',              levels: 'saa',     enabled: true },
        { id: 'neptune',               dir: 'services', icon: '🔮', label: 'Amazon Neptune',        levels: 'saa',     enabled: true },
      ],
    },
    {
      title: 'ネットワーキング',
      items: [
        { id: 'vpc',                   dir: 'services', icon: '🔗', label: 'Amazon VPC',            levels: 'clf saa', enabled: true },
        { id: 'elb',                   dir: 'services', icon: '⚖️', label: 'ELB',                   levels: 'clf saa', enabled: true },
        { id: 'global-accelerator',    dir: 'services', icon: '🌐', label: 'Global Accelerator',    levels: 'saa',     enabled: true },
        { id: 'cloudfront',            dir: 'services', icon: '🌍', label: 'Amazon CloudFront',     levels: 'clf saa', enabled: true },
        { id: 'route53',               dir: 'services', icon: '🧭', label: 'Amazon Route 53',       levels: 'clf saa', enabled: true },
        { id: 'direct-connect-vpn',    dir: 'services', icon: '🔌', label: 'Direct Connect / VPN',  levels: 'clf saa', enabled: true },
      ],
    },
    {
      title: 'データ分析',
      items: [
        { id: 'kinesis',               dir: 'services', icon: '🌊', label: 'Amazon Kinesis',        levels: 'saa',     enabled: true },
        { id: 'data-firehose',         dir: 'services', icon: '🚒', label: 'Data Firehose',         levels: 'saa',     enabled: true },
        { id: 'athena',                dir: 'services', icon: '🔎', label: 'Amazon Athena',         levels: 'saa',     enabled: true },
        { id: 'glue',                  dir: 'services', icon: '🔧', label: 'AWS Glue',              levels: 'saa',     enabled: true },
        { id: 'quicksight',            dir: 'services', icon: '📊', label: 'Amazon QuickSight',     levels: 'saa',     enabled: true },
      ],
    },
    {
      title: 'アプリケーション統合',
      items: [
        { id: 'sns',                   dir: 'services', icon: '📣', label: 'Amazon SNS',            levels: 'clf saa', enabled: true },
        { id: 'sqs',                   dir: 'services', icon: '📨', label: 'Amazon SQS',            levels: 'clf saa', enabled: true },
        { id: 'eventbridge',           dir: 'services', icon: '🔔', label: 'EventBridge',           levels: 'saa',     enabled: true },
        { id: 'step-functions',        dir: 'services', icon: '🔀', label: 'Step Functions',        levels: 'saa',     enabled: true },
      ],
    },
    {
      title: '監視・管理',
      items: [
        { id: 'cloudwatch',            dir: 'services', icon: '📈', label: 'CloudWatch',            levels: 'clf saa', enabled: true },
        { id: 'cloudtrail',            dir: 'services', icon: '🔍', label: 'CloudTrail',            levels: 'clf saa', enabled: true },
        { id: 'x-ray',                 dir: 'services', icon: '🩻', label: 'AWS X-Ray',             levels: 'saa',     enabled: true },
        { id: 'cloudformation',        dir: 'services', icon: '🏗', label: 'CloudFormation',        levels: 'saa',     enabled: true },
        { id: 'aws-config',            dir: 'services', icon: '⚙️', label: 'AWS Config',            levels: 'saa',     enabled: true },
        { id: 'systems-manager',       dir: 'services', icon: '🛠', label: 'Systems Manager',       levels: 'saa',     enabled: true },
        { id: 'backup',                dir: 'services', icon: '💾', label: 'AWS Backup',            levels: 'clf saa', enabled: true },
        { id: 'health-dashboard',      dir: 'services', icon: '🩺', label: 'Health Dashboard',      levels: 'clf',     enabled: true },
        { id: 'trusted-advisor',       dir: 'services', icon: '💡', label: 'Trusted Advisor',       levels: 'clf',     enabled: true },
        { id: 'cost-explorer',         dir: 'services', icon: '💰', label: 'Cost Explorer',         levels: 'clf',     enabled: true },
        { id: 'compute-optimizer',     dir: 'services', icon: '📐', label: 'Compute Optimizer',     levels: 'clf',     enabled: true },
      ],
    },
    {
      title: 'セキュリティ',
      items: [
        { id: 'iam',                   dir: 'services', icon: '🔐', label: 'IAM / Organizations',   levels: 'clf saa', enabled: true },
        { id: 'waf-shield',            dir: 'services', icon: '🛡', label: 'WAF / Shield',          levels: 'clf saa', enabled: true },
        { id: 'kms-cloudhsm',          dir: 'services', icon: '🔑', label: 'KMS / CloudHSM',        levels: 'saa',     enabled: true },
        { id: 'secrets-manager',       dir: 'services', icon: '🔒', label: 'Secrets Manager',       levels: 'saa',     enabled: true },
        { id: 'certificate-manager',   dir: 'services', icon: '📜', label: 'Certificate Manager',   levels: 'clf saa', enabled: true },
        { id: 'cognito',               dir: 'services', icon: '👤', label: 'Amazon Cognito',        levels: 'saa',     enabled: true },
        { id: 'sts',                   dir: 'services', icon: '🎟', label: 'AWS STS',               levels: 'saa',     enabled: true },
        { id: 'iam-identity-center',   dir: 'services', icon: '🪪', label: 'IAM Identity Center',   levels: 'saa',     enabled: true },
        { id: 'security-services',     dir: 'services', icon: '🛡', label: 'セキュリティ検出',       levels: 'clf saa', enabled: true },
        { id: 'pen-testing',           dir: 'concepts', icon: '🧪', label: 'ペネトレーションテスト', levels: 'clf saa', enabled: true },
      ],
    },
    {
      title: 'ガバナンス・コンプライアンス',
      items: [
        { id: 'control-tower',         dir: 'services', icon: '🏛', label: 'Control Tower',         levels: 'saa',     enabled: true },
        { id: 'artifact',              dir: 'services', icon: '📑', label: 'AWS Artifact',          levels: 'clf',     enabled: true },
        { id: 'audit-manager',         dir: 'services', icon: '🔎', label: 'Audit Manager',         levels: 'saa',     enabled: true },
        { id: 'marketplace',           dir: 'services', icon: '🛒', label: 'AWS Marketplace',       levels: 'clf',     enabled: true },
        { id: 'managed-services',      dir: 'services', icon: '🤲', label: 'Managed Services',      levels: 'clf',     enabled: true },
        { id: 'support',               dir: 'services', icon: '🛟', label: 'AWS サポートプラン',     levels: 'clf saa', enabled: true },
      ],
    },
    {
      title: '移行・転送',
      items: [
        { id: 'migration-tools',       dir: 'services', icon: '🚚', label: 'AWSへの移行ツール',     levels: 'saa',     enabled: true },
        { id: 'datasync',              dir: 'services', icon: '🔄', label: 'AWS DataSync',          levels: 'saa',     enabled: true },
        { id: 'snowball',              dir: 'services', icon: '❄️', label: 'AWS Snowball',          levels: 'clf saa', enabled: true },
      ],
    },
    {
      title: '開発者ツール',
      items: [
        { id: 'developer-tools',       dir: 'services', icon: '🧰', label: 'デベロッパーツール',     levels: 'saa',     enabled: true },
        { id: 'cloud9',                dir: 'services', icon: '💻', label: 'AWS Cloud9',            levels: 'saa',     enabled: true },
        { id: 'amplify',               dir: 'services', icon: '🔺', label: 'AWS Amplify',           levels: 'saa',     enabled: true },
      ],
    },
    {
      title: '機械学習・AI',
      items: [
        { id: 'ml-ai',                 dir: 'services', icon: '🤖', label: 'ML / AI サービス',      levels: 'clf saa', enabled: true },
      ],
    },
    {
      title: 'エンドユーザー / ハイブリッド',
      items: [
        { id: 'workspaces',            dir: 'services', icon: '🖥', label: 'WorkSpaces',            levels: 'clf',     enabled: true },
        { id: 'appstream',             dir: 'services', icon: '📲', label: 'AppStream 2.0',         levels: 'saa',     enabled: true },
        { id: 'outposts',              dir: 'services', icon: '🏗', label: 'Outposts',              levels: 'saa',     enabled: true },
        { id: 'wavelength',            dir: 'services', icon: '📡', label: 'Wavelength',            levels: 'saa',     enabled: true },
      ],
    },
  ];

  /* ── ドメインカード用アイコン（グループ名 → 絵文字） ── */
  const DOMAIN_ICONS = {
    '基礎概念':                      '☁️',
    'Well-Architected':              '🏛',
    'コンピューティング':            '💻',
    'ストレージ':                    '🪣',
    'データベース':                  '🗄️',
    'ネットワーキング':              '🔗',
    'データ分析':                    '🌊',
    'アプリケーション統合':          '🔔',
    '監視・管理':                    '📊',
    'セキュリティ':                  '🔐',
    'ガバナンス・コンプライアンス':  '🏛',
    '移行・転送':                    '🚚',
    '開発者ツール':                  '🧰',
    '機械学習・AI':                  '🤖',
    'エンドユーザー / ハイブリッド': '🖥',
  };

  /* ── 新着として表示するページID ──
     ドキュメントを追加したらここにIDを足す。定着したら削除すればホームの「新着」から自動で消える。 */
  const NEW_IDS = new Set([
    'service-graph',
    'well-architected', 'wa-security', 'wa-reliability', 'wa-performance', 'wa-cost', 'wa-operational', 'pen-testing',
    'cloudfront', 'route53', 'direct-connect-vpn',
    'data-firehose', 'athena', 'glue', 'quicksight',
    'sns', 'sqs', 'eventbridge', 'step-functions',
    'x-ray', 'cognito', 'sts', 'iam-identity-center', 'security-services', 'support',
    'migration-tools', 'datasync', 'snowball',
    'developer-tools', 'cloud9', 'amplify', 'ml-ai',
  ]);

  // 全ページのフラット配列（グループ名付き。サイドバー・ドメイン・前後ナビ・統計の正典）
  const ALL_ITEMS = NAV_GROUPS.flatMap(g => g.items.map(it => Object.assign({ group: g.title }, it)));

  // 進捗計算用（noProgress を除く有効ページ）。updateBars 互換のため形を維持
  const PAGE_REGISTRY = ALL_ITEMS
    .filter(it => it.enabled && !it.noProgress)
    .map(it => ({ id: it.id, levels: it.levels }));

  // 学習動線（前後ナビ）用の順序＝有効・進捗対象ページを NAV_GROUPS の並びで
  const LEARN_ORDER = ALL_ITEMS.filter(it => it.enabled && !it.noProgress);

  /* ── 共通ヘルパー ── */
  function hrefFor(it) { return prefix + it.dir + '/' + (it.file || it.id) + '.html'; }
  function levelBadge(levels) {
    return levels.includes('saa') && !levels.includes('clf')
      ? '<span class="nav-badge saa">SAA</span>'
      : '<span class="nav-badge clf">CLF</span>';
  }
  function escAttr(s) { return String(s).replace(/"/g, '&quot;'); }

  /* ── 現在地からの相対パス接頭辞を判定 ── */
  const inSubDir = /\/(concepts|services)\//.test(location.pathname);
  const prefix = inSubDir ? '../' : '';
  const currentPage = document.body.dataset.page || '';

  /* ── サイドバーHTMLを生成して注入（先頭に検索ボックス） ── */
  function renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    let html = '<div class="nav-search"><input type="search" id="navSearch" '
             + 'placeholder="🔍 サービスを検索…" autocomplete="off" spellcheck="false">'
             + '<span class="nav-search-hint">/</span></div>';

    for (const group of NAV_GROUPS) {
      html += '<div class="nav-group" data-group>'
            + '<div class="nav-group-title">' + group.title + '</div>';
      for (const it of group.items) {
        const badge = levelBadge(it.levels);
        const term = escAttr((it.label + ' ' + it.id + ' ' + group.title).toLowerCase());
        const newDot = (it.enabled && NEW_IDS.has(it.id)) ? '<span class="nav-new">NEW</span>' : '';
        if (!it.enabled) {
          html += '<a href="#" class="nav-item" data-term="' + term + '" style="opacity:.5;cursor:not-allowed">'
                + it.icon + ' ' + it.label + badge + '<span class="nav-dot"></span></a>';
        } else {
          const active = it.id === currentPage ? ' active' : '';
          html += '<a href="' + hrefFor(it) + '" class="nav-item' + active + '" data-page="' + it.id + '" data-term="' + term + '">'
                + it.icon + ' ' + it.label + badge + newDot + '<span class="nav-dot"></span></a>';
        }
      }
      html += '</div>';
    }
    sidebar.innerHTML = html;

    // 検索フィルタ
    const search = sidebar.querySelector('#navSearch');
    function filterNav(q) {
      const query = q.trim().toLowerCase();
      sidebar.querySelectorAll('[data-group]').forEach(grp => {
        let any = false;
        grp.querySelectorAll('.nav-item').forEach(a => {
          const hit = !query || (a.dataset.term || '').includes(query);
          a.style.display = hit ? '' : 'none';
          if (hit) any = true;
        });
        grp.style.display = any ? '' : 'none';
      });
    }
    search?.addEventListener('input', () => filterNav(search.value));

    // 現在ページを中央へスクロール
    sidebar.querySelector('.nav-item.active')?.scrollIntoView({ block: 'center' });
  }

  renderSidebar();

  // 「/」キーでサイドバー検索にフォーカス
  document.addEventListener('keydown', (e) => {
    if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (document.activeElement?.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    const s = document.getElementById('navSearch');
    if (s) { e.preventDefault(); s.focus(); }
  });

  /* ── ダッシュボードの学習ドメイン（アコーディオン展開） ──
     各ドメインをクリックすると、配下の全ページ一覧（各ページへのリンク）が開く。
     ページ数は NAV_GROUPS から自動算出するため常に正確。 */
  function renderDomainGrid() {
    const grid = document.getElementById('domainGrid');
    if (!grid) return; // index.html 以外では何もしない

    const prog = getProgress();
    let html = '';
    for (const group of NAV_GROUPS) {
      const icon = DOMAIN_ICONS[group.title] || '📁';
      const enabledItems = group.items.filter(it => it.enabled && !it.noProgress);
      const count = enabledItems.length;
      const clfN = enabledItems.filter(it => it.levels.includes('clf')).length;
      const saaN = enabledItems.filter(it => it.levels.includes('saa')).length;
      const doneN = enabledItems.filter(it => prog[it.id]).length;
      const pct = count ? Math.round(doneN / count * 100) : 0;

      // 配下ページのリンク一覧
      let pages = '';
      for (const it of group.items) {
        const badge = levelBadge(it.levels);
        const newDot = (it.enabled && NEW_IDS.has(it.id)) ? '<span class="nav-new">NEW</span>' : '';
        if (!it.enabled) {
          pages += '<span class="domain-page disabled">'
                 + it.icon + ' ' + it.label + badge
                 + '<span class="domain-page-soon">準備中</span></span>';
        } else {
          pages += '<a href="' + hrefFor(it) + '" class="domain-page" data-page="' + it.id + '">'
                 + it.icon + ' ' + it.label + badge + newDot
                 + '<span class="nav-dot"></span></a>';
        }
      }

      html += '<div class="domain-card" data-domain>'
            +   '<button type="button" class="domain-head" aria-expanded="false">'
            +     '<div class="domain-icon">' + icon + '</div>'
            +     '<div class="domain-meta">'
            +       '<div class="domain-name">' + group.title + '</div>'
            +       '<div class="domain-count">' + count + 'ページ・CLF' + clfN + '/SAA' + saaN
            +         '<span class="domain-done">' + doneN + '/' + count + '学習済</span></div>'
            +       '<div class="domain-bar"><div class="domain-bar-fill" style="width:' + pct + '%"></div></div>'
            +     '</div>'
            +     '<span class="domain-toggle">▾</span>'
            +   '</button>'
            +   '<div class="domain-pages">' + pages + '</div>'
            + '</div>';
    }
    grid.innerHTML = html;

    // 開閉トグル
    grid.querySelectorAll('.domain-head').forEach(head => {
      head.addEventListener('click', () => {
        const card = head.closest('.domain-card');
        const open = card.classList.toggle('open');
        head.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  }

  renderDomainGrid();

  /* ── モバイルサイドバー ── */
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  function openSidebar()  { sidebar?.classList.add('open');    overlay?.classList.add('show'); }
  function closeSidebar() { sidebar?.classList.remove('open'); overlay?.classList.remove('show'); }

  menuBtn?.addEventListener('click', () =>
    sidebar?.classList.contains('open') ? closeSidebar() : openSidebar());
  overlay?.addEventListener('click', closeSidebar);

  /* ── 学習進捗 ── */
  function getProgress() {
    try { return JSON.parse(localStorage.getItem('awsProgress') || '{}'); }
    catch { return {}; }
  }
  function setProgress(p) {
    try { localStorage.setItem('awsProgress', JSON.stringify(p)); }
    catch {}
  }

  const progress = getProgress();

  // 現在ページを完了にマーク（開いたら自動記録）
  if (currentPage && currentPage !== 'home') {
    progress[currentPage] = true;
    setProgress(progress);
  }

  // サイドバーの完了ドットを更新（注入後に実行）
  document.querySelectorAll('.nav-item[data-page], .domain-page[data-page]').forEach(el => {
    if (progress[el.dataset.page]) el.classList.add('done');
  });

  /* ── ダッシュボード進捗バー（index.htmlのみ動作） ── */
  function updateBars() {
    const pages = getProgress();

    const clfPages = PAGE_REGISTRY.filter(p => p.levels.includes('clf'));
    const saaPages = PAGE_REGISTRY.filter(p => p.levels.includes('saa'));
    const totalCLF = clfPages.length;
    const totalSAA = saaPages.length;
    const doneCLF  = clfPages.filter(p => pages[p.id]).length;
    const doneSAA  = saaPages.filter(p => pages[p.id]).length;
    const pctCLF   = totalCLF ? Math.round(doneCLF / totalCLF * 100) : 0;
    const pctSAA   = totalSAA ? Math.round(doneSAA / totalSAA * 100) : 0;

    const clfFill = document.getElementById('clfFill');
    const saaFill = document.getElementById('saaFill');
    const clfPct  = document.getElementById('clfPct');
    const saaPct  = document.getElementById('saaPct');

    if (clfFill) clfFill.style.width = pctCLF + '%';
    if (saaFill) saaFill.style.width = pctSAA + '%';
    if (clfPct)  clfPct.textContent  = doneCLF + '/' + totalCLF + ' (' + pctCLF + '%)';
    if (saaPct)  saaPct.textContent  = doneSAA + '/' + totalSAA + ' (' + pctSAA + '%)';
  }

  updateBars();

  /* ── ホーム上部：統計ストリップ（NAV_GROUPS から自動算出） ── */
  function renderStats() {
    const el = document.getElementById('statStrip');
    if (!el) return;
    const pages = getProgress();
    const total   = PAGE_REGISTRY.length;
    const clf     = PAGE_REGISTRY.filter(p => p.levels.includes('clf')).length;
    const saa     = PAGE_REGISTRY.filter(p => p.levels.includes('saa')).length;
    const done    = PAGE_REGISTRY.filter(p => pages[p.id]).length;
    const pct     = total ? Math.round(done / total * 100) : 0;
    const domains = NAV_GROUPS.length;
    const stat = (icon, num, label, cls) =>
      '<div class="stat ' + (cls || '') + '"><div class="stat-num">' + icon + ' ' + num + '</div>'
      + '<div class="stat-label">' + label + '</div></div>';
    el.innerHTML =
        stat('📚', total, '総ページ数')
      + stat('🗂', domains, '学習ドメイン')
      + stat('☁️', clf, 'CLF対象', 'clf')
      + stat('🏗', saa, 'SAA対象', 'saa')
      + stat('✅', done + ' / ' + total, '学習済み（' + pct + '%）', 'done');
  }
  renderStats();

  /* ── ホーム：新着（NEW_IDS から自動。0件ならセクション非表示） ── */
  function renderNew() {
    const row = document.getElementById('newRow');
    if (!row) return;
    const items = ALL_ITEMS.filter(it => it.enabled && !it.noProgress && NEW_IDS.has(it.id));
    const section = document.getElementById('newSection');
    if (!items.length) { if (section) section.style.display = 'none'; return; }
    row.innerHTML = items.map(it =>
      '<a href="' + hrefFor(it) + '" class="new-chip" data-page="' + it.id + '">'
      + '<span class="new-chip-icon">' + it.icon + '</span>'
      + '<span class="new-chip-label">' + it.label + '</span>'
      + levelBadge(it.levels) + '</a>'
    ).join('');
  }
  renderNew();

  /* ── 全ページ共通：前後ナビ（学習動線）を本文末尾に注入 ── */
  function injectPrevNext() {
    if (!currentPage || currentPage === 'home') return;
    const inner = document.querySelector('.main-inner');
    if (!inner) return;
    const idx = LEARN_ORDER.findIndex(it => it.id === currentPage);
    if (idx === -1) return;
    const prev = LEARN_ORDER[idx - 1];
    const next = LEARN_ORDER[idx + 1];
    const link = (it, dir) => it
      ? '<a class="prevnext-link ' + dir + '" href="' + hrefFor(it) + '">'
        + '<span class="prevnext-dir">' + (dir === 'prev' ? '← 前へ' : '次へ →') + '</span>'
        + '<span class="prevnext-name">' + it.icon + ' ' + it.label + '</span></a>'
      : '<span class="prevnext-link empty"></span>';
    const nav = document.createElement('nav');
    nav.className = 'prevnext';
    nav.innerHTML = link(prev, 'prev') + link(next, 'next');
    inner.appendChild(nav);
  }
  injectPrevNext();

  /* ── 全ページ共通：トップへ戻るボタン ── */
  function injectScrollTop() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'scrolltop';
    btn.setAttribute('aria-label', 'ページ上部へ戻る');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    const onScroll = () => btn.classList.toggle('show', window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  injectScrollTop();

  /* ── ページ内 AI チャット（Gemini 無料枠・ページ本文グラウンディング） ── */
  function initChatWidget() {
    const LS_KEY   = 'geminiApiKey';
    const MODEL    = 'gemini-2.5-flash';
    const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/'
                   + MODEL + ':generateContent';
    const MAX_CONTEXT = 12000; // ページ本文の最大文字数

    // ページタイトル（パネル見出し用）
    const pageTitle = (document.querySelector('.page-title h1')?.textContent
                    || document.title || 'このページ').trim();

    // 会話履歴（このページ読込中のみ保持）
    const history = []; // { role:'user'|'model', text:string }

    /* --- DOM 生成 --- */
    const fab = document.createElement('button');
    fab.className = 'chat-fab';
    fab.type = 'button';
    fab.setAttribute('aria-label', 'AIに質問');
    fab.innerHTML = '<span class="chat-fab-icon">💬</span>';

    const panel = document.createElement('div');
    panel.className = 'chat-panel';
    panel.innerHTML =
        '<div class="chat-header">'
      +   '<div class="chat-title">🤖 AIに質問<span class="chat-model">' + MODEL + '</span></div>'
      +   '<div class="chat-header-btns">'
      +     '<button type="button" class="chat-icon-btn" data-act="settings" aria-label="APIキー設定" title="APIキー設定">⚙️</button>'
      +     '<button type="button" class="chat-icon-btn" data-act="close" aria-label="閉じる" title="閉じる">✕</button>'
      +   '</div>'
      + '</div>'
      + '<div class="chat-log" id="chatLog"></div>'
      + '<form class="chat-inputbar" id="chatForm">'
      +   '<textarea class="chat-input" id="chatInput" rows="1" placeholder="このページについて質問…（⌘+Enter または Ctrl+Enter で送信）"></textarea>'
      +   '<button type="submit" class="chat-send" aria-label="送信">➤</button>'
      + '</form>';

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    const log      = panel.querySelector('#chatLog');
    const form     = panel.querySelector('#chatForm');
    const input    = panel.querySelector('#chatInput');
    const sendBtn  = panel.querySelector('.chat-send');

    /* --- ユーティリティ --- */
    function escapeHtml(s) {
      return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    // 安全な簡易Markdown（エスケープ後に最小限の整形のみ）
    function mdToHtml(text) {
      const lines = escapeHtml(text).split('\n');
      let out = '', inList = false;
      for (let line of lines) {
        line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                   .replace(/`([^`]+?)`/g, '<code>$1</code>');
        const m = line.match(/^\s*[-*]\s+(.*)$/);
        if (m) {
          if (!inList) { out += '<ul>'; inList = true; }
          out += '<li>' + m[1] + '</li>';
        } else {
          if (inList) { out += '</ul>'; inList = false; }
          if (line.trim() === '') out += '<br>';
          else out += '<p>' + line + '</p>';
        }
      }
      if (inList) out += '</ul>';
      return out;
    }
    function addMsg(role, text, opts) {
      const el = document.createElement('div');
      el.className = 'chat-msg ' + role;
      if (opts && opts.html) el.innerHTML = text;
      else if (role === 'bot') el.innerHTML = mdToHtml(text);
      else el.textContent = text;
      log.appendChild(el);
      log.scrollTop = log.scrollHeight;
      return el;
    }
    function getPageText() {
      const main = document.querySelector('.main-inner');
      let t = (main?.innerText || '').replace(/\n{3,}/g, '\n\n').trim();
      if (t.length > MAX_CONTEXT) t = t.slice(0, MAX_CONTEXT) + '\n…（以下省略）';
      return t;
    }
    function buildSystemInstruction() {
      return 'あなたはAWS認定（CLF/SAA）の家庭教師です。日本語で簡潔に、わかりやすく回答してください。'
        + '下記「ページ本文」を最優先の根拠として答えてください。'
        + '本文で足りない点はAWSの一般知識で補ってよいですが、その場合は「※本文外の補足」と明示してください。'
        + '試験で問われやすいポイントがあれば添えてください。\n\n'
        + '現在のページ：' + pageTitle + '\n'
        + '---ページ本文ここから---\n' + getPageText() + '\n---ページ本文ここまで---';
    }

    /* --- APIキー モーダル --- */
    function showKeyModal(onSaved) {
      const cur = localStorage.getItem(LS_KEY) || '';
      const back = document.createElement('div');
      back.className = 'chat-key-modal';
      back.innerHTML =
          '<div class="chat-key-box">'
        +   '<h3>Gemini APIキーの設定</h3>'
        +   '<p>このチャットは Google Gemini（無料枠）を使います。'
        +     '<a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">こちら</a> から無料のAPIキーを取得して貼り付けてください。</p>'
        +   '<input type="password" class="chat-key-input" placeholder="AIza... で始まるキー" value="' + escapeHtml(cur) + '">'
        +   '<p class="chat-key-note">🔒 キーはこのブラウザ内（localStorage）にのみ保存されます。共有PCでは使用後に削除してください。</p>'
        +   '<div class="chat-key-actions">'
        +     (cur ? '<button type="button" class="chat-key-btn ghost" data-act="clear">削除</button>' : '')
        +     '<span style="flex:1"></span>'
        +     '<button type="button" class="chat-key-btn ghost" data-act="cancel">キャンセル</button>'
        +     '<button type="button" class="chat-key-btn primary" data-act="save">保存</button>'
        +   '</div>'
        + '</div>';
      document.body.appendChild(back);
      const keyInput = back.querySelector('.chat-key-input');
      keyInput.focus();

      function close() { back.remove(); }
      back.addEventListener('click', (e) => { if (e.target === back) close(); });
      back.querySelector('[data-act="cancel"]').addEventListener('click', close);
      back.querySelector('[data-act="save"]').addEventListener('click', () => {
        const v = keyInput.value.trim();
        if (!v) { keyInput.focus(); return; }
        localStorage.setItem(LS_KEY, v);
        close();
        if (onSaved) onSaved();
      });
      const clearBtn = back.querySelector('[data-act="clear"]');
      if (clearBtn) clearBtn.addEventListener('click', () => {
        localStorage.removeItem(LS_KEY);
        close();
        addMsg('bot', 'APIキーを削除しました。次回の送信時に再度入力してください。');
      });
    }

    /* --- Gemini 呼び出し --- */
    async function callGemini(userText) {
      const key = localStorage.getItem(LS_KEY);
      const contents = history.map(h => ({ role: h.role, parts: [{ text: h.text }] }));
      const body = {
        systemInstruction: { parts: [{ text: buildSystemInstruction() }] },
        contents,
        // maxOutputTokens は指定しない＝モデル既定の最大まで出力（途中で切れないように）
        generationConfig: { temperature: 0.3 },
      };
      const res = await fetch(ENDPOINT + '?key=' + encodeURIComponent(key), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        let detail = '';
        try { detail = (await res.json())?.error?.message || ''; } catch {}
        const err = new Error(detail || ('HTTP ' + res.status));
        err.status = res.status;
        throw err;
      }
      const data = await res.json();
      const cand = data?.candidates?.[0];
      const text = cand?.content?.parts?.map(p => p.text).filter(Boolean).join('') || '';
      if (!text) {
        if (cand?.finishReason === 'SAFETY')
          return '（安全性フィルタにより回答が制限されました。質問を言い換えてみてください）';
        return '（回答を取得できませんでした。もう一度お試しください）';
      }
      let out = text.trim();
      // 出力上限などで途中終了した場合は明示
      if (cand?.finishReason === 'MAX_TOKENS')
        out += '\n\n※回答が長くなり途中で止まりました。「続き」と送ると続きを生成できます。';
      return out;
    }

    /* --- 送信フロー --- */
    let busy = false;
    async function send(userText) {
      if (busy) return;
      if (!localStorage.getItem(LS_KEY)) {
        showKeyModal(() => send(userText));
        return;
      }
      busy = true;
      sendBtn.disabled = true;
      addMsg('user', userText);
      history.push({ role: 'user', text: userText });
      const thinking = addMsg('bot', '<span class="chat-dots"><span></span><span></span><span></span></span>', { html: true });

      try {
        const answer = await callGemini(userText);
        thinking.innerHTML = mdToHtml(answer);
        history.push({ role: 'model', text: answer });
      } catch (e) {
        history.pop(); // 失敗したユーザー発話は履歴から除く
        let msg;
        if (e.status === 400 || e.status === 401 || e.status === 403)
          msg = '⚠️ APIキーが無効または未承認の可能性があります。⚙️ から再設定してください。<br><small>' + escapeHtml(e.message || '') + '</small>';
        else if (e.status === 429)
          msg = '⚠️ 無料枠のレート上限に達しました。少し時間をおいて再度お試しください。';
        else
          msg = '⚠️ 通信エラーが発生しました。<br><small>' + escapeHtml(e.message || '') + '</small>';
        thinking.classList.add('error');
        thinking.innerHTML = msg;
      } finally {
        busy = false;
        sendBtn.disabled = false;
        log.scrollTop = log.scrollHeight;
      }
    }

    /* --- 開閉・イベント --- */
    let greeted = false;
    function openPanel() {
      panel.classList.add('open');
      fab.classList.add('hidden');
      if (!greeted) {
        addMsg('bot', 'こんにちは！「**' + pageTitle + '**」について質問できます。'
          + '\n例：「このページの要点を3行で」「試験で狙われるポイントは？」「4択問題を1問出して」');
        greeted = true;
      }
      setTimeout(() => input.focus(), 50);
    }
    function closePanel() {
      panel.classList.remove('open');
      fab.classList.remove('hidden');
    }

    fab.addEventListener('click', openPanel);
    panel.querySelector('[data-act="close"]').addEventListener('click', closePanel);
    panel.querySelector('[data-act="settings"]').addEventListener('click', () => showKeyModal());

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = input.value.trim();
      if (!v) return;
      input.value = '';
      input.style.height = 'auto';
      send(v);
    });
    input.addEventListener('keydown', (e) => {
      // 送信は ⌘+Enter（Mac）/ Ctrl+Enter のみ。
      // 通常のEnterは改行（日本語IMEの変換確定Enterで誤送信しないため）。
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        form.requestSubmit();
      }
    });
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    });
  }

  initChatWidget();

  /* ── 他ページ（サービス関連図など）から参照する正典メタを公開 ── */
  window.AWS_NAV_GROUPS = NAV_GROUPS;
  window.AWS_DOMAIN_ICONS = DOMAIN_ICONS;

})();
