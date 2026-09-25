
// 「下载」→ 开弹窗；「我已付款」→ 站内显示网盘链接。就这么点逻辑，不引任何库。
(function () {
  var mask = document.getElementById('mask');
  if (!mask) return;
  function open() { mask.classList.add('on'); }
  function close() { mask.classList.remove('on'); }

  document.querySelectorAll('[data-open]').forEach(function (b) {
    b.addEventListener('click', open);
  });
  mask.addEventListener('click', function (e) { if (e.target === mask) close(); });
  var x = mask.querySelector('.x');
  if (x) x.addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  var rv = document.getElementById('reveal'), dl = document.getElementById('dl');
  if (rv && dl) rv.addEventListener('click', function () {
    dl.hidden = false; rv.hidden = true;
    dl.scrollIntoView({ block: 'nearest' });
  });

  // 复制：优先 clipboard API，file:// 下被拦就退回「选中让用户自己按 Ctrl+C」
  function copy(text, btn) {
    var old = btn.textContent;
    function done(ok) {
      btn.textContent = ok ? '已复制' : '请手动复制';
      setTimeout(function () { btn.textContent = old; }, 1500);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { done(true); },
                                               function () { done(false); });
      return;
    }
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    done(ok);
  }
  document.querySelectorAll('[data-copy],[data-text]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var sel = btn.getAttribute('data-copy');
      var el = sel ? document.querySelector(sel) : null;
      copy(el ? (el.value || el.textContent) : btn.getAttribute('data-text'), btn);
    });
  });
})();
