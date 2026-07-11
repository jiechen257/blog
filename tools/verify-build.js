'use strict';

const { existsSync, readFileSync, readdirSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');
const output = join(root, 'public');
const failures = [];

function requireFile(path) {
  const fullPath = join(output, path);
  if (!existsSync(fullPath)) failures.push('Missing output: /' + path);
  return existsSync(fullPath) ? readFileSync(fullPath, 'utf8') : '';
}

const home = requireFile('index.html');
requireFile('atom.xml');
requireFile('sitemap.xml');
requireFile('robots.txt');
requireFile('404/index.html');
requireFile('css/ux-refinements.css');
requireFile('js/code-copy.js');

if (!home.includes('https://blog.becase.top/')) failures.push('Canonical domain is incorrect');
if (!home.includes('<main')) failures.push('Inside SSR did not render main content');
if (/user-scalable\s*=\s*(?:no|0)|maximum-scale\s*=\s*1/i.test(home)) failures.push('Viewport disables zoom');
if (/jquery|clipboard@|fonts\.googleapis\.com/i.test(home)) failures.push('Removed blocking dependency is still loaded');
if (existsSync(join(output, 'undefined'))) failures.push('Invalid /undefined/ route was generated');

const postDirectories = existsSync(join(output, 'post'))
  ? readdirSync(join(output, 'post'), { withFileTypes: true }).filter((entry) => entry.isDirectory())
  : [];
if (postDirectories.length !== 97) failures.push('Expected 97 published post routes, found ' + postDirectories.length);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Verified SSR, SEO files, 97 post routes, zoom support, and optimized assets.');
