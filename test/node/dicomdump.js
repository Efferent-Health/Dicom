#!/usr/bin/env node
// dicomdump.js
// Usage: node dicomdump.js <input.dcm>

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DicomParser, DICOM_TAG as TAG } from '../../dist/node/index.js';

// import { DicomParser, DICOM_TAG as TAG} from 'efferent-dicom';

const __filename = fileURLToPath(import.meta.url);

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

// Map common DICOM transfer syntaxes to well-known exportable formats
const EXPORT_FORMATS = {
    // JPEG Baseline (Process 1)
    '1.2.840.10008.1.2.4.50': { ext: 'jpg', mime: 'image/jpeg', label: 'JPEG Baseline' },
    // JPEG Extended (Process 2 & 4)
    '1.2.840.10008.1.2.4.51': { ext: 'jpg', mime: 'image/jpeg', label: 'JPEG Extended' },
    // JPEG Lossless, Non-Hierarchical, First-Order Prediction (Process 14 [SV1])
    '1.2.840.10008.1.2.4.57': { ext: 'jpg', mime: 'image/jpeg', label: 'JPEG Lossless (SV1)' },
    // JPEG-LS
    '1.2.840.10008.1.2.4.80': { ext: 'jls', mime: 'image/jls', label: 'JPEG-LS Lossless' },
    '1.2.840.10008.1.2.4.81': { ext: 'jls', mime: 'image/jls', label: 'JPEG-LS Near-Lossless' },
    // JPEG 2000
    '1.2.840.10008.1.2.4.90': { ext: 'jp2', mime: 'image/jp2', label: 'JPEG 2000 (Lossless Only)' },
    '1.2.840.10008.1.2.4.91': { ext: 'jp2', mime: 'image/jp2', label: 'JPEG 2000 (Lossless/Lossy)' },
    // RLE (not a general-purpose image format, but dump as .rle bytes)
    '1.2.840.10008.1.2.5': { ext: 'rle', mime: 'application/octet-stream', label: 'RLE encoding' },
    // Others, possibliy raw raster format
    '*': { ext: 'bin', mime: 'application/octet-stream', label: 'Other binary formats' }
};

function getExportFormat(tsUid) {
    return EXPORT_FORMATS[tsUid] || null;
}

// ---- Extract pixel data ----
let pixel = parser.image;
let outBase = "./" + path.basename(inputPath);
let pixelOut = null;

if (Array.isArray(pixel) && pixel.length > 0) {
    // take last frame
    pixel = pixel[pixel.length - 1];
}

if (pixel && ArrayBuffer.isView(pixel)) {
    const fmt = getExportFormat(transferSyntax) || getExportFormat("*");
    pixelOut = `${outBase}.${fmt.ext}`;
    fs.writeFileSync(pixelOut, Buffer.from(pixel.buffer, pixel.byteOffset, pixel.byteLength));
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
    exportFormat: (getExportFormat(transferSyntax)?.label) || null,
    rows: Number(tags[TAG.ROWS] || 0),
    columns: Number(tags[TAG.COLUMNS] || 0),
    bitsAllocated: Number(tags[TAG.BITS_ALLOCATED] || 0),
    photometric: String(tags[TAG.PHOTOMETRIC_INTERPRETATION] || ''),
    numberOfFrames: Number(tags[TAG.NUMBER_OF_FRAMES] || 0) || undefined,
    pixelDataWritten: pixelOut ? path.basename(pixelOut) : null,
    tags
};

console.log(stringify(report, 2));