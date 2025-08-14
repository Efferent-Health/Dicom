# Efferent.Dicom
Javascript library for reading and writing DICOM files in desktop and browser applications.
The following frameworks are supported:
- Browser applications (Javascript)
- NodeJS ESM
- NodeJS CJS

## API Overview

### Main classes
- DicomParser - DICOM Readers and parser, with image extraction capabilities
- DicomWriter - DICOM Creator and serializer

### Ancillary
- DicomElement - Main building block for DICOM files
- DICOM_TAG - Collection of commonly used DICOM tags
- PixelSpacing

## Usage

### Browser applications
If working with Typescript, include Efferent.Dicom.d.ts in your tsconfig.json file:
````json
    "include": [
        "./lib/Efferent.Dicom.d.ts",
        // Other files
    ]
````

At runtime, add a reference to the script into your html header:
````html
<header>
    <script src="Efferent.Dicom.js"></script>      <!-- Full -->
    <script src="Efferent.Dicom.min.js"></script>  <!-- Minified -->
````
You can also import the library using bundlers such as Webpack, Rollup, or Vite.

### NodeJS
The library is published on npm as `efferent-dicom`.

**ESM (ECMAScript Modules)**  
If your project uses `"type": "module"` in `package.json` or has `.mjs` files:
```js
import { DicomParser, DICOM_TAG as TAG } from 'efferent-dicom';
```

**CommonJS (require syntax)**  
If your project uses the default CommonJS module system:
```js
const { DicomParser, DICOM_TAG: TAG } = require('efferent-dicom');
```

**Note:**  
- In CJS, destructuring syntax uses `DICOM_TAG: TAG` to rename the constant.  
- In ESM, you can directly alias using `as TAG`.

#### Example
```js
import fs from 'fs';
import { DicomParser, DICOM_TAG as TAG } from 'efferent-dicom';

const data = fs.readFileSync('example.dcm');
const parser = new DicomParser(new Uint8Array(data.buffer));
console.log(parser.DicomTags[TAG.PATIENT_NAME]);
```
