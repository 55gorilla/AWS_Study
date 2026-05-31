/* AWS 資格学習ポータル — 簡易パスワードゲート（auth.js）
 *
 * ⚠️ これはカジュアルな限定公開用の簡易ゲートです（本格的なセキュリティではありません）。
 *    ソースは閲覧可能なため、技術的には突破され得ます。
 *
 * パスワードの変更方法（運用ガイド.md 参照）：
 *   1. ターミナルで新パスワードの SHA-256 を生成
 *      echo -n 'あなたの新パスワード' | shasum -a 256
 *   2. 下の PASSWORD_HASH を、出力された64桁の16進文字列に置き換える
 *   3. git add -A && git commit -m "change password" && git push
 */
(function () {
  'use strict';

  // 正解パスワードの SHA-256 ハッシュ（平文は埋め込まない）
  var PASSWORD_HASH = '4b7a412d8c22d4f2e022eef91415c4ab62c10d57aee9ac175f326d6ae2bab9ac';

  var FLAG = 'awsPortalAuthed';

  // 認証済みなら何もしない（チラ見せ・遅延なし）
  try {
    if (localStorage.getItem(FLAG) === '1') return;
  } catch (e) { /* localStorage不可環境はゲートのみ動作 */ }

  // 認証前は全体を隠す（CSS読込前でも確実に隠すため documentElement に直接指定）
  var rootEl = document.documentElement;
  rootEl.style.visibility = 'hidden';

  function sha256Hex(str) {
    var buf = new TextEncoder().encode(str);
    return crypto.subtle.digest('SHA-256', buf).then(function (hash) {
      var bytes = new Uint8Array(hash);
      var hex = '';
      for (var i = 0; i < bytes.length; i++) {
        hex += bytes[i].toString(16).padStart(2, '0');
      }
      return hex;
    });
  }

  function buildGate() {
    // オーバーレイ（スタイルはCSS非依存のインライン指定）
    var overlay = document.createElement('div');
    overlay.id = 'authGate';
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:99999',
      'background:linear-gradient(135deg,#232F3E,#16202C)',
      'display:flex', 'align-items:center', 'justify-content:center',
      'padding:20px',
      "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif"
    ].join(';');

    var box = document.createElement('div');
    box.style.cssText = [
      'background:#fff', 'border-radius:14px', 'padding:30px 28px',
      'width:100%', 'max-width:360px',
      'box-shadow:0 12px 40px rgba(0,0,0,.35)', 'text-align:center'
    ].join(';');

    box.innerHTML =
        '<div style="font-size:34px;line-height:1;margin-bottom:10px">🔐</div>'
      + '<div style="font-size:18px;font-weight:700;color:#16191F;margin-bottom:6px">AWS 資格学習ポータル</div>'
      + '<div style="font-size:13px;color:#6B7280;margin-bottom:18px">パスワードを入力してください</div>'
      + '<input id="authPw" type="password" autocomplete="current-password" '
      +   'style="width:100%;border:1.5px solid #E2E8F0;border-radius:8px;padding:11px 13px;'
      +   'font-size:15px;outline:none;margin-bottom:10px;box-sizing:border-box" placeholder="パスワード">'
      + '<div id="authErr" style="display:none;color:#DC2626;font-size:12px;margin-bottom:10px">'
      +   'パスワードが違います</div>'
      + '<button id="authBtn" type="button" '
      +   'style="width:100%;border:none;border-radius:8px;padding:12px;background:#FF9900;color:#fff;'
      +   'font-size:15px;font-weight:700;cursor:pointer">ログイン</button>'
      + '<div style="font-size:11px;color:#9CA3AF;margin-top:14px;line-height:1.6">'
      +   '🔒 認証状態はこの端末にのみ保存されます</div>';

    overlay.appendChild(box);
    document.body.appendChild(overlay);
    // オーバーレイ自体は表示する（隠しているのは元コンテンツ）
    rootEl.style.visibility = '';
    overlay.style.visibility = 'visible';

    var pw  = box.querySelector('#authPw');
    var btn = box.querySelector('#authBtn');
    var err = box.querySelector('#authErr');
    pw.focus();

    function submit() {
      var val = pw.value;
      if (!val) { pw.focus(); return; }
      sha256Hex(val).then(function (hex) {
        if (hex === PASSWORD_HASH.toLowerCase()) {
          try { localStorage.setItem(FLAG, '1'); } catch (e) {}
          overlay.remove();
          rootEl.style.visibility = '';
        } else {
          err.style.display = 'block';
          pw.value = '';
          pw.focus();
        }
      });
    }

    btn.addEventListener('click', submit);
    pw.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); submit(); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildGate);
  } else {
    buildGate();
  }
})();
