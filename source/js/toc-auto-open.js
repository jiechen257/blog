(function () {
  var DESKTOP_QUERY = '(min-width: 992px)';
  var lastOpenedPath = '';

  function isDesktop() {
    return window.matchMedia && window.matchMedia(DESKTOP_QUERY).matches;
  }

  function isPostLikePath() {
    return /^\/post\//.test(location.pathname);
  }

  function tryOpenToc() {
    if (!isDesktop() || !isPostLikePath()) return;
    if (lastOpenedPath === location.pathname) return;

    var tocButton = document.querySelector('.iκ-toc');
    if (!tocButton) return;

    lastOpenedPath = location.pathname;
    tocButton.click();
  }

  function scheduleTryOpen() {
    setTimeout(tryOpenToc, 80);
    setTimeout(tryOpenToc, 240);
    setTimeout(tryOpenToc, 480);
  }

  function onRouteChange() {
    if (lastOpenedPath !== location.pathname) {
      scheduleTryOpen();
    }
  }

  var rawPushState = history.pushState;
  var rawReplaceState = history.replaceState;

  history.pushState = function () {
    rawPushState.apply(this, arguments);
    onRouteChange();
  };

  history.replaceState = function () {
    rawReplaceState.apply(this, arguments);
    onRouteChange();
  };

  window.addEventListener('popstate', onRouteChange, { passive: true });
  window.addEventListener('hashchange', onRouteChange, { passive: true });
  window.addEventListener('load', scheduleTryOpen, { passive: true });

  document.addEventListener('click', function () {
    onRouteChange();
  }, { passive: true });
})();
