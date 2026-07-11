(function () {
  'use strict';

  var cachedPosts;

  function isListingPage() {
    return /^(?:\/(?:tech)?\/?|\/page\/\d+\/?|\/tech\/page\/\d+\/?)$/.test(location.pathname);
  }

  function loadPosts() {
    if (cachedPosts) return Promise.resolve(cachedPosts);
    return fetch('/api/cGFnZQ.json', { credentials: 'same-origin' })
      .then(function (response) {
        if (!response.ok) throw new Error('Post metadata request failed');
        return response.json();
      })
      .then(function (payload) {
        cachedPosts = payload && Array.isArray(payload.data) ? payload.data : [];
        return cachedPosts;
      });
  }

  function markCards(posts) {
    var remaining = 0;
    posts.filter(function (post) { return post.reprinted && post.link; }).forEach(function (post) {
      var links = document.querySelectorAll('a[href="' + post.link + '"], a[href$="' + post.link + '"]');
      if (!links.length) remaining += 1;
      links.forEach(function (link) {
        var card = link.closest('is-i');
        if (!card || card.dataset.reprinted === 'true') return;
        card.dataset.reprinted = 'true';
        card.classList.add('reprinted-post');
        var badge = document.createElement('span');
        badge.className = 'reprinted-badge';
        badge.textContent = '转载';
        badge.setAttribute('aria-label', '转载文章');
        card.appendChild(badge);
      });
    });
    return remaining;
  }

  function refresh() {
    if (!isListingPage()) return;
    loadPosts().then(function (posts) {
      if (markCards(posts) === 0) return;
      var app = document.body;
      var observer = new MutationObserver(function () {
        if (markCards(posts) === 0) observer.disconnect();
      });
      observer.observe(app, { childList: true, subtree: true });
      window.setTimeout(function () { observer.disconnect(); }, 3000);
    }).catch(function () {
      /* The badge is optional; content remains fully available. */
    });
  }

  function emitNavigation() {
    window.dispatchEvent(new Event('inside:navigation'));
  }

  ['pushState', 'replaceState'].forEach(function (method) {
    var original = history[method];
    history[method] = function () {
      var result = original.apply(this, arguments);
      emitNavigation();
      return result;
    };
  });

  window.addEventListener('popstate', emitNavigation, { passive: true });
  window.addEventListener('inside:navigation', refresh, { passive: true });
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', refresh, { once: true })
    : refresh();
})();
