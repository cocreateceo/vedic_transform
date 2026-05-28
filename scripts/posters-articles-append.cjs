// Converts scripts/posters-articles-data.json into:
//   - LibraryArticle TS entries appended to src/data/library-articles.ts
//   - ContentItem TS entries appended to src/data/content-library.ts
//
// Backticks inside the content body are escaped to \`.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(__dirname, 'posters-articles-data.json');
const LIBRARY_ARTICLES = path.join(ROOT, 'src/data/library-articles.ts');
const CONTENT_LIBRARY = path.join(ROOT, 'src/data/content-library.ts');

const articles = JSON.parse(fs.readFileSync(DATA, 'utf8'));

function tsString(s) {
  return JSON.stringify(s);
}

function escapeBackticks(s) {
  return s.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

// 1) Append LibraryArticle entries
let libSrc = fs.readFileSync(LIBRARY_ARTICLES, 'utf8');
const libEntries = articles.map(a => `  {
    slug: ${tsString(a.slug)},
    contentId: ${tsString(a.contentId)},
    title: ${tsString(a.title)},
    excerpt:
      ${tsString(a.excerpt)},
    category: ${tsString(a.category)},
    pillarSlug: ${tsString(a.pillarSlug)},
    readTime: ${tsString(a.readTime)},
    kind: "article",
    content: \`${escapeBackticks(a.content)}\`,
  }`).join(',\n');

// Insert before the final '];\n'
const libAnchor = '];\n';
const libIdx = libSrc.lastIndexOf(libAnchor);
if (libIdx < 0) throw new Error('library-articles anchor not found');
libSrc = libSrc.substring(0, libIdx) + libEntries + ',\n' + libSrc.substring(libIdx);
// Fix: only prepend the leading ',' if the preceding content already has at least one entry
// (which it does; existing file has 3 entries).
fs.writeFileSync(LIBRARY_ARTICLES, libSrc);
console.log('library-articles.ts new line count:', libSrc.split('\n').length);

// 2) Append ContentItem entries (only id/title/type/pillarSlug/category/duration/url/description)
let conSrc = fs.readFileSync(CONTENT_LIBRARY, 'utf8');
const conEntries = articles.map(a => `  {
    id: ${tsString(a.contentId)},
    title: ${tsString(a.title)},
    type: "article",
    pillarSlug: ${tsString(a.pillarSlug)},
    category: ${tsString(a.category)},
    duration: ${tsString(a.readTime)},
    url: "/library/article/${a.slug}",
    description:
      ${tsString(a.excerpt)},
  }`).join(',\n');

const conIdx = conSrc.lastIndexOf(libAnchor);
if (conIdx < 0) throw new Error('content-library anchor not found');
conSrc = conSrc.substring(0, conIdx) + conEntries + ',\n' + conSrc.substring(conIdx);
fs.writeFileSync(CONTENT_LIBRARY, conSrc);
console.log('content-library.ts new line count:', conSrc.split('\n').length);

console.log('\nAppended', articles.length, 'articles + content-library cards.');
