const { parseToc, isObject, isEmptyObject, trimHtml } = require('../utils');
const date_formats = [
  'll', // Sep 4, 1986
  'L', // 09/04/1986
  'MM-DD' // 06-17
];

module.exports = function (data) {
  if (data.layout !== 'page' && data.layout !== 'post') return;

  const { config, theme: { config: theme } } = this;
  const { hasComments, hasReward, hasToc, copyright, dateHelper, uriReplacer, renderReadingTime } = theme.runtime;
  const isPage = data.layout === 'page';

  // pre format date for i18n
  data.date_formatted = date_formats.reduce((ret, format) => {
    ret[format] = dateHelper(data.date, format)
    return ret
  }, {})

  // relative link
  data.link = trimHtml(data.path).replace(/^\//, '');
  // permalink link
  data.plink = `${config.url}/${data.link ? `${data.link}/` : ''}`;
  // type
  data.type = isPage ? 'page' : 'post';

  // comments
  data.comments = hasComments && data.comments !== false;

  // asset path (for post_asset_folder)
  const assetPath = config.post_asset_folder
    ? (isPage ? trimHtml(data.path, true) : data.link)
    : undefined;

  // Make sure articles without titles are also accessible
  if (!data.title) data.title = data.slug

  // post thumbnail
  if (!isPage && data.thumbnail) {
    const particals = data.thumbnail.split(' ');
    data.thumbnail = uriReplacer(particals[0], assetPath);
    if (particals[1] && !data.color)
      data.color = particals[1];
  }

  // reward
  if (hasReward && theme[data.type].reward && data.reward !== false) data.reward = true;

  // copyright
  let cr;
  if (
    (copyright && theme[data.type].copyright && data.copyright === undefined) ||
    (copyright && data.copyright === true)
  ) {
    cr = Object.assign({}, copyright);
  }
  // override page/post.copyright with front matter
  else if (isObject(data.copyright)) {
    cr = Object.assign({}, data.copyright);
  }
  if (cr) {
    if (cr.custom) cr = { custom: cr.custom };
    else {
      if (cr.author) cr.author = data.author || config.author;
      else delete cr.author;
      if (cr.link) cr.link = `<a href="${data.plink}" title="${data.title}">${data.plink}</a>`;
      else delete cr.link;
      if (cr.published) cr.published = dateHelper(data.date, 'LL');
      else delete cr.published;
      if (cr.updated) cr.updated = dateHelper(data.updated, 'LL');
      else delete cr.updated;
    }

    if (!isEmptyObject(cr)) data.copyright = cr;
    else delete data.copyright;
  } else delete data.copyright;

  // toc
  if (hasToc && theme[data.type].toc && data.toc !== false) {
    const toc = parseToc(data.content, theme.toc.depth);
    if (toc.length) data.toc = toc;
    else delete data.toc;
  } else delete data.toc;

  // reading time
  if (renderReadingTime) {
    data.reading_time = renderReadingTime(data.content);
  }

  // reprinted flag
  if (!isPage && data.reprinted) {
    data.reprinted = true;
    // 添加转载标识的显示信息
    data.reprinted_label = "转载";
    data.reprinted_icon = "📋";
    data.reprinted_badge = true; // 用于右上角角标
    
    // 构建转载标识内容
    let reprintedContent = `<strong>📋 声明</strong> - 本文为转载文章`;
    
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
  } else {
    data.reprinted = false;
    data.reprinted_label = null;
    data.reprinted_icon = null;
    data.reprinted_badge = false;
  }
};
