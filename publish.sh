exit;

# Execute line by line from the folder root
rm -rf dist
npm run build:test

# Interactive login
npm login
npm publish --access public

# Node test
node ./demo/node/dicomdump.js <dicom file>
