const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

const rootDir = path.join(__dirname, '..');
const dashboardDir = path.join(rootDir, 'dashboard');
const apiDir = path.join(rootDir, 'api');

function build() {
  console.log('Building dashboard assets...');

  // 1. Run Tailwind
  console.log('Running Tailwind...');
  execSync(
    'npx tailwindcss -i ./dashboard/input.css -o ./dashboard/output.css',
    {cwd: rootDir},
  );

  // 2. Run Babel
  console.log('Running Babel...');
  execSync('npx babel ./dashboard/App.jsx --out-file ./dashboard/App.js', {
    cwd: rootDir,
  });

  // 3. Assemble dashboard.js
  console.log('Assembling dashboard.js...');
  let html = fs.readFileSync(path.join(dashboardDir, 'index.html'), 'utf8');
  let customCss = fs.readFileSync(
    path.join(dashboardDir, 'styles.css'),
    'utf8',
  );
  let tailwindCss = fs.readFileSync(
    path.join(dashboardDir, 'output.css'),
    'utf8',
  );
  let js = fs.readFileSync(path.join(dashboardDir, 'App.js'), 'utf8');

  // Escape backticks and dollar signs for template literal
  const sanitize = str => str.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

  let combinedCss = customCss + '\n/* Tailwind CSS */\n' + tailwindCss;

  html = html.replace('<!-- DASHBOARD_CSS -->', combinedCss);
  html = html.replace(
    '<!-- DASHBOARD_JS -->',
    '<script>\n' + js + '\n</script>',
  );

  const finalContent = 'module.exports = `' + sanitize(html) + '`;';
  fs.writeFileSync(path.join(apiDir, 'dashboard.js'), finalContent);

  console.log('Build complete: backend/api/dashboard.js');
}

build();
