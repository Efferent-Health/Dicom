// Node/Module entry that re-exports from the global namespace build.
// The tsup banner prepends dist/Efferent.Dicom.js so `Efferent` exists at runtime.

declare const Efferent: any;

const NS = (globalThis as any).Efferent ?? Efferent;

export const DICOM_TAG = NS.DICOM_TAG;
export const DicomReader = NS.DicomReader;
export const DicomWriter = NS.DicomWriter;
export const DicomElement = NS.DicomElement;
export const PixelSpacing = NS.PixelSpacing;

export default NS;