const fs = require('fs')
const path = require('path')

const indexPath = path.join(__dirname, '../dist/index.html')
let html = fs.readFileSync(indexPath, 'utf8')

const metaTags = `
    <meta name="description" content="Win amazing prizes with Tick Pick. Enter competitions from $5 and walk away with cash, gadgets, and more." />

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="shortcut icon" href="/favicon.png" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://tick-pick.com" />
    <meta property="og:title" content="Tick Pick — Prize Competitions" />
    <meta property="og:description" content="Win amazing prizes with Tick Pick. Enter competitions from $5 and walk away with cash, gadgets, and more." />
    <meta property="og:image" content="https://tick-pick.com/og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Tick Pick — Prize Competitions" />
    <meta name="twitter:description" content="Win amazing prizes with Tick Pick. Enter competitions from $5 and walk away with cash, gadgets, and more." />
    <meta name="twitter:image" content="https://tick-pick.com/og-image.png" />

    <!-- Theme color -->
    <meta name="theme-color" content="#7C3AED" />`

// Replace title and inject meta tags after it
html = html.replace(
  '<title>Tick Pick</title>',
  '<title>Tick Pick — Prize Competitions</title>' + metaTags
)

// Copy public assets into dist
const publicDir = path.join(__dirname, '../public')
const distDir = path.join(__dirname, '../dist')
for (const file of fs.readdirSync(publicDir)) {
  fs.copyFileSync(path.join(publicDir, file), path.join(distDir, file))
}

fs.writeFileSync(indexPath, html)
console.log('✓ Patched dist/index.html with meta tags and copied public assets')
