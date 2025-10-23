exit;

# Execute line by line from the folder root
rm -rf dist
npm run build:test

# Interactive login
npm login

# Production publication
npm publish --access public

# Beta publication
npm publish --access public --tag some_tag

# Node test
node ./demo/node/dicomdump.js <dicom file>
