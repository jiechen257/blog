// 转载标识功能 - 右上角角标
(function() {
  'use strict';
  
  // 添加转载角标到文章卡片
  function addReprintedBadges() {
    // 只在文章列表页显示转载标识，不在详情页显示
    if (window.location.pathname.includes('/post/') || window.location.pathname.match(/^\/[^\/]+\/$/)) {
      return;
    }
    
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
    
    // 查找所有包含转载标识的元素
    const allElements = document.querySelectorAll('*');
    let foundReprinted = false;
    
    allElements.forEach(element => {
      // 检测转载文章：通过数据属性
      const isReprinted = element.getAttribute('data-reprinted') === 'true';
      
      if (isReprinted && !element.classList.contains('reprinted-post')) {
        // 找到包含转载标识的父容器（文章卡片）
        let container = element;
        while (container && container !== document.body) {
          const rect = container.getBoundingClientRect();
          // 检查是否是文章卡片（有足够的尺寸）
          if (rect.width > 200 && rect.height > 50) {
            // 确保容器有相对定位
            const computedStyle = window.getComputedStyle(container);
            if (computedStyle.position === 'static') {
              container.style.position = 'relative';
            }
            
            // 添加转载文章类名（这会触发 CSS 伪元素）
            container.classList.add('reprinted-post');
            foundReprinted = true;
            break;
          }
          container = container.parentElement;
        }
      }
    });
  }
  
  // 等待 Angular 应用加载完成
  function waitForAngular() {
    // 检查是否有 Angular 应用
    if (document.querySelector('app-root')) {
      // 等待 Angular 应用完全加载
      setTimeout(() => {
        addReprintedBadges();
      }, 2000);
      
      // 监听 Angular 应用的变化
      const observer = new MutationObserver(() => {
        setTimeout(addReprintedBadges, 500);
      });
      
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
      
    } else {
      addReprintedBadges();
    }
  }
  
  // 页面加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForAngular);
  } else {
    waitForAngular();
  }
  
  // 监听路由变化（SPA 应用）
  let lastUrl = location.href;
  setInterval(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(addReprintedBadges, 1000);
    }
  }, 1000);
})();
