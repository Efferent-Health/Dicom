// Node/Module entry that re-exports from the global namespace build.
// Assumes the browser bundle (Efferent.Dicom.js) has been prepended by the bundler.

declare const Efferent: any; // runtime provided by prepended browser build

const NS = (globalThis as any).Efferent ?? Efferent;

export const DICOM_TAG = NS.DICOM_TAG;
export const DicomParser = NS.DicomParser;
export const DicomWriter = NS.DicomWriter;

// If you expose more API on the namespace, export them here too:
// export const BitReader = NS.BitReader;
// export const PixelSpacing = NS.PixelSpacing;

export default NS;