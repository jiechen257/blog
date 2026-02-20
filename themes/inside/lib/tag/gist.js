const { snippet } = require('../utils');

/**
* Gist tag
*
* Syntax:
*   {% gist gist_id [filename] %}
*/
module.exports = function (args = []) {
  if (!Array.isArray(args) || !args.length) return '';

  const id = args[0];
  const file = args[1];
  const fileQuery = file ? `?file=${encodeURIComponent(file)}` : '';
  const src = `https://gist.github.com/${id}.js${fileQuery}`;

  return snippet(null, `<script src="${src}"></script>`);
}
