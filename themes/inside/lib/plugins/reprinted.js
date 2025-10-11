"use strict";

module.exports = {
  exec: function (hexo, options = {}) {
    const { placeholder = "转载", excerpt = "本文为转载文章" } = options;
    
    // 在文章渲染后添加转载标识
    hexo.extend.filter.register('after_post_render', function (data) {
      if (data.layout === 'post' && data.reprinted) {
        // 构建转载标识内容
        let reprintedContent = `<strong>📋 ${placeholder}</strong> - ${excerpt}`;
        
        // 如果有原文链接，添加链接
        if (data.reprinted_url) {
          reprintedContent += `<br><a href="${data.reprinted_url}" target="_blank" rel="noopener noreferrer" class="reprinted-link">🔗 原文链接：${data.reprinted_url}</a>`;
        }
        
        // 在文章内容前添加转载标识
        const reprintedNotice = `
<div class="reprinted-notice" style="
  background: #f8f9fa;
  border-left: 4px solid #333;
  padding: 12px 16px;
  margin: 16px 0;
  border-radius: 4px;
  font-size: 14px;
  color: #495057;
  line-height: 1.6;
">
  ${reprintedContent}
</div>
`;
        data.content = reprintedNotice + data.content;
      }
    }, 1);
    
    // 也在 before_post_render 中添加
    hexo.extend.filter.register('before_post_render', function (data) {
      if (data.layout === 'post' && data.reprinted) {
        // 转载文章处理
      }
    }, 1);
  },
  schema: {
    properties: {
      placeholder: {
        type: "string",
        default: "转载"
      },
      excerpt: {
        type: "string", 
        default: "本文为转载文章"
      },
      reprinted_url: {
        type: "string",
        description: "原文链接地址"
      }
    },
    required: ["placeholder", "excerpt"],
    additionalProperties: false
  }
};
