#!/usr/bin/env node
// dicomdump.js
// Usage: node dicomdump.js <input.dcm>

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DicomParser, DICOM_TAG as TAG } from '../../dist/node/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.argv.length < 3) {
    console.error('Usage: node dicomdump.js <input.dcm>');
    process.exit(1);
}

const inputPath = path.resolve(process.argv[2]);

if (!fs.existsSync(inputPath)) {
    console.error(`Input not found: ${inputPath}`);
    process.exit(1);
}

const bytes = fs.readFileSync(inputPath);
const u8 = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);

const parser = new DicomParser(u8, /*debug*/ false);
const tags = parser.DicomTags || {};
const transferSyntax = String(tags[TAG.TRANSFER_SYNTAX_UID] || '');

// ---- Extract pixel data ----
let pixel = parser.image;
let outBase = "./" + path.basename(inputPath);
let pixelOut = null;

if (Array.isArray(pixel) && pixel.length > 0) {
    // take last frame
    pixel = pixel[pixel.length - 1];
}

if (pixel && ArrayBuffer.isView(pixel)) {
    if (transferSyntax === '1.2.840.10008.1.2.4.50') {
        // JPEG Baseline
        pixelOut = `${outBase}.pixel.jpg`;
        fs.writeFileSync(pixelOut, Buffer.from(pixel.buffer, pixel.byteOffset, pixel.byteLength));
    } else {
        // Raw bytes
        const ext = pixel.constructor && pixel.constructor.name || 'bin';
        pixelOut = `${outBase}.pixel.${ext.toLowerCase()}`;
        fs.writeFileSync(pixelOut, Buffer.from(pixel.buffer, pixel.byteOffset, pixel.byteLength));
    }
}

// ---- Summarize buffers/typed arrays by length ----
function stringify(value, indent = 2) {
    const seen = new WeakSet();
    function replacer(key, val) {
        if (typeof val === 'object' && val !== null) {
            if (seen.has(val)) return '[Circular]';
            seen.add(val);
        }
        if (val instanceof ArrayBuffer) return `ArrayBuffer(${val.byteLength})`;
        if (val instanceof DataView) return `DataView(${val.byteLength})`;
        if (ArrayBuffer.isView(val) && !(val instanceof DataView))
            return `${val.constructor.name}(${val.length})`;
        if (typeof Blob !== 'undefined' && val instanceof Blob)
            return `Blob(${val.size} bytes, type=${val.type || 'application/octet-stream'})`;
        if (typeof val === 'bigint') return `${val.toString()}n`;
        return val;
    }
    return JSON.stringify(value, replacer, indent);
}

const report = {
    file: path.basename(inputPath),
    sizeBytes: u8.byteLength,
    transferSyntax,
    rows: Number(tags[TAG.ROWS] || 0),
    columns: Number(tags[TAG.COLUMNS] || 0),
    bitsAllocated: Number(tags[TAG.BITS_ALLOCATED] || 0),
    photometric: String(tags[TAG.PHOTOMETRIC_INTERPRETATION] || ''),
    numberOfFrames: Number(tags[TAG.NUMBER_OF_FRAMES] || 0) || undefined,
    pixelDataWritten: pixelOut ? path.basename(pixelOut) : null,
    tags
};

console.log(stringify(report, 2));