(function () {
  'use strict';

  var openedPath = '';

  function shouldOpen() {
    return window.matchMedia('(min-width: 992px)').matches && /^\/post\//.test(location.pathname);
  }

  function openWhenReady() {
    if (!shouldOpen() || openedPath === location.pathname) return;
    var app = document.body;

    function open() {
      var button = document.querySelector('.iκ-toc');
      if (!button) return false;
      openedPath = location.pathname;
      button.click();
      return true;
    }

    if (open()) return;
    var observer = new MutationObserver(function () {
      if (open()) observer.disconnect();
    });
    observer.observe(app, { childList: true, subtree: true });
    window.setTimeout(function () { observer.disconnect(); }, 2500);
  }

  window.addEventListener('inside:navigation', openWhenReady, { passive: true });
  window.addEventListener('popstate', openWhenReady, { passive: true });
  window.addEventListener('resize', openWhenReady, { passive: true });
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', openWhenReady, { once: true })
    : openWhenReady();
})();
