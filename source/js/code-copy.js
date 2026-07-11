(function () {
  'use strict';

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      var copied = document.execCommand('copy');
      textarea.remove();
      copied ? resolve() : reject(new Error('Copy command failed'));
    });
  }

  function enhance(root) {
    var scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll('pre, figure.highlight').forEach(function (container) {
      if (container.dataset.copyReady === 'true') return;
      var code = container.matches('figure.highlight')
        ? container.querySelector('.code')
        : container.querySelector('code');
      if (!code) return;

      container.dataset.copyReady = 'true';
      var button = document.createElement('button');
      button.className = 'copy-code-button';
      button.type = 'button';
      button.textContent = '复制';
      button.setAttribute('aria-label', '复制代码');
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        copyText(code.innerText).then(function () {
          button.textContent = '已复制';
          button.dataset.state = 'copied';
          window.setTimeout(function () {
            button.textContent = '复制';
            delete button.dataset.state;
          }, 1600);
        }).catch(function () {
          button.textContent = '复制失败';
        });
      });
      container.appendChild(button);
    });
  }

  function start() {
    var app = document.body;
    enhance(app);
    new MutationObserver(function (records) {
      records.forEach(function (record) {
        record.addedNodes.forEach(function (node) {
          if (node.nodeType === Node.ELEMENT_NODE) enhance(node);
        });
      });
    }).observe(app, { childList: true, subtree: true });
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', start, { once: true })
    : start();
})();
