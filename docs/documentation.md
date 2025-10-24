# Documentation

## Table of contents

- [Overview](#overview)
- [DicomReader](#dicomreader)
- [DicomWriter](#dicomwriter)
- [DicomDictionary](#dicomdictionary)
- [Working with the components together](#working-with-the-components-together)
- [Additional tips and best practices](#additional-tips-and-best-practices)

# Documentation

This document explains how the three core components of the Efferent DICOM toolkit fit together, the responsibilities each class owns, and practical guidance for using them in browser and Node.js applications.

## Overview

- `DicomReader` parses a binary DICOM stream, exposing metadata tags, pixel data, and helper state about the dataset.
- `DicomWriter` builds new DICOM datasets by writing `DicomElement` instances (and optional pixel data) into a properly ordered binary file.
- `DicomDictionary` provides Value Representation (VR), Value Multiplicity (VM), and human-readable descriptions for the majority of DICOM tags and is used internally by the reader while remaining available to consumers for lookups.

The reader and writer both depend on shared building blocks such as `DicomElement`, `PixelSpacing`, the `DICOM_TAG` constants, and the CSV-powered dictionary source found in `DictionarySource.ts`. Understanding these classes helps when extracting images, constructing new datasets, or presenting tag metadata to users.

## DicomReader

### Responsibilities

- Validates the DICOM preamble (`128`-byte header + `"DICM"` marker) and walks the file element by element.
- Uses `DicomDictionary` lookups to resolve VRs for implicit datasets and to decide how to decode element values.
- Maintains the parsed dataset in `DicomTags`, exposes `image` and `pixelSpacing` for visualization, and tracks pixel data parsing state.
- Handles sequences (SQ), encapsulated pixel data, and (optionally) deflated transfer syntaxes.

### Construction and lifecycle

```ts
import { DicomReader } from 'efferent-dicom';

const reader = new DicomReader(buffer, /* debug? */ false);
```

- `buffer` must be a `Uint8Array` (convert `ArrayBuffer` or Node `Buffer` as needed).
- Passing `true` for `debug` prints each parsed `DicomElement` to the console via `ToString`, which is useful when troubleshooting.
- Instantiation immediately parses the entire file; there is no separate `read` method.

### Key public properties

- `DicomTags: Record<string, any>` — Tag-value map keyed by `"GGGG_EEEE"` strings (e.g. `"0010_0010"`). Multi-valued Patient IDs get suffixed with `_n`.
- `image: Uint8Array | Uint16Array | Int16Array | Float32Array | Float64Array | null` — Resolved pixel data when available. For multi-frame datasets the value can be an array of frame buffers.
- `pixelSpacing: PixelSpacing | undefined` — Convenience calibration info derived from `PIXEL_SPACING` or `IMAGER_PIXEL_SPACING`.
- `transferSyntax: string | undefined`, `modality: string | undefined`, `photometric: string | undefined` — Selected modality attributes gleaned from the dataset.
- `bitsAllocated: number | undefined`, `isUnsigned: boolean`, `reachedPixelData: boolean`, `implicitVR: boolean` — Parsing flags you can inspect to adapt rendering logic.

### Pixel data handling

- For explicit VR little-endian datasets (`1.2.840.10008.1.2.1`) the reader decodes the pixel buffer immediately and populates `image`. Pixel data VRs are normalized (e.g. implicit monochrome 16-bit stored as `OW` becomes a `Uint16Array`).
- For encapsulated pixel data (`VL === 0xFFFFFFFF`) the reader interprets the fragments, concatenates them, and still returns the native typed array. Multi-frame data is exposed as an array of frames.
- For implicit VR (`1.2.840.10008.1.2`) the reader populates `DicomTags` but does **not** extract `image` because pixel data decoding requires explicit VR knowledge.
- If the transfer syntax is deflated (`1.2.840.10008.1.2.1.99`), the reader inflates the stream via `Inflator` before resuming parsing.

### Sequence support

- When an element’s VR is `SQ`, or when an implicit dataset signals an undefined length (`VL === 0xFFFFFFFF`), `DicomReader` recursively parses nested `DicomElement` arrays or maps.
- Item and sequence delimiters (`FFFE_E00D`, `FFFE_E0DD`) are respected, and nested values are pushed to the parent element’s `value`.

### Practical usage example

```ts
import fs from 'fs';
import { DicomReader, DICOM_TAG as TAG } from 'efferent-dicom';

const dicomFile = fs.readFileSync('example.dcm');
const reader = new DicomReader(new Uint8Array(dicomFile));

console.log('Patient name:', reader.DicomTags[TAG.PATIENT_NAME]);
console.log('Modality:', reader.modality);
console.log('Dimensions:', reader.DicomTags[TAG.ROWS], 'x', reader.DicomTags[TAG.COLUMNS]);

if (reader.image) {
  // Render or persist the pixel data
  console.log('Pixel buffer length:', reader.image.length);
}

if (reader.pixelSpacing) {
  console.log('Pixel spacing (mm):', reader.pixelSpacing.PixelX, reader.pixelSpacing.PixelY);
}
```

### Tips and limitations

- Provide a `DicomDictionary` if you need to look up human-readable descriptions for each tag when presenting the parsed metadata.
- When consuming `DicomTags`, remember values may contain `Uint8Array` instances (for binary blobs) or nested arrays for sequences.
- The reader does not currently enforce endian swapping for big-endian datasets and is tailored to little-endian files.

## DicomWriter

### Responsibilities

- Builds a DICOM Part 10 file from a collection of `DicomElement` instances.
- Calculates and writes VR-specific lengths (`VL`), applies required padding, and ensures the file meta header precedes the main dataset.
- Can append encapsulated pixel data streams after serializing the dataset.

### Building a dataset

1. Instantiate the writer: `const writer = new DicomWriter();`
2. Populate `DicomElement` objects (see `DicomElement.ts`) with `tag`, `VR`, and `value`.
3. Call `AddElement(element)` for each item. The method:
   - Normalizes tag formatting by stripping parentheses, commas, underscores, and whitespace.
   - Derives `VL` based on VR semantics (numeric types become arrays, strings use their length, sequences mark `0xFFFFFFFF`).
   - Recursively queues sequence children by calling `AddElement(child, false)`.
4. Optionally call `AddPixelData(pixelBuffer)` to stage an `Uint8Array` that will be written after the dataset.

### Serialization and ordering

- `Serialize()` sorts root-level elements by tag to satisfy the DICOM requirement for ascending group/element order.
- The first element must belong to the file meta header (`0002_xxxx`). The writer pads out the 128-byte preamble, writes `"DICM"`, then emits each element.
- A `DynamicBinaryBuffer` backs the binary output, ensuring capacity, handling padding, and encoding integers/floats in little-endian order.
- Sequences (`SQ`) are serialized with undefined-length delimiters as described in PS 3.5 §7.5. Each item receives start/end delimiters (`FFFE_E000`, `FFFE_E00D`) and sequences conclude with `FFFE_E0DD`.
- After root serialization, `Serialize` returns the final `Uint8Array`. When invoked on nested sequences the method writes into the parent buffer but returns `null`.

### Pixel data emission

- Pixel data supplied through `AddPixelData` is emitted after the dataset with a standard encapsulated pixel data structure: item header prefix, the compressed/uncompressed buffer, and sequence delimiters.
- The writer aligns the data to even byte boundaries and does not perform compression; provide pre-compressed pixel data if needed.

### Practical usage example

```ts
import { DicomWriter, DicomElement, DICOM_TAG as TAG } from 'efferent-dicom';

const writer = new DicomWriter();

writer.AddElement(new DicomElement(TAG.FILE_META_INFORMATION_GROUP_LENGTH, 'UL', 0));
writer.AddElement(new DicomElement(TAG.MEDIA_STORAGE_SOP_CLASS_UID, 'UI', '1.2.840.10008.5.1.4.1.1.2'));
writer.AddElement(new DicomElement(TAG.TRANSFER_SYNTAX_UID, 'UI', '1.2.840.10008.1.2.1'));

writer.AddElement(new DicomElement(TAG.PATIENT_NAME, 'PN', 'Doe^Jane'));
writer.AddElement(new DicomElement(TAG.MODALITY, 'CS', 'CT'));
writer.AddElement(new DicomElement(TAG.ROWS, 'US', 512));
writer.AddElement(new DicomElement(TAG.COLUMNS, 'US', 512));

// Optional pixel data
const pixels = new Uint16Array(512 * 512);
writer.AddPixelData(new Uint8Array(pixels.buffer));

const dicomBytes = writer.Serialize();
```

### Tips and limitations

- The writer expects you to manage UIDs, timestamps, and other metadata; it does not auto-generate values.
- Ensure file meta elements (`0002_group`) precede dataset elements or `Serialize` will throw.
- VRs not handled in `AddElement` (e.g., OB sequences with fragments, AT tag lists) will trigger `"Unsupported VR"` errors—extend the switch if you need additional coverage.

## DicomDictionary

### Responsibilities

- Lazily expands the `DICOM_DICT` CSV into an in-memory map keyed by `"GGGG_EEEE"`.
- Supplies VR, VM, and description strings used throughout parsing and presentation layers.

### API surface

- `GetDictionary(): Record<string, [vr, vm, description]>` — Returns the entire dictionary map, populating it on first call.
- `GetVR(tag: string): string | undefined` — Looks up the Value Representation for a tag. Multi-VR entries (containing `/`) return `undefined` to force caller-side logic.
- `GetVM(tag: string): string | undefined` — Returns the Value Multiplicity string.
- `GetDescription(tag: string): string | undefined` — Human-readable name, resolving shorthand references inside the CSV (e.g., `$1`, `%2` tokens).
- `printDict()` — Debug helper that logs every dictionary entry.

### Implementation notes

- The CSV backing store lives in `DictionarySource.ts` and mirrors curated tag definitions. `DicomDictionary` keeps the parsed dictionary cached after the first expansion.
- When parsing the CSV, blank VR values inherit the previous row’s VR, blank VMs default to `"1"`, and compact tag forms (e.g. `"0010"`) reuse the last group.

### Practical usage example

```ts
import { DicomDictionary, DICOM_TAG as TAG } from 'efferent-dicom';

const dict = new DicomDictionary();
console.log(dict.GetVR(TAG.PATIENT_NAME));        // "PN"
console.log(dict.GetDescription(TAG.PATIENT_NAME)); // "Patient's Name"
```

---

## Working with the components together

- `DicomReader` already constructs its own `DicomDictionary` instance, but you can share a single dictionary when building utilities that both read and write datasets to avoid repeated CSV parsing.
- When building custom UI, map over `Object.entries(reader.DicomTags)` and use the dictionary to display VRs and descriptions alongside values.
- For round-tripping data, deserialize with `DicomReader`, inspect or modify tags, then feed modified `DicomElement` objects into `DicomWriter` to produce a new byte stream.

## Additional tips and best practices

- Validate transfer syntax support before assuming pixel data extraction is available. Unsupported syntaxes still populate metadata but may leave `image` undefined.
- Use `PixelSpacing.ParseDicomTag` when you encounter spacing tags outside the reader context to maintain consistent calibration objects.
- If you need bulk tag iteration with stable ordering, sort the keys from `DicomTags` or provide a comparator—JavaScript object key order is insertion-based.
- For debugging raw datasets, use the `debug` flag on `DicomReader` or leverage the CLI demo in `demo/node/dicomdump.js` for a quick tag dump.
