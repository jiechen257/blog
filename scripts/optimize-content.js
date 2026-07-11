'use strict';

hexo.extend.filter.register('after_post_render', function (data) {
  if (!data.content) return data;

  data.content = data.content.replace(/<img\b(?![^>]*\bloading=)([^>]*)>/gi, function (_, attributes) {
    return '<img loading="lazy" decoding="async"' + attributes + '>';
  });

  return data;
});
