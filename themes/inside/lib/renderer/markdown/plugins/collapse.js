const container = require('markdown-it-container');
const { parsePipe } = require('../../../utils');

module.exports = [
  container,
  'collapse',
  {
    render(tokens, idx, options, env, slf) {
      const meta = parsePipe(tokens[idx].info.trim().slice(9));
      const opt = meta.options || {};
      const defaultOpen = opt.open !== 'false' && opt.open !== false && opt.closed !== true && opt.closed !== 'true';
      const open = defaultOpen ? ' open' : '';
      const summary = meta.value || '展开';

      return tokens[idx].nesting === 1
        ? `<details class="inside-collapse"${open}><summary>${summary}</summary>`
        : '</details>';
    },
  },
];
