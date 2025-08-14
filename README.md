# Efferent.Dicom
[![npm version](https://img.shields.io/npm/v/efferent-dicom.svg)](https://www.npmjs.com/package/efferent-dicom)
[![npm downloads](https://img.shields.io/npm/dm/efferent-dicom.svg)](https://www.npmjs.com/package/efferent-dicom)
[![GitHub stars](https://img.shields.io/github/stars/efferentinc/dicom.svg?style=social&label=Star)](https://github.com/efferentinc/dicom)

Javascript library for reading and writing DICOM files in desktop, cloud and browser applications.
The following frameworks are supported:
- Browser applications (Javascript)
- NodeJS ESM
- NodeJS CJS

## API Overview

### Main classes
- DicomParser - DICOM reader and parser, with image extraction capabilities
- DicomWriter - DICOM creator and serializer

### Ancillary
- DicomElement - Main building block for DICOM files
- DICOM_TAG - Collection of commonly used DICOM tags
- PixelSpacing - Used for calibration purposes

## Usage

### Browser applications
If working with Typescript, include Efferent.Dicom.d.ts in your tsconfig.json file:
````json
    "include": [
        "./lib/Efferent.Dicom.d.ts",
        // Other files
    ]
````

At runtime, add a reference to the script into your html header section:
````html
<head>
    <script src="Efferent.Dicom.js"></script>      <!-- Full     -->
    <script src="Efferent.Dicom.min.js"></script>  <!-- Minified -->
</head>
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
