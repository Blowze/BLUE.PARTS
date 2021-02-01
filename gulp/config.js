const path = require('path')
const dirsOverwrite = require('./dirs_overwrite');
const root = path.join(__dirname, '../')
const src = path.join(root, 'src')

const overwritePath = process.env.ORVERWRITE_DIRS === 'true';

function resolvePath(dir, overwriteMarker = null) {
  if (!overwritePath) {
    return dir;
  }

  const newPath = dirsOverwrite[overwriteMarker ? overwriteMarker : dir];
  if (!newPath)
    throw new Error("Path not found - " + dir);
  return newPath;
}


module.exports = {
  root,
  src,
  forceClean: overwritePath,
  resolvePath,
  buildPath: path.join(root, '/build'),
  pug2html: {
    beautifyHtml: true
  },
  lighthouse: {
    reportPath: path.join(root, 'reports'),
    PORT: 8080,
    chromeLauncherPort: 9222,
    config: {
      extends: 'lighthouse:default'
    },
    flags: {
      // available options - https://github.com/GoogleChrome/lighthouse/#cli-options
      chromeFlags: ['--show-paint-rects'],
      output: 'html'
    }
  }
}
