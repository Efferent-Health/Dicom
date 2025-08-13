exit;

# Execute line by line from the folder root
rm -rf dist
npm run build

# Checkings
node -e "import('./dist/node/index.js').then(m=>console.log('ESM:', Object.keys(m)))"
node -e "console.log('CJS:', Object.keys(require('./dist/node/index.cjs')))"

# Interactive login
npm login
npm publish --access public

# Node test
node ./test/node/dicomdump.js <dicom file>
