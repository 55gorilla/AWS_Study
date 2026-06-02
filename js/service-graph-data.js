/* サービス関連図の学習コンテンツ（このページの正典）
   - キーは NAV_GROUPS の id（dir:'services'）。name/icon/group/levels/詳細URLは app.js 側から解決。
   - summary: 概要 / detail: 詳しい解説 / exam: 試験対策（暗記） / related: 関連サービスID（無向エッジの元）
   - サービス追加時はここに1エントリ足す（related は実在IDのみ）。 */
window.SERVICE_GRAPH = {

  /* ── コンピューティング ── */
  'ec2': {
    summary: '仮想サーバー（インスタンス）をクラウド上で起動できる、最も基本的なコンピューティングサービス。OSレベルから自由に制御できる。',
    detail: [
      'AMI（イメージ）からインスタンスを起動。インスタンスタイプでCPU/メモリ/ネットワーク性能を選ぶ。',
      'ストレージは EBS（永続ブロック）や インスタンスストア（一時）を接続。',
      'セキュリティグループ（仮想ファイアウォール）で通信を制御し、VPC 内に配置する。',
      'Auto Scaling と ELB を組み合わせて高可用性・スケーラブルな構成にできる。',
    ],
    exam: [
      'OSレベルの管理が必要・長時間実行なら EC2。',
      '購入オプション（オンデマンド/RI/Savings Plans/スポット）でコスト最適化。',
      'スポットは中断あり＝ステートレス/耐障害ワークロード向け。',
    ],
    related: ['ec2-purchase-options', 'ebs', 'auto-scaling', 'elb', 'vpc', 'cloudwatch'],
  },
  'ec2-purchase-options': {
    summary: 'EC2 の料金を最適化する購入方式。ワークロードの特性に応じてオンデマンド・RI・Savings Plans・スポットを使い分ける。',
    detail: [
      'オンデマンド：従量課金。短期・予測不能な負荷向け。',
      'リザーブドインスタンス(RI)/Savings Plans：1〜3年コミットで大幅割引。定常負荷向け。',
      'スポットインスタンス：最大90%割引だが中断あり。中断耐性のある処理向け。',
      'Dedicated Hosts/Instances：物理サーバー占有（ライセンス・コンプライアンス要件）。',
    ],
    exam: [
      '定常的にずっと動く → RI / Savings Plans。',
      '中断OKでコスト最優先 → スポット。',
      'BYOL・コンプライアンスで物理占有 → Dedicated Hosts。',
    ],
    related: ['ec2', 'auto-scaling', 'compute-optimizer', 'cost-explorer'],
  },
  'lambda': {
    summary: 'サーバーレスでコードを実行する関数サービス。イベント駆動で起動し、使った分だけ課金。インフラ管理不要。',
    detail: [
      'イベントソース（S3・DynamoDB・API Gateway・EventBridge 等）に応じて自動実行。',
      '実行時間は最大15分。スケーリングは自動。',
      'API Gateway と組み合わせてサーバーレスAPIを構築。',
      '言語ランタイム複数対応。同時実行数やメモリ設定でチューニング。',
    ],
    exam: [
      'イベント駆動・短時間・サーバー管理不要 → Lambda。',
      '15分を超える/常時稼働なら EC2 や Fargate を検討。',
      'Step Functions で複数Lambdaをオーケストレーション。',
    ],
    related: ['s3', 'dynamodb', 'eventbridge', 'sns', 'sqs', 'step-functions'],
  },
  'auto-scaling': {
    summary: 'EC2 インスタンス数を需要に応じて自動で増減（スケールアウト/イン）し、可用性とコスト効率を両立する。',
    detail: [
      'Auto Scaling グループ（ASG）で最小/希望/最大台数を定義。',
      'ターゲット追跡・ステップ・スケジュール・予測スケーリング等のポリシー。',
      'ELB のヘルスチェックと連動し、異常インスタンスを置換。',
      'CloudWatch メトリクス（CPU使用率等）をトリガーにする。',
    ],
    exam: [
      '需要変動に自動対応・単一障害点排除 → Auto Scaling。',
      'スケールアウト＝台数増、スケールアップ＝スペック増（別概念）。',
      'ELB + ASG + マルチAZ が高可用性の定番。',
    ],
    related: ['ec2', 'elb', 'cloudwatch', 'ec2-purchase-options'],
  },
  'ecs-fargate-eks': {
    summary: 'Docker コンテナのオーケストレーション。ECS（AWS独自）/ EKS（Kubernetes）、実行基盤として Fargate（サーバーレス）を選べる。',
    detail: [
      'ECS：AWSネイティブなコンテナ管理。学習が容易。',
      'EKS：マネージド Kubernetes。移植性・エコシステム重視。',
      'Fargate：サーバー（EC2）管理不要でコンテナを実行する起動タイプ。',
      'EC2起動タイプはホストを自分で管理（コスト最適化・特殊要件向け）。',
    ],
    exam: [
      'コンテナでサーバー管理したくない → Fargate。',
      'Kubernetes 互換が必須 → EKS。',
      'シンプルなAWS統合 → ECS。',
    ],
    related: ['ec2', 'elb', 'lambda', 'vpc', 'app-runner'],
  },
  'app-runner': {
    summary: 'コンテナ/ソースコードから Web アプリ・APIを最小設定でデプロイ・自動スケールするフルマネージドサービス。',
    detail: [
      'ソースリポジトリやコンテナイメージを指定するだけでビルド〜デプロイ〜公開。',
      'ロードバランシング・オートスケール・HTTPS を自動構成。',
      'インフラやオーケストレーションの知識が不要。',
    ],
    exam: [
      'コンテナWebアプリを手早く公開・自動スケール → App Runner。',
      'きめ細かな制御が必要なら ECS/EKS。',
    ],
    related: ['ecs-fargate-eks', 'lambda', 'elastic-beanstalk', 'amplify'],
  },
  'batch': {
    summary: '大量のバッチ処理ジョブをキューイングし、最適なコンピューティング（EC2/Fargate/スポット）で自動実行するサービス。',
    detail: [
      'ジョブ定義・ジョブキュー・コンピューティング環境で構成。',
      '必要なリソースを動的にプロビジョニングし、完了後に解放。',
      'スポットインスタンス活用でコスト最適化しやすい。',
    ],
    exam: [
      '大量の非同期バッチ計算（科学計算/レンダリング等）→ AWS Batch。',
      'スポット併用でコスト削減。',
    ],
    related: ['ec2', 'ec2-purchase-options', 'ecs-fargate-eks', 's3'],
  },
  'elastic-beanstalk': {
    summary: 'コードをアップロードするだけで、EC2・ELB・Auto Scaling 等を自動構成してWebアプリを実行する PaaS 的サービス。',
    detail: [
      'プラットフォーム（Java/Python/Node 等）を選びデプロイ。',
      '裏側のリソースはユーザーが所有・調整可能（CloudFormation ベース）。',
      'デプロイ方式（ローリング/Blue-Green 等）を選べる。',
    ],
    exam: [
      '既存Webアプリを素早く・インフラ自動構成で動かす → Elastic Beanstalk。',
      'リソースは隠さず制御可能（App Runner より自由度高）。',
    ],
    related: ['ec2', 'elb', 'auto-scaling', 'cloudformation', 'app-runner'],
  },
  'lightsail': {
    summary: '仮想サーバー・DB・ストレージを定額・簡単に始められる、小規模/学習向けの統合サービス。',
    detail: [
      '月額固定で予測しやすい料金。テンプレート（WordPress 等）から即起動。',
      'ネットワーク・スナップショット・ロードバランサーも内包。',
      '規模拡大時は EC2 へ移行可能。',
    ],
    exam: [
      'シンプル・低コストで小規模サイト/検証 → Lightsail。',
      '本格的な拡張性が必要なら EC2/VPC。',
    ],
    related: ['ec2', 's3', 'rds'],
  },

  /* ── ストレージ ── */
  's3': {
    summary: '高耐久（イレブンナイン）なオブジェクトストレージ。静的ファイル・バックアップ・データレイク・静的サイトに使う。',
    detail: [
      'バケット単位で管理。ストレージクラス（Standard/IA/One Zone-IA/Glacier 等）でコスト最適化。',
      'ライフサイクルポリシーで自動階層化・削除。バージョニングで世代管理。',
      '暗号化（SSE-S3/SSE-KMS）、バケットポリシー/IAM/ブロックパブリックアクセスで保護。',
      'イベント通知で Lambda/SNS/SQS を起動できる。',
    ],
    exam: [
      '静的ファイル・バックアップ・HTTP配信・データレイク → S3。',
      '長期アーカイブ・低コスト → Glacier 系。',
      '耐久性99.999999999%、自動で複数AZに冗長化。',
    ],
    related: ['cloudfront', 'athena', 'glue', 'kms-cloudhsm', 'lambda', 'storage-gateway'],
  },
  'ebs': {
    summary: 'EC2 にアタッチする永続的なブロックストレージ（仮想ディスク）。OSやDBのボリュームに使う。',
    detail: [
      'gp3/io2 等のボリュームタイプで性能（IOPS/スループット）を選択。',
      '単一AZ内に存在し、基本は1インスタンスにアタッチ（io2 は複数アタッチ可）。',
      'スナップショットを S3 に取得しバックアップ・複製・別AZ展開。',
      '保管時暗号化（KMS）に対応。',
    ],
    exam: [
      'EC2のOS/DBディスク（1インスタンス専用）→ EBS。',
      '複数EC2で共有したい → EFS。',
      'スナップショットは増分・S3保存・リージョン跨ぎコピー可。',
    ],
    related: ['ec2', 's3', 'backup', 'kms-cloudhsm'],
  },
  'efs': {
    summary: '複数の EC2 から同時マウントできる、フルマネージドな共有ファイルストレージ（NFS）。自動拡張。',
    detail: [
      '複数AZからアクセス可能で高可用。容量は自動で伸縮。',
      'ストレージクラス（Standard/IA）とライフサイクルでコスト最適化。',
      'Linux 向け NFS。Windows 共有は FSx。',
    ],
    exam: [
      '複数EC2で同じファイルを共有（NFS）→ EFS。',
      'Windows ファイル共有/高性能 → FSx。',
      '単一インスタンス専用ブロック → EBS。',
    ],
    related: ['ec2', 'fsx', 's3', 'datasync'],
  },
  'fsx': {
    summary: '用途特化のフルマネージド共有ファイルシステム。Windows File Server・Lustre・NetApp ONTAP・OpenZFS から選ぶ。',
    detail: [
      'FSx for Windows：SMB/Active Directory 統合の Windows 共有。',
      'FSx for Lustre：HPC/機械学習向けの超高速並列ファイルシステム。S3 連携。',
      'マネージドでバックアップ・高可用構成が容易。',
    ],
    exam: [
      'Windows(SMB/AD)共有 → FSx for Windows。',
      'HPC・大規模解析の高速FS → FSx for Lustre。',
      'Linux汎用NFS共有 → EFS。',
    ],
    related: ['efs', 'ec2', 's3', 'storage-gateway'],
  },
  'storage-gateway': {
    summary: 'オンプレミスから AWS ストレージ（S3/Glacier/EBS）へシームレスにアクセスするハイブリッドストレージのゲートウェイ。',
    detail: [
      'File Gateway（NFS/SMB→S3）、Volume Gateway（iSCSI）、Tape Gateway（仮想テープ）。',
      'ローカルにキャッシュしつつ実体はクラウドに保存。',
      'バックアップ・アーカイブ・段階的クラウド移行に活用。',
    ],
    exam: [
      'オンプレのアプリからAWSストレージへ常時接続 → Storage Gateway。',
      'オフラインの大量一括移行 → Snowball、オンライン同期 → DataSync。',
    ],
    related: ['s3', 'datasync', 'snowball', 'backup'],
  },

  /* ── データベース ── */
  'dynamodb': {
    summary: 'フルマネージドなサーバーレス NoSQL（キーバリュー/ドキュメント）。1桁ミリ秒・無制限スケール。',
    detail: [
      'スキーマレス。パーティションキー設計が性能の鍵。',
      'オンデマンド/プロビジョンドのキャパシティモード。',
      'DAX（インメモリキャッシュ）、Streams（変更検知→Lambda）、グローバルテーブル（マルチリージョン）。',
      'TTL で自動失効。バックアップ・PITR 対応。',
    ],
    exam: [
      '超高速・スキーマレス・無限スケール → DynamoDB。',
      'JOIN/トランザクション/SQL が必要 → RDS。',
      'Streams + Lambda でイベント駆動処理。',
    ],
    related: ['lambda', 'elasticache', 'kinesis', 's3'],
  },
  'rds': {
    summary: 'マネージドなリレーショナルDB（MySQL/PostgreSQL/MariaDB/Oracle/SQL Server）。パッチ・バックアップを自動化。',
    detail: [
      'マルチAZ配置で同期レプリカへ自動フェイルオーバー（高可用）。',
      'リードレプリカで読み取りスケール（非同期）。',
      '自動バックアップ・スナップショット・PITR。保管時暗号化（KMS）。',
    ],
    exam: [
      'SQL・ACIDトランザクション・JOIN → RDS。',
      'マルチAZ＝可用性、リードレプリカ＝読み取り性能（目的が違う）。',
      'より高性能・互換が欲しい → Aurora。',
    ],
    related: ['aurora', 'elasticache', 'ec2', 'kms-cloudhsm', 'backup'],
  },
  'aurora': {
    summary: 'MySQL/PostgreSQL 互換の高性能マネージドDB。3AZ×6コピーで高耐久、自動フェイルオーバー・自動拡張ストレージ。',
    detail: [
      'ストレージは10GB単位で自動拡張、3AZに6重複製。',
      '最大15のリードレプリカ、Aurora Serverless で需要に応じ自動増減。',
      'グローバルデータベースで低遅延クロスリージョン。',
    ],
    exam: [
      'RDS互換でより高性能・高可用 → Aurora。',
      'アクセス変動が大きく管理を最小化 → Aurora Serverless。',
    ],
    related: ['rds', 'elasticache', 'redshift'],
  },
  'redshift': {
    summary: 'ペタバイト級のデータウェアハウス。列指向・MPP で大規模分析クエリを高速実行する。',
    detail: [
      '列指向ストレージ＋並列処理（MPP）で集計が高速。',
      'Redshift Spectrum で S3 上のデータも直接クエリ。',
      'BI（QuickSight）や ETL（Glue）と連携。',
    ],
    exam: [
      'PB級データのDWH分析・BI → Redshift。',
      'アドホックに S3 をSQL分析（サーバーレス）→ Athena。',
    ],
    related: ['s3', 'glue', 'athena', 'quicksight', 'data-firehose'],
  },
  'elasticache': {
    summary: 'マネージドなインメモリキャッシュ（Redis/Memcached）。DB前段に置きミリ秒未満の応答とDB負荷軽減を実現。',
    detail: [
      'Redis：永続化・レプリケーション・Pub/Sub・高度なデータ型。',
      'Memcached：シンプル・マルチスレッドの揮発キャッシュ。',
      'セッションストアやリーダーボードにも利用。',
    ],
    exam: [
      'DBクエリ結果をキャッシュして高速化・負荷軽減 → ElastiCache。',
      '永続化/レプリカが必要 → Redis、単純キャッシュ → Memcached。',
    ],
    related: ['rds', 'aurora', 'dynamodb', 'memorydb'],
  },
  'memorydb': {
    summary: 'Redis 互換で「データベースとしての耐久性」を持つインメモリDB。超低遅延かつ永続化が必要な用途向け。',
    detail: [
      'マルチAZのトランザクションログで耐久性を確保。',
      'プライマリDBとして使えるインメモリストア（キャッシュ専用のElastiCacheと差別化）。',
    ],
    exam: [
      '超低遅延＋永続性をプライマリDBで → MemoryDB。',
      'キャッシュ用途 → ElastiCache。',
    ],
    related: ['elasticache', 'dynamodb'],
  },
  'neptune': {
    summary: 'フルマネージドなグラフデータベース。関係性（ソーシャル・推薦・不正検知・ナレッジグラフ）を高速にたどる。',
    detail: [
      'プロパティグラフ（Gremlin）と RDF（SPARQL）に対応。',
      'マルチAZ・リードレプリカで高可用。',
    ],
    exam: [
      '高度に連結した関係データを扱う → Neptune（グラフDB）。',
    ],
    related: ['dynamodb', 'rds'],
  },

  /* ── ネットワーキング ── */
  'vpc': {
    summary: 'AWS上の論理的に分離した仮想ネットワーク。サブネット・ルーティング・ゲートウェイ・FWを自分で設計する。',
    detail: [
      'パブリック/プライベートサブネットを AZ に分けて配置。',
      'IGW（インターネット接続）、NAT GW（プライベートからの外向き）、ルートテーブルで制御。',
      'セキュリティグループ（ステートフル・インスタンス単位）と NACL（ステートレス・サブネット単位）。',
      'VPCピアリング/Transit Gateway/エンドポイントで接続を拡張。',
    ],
    exam: [
      'SG＝ステートフル/許可のみ、NACL＝ステートレス/許可と拒否。',
      'プライベートサブネットの外向き通信 → NAT Gateway。',
      'S3/DynamoDB へ閉域接続 → VPCゲートウェイエンドポイント。',
    ],
    related: ['ec2', 'elb', 'direct-connect-vpn', 'route53', 'waf-shield'],
  },
  'elb': {
    summary: 'トラフィックを複数のターゲットに分散するロードバランサー。ALB/NLB/GWLB/CLB の4種がある。',
    detail: [
      'ALB：L7（HTTP/HTTPS）。パス/ホストベースルーティング、コンテナ向け。',
      'NLB：L4（TCP/UDP）。超低遅延・固定IP・高スループット。',
      'GWLB：サードパーティ仮想アプライアンス連携。',
      'ヘルスチェックで異常ターゲットを除外、マルチAZ分散。',
    ],
    exam: [
      'HTTPの高度なルーティング → ALB。',
      'TCP/UDP超低遅延・固定IP → NLB。',
      'Auto Scaling と組み合わせて高可用性を実現。',
    ],
    related: ['ec2', 'auto-scaling', 'ecs-fargate-eks', 'vpc', 'certificate-manager'],
  },
  'global-accelerator': {
    summary: 'AWSのグローバルネットワークと Anycast 固定IPで、世界中のユーザーから最寄りエッジ経由で低遅延・高可用に到達させる。',
    detail: [
      '2つの静的Anycast IPを提供し、最適なリージョン/エンドポイントへルーティング。',
      'ヘルスチェックで障害時に自動フェイルオーバー。',
      'TCP/UDP アプリのグローバル最適化に有効（CloudFrontはコンテンツ配信）。',
    ],
    exam: [
      'グローバルなTCP/UDPトラフィック最適化・固定IP → Global Accelerator。',
      '静的/動的コンテンツのキャッシュ配信 → CloudFront。',
    ],
    related: ['cloudfront', 'route53', 'elb'],
  },
  'cloudfront': {
    summary: '世界中のエッジロケーションからコンテンツを低遅延配信する CDN。静的/動的・ストリーミングに対応。',
    detail: [
      'オリジン（S3/EC2/ELB/オンプレ）のコンテンツをエッジにキャッシュ。',
      'WAF/Shield と連携し、HTTPS（ACM証明書）配信。',
      'OAC で S3 を非公開のまま CloudFront 経由で配信。',
    ],
    exam: [
      '世界中へ低遅延でコンテンツ配信（CDN）→ CloudFront。',
      'オリジンは S3/ELB/EC2/オンプレ。WAFで保護。',
    ],
    related: ['s3', 'route53', 'waf-shield', 'certificate-manager', 'global-accelerator'],
  },
  'route53': {
    summary: 'マネージド DNS。ドメイン登録・名前解決・ヘルスチェック・多彩なルーティングポリシーを提供（SLA 100%）。',
    detail: [
      'ルーティング：シンプル/加重/レイテンシー/位置情報/地理的近接性/複数値/フェイルオーバー。',
      'ヘルスチェックと連動し障害時に切替（高可用）。',
      'Alias レコードで CloudFront/ELB/S3 等を指定。',
    ],
    exam: [
      'フェイルオーバールーティング＋ヘルスチェックで可用性。',
      'レイテンシー/地理的近接性でグローバル最適化。',
    ],
    related: ['cloudfront', 'elb', 'vpc', 'global-accelerator'],
  },
  'direct-connect-vpn': {
    summary: 'オンプレミスと AWS をセキュアに接続。Direct Connect は専用線、VPN はインターネット上の暗号化トンネル。',
    detail: [
      'Direct Connect(DX)：専用線で安定・高帯域・低遅延（開通に時間とコスト）。',
      'AWS VPN：IPsecでインターネット上に暗号化トンネル。安価・短期間で開始。',
      'クライアントVPN（端末↔VPC）と Site-to-Site VPN（拠点↔VPC）。',
    ],
    exam: [
      '安定・高帯域の専用接続 → Direct Connect。',
      '手軽に暗号化接続 → VPN。DXのバックアップにVPN併用も定番。',
    ],
    related: ['vpc', 'datasync', 'storage-gateway'],
  },

  /* ── データ分析 ── */
  'kinesis': {
    summary: 'ストリーミングデータをリアルタイム収集・処理するサービス群（Data Streams / Video Streams）。',
    detail: [
      'Data Streams：プロデューサーが送信、コンシューマー（Lambda/Firehose/Flink）が処理。',
      'データ保持は既定24時間〜最長1年。シャードでスループット管理。',
      'IoT・ログ・クリックストリームのリアルタイム処理に。',
    ],
    exam: [
      'IoT/ログをリアルタイム収集・処理 → Kinesis。',
      '収集＝Data Streams、配信＝Data Firehose と役割を区別。',
    ],
    related: ['data-firehose', 'lambda', 's3', 'redshift', 'dynamodb'],
  },
  'data-firehose': {
    summary: 'ストリーミングデータを S3/Redshift/OpenSearch などへ簡単に配信（ロード）するフルマネージドサービス。',
    detail: [
      'プロデューサーから受信し、必要なら Lambda で変換後に配信。',
      'バッファリング・自動スケール・圧縮/暗号化に対応。',
      'シャード管理不要（Kinesis Data Streams との違い）。',
    ],
    exam: [
      'ストリームを S3/Redshift/OpenSearch へ配信 → Data Firehose。',
      '配信前に Lambda でデータ変換できる。',
    ],
    related: ['kinesis', 's3', 'redshift', 'lambda'],
  },
  'athena': {
    summary: 'S3 上のデータに標準SQLを実行できるサーバーレスなクエリサービス。スキャン量課金でインフラ管理不要。',
    detail: [
      'Glue データカタログのスキーマを使って S3 を直接分析。',
      'CSV/JSON/Parquet 等に対応。列指向/圧縮でコスト削減。',
      'ログ分析やアドホック分析に最適。',
    ],
    exam: [
      'S3のデータ/ログをサーバーレスでSQL分析 → Athena。',
      '課金はスキャンしたデータ量。Parquet+圧縮でコスト減。',
    ],
    related: ['s3', 'glue', 'quicksight', 'redshift'],
  },
  'glue': {
    summary: 'フルマネージドな ETL（抽出・変換・ロード）＋データカタログ。データ分析の前処理を担う。',
    detail: [
      'クローラがデータソースを走査しスキーマを自動推論→データカタログ登録。',
      'ジョブは Apache Spark 上で実行（Python/Scala）。',
      'Athena/Redshift/EMR から共有のカタログを参照。',
    ],
    exam: [
      'サーバーレスETL・データカタログ → Glue。',
      'クローラでカタログ化→Athenaで分析、が頻出の連携。',
    ],
    related: ['s3', 'athena', 'redshift', 'kinesis'],
  },
  'quicksight': {
    summary: 'マネージドな BI サービス。各種データソースからダッシュボード・グラフを作成・共有し可視化する。',
    detail: [
      'S3/Athena/Redshift/RDS 等に接続。SPICE インメモリエンジンで高速集計。',
      'インタラクティブなダッシュボードを共有・埋め込み。',
    ],
    exam: [
      'データを可視化・ダッシュボード化（BI）→ QuickSight。',
      'Athena/Redshift と連携して分析結果を可視化。',
    ],
    related: ['athena', 'redshift', 'glue', 's3'],
  },

  /* ── アプリケーション統合 ── */
  'sns': {
    summary: 'Pub/Sub 型の通知サービス。1つのメッセージを複数の購読者（Email/SMS/Lambda/SQS）へ同時にプッシュ配信。',
    detail: [
      'トピックに発行→購読者へファンアウト。発行者は購読者を意識しない（疎結合）。',
      'メッセージフィルタリング・暗号化に対応。',
      'SNS→SQS のファンアウトで並列処理が定番。',
    ],
    exam: [
      'プッシュ型・1対多の同時通知 → SNS。',
      'プル型キュー → SQS。両者を組み合わせて疎結合化。',
    ],
    related: ['sqs', 'lambda', 'eventbridge', 'cloudwatch'],
  },
  'sqs': {
    summary: 'プル型のメッセージキュー。コンポーネント間を非同期・疎結合にし、急なアクセス増を吸収（バッファ）する。',
    detail: [
      '標準キュー（高スループット・順序保証なし）と FIFO（順序保証・重複排除）。',
      '受信側が自分のタイミングで取得。可視性タイムアウト・DLQ で信頼性向上。',
      'SNS と組み合わせてファンアウト構成。',
    ],
    exam: [
      'アクセス増を吸収しバックエンドを保護 → SQS。',
      '順序保証/重複排除が必要 → FIFO。',
    ],
    related: ['sns', 'lambda', 'auto-scaling', 'step-functions'],
  },
  'eventbridge': {
    summary: 'イベント駆動の中核。AWSリソースの状態変化やスケジュール、SaaSイベントを契機に処理を起動するイベントバス。',
    detail: [
      'イベントソース→ルール→ターゲット（Lambda/SNS/SQS/Step Functions 等）。',
      'スケジューラで定時実行（cron 的）。',
      'SaaS/カスタムアプリのイベントも取り込み可能。',
    ],
    exam: [
      '状態変化やスケジュールで処理を自動起動 → EventBridge。',
      '旧称 CloudWatch Events。多数のAWSサービスと統合。',
    ],
    related: ['lambda', 'sns', 'sqs', 'step-functions', 'cloudwatch'],
  },
  'step-functions': {
    summary: '複数のAWSサービスをワークフローとして連携・オーケストレーションするサーバーレスサービス。',
    detail: [
      'Workflow Studio で視覚的に定義。状態（ステート）を管理。',
      '条件分岐・並列・リトライ・待機・人手承認を組み込める。',
      'Lambda/ECS/SNS 等を順序立てて実行。',
    ],
    exam: [
      '複数サービスを順序立てて連携・状態管理 → Step Functions。',
      '単発のイベント連携は EventBridge、非同期分散は SQS/SNS。',
    ],
    related: ['lambda', 'eventbridge', 'sqs', 'ecs-fargate-eks'],
  },

  /* ── 監視・管理 ── */
  'cloudwatch': {
    summary: 'AWS/アプリのメトリクス・ログ・イベントを収集し、監視・可視化・アラーム・自動対応を行う監視の中核。',
    detail: [
      'メトリクス（CPU等）・Logs・Alarms・Dashboards・Synthetics。',
      'アラームから Auto Scaling や SNS 通知をトリガー。',
      'カスタムメトリクス（メモリ等）はエージェントで取得。',
    ],
    exam: [
      'パフォーマンス監視・ログ・アラーム → CloudWatch。',
      '「誰が何をしたか」のAPI監査は CloudTrail（役割が違う）。',
    ],
    related: ['cloudtrail', 'auto-scaling', 'sns', 'x-ray', 'eventbridge'],
  },
  'cloudtrail': {
    summary: 'AWS アカウント内の API 呼び出し・操作履歴を記録する監査ログサービス。「誰が・いつ・何を」を追跡。',
    detail: [
      '管理イベント/データイベントを記録し S3 に保存。',
      '組織証跡で複数アカウントを一括記録。',
      'ログ改ざん検知、CloudWatch Logs 連携で監視。',
    ],
    exam: [
      'API監査・操作履歴・コンプライアンス → CloudTrail。',
      'リソース設定の変更追跡・準拠評価は Config。',
    ],
    related: ['cloudwatch', 'aws-config', 's3', 'security-services'],
  },
  'x-ray': {
    summary: 'アプリの分散トレーシング。リクエストの経路・処理時間を可視化し、ボトルネックやエラー箇所を特定する。',
    detail: [
      'サービスマップでマイクロサービス間の呼び出しを可視化。',
      'Lambda/API Gateway/ECS 等のパフォーマンス分析。',
      'CloudWatch と組み合わせて可観測性を高める。',
    ],
    exam: [
      'アプリの遅延/エラー箇所を特定（分散トレーシング）→ X-Ray。',
    ],
    related: ['cloudwatch', 'lambda', 'ecs-fargate-eks'],
  },
  'cloudformation': {
    summary: 'インフラをコード（テンプレート）で定義・自動構築する IaC サービス。再現性のある環境を宣言的に管理。',
    detail: [
      'テンプレート（YAML/JSON）→スタックとしてリソースを一括作成/更新/削除。',
      '変更セットで影響を事前確認。ドリフト検出で乖離を検知。',
      'StackSets で複数アカウント/リージョンへ展開。',
    ],
    exam: [
      'インフラのコード化・再現可能な自動構築 → CloudFormation。',
      'アプリ寄りの自動構成は Elastic Beanstalk（裏でCFN利用）。',
    ],
    related: ['systems-manager', 'control-tower', 'developer-tools', 'elastic-beanstalk'],
  },
  'aws-config': {
    summary: 'AWSリソースの構成変更を継続記録し、あるべき設定（ルール）への準拠を評価・是正するサービス。',
    detail: [
      '構成履歴・関係性を記録。Config ルールで非準拠を検出。',
      '自動修復（SSM Automation）で是正。',
      'ガバナンス・コンプライアンス監査に活用。',
    ],
    exam: [
      'リソース設定の変更追跡・準拠チェック → Config。',
      'API操作の監査は CloudTrail（区別）。',
    ],
    related: ['cloudtrail', 'systems-manager', 'control-tower', 'audit-manager'],
  },
  'systems-manager': {
    summary: '運用管理の統合サービス（SSM）。パッチ適用・コマンド実行・パラメータ管理・セッション接続を一元化。',
    detail: [
      'Patch Manager/Run Command/Automation で運用を自動化。',
      'Parameter Store で設定/機密を安全に保管。',
      'Session Manager で踏み台不要のシェル接続。',
    ],
    exam: [
      'SSH/踏み台なしで安全に接続 → Session Manager。',
      '設定値の集中管理 → Parameter Store（機密ローテーションは Secrets Manager）。',
    ],
    related: ['ec2', 'aws-config', 'cloudformation', 'secrets-manager'],
  },
  'backup': {
    summary: '複数のAWSサービスのバックアップを一元的にポリシーで管理・自動化するフルマネージドサービス。',
    detail: [
      'EBS/EFS/RDS/DynamoDB/Storage Gateway 等を横断管理。',
      'バックアップ計画（頻度・保持・コピー先）を集中設定。',
      'クロスリージョン/クロスアカウントコピーで災害対策。',
    ],
    exam: [
      '複数サービスのバックアップを一元管理・自動化 → AWS Backup。',
    ],
    related: ['ebs', 'efs', 'rds', 'dynamodb', 'storage-gateway'],
  },
  'health-dashboard': {
    summary: 'AWS のサービス稼働状況と、自分のリソースに影響するイベントを通知する正常性ダッシュボード。',
    detail: [
      'Service Health（全体）と Account Health（自分への影響）。',
      'メンテナンス・障害・予定イベントを把握し対応計画に。',
    ],
    exam: [
      '自分のリソースに影響するAWS側イベントの把握 → Health Dashboard。',
    ],
    related: ['cloudwatch', 'trusted-advisor', 'support'],
  },
  'trusted-advisor': {
    summary: 'コスト最適化・パフォーマンス・セキュリティ・耐障害性・サービス上限の5カテゴリでベストプラクティス診断する。',
    detail: [
      'チェック結果を推奨事項として提示。',
      '全チェックの利用はビジネス以上のサポートプランが必要。',
    ],
    exam: [
      'ベストプラクティスとの乖離を自動診断 → Trusted Advisor。',
      '全機能はビジネス/エンタープライズサポート。',
    ],
    related: ['cost-explorer', 'compute-optimizer', 'support', 'security-services'],
  },
  'cost-explorer': {
    summary: 'コストと使用量を可視化・分析し、将来予測やRI/Savings Plans の推奨を得るコスト管理ツール。',
    detail: [
      '時系列・サービス別・タグ別にコストを分解。',
      'AWS Budgets で予算超過アラート。',
      'Pricing Calculator で事前見積もり。',
    ],
    exam: [
      '過去コストの可視化・将来予測 → Cost Explorer。',
      '予算超過アラート → AWS Budgets。',
    ],
    related: ['trusted-advisor', 'compute-optimizer', 'ec2-purchase-options'],
  },
  'compute-optimizer': {
    summary: '機械学習で EC2/EBS/Lambda/ASG の使用状況を分析し、最適なリソースサイズ（ライトサイジング）を推奨する。',
    detail: [
      '過負荷/過剰プロビジョニングを検出し推奨を提示。',
      'コスト削減と性能改善の両立を支援。',
    ],
    exam: [
      'リソースの適切なサイジング推奨 → Compute Optimizer。',
    ],
    related: ['ec2', 'cost-explorer', 'trusted-advisor', 'ec2-purchase-options'],
  },

  /* ── セキュリティ・認証 ── */
  'iam': {
    summary: 'AWSリソースへのアクセスを管理する認証・認可の基盤。ユーザー/グループ/ロール/ポリシーと Organizations による統制。',
    detail: [
      '最小権限の原則。ロールで一時権限を委譲（EC2/Lambda/クロスアカウント）。',
      'MFA で多要素認証。ポリシーは JSON で許可/拒否を定義。',
      'Organizations + SCP で組織全体のガードレール。',
    ],
    exam: [
      'EC2等にはアクセスキーでなく IAM ロールを付与。',
      '組織横断の権限上限 → SCP（Organizations）。',
      '最小権限・MFA が基本。',
    ],
    related: ['sts', 'iam-identity-center', 'control-tower', 'kms-cloudhsm', 'cognito'],
  },
  'waf-shield': {
    summary: 'Webアプリ保護。WAF が L7 攻撃（SQLi/XSS/ボット）を防ぎ、Shield が DDoS から保護する。',
    detail: [
      'WAF：マネージドルール/カスタムルール、レート制限。CloudFront/ALB/API GW に適用。',
      'Shield Standard：自動・無料の基本DDoS防御。',
      'Shield Advanced：高度なDDoS防御・コスト保護・専門支援（有料）。',
    ],
    exam: [
      'SQLi/XSS/ボット対策 → WAF。',
      'DDoS防御 → Shield（標準は自動、Advancedは有料で高度）。',
    ],
    related: ['cloudfront', 'elb', 'route53', 'security-services'],
  },
  'kms-cloudhsm': {
    summary: '暗号鍵の管理。KMS はマネージドな鍵管理（多くのサービスと統合）、CloudHSM は専有ハードウェア(HSM)。',
    detail: [
      'KMS：S3/EBS/RDS 等の暗号化に統合。鍵ローテーション・きめ細かな権限。',
      'CloudHSM：単一テナントのHSMで鍵を完全管理（FIPS要件等）。',
      'CMK（カスタマー管理キー）でアクセスと監査を制御。',
    ],
    exam: [
      '保管時暗号化の鍵管理 → KMS。',
      '専有HSM・厳格なコンプライアンス → CloudHSM。',
    ],
    related: ['s3', 'ebs', 'rds', 'secrets-manager', 'certificate-manager'],
  },
  'secrets-manager': {
    summary: 'DB認証情報やAPIキーなどの機密を安全に保管し、自動ローテーションするサービス。',
    detail: [
      '機密の暗号化保管（KMS）とアプリからの安全な取得。',
      'RDS 等の認証情報を自動ローテーション。',
      'Parameter Store より機密管理に特化（ローテーション内蔵）。',
    ],
    exam: [
      'DBパスワード等の機密を保管＋自動ローテーション → Secrets Manager。',
      '単純な設定値は SSM Parameter Store。',
    ],
    related: ['rds', 'kms-cloudhsm', 'systems-manager', 'iam'],
  },
  'certificate-manager': {
    summary: 'SSL/TLS 証明書を無料で発行・管理・自動更新する（ACM）。HTTPS化の手間を削減。',
    detail: [
      'ELB/CloudFront/API Gateway に証明書を関連付け。',
      'パブリック証明書は自動更新。プライベートCAも提供。',
    ],
    exam: [
      'HTTPS用のSSL/TLS証明書を無料・自動更新 → ACM。',
      'ALB/CloudFront と統合して配信を暗号化。',
    ],
    related: ['cloudfront', 'elb', 'route53'],
  },
  'cognito': {
    summary: 'Web/モバイルアプリのユーザー認証とアクセス制御。サインインと、AWSリソースへの一時権限付与を担う。',
    detail: [
      'ユーザープール：認証（サインアップ/イン）。外部IdP(Google等)フェデレーション、JWT発行。',
      'IDプール：認証済みユーザーに STS の一時認証情報を発行（IAMロール割当）。',
      '数千万ユーザー規模に対応。',
    ],
    exam: [
      'アプリ利用者の認証（大規模）→ Cognito。',
      'ユーザープール＝認証、IDプール＝AWSリソースへの一時認証情報。',
    ],
    related: ['iam', 'sts', 'lambda', 'amplify'],
  },
  'sts': {
    summary: '一時的なセキュリティ認証情報を発行するサービス。AssumeRole・クロスアカウント・フェデレーションの基盤。',
    detail: [
      '有効期限付き認証情報で長期キーの配布を回避。',
      'ロールの引き受け（AssumeRole）でクロスアカウントアクセス。',
      '外部IdP/LDAP連携のフェデレーションに利用。',
    ],
    exam: [
      '一時認証情報の発行・クロスアカウント → STS。',
      'Cognito IDプールも内部でSTSを利用。',
    ],
    related: ['iam', 'cognito', 'iam-identity-center'],
  },
  'iam-identity-center': {
    summary: '複数のAWSアカウント/SaaSへのSSO（シングルサインオン）を一元管理（旧 AWS SSO）。Organizations と連携。',
    detail: [
      '一度の認証で複数アカウント/アプリへアクセス。',
      'SAML2.0外部IdP・Active Directory(Directory Service)と統合。',
      '権限セットでアカウント横断の権限を割当。',
    ],
    exam: [
      '複数AWSアカウント/SaaSへのSSO一元管理 → IAM Identity Center。',
      'Organizations と連携、SAML/AD統合。',
    ],
    related: ['iam', 'sts', 'control-tower', 'cognito'],
  },
  'security-services': {
    summary: '脅威検出・脆弱性評価・機密データ検出・統合管理を担う検出系サービス群（Macie/GuardDuty/Inspector/Security Hub）。',
    detail: [
      'Macie：S3内の機密データ(PII)を検出・分類。',
      'GuardDuty：脅威・不正アクティビティを継続検知。',
      'Inspector：EC2/コンテナ等の脆弱性スキャン。',
      'Security Hub：各種結果を集約・一元管理。',
    ],
    exam: [
      'S3機密データ→Macie / 脅威検知→GuardDuty / 脆弱性→Inspector / 集約→Security Hub。',
    ],
    related: ['cloudtrail', 'aws-config', 'waf-shield', 's3'],
  },

  /* ── ガバナンス・コンプライアンス ── */
  'control-tower': {
    summary: 'マルチアカウント環境を「ランディングゾーン」としてベストプラクティス構成で自動セットアップ・統制する。',
    detail: [
      'Organizations・SCP・Config・CloudTrail をまとめて設計。',
      'ガードレール（予防/発見的統制）で準拠を強制。',
      'Account Factory で標準化したアカウントを払い出し。',
    ],
    exam: [
      '複数アカウントを一括で安全に立ち上げ・統制 → Control Tower。',
      'SSOは IAM Identity Center、監査は CloudTrail/Config。',
    ],
    related: ['iam', 'iam-identity-center', 'aws-config', 'cloudtrail', 'audit-manager'],
  },
  'artifact': {
    summary: 'AWS のコンプライアンス報告書（SOC/ISO/PCI 等）をオンデマンドで入手できるポータル。',
    detail: [
      '第三者監査レポートや契約（BAA等）をダウンロード。',
      '監査・コンプライアンス対応の証跡として利用。',
    ],
    exam: [
      'AWSの監査報告書/コンプライアンス文書を入手 → Artifact。',
    ],
    related: ['audit-manager', 'aws-config'],
  },
  'audit-manager': {
    summary: '監査の証跡収集を自動化し、コンプライアンスフレームワーク（PCI/HIPAA等）への準拠評価を支援する。',
    detail: [
      'フレームワークに沿って証拠を継続収集。',
      '監査レポートを生成し、監査準備を効率化。',
    ],
    exam: [
      '監査証跡の収集自動化・準拠評価 → Audit Manager。',
      'AWS側の報告書入手は Artifact（区別）。',
    ],
    related: ['artifact', 'aws-config', 'cloudtrail', 'control-tower'],
  },
  'marketplace': {
    summary: 'サードパーティのソフトウェア（AMI/SaaS/コンテナ等）を検索・購入・デプロイできるデジタルカタログ。',
    detail: [
      'AWS請求に統合された課金。従量/サブスク等の価格モデル。',
      '検証済みの製品を迅速に調達・展開。',
    ],
    exam: [
      'サードパーティ製品を調達しAWS請求に統合 → Marketplace。',
    ],
    related: ['ec2', 'managed-services'],
  },
  'managed-services': {
    summary: 'AWS Managed Services(AMS)。本番環境の運用（監視・パッチ・インシデント対応等）をAWSが代行する。',
    detail: [
      'エンタープライズの運用負荷を軽減し、ガバナンスを維持。',
      'ベストプラクティスに沿った運用をアウトソース。',
    ],
    exam: [
      '本番運用をAWSに任せ運用負荷を軽減 → AMS。',
    ],
    related: ['support', 'systems-manager', 'control-tower'],
  },
  'support': {
    summary: 'AWSサポートプラン（ベーシック/開発者/ビジネス/エンタープライズOn-Ramp/エンタープライズ）。技術支援の範囲が異なる。',
    detail: [
      'ベーシック：無料。ドキュメント/一部Trusted Advisor。',
      'ビジネス以上：24/365の電話・チャット、全Trusted Advisor、Health API。',
      'エンタープライズ：専任TAM・コンシェルジュ。',
    ],
    exam: [
      '24/365の電話・チャットサポート → ビジネス以上。',
      '専任TAM → エンタープライズ。',
    ],
    related: ['trusted-advisor', 'health-dashboard', 'managed-services'],
  },

  /* ── 移行・転送 ── */
  'migration-tools': {
    summary: 'AWS移行を支援するツール群（ADS/DMS/MGN/Migration Hub）と移行戦略「7R」。',
    detail: [
      'ADS：現状把握（構成・依存関係の収集）。Migration Hub：進捗の一元管理。',
      'DMS：DB移行（異種エンジン間も。CDCで継続レプリケーション）。',
      'MGN：サーバー全体のリフト&シフト移行。',
      '7R：Retire/Retain/Rehost/Relocate/Repurchase/Replatform/Refactor。',
    ],
    exam: [
      'DB移行→DMS、サーバー移行→MGN、現状把握→ADS、進捗→Migration Hub。',
      'リフト&シフト＝Rehost。',
    ],
    related: ['datasync', 'snowball', 'storage-gateway', 'rds'],
  },
  'datasync': {
    summary: 'オンプレミス⇔AWS、AWS間でのオンラインデータ移行・同期を高速・安全に行うマネージドサービス。',
    detail: [
      'S3/EFS/FSx へ転送。オンプレは NFS/SMB/HDFS 対応。',
      'SSL/TLS暗号化・中断再開・メタデータ保持・増分同期。',
      'オンプレ利用時は DataSync エージェントを導入。',
    ],
    exam: [
      'オンライン高速転送・継続同期（NFS/SMB→S3/EFS/FSx）→ DataSync。',
      'オフライン大量一括 → Snowball、常時接続 → Storage Gateway。',
    ],
    related: ['s3', 'efs', 'fsx', 'snowball', 'storage-gateway', 'direct-connect-vpn'],
  },
  'snowball': {
    summary: '物理デバイスで大容量データをオフライン移行するサービス。ネットワークでは時間がかかる場合に有効。',
    detail: [
      'デバイスにデータを取り込み→AWSへ郵送→S3に保存。',
      'Storage最適化（大容量移行）と Compute最適化（エッジ処理）。',
      'クラスタ構成で並行取り込み・耐障害性向上。',
    ],
    exam: [
      '大容量データを物理デバイスでオフライン移行 → Snowball。',
      'オンライン可能なら DataSync を優先。',
    ],
    related: ['s3', 'datasync', 'storage-gateway', 'migration-tools'],
  },

  /* ── 開発者ツール ── */
  'developer-tools': {
    summary: 'CI/CD を実現する Code シリーズ（CodeCommit/CodeBuild/CodeDeploy/CodePipeline）。',
    detail: [
      'CodeCommit：マネージドGitリポジトリ。',
      'CodeBuild：ビルド/テスト。CodeDeploy：デプロイ自動化。',
      'CodePipeline：一連の流れをオーケストレーション。',
    ],
    exam: [
      'CI/CDパイプライン構築 → CodePipeline。',
      'IaCは CloudFormation と組み合わせる。',
    ],
    related: ['cloudformation', 'cloud9', 'lambda', 'ecs-fargate-eks'],
  },
  'cloud9': {
    summary: 'ブラウザで使えるクラウド統合開発環境(IDE)。共同編集や Lambda のサーバーレス開発に向く。',
    detail: [
      'ローカル環境構築不要でコード記述・実行・デバッグ。',
      'チームでのリアルタイム共同編集。',
      'AWS CLI/Lambda と統合。',
    ],
    exam: [
      'ブラウザのクラウドIDE → Cloud9。',
    ],
    related: ['developer-tools', 'lambda', 'amplify'],
  },
  'amplify': {
    summary: 'Web/モバイルのフルスタック開発プラットフォーム。認証・API・DB・ホスティング・CI/CD を統合提供。',
    detail: [
      'バックエンド（Cognito/API/DB/ストレージ）を簡単構築。',
      '静的サイト/SPA のホスティングと Git 連携の自動デプロイ。',
      'React/Next.js 等から容易に組込み。',
    ],
    exam: [
      'Web/モバイルのフロント＋バックを素早く構築・公開 → Amplify。',
      '認証は Cognito、配信はCDN。',
    ],
    related: ['cognito', 'app-runner', 'lambda', 'cloud9'],
  },

  /* ── 機械学習・AI ── */
  'ml-ai': {
    summary: 'フルマネージドなAIサービス群。専門知識なしで翻訳・音声・画像・文書・チャットボット・検索を利用できる。',
    detail: [
      '言語：Comprehend(解析)/Translate(翻訳)。音声：Transcribe(音声→文字)/Polly(文字→音声)。',
      '画像/動画：Rekognition。文書OCR：Textract。会話：Lex。企業内検索：Kendra。',
      'いずれもAPIで既存アプリに組込み可能。',
    ],
    exam: [
      '翻訳→Translate / 音声認識→Transcribe / 読み上げ→Polly。',
      '画像分析→Rekognition / OCR→Textract / チャットボット→Lex / 検索→Kendra。',
    ],
    related: ['s3', 'lambda', 'kinesis'],
  },

  /* ── エンドユーザー / ハイブリッド ── */
  'workspaces': {
    summary: 'クラウド上の仮想デスクトップ(DaaS)。どこからでも安全にデスクトップ環境へアクセスできる。',
    detail: [
      'マネージドな Windows/Linux デスクトップを払い出し。',
      'データは端末でなくクラウドに保持しセキュア。',
      'リモートワーク・短期プロジェクトに有効。',
    ],
    exam: [
      'マネージド仮想デスクトップ(DaaS) → WorkSpaces。',
      'アプリ単体のストリーミングは AppStream 2.0。',
    ],
    related: ['appstream', 'vpc', 'iam-identity-center'],
  },
  'appstream': {
    summary: 'デスクトップアプリをブラウザにストリーミング配信するマネージドサービス。',
    detail: [
      'アプリ本体はAWS側で実行し、画面だけを配信。',
      '端末にインストール不要で、重いアプリも軽量端末で利用。',
    ],
    exam: [
      'アプリ単体をブラウザにストリーミング → AppStream 2.0。',
      'デスクトップ全体は WorkSpaces。',
    ],
    related: ['workspaces', 's3'],
  },
  'outposts': {
    summary: 'AWSのインフラ（ラック/サーバー）をオンプレミスに設置し、AWSと同じAPIでハイブリッド運用する。',
    detail: [
      '低遅延・データ所在地要件・オンプレ統合が必要なワークロード向け。',
      'EC2/EBS/一部サービスをオンプレで実行し、リージョンと一体管理。',
    ],
    exam: [
      '低遅延/データ所在地要件でオンプレにAWSを置く → Outposts。',
    ],
    related: ['ec2', 'vpc', 'wavelength', 'direct-connect-vpn'],
  },
  'wavelength': {
    summary: '5GネットワークのエッジにAWSを展開し、モバイル端末向けに超低遅延アプリを提供する。',
    detail: [
      'キャリアの5G網内にコンピューティングを配置。',
      'AR/VR・ゲーム・リアルタイム処理など超低遅延用途。',
    ],
    exam: [
      '5Gモバイル向けの超低遅延 → Wavelength。',
      'オンプレ統合は Outposts、CDNは CloudFront（区別）。',
    ],
    related: ['outposts', 'vpc', 'global-accelerator'],
  },

};
