// 转载标识功能 - 右上角角标
(function() {
  'use strict';
  
  // 等待页面加载完成
  function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
    } else {
      setTimeout(() => waitForElement(selector, callback), 100);
    }
  }
  
  // 添加转载角标到文章卡片
  function addReprintedBadges() {
    // 等待 Angular 应用加载完成
    waitForElement('app-root', function() {
      // 等待文章列表加载
      setTimeout(() => {
        // 首先尝试从页面数据中获取转载信息并设置data属性
        try {
          // 查找可能包含文章数据的script标签
          const dataScripts = document.querySelectorAll('script[type="application/json"]');
          
          dataScripts.forEach(script => {
            try {
              const data = JSON.parse(script.textContent);
              if (data && data.data && Array.isArray(data.data)) {
                // 处理分页数据格式
                data.data.forEach(post => {
                  if (post.reprinted) {
                    // 查找对应的文章卡片并设置data-reprinted属性
                    const postLinks = document.querySelectorAll(`a[href*="${post.link}"]`);
                    postLinks.forEach(link => {
                      let card = link.closest('article, .post-item, [class*="post"], [class*="card"], [class*="item"]');
                      if (card) {
                        card.setAttribute('data-reprinted', 'true');
                      }
                    });
                  }
                });
              } else if (data && data.posts && Array.isArray(data.posts)) {
                // 处理直接的文章数组格式
                data.posts.forEach(post => {
                  if (post.reprinted) {
                    // 查找对应的文章卡片并设置data-reprinted属性
                    const postLinks = document.querySelectorAll(`a[href*="${post.link}"]`);
                    postLinks.forEach(link => {
                      let card = link.closest('article, .post-item, [class*="post"], [class*="card"], [class*="item"]');
                      if (card) {
                        card.setAttribute('data-reprinted', 'true');
                      }
                    });
                  }
                });
              }
            } catch (e) {
              // 忽略解析错误
            }
          });
          
        } catch (e) {
          // 忽略错误
        }
        
        // 查找所有可能的文章卡片容器
        const postSelectors = [
          '[data-post-item]',
          '.post-item',
          'article',
          '[class*="post"]',
          '.card',
          '[class*="card"]',
          '.item',
          '[class*="item"]'
        ];
        
        let postItems = [];
        postSelectors.forEach(selector => {
          const items = document.querySelectorAll(selector);
          postItems = postItems.concat(Array.from(items));
        });
        
        // 去重
        postItems = [...new Set(postItems)];
        
        postItems.forEach(item => {
          // 检查是否已经有角标
          if (item.querySelector('.reprinted-badge')) {
            return;
          }
          
          // 检查是否有转载标识的数据属性
          const isReprinted = item.getAttribute('data-reprinted') === 'true' || 
                             item.querySelector('[data-reprinted="true"]');
          
          if (isReprinted) {
            // 确保容器有相对定位
            const computedStyle = window.getComputedStyle(item);
            if (computedStyle.position === 'static') {
              item.style.position = 'relative';
            }
            
            // 创建角标
            const badge = document.createElement('div');
            badge.className = 'reprinted-badge';
            badge.textContent = '转载';
            badge.title = '本文为转载文章';
            
            // 添加到卡片
            item.appendChild(badge);
          }
        });
      }, 1000);
    });
  }
  
  // 页面加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addReprintedBadges);
  } else {
    addReprintedBadges();
  }
  
  // 监听路由变化（SPA 应用）
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(addReprintedBadges, 500);
    }
  }).observe(document, { subtree: true, childList: true });
})();
