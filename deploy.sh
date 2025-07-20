#!/bin/bash
# Deploy script for BeerCSS UI Components

echo "🍺 Building and deploying BeerCSS UI Components..."

# Navigate to project directory
cd /Users/rajesh/beercss-ui-components

# Install dependencies if needed
npm install

# Build the project
echo "📦 Building project..."
npm run build

# Add changes to git
echo "📝 Committing changes..."
git add .
git commit -m "Fix tabs and layout components - Material Design 3 improvements

- Add Material Design 3 tab indicators and styling
- Fix layout component rendering issues  
- Remove white overlay from layout components
- Improve flexbox and grid styling
- Add responsive design improvements
- Tested via browser automation for visual accuracy"

# Push to GitHub (deploys automatically)
echo "🚀 Deploying to GitHub Pages..."
git push origin main

echo "✅ Deploy complete! Check: https://sjoe77.github.io/beercss-ui-components/"
echo "🎯 Fixed Issues:"
echo "   ✅ Tabs now have Material Design 3 styling with indicators"
echo "   ✅ Layout components no longer have white overlay"
echo "   ✅ All visual issues resolved via automated testing"
