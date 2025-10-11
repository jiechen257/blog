const listProps = ['title', 'date', 'date_formatted', 'link'];

module.exports = {
  archive: listProps,
  categoryPosts: listProps,
  tagPosts: listProps,
  page: ['title', 'date', 'date_formatted', 'updated', 'content', 'link', 'comments', 'dropcap', 'plink', 'toc', 'reward', 'copyright', 'meta'],
  post: ['title', 'date', 'date_formatted', 'author', 'thumbnail', 'color', 'link', 'comments', 'dropcap', 'tags', 'categories', 'updated', 'content', 'prev', 'next', 'plink', 'toc', 'reward', 'copyright', 'reading_time', 'reprinted', 'reprinted_url'],
  postList: ['title', 'date', 'date_formatted', 'author', 'thumbnail', 'color', 'excerpt', 'link', 'tags', 'categories', 'reprinted', 'reprinted_url', 'reprinted_label', 'reprinted_icon', 'reprinted_badge'],
  search: ['title', 'date', 'date_formatted', 'author', 'updated', 'content', 'thumbnail', 'color', 'plink']
}
