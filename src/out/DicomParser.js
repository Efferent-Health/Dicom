define("DicomElement", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DicomElement = void 0;
    class DicomElement {
        constructor(tag, VR, value, VL = 0) {
            this.tag = tag;
            this.VR = VR;
            this.value = value;
            this.VL = VL;
        }
        ToString(indent) {
            if (Array.isArray(this.value)) {
                let response = "  ".repeat(indent) + this.tag + " " + (this.VR || "??") + " " + this.VL + " Array:\r\n";
                for (let i = 0; i < this.value.length; i++)
                    response += this.value[i].ToString(indent + 1) + "\r\n";
                return response;
            }
            else {
                let valueStr;
                if (typeof this.value === "undefined")
                    valueStr = "[undefined]";
                if (typeof this.value === "string")
                    valueStr = this.value.substring(0, 100);
                else if (typeof this.value === "number")
                    valueStr = this.value.toString();
                else
                    valueStr = "[binary]";
                return "  ".repeat(indent) + this.tag + " " + (this.VR || "??") + " " + this.VL + " " + valueStr;
            }
        }
    }
    exports.DicomElement = DicomElement;
});
define("DicomTags", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DICOM_TAG = void 0;
    exports.DICOM_TAG = {
        FILE_META_INFORMATION_GROUP_LENGTH: "0002_0000",
        MEDIA_STORAGE_SOP_CLASS_UID: "0002_0002",
        TRANSFER_SYNTAX_UID: "0002_0010",
        REFERENCED_FILE_ID: "0004_1500",
        DIRECTORY_RECORD_SEQUENCE: "0004_1220",
        DIRECTORY_RECORD_TYPE: "0004_1430",
        SPECIFIC_CHARACTER_SET: "0008_0005",
        IMAGE_TYPE: "0008_0008",
        SOP_CLASS_UID: "0008_0016",
        SOP_INSTANCE_UID: "0008_0018",
        STUDY_DATE: "0008_0020",
        ACQUISITION_DATE: "0008_0022",
        STUDY_TIME: "0008_0030",
        ACCESSION_NUMBER: "0008_0050",
        MODALITY: "0008_0060",
        MANUFACTURER: "0008,0070",
        INSTITUTION_NAME: "0008_0080",
        REFERRING_PHYSICIAN_NAME: "0008_0090",
        REFERENCED_IMAGE_SEQUENCE: "0008_1140",
        REFERENCED_SOP_CLASS_UID: "0008_1150",
        REFERENCED_SOP_INSTANCE_UID: "0008_1155",
        REFERENCED_FRAME_NUMBER: "0008_1160",
        STUDY_DESCRIPTION: "0008_1030",
        SERIES_DESCRIPTION: "0008_103E",
        PATIENT_NAME: "0010_0010",
        PATIENT_ID: "0010_0020",
        PATIENT_BIRTHDATE: "0010_0030",
        PATIENT_SEX: "0010_0040",
        PATIENT_AGE: "0010_1010",
        SLICE_THICKNESS: "0018_0050",
        CINE_RATE: "0018_0040",
        IMAGER_PIXEL_SPACING: "0018_1164",
        STUDY_ID: "0020_0010",
        INSTANCE_NUMBER: "0020_0013",
        STUDY_INSTANCE_UID: "0020_000D",
        SERIES_INSTANCE_UID: "0020_000E",
        SERIES_NUMBER: "0020_0011",
        IMAGE_POSITION_PATIENT: "0020_0032",
        IMAGE_ORIENTATION_PATIENT: "0020_0037",
        LATERALITY: "0020_0060",
        PLANE_POSITION_SEQUENCE: "0020_9113",
        PLANE_ORIENTATION_SEQUENCE: "0020_9116",
        REQUESTED_PROCEDURE_DESCRIPTION: "0032_1060",
        REQUEST_ATTRIBUTES_SEQUENCE: "0040_0275",
        ACQUISITION_TIME: "0008_0032",
        PHOTOMETRIC_INTERPRETATION: "0028_0004",
        SAMPLES_PER_PIXEL: "0028_0002",
        PLANAR_CONFIGURATION: "0028,0006",
        NUMBER_OF_FRAMES: "0028_0008",
        ROWS: "0028_0010",
        COLUMNS: "0028_0011",
        PIXEL_SPACING: "0028_0030",
        BITS_ALLOCATED: "0028_0100",
        BITS_STORED: "0028_0101",
        HIGH_BIT: "0028_0102",
        PIXEL_REPRESENTATION: "0028_0103",
        SMALLEST_IMAGE_PIXEL_VALUE: "0028_0106",
        LARGEST_IMAGE_PIXEL_VALUE: "0028_0107",
        WINDOW_CENTER: "0028_1050",
        WINDOW_WIDTH: "0028_1051",
        RESCALE_INTERCEPT: "0028_1052",
        RESCALE_SLOPE: "0028_1053",
        RESCALE_TYPE: "0028_1054",
        RED_PALETTE_COLOR_LOOKUP_TABLE_DESCRIPTOR: "0028_1101",
        GREEN_PALETTE_COLOR_LOOKUP_TABLE_DESCRIPTOR: "0028_1102",
        BLUE_PALETTE_COLOR_LOOKUP_TABLE_DESCRIPTOR: "0028_1103",
        RED_PALETTE_COLOR_LOOKUP_TABLE_DATA: "0028_1201",
        GREEN_PALETTE_COLOR_LOOKUP_TABLE_DATA: "0028_1202",
        BLUE_PALETTE_COLOR_LOOKUP_TABLE_DATA: "0028_1203",
        LOSSY_IMAGE_COMPRESSION: "0028_2110",
        LOSSY_IMAGE_COMPRESSION_RATIO: "0028_2112",
        LOSSY_IMAGE_COMPRESSION_METHOD: "0028_2114",
        LUT_DESCRIPTOR: "0028_3002",
        LUT_DATA: "0028_3006",
        VOI_LUT_SEQUENCE: "0028_3010",
        PIXEL_MEASURES_SEQUENCE: "0028_9110",
        FRAME_VOI_LUT_SEQUENCE: "0028_9132",
        PIXEL_VALUE_TRANSFORMATION_SEQUENCE: "0028_9145",
        ENCAPSULATED_DOCUMENT: "0042_0011",
        TRACKING_ID: "0062_0020",
        TRACKING_UID: "0062_0021",
        GRAPHIC_ANNOTATION_SEQUENCE: "0070_0001",
        GRAPHIC_LAYER: "0070_0002",
        BOUNDING_BOX_ANNOTATION_UNITS: "0070_0003",
        ANCHOR_POINT_ANNOTATION_UNITS: "0070_0004",
        GRAPHIC_ANNOTATION_UNITS: "0070_0005",
        UNFORMATTED_TEXT_VALUE: "0070_0006",
        TEXT_OBJECT_SEQUENCE: "0070_0008",
        GRAPHIC_OBJECT_SEQUENCE: "0070_0009",
        BOUNDING_BOX_TOP_LEFT_HAND_CORNER: "0070_0010",
        BOUNDING_BOX_BOTTOM_RIGHT_HAND_CORNER: "0070_0011",
        BOUNDING_BOX_TEXT_HORIZONTAL_JUSTIFICATION: "0070_0012",
        ANCHOR_POINT: "0070_0014",
        ANCHOR_POINT_VISIBILITY: "0070_0015",
        GRAPHIC_DIMENSIONS: "0070_0020",
        NUMBER_OF_GRAPHIC_POINTS: "0070_0021",
        GRAPHIC_DATA: "0070_0022",
        GRAPHIC_TYPE: "0070_0023",
        GRAPHIC_FILLED: "0070_0024",
        COMPOUND_GRAPHIC_SEQUENCE: "0070_0209",
        GRAPHIC_GROUP_ID: "0070_0295",
        PRESENTATION_LUT_SHAPE: "2050_0020",
        PER_FRAME_FUNC_GROUPS_SEQUENCE: "5200_9230",
        PIXEL_DATA: "7FE0_0010",
        DELIMITATION_SEQUENCE: "FFFE_E000",
        DELIMITATION_SEQUENCE_ITEMS_1: "FFFE_E00D",
        DELIMITATION_SEQUENCE_ITEMS_2: "FFFE_E0DD"
    };
});
define("PixelSpacing", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PixelSpacing = void 0;
    class PixelSpacing {
        constructor(pixelX, pixelY, units) {
            this.PixelX = pixelX || 1;
            this.PixelY = pixelY || (pixelX || 1);
            this.Units = units || (pixelX ? "mm" : "px");
            this.CalibrationFactor = pixelX || pixelY || 1;
        }
        static ParseDicomTag(tagValue) {
            try {
                var values = tagValue.split("\\");
                var c = parseFloat(values[0]);
                var r = parseFloat(values[1]);
                return new PixelSpacing(c, r, "mm");
            }
            catch {
                return null;
            }
        }
    }
    exports.PixelSpacing = PixelSpacing;
});
define("DicomParser", ["require", "exports", "DicomElement", "DicomTags", "PixelSpacing"], function (require, exports, DicomElement_1, DicomTags_1, PixelSpacing_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DicomParser = void 0;
    class DicomParser {
        constructor(buffer, debug = false) {
            this.position = 0;
            this.pidCounter = 1;
            this.headerSize = 128;
            this.isUnsigned = true;
            this.DicomTags = {};
            this.reachedPixelData = false;
            this.implicitVR = false;
            this.dicomBuffer = buffer;
            this.isDebug = debug;
            this.fileSize = buffer.length;
            this.textDecoder = this.createDicomTextDecoder();
            this.textDecoderUTF8 = new TextDecoder("utf-8");
            if (this.fileSize < 140)
                return;
            if (buffer[128] !== 0x44 ||
                buffer[129] !== 0x49 ||
                buffer[130] !== 0x43 ||
                buffer[131] !== 0x4D)
                return;
            this.position = 132;
            let element;
            while (element = this.getNextElement()) {
                this.fixVRValue(element);
                this.readElementValue(element);
                this.addValueToMainDataset(element);
                this.evaluateElementTag(element, false);
                if (this.isDebug)
                    console.log(element.ToString(0));
                if (Number.isNaN(this.position) || (this.position + 8) >= this.fileSize)
                    break;
            }
        }
        getNextElement() {
            if (this.image && this.ismainImage)
                return null;
            try {
                let VR;
                let VL;
                const tag = this.fetchTag();
                if (this.implicitVR && this.position >= this.headerSize) {
                    VL = this.dicomBuffer[this.position + 4] + this.dicomBuffer[this.position + 5] * 256 + this.dicomBuffer[this.position + 6] * 65536 + this.dicomBuffer[this.position + 7] * 16777216;
                    this.position += 8;
                }
                else {
                    switch (tag) {
                        case "FFFE_E000":
                        case "FFFE_E00D":
                        case "FFFE_E0DD":
                            VL = this.dicomBuffer[this.position + 4] + this.dicomBuffer[this.position + 5] * 256 + this.dicomBuffer[this.position + 6] * 65536 + this.dicomBuffer[this.position + 7] * 16777216;
                            this.position += 8;
                            break;
                        default:
                            VR = String.fromCharCode(this.dicomBuffer[this.position + 4]) + String.fromCharCode(this.dicomBuffer[this.position + 5]);
                            switch (VR) {
                                case "OB":
                                case "OD":
                                case "OL":
                                case "OF":
                                case "OV":
                                case "OW":
                                case "SQ":
                                case "SV":
                                case "UC":
                                case "UN":
                                case "UR":
                                case "UT":
                                case "UV":
                                    VL = this.dicomBuffer[this.position + 8] + this.dicomBuffer[this.position + 9] * 256 + this.dicomBuffer[this.position + 10] * 65536 + this.dicomBuffer[this.position + 11] * 16777216;
                                    this.position += 12;
                                    break;
                                default:
                                    VL = this.dicomBuffer[this.position + 6] + this.dicomBuffer[this.position + 7] * 256;
                                    this.position += 8;
                                    break;
                            }
                            break;
                    }
                }
                if (VR && VR !== "SQ" && tag !== "7FE0_0010" && VL === 0xFFFFFFFF)
                    return null;
                return new DicomElement_1.DicomElement(tag, VR, "", VL);
            }
            catch (err) {
                return null;
            }
        }
        fixVRValue(element) {
            if (this.transferSyntax === "1.2.840.10008.1.2.1" && element.tag === "7FE0_0010") {
                if (element.VR === "OW" && this.photometric === "RGB")
                    element.VR = "OB";
                else if (element.VR === "OW" && this.bitsAllocated === 8 && (this.modality === "XA" || this.modality === "RF" || this.modality === "US"))
                    element.VR = "OB";
                else if ((this.modality === "MG" || this.modality === "DX") && this.bitsAllocated === 16)
                    element.VR = "OW";
            }
        }
        readElementValue(element) {
            let position = this.position;
            if (this.implicitVR && position >= this.headerSize) {
                const tag = this.fetchTag();
                if (element.VL === 0xFFFFFFFF || tag === "FFFE_E000") {
                    element.value = [];
                    this.processSequence(element);
                }
                else if (element.VL > 1024) {
                    element.value = "[LONG CONTENT]";
                    this.position += element.VL;
                }
                else {
                    const bytes = this.dicomBuffer.subarray(position, position + element.VL);
                    element.value = this.textDecoder.decode(bytes).replace(/[\0\s]+$/, '');
                    this.position += element.VL;
                }
                return;
            }
            if (element.tag === "7FE0_0010" && element.VL === 0xFFFFFFFF && (element.VR === "OB" || element.VR === "OW")) {
                element.value = [];
                this.processPixelDataSequence(element);
                if (!this.numberFrames || (this.numberFrames && this.numberFrames === 1)) {
                    this.image = (element.value && Array.isArray(element.value)) ? element.value[element.value.length - 1] : element.value;
                }
                else if (this.numberFrames > 1) {
                    this.image = element.value;
                }
                return;
            }
            switch (element.VR) {
                case "AE":
                case "AS":
                case "AT":
                case "CS":
                case "DA":
                case "DS":
                case "DT":
                case "IS":
                case "LO":
                case "LT":
                case "PN":
                case "SH":
                case "ST":
                case "TM":
                case "UI":
                case "UT":
                    {
                        const bytes = this.dicomBuffer.subarray(position, position + element.VL);
                        element.value = this.textDecoder.decode(bytes).replace(/[\0\s]+$/, '');
                    }
                    break;
                case "UR":
                case "UC":
                    {
                        const bytes = this.dicomBuffer.subarray(position, position + element.VL);
                        element.value = this.textDecoderUTF8.decode(bytes).replace(/[\0\s]+$/, '');
                    }
                    break;
                case "OD":
                    element.value = new Float64Array(this.bufferSlice(position, position + element.VL));
                    break;
                case "OL":
                    element.value = new Uint32Array(this.bufferSlice(position, position + element.VL));
                    break;
                case "FL":
                    if (element.VL == 4)
                        element.value = (new Float32Array(this.getBytes(4)))[0];
                    else
                        element.value = Array.prototype.slice.call(new Float32Array(this.getBytes(element.VL)));
                    break;
                case "FD":
                    if (element.VL == 8)
                        element.value = (new Float64Array(this.getBytes(8)))[0];
                    else
                        element.value = Array.prototype.slice.call(new Float32Array(this.getBytes(element.VL)));
                    break;
                case "OB":
                    if (this.bitsAllocated === 8) {
                        element.value = new Uint8Array(this.bufferSlice(position, position + element.VL));
                    }
                    else {
                        try {
                            if (this.isUnsigned)
                                element.value = new Uint16Array(this.bufferSlice(position, position + element.VL));
                            else
                                element.value = new Int16Array(this.bufferSlice(position, position + element.VL));
                        }
                        catch (err) {
                            try {
                                if (this.isUnsigned)
                                    element.value = new Uint8Array(this.bufferSlice(position, position + element.VL));
                                else
                                    element.value = new Int8Array(this.bufferSlice(position, position + element.VL));
                            }
                            catch (err2) {
                                element.value = "";
                            }
                        }
                    }
                    break;
                case "OW":
                    try {
                        if (this.isUnsigned)
                            element.value = new Uint16Array(this.bufferSlice(position, position + element.VL));
                        else
                            element.value = new Int16Array(this.bufferSlice(position, position + element.VL));
                    }
                    catch (err) {
                        element.value = "";
                    }
                    break;
                case "OF":
                    element.value = new Float32Array(this.bufferSlice(position, position + element.VL));
                    break;
                case "OV":
                    if (typeof BigUint64Array !== "undefined") {
                        element.value = new BigUint64Array(this.bufferSlice(position, position + element.VL));
                    }
                    else {
                        element.value = null;
                        if (this.isDebug)
                            console.warn("BigUint64Array not supported in this browser. Skipping OV value.");
                    }
                    break;
                case "SL":
                    if (element.VL == 4)
                        element.value = (new Int32Array(this.getBytes(4)))[0];
                    else
                        element.value = Array.prototype.slice.call(new Int32Array(this.getBytes(element.VL)));
                    break;
                case "SS":
                    if (element.VL == 2)
                        element.value = (new Int16Array(this.getBytes(2)))[0];
                    else
                        element.value = Array.prototype.slice.call(new Int16Array(this.getBytes(element.VL)));
                    break;
                case "SV":
                    if (typeof BigInt64Array !== "undefined") {
                        element.value = new BigInt64Array(this.bufferSlice(position, position + element.VL));
                    }
                    else {
                        element.value = null;
                        if (this.isDebug)
                            console.warn("BigInt64Array not supported in this browser. Skipping SV value.");
                    }
                    break;
                case "UL":
                    if (element.VL == 4)
                        element.value = (new Uint32Array(this.getBytes(4)))[0];
                    else
                        element.value = Array.prototype.slice.call(new Uint32Array(this.getBytes(element.VL)));
                    break;
                case "US":
                    if (element.VL == 2)
                        element.value = (new Uint16Array(this.getBytes(2)))[0];
                    else
                        element.value = Array.prototype.slice.call(new Uint16Array(this.getBytes(element.VL)));
                    break;
                case "UN":
                    element.value = new Uint8Array(this.bufferSlice(position, position + element.VL));
                    break;
                case "UV":
                    if (typeof BigUint64Array !== "undefined") {
                        element.value = new BigUint64Array(this.bufferSlice(position, position + element.VL));
                    }
                    else {
                        element.value = null;
                        if (this.isDebug)
                            console.warn("BigUint64Array not supported in this browser. Skipping UV value.");
                    }
                    break;
                case "SQ":
                    element.value = [];
                    this.processSequence(element);
                    return;
                default:
                    if (element.tag === "FFFE_E000") {
                        element.value = [];
                        this.processSequence(element);
                        return;
                    }
                    break;
            }
            if (element.VL !== 0xFFFFFFFF)
                this.position += element.VL;
        }
        evaluateElementTag(element, isSequence) {
            if (element.tag === "7FE0_0010" && element.VL !== 0xFFFFFFFF) {
                this.reachedPixelData = true;
                if (this.implicitVR)
                    return;
                if (!isSequence && this.image)
                    this.ismainImage = true;
                return;
            }
            if (isSequence)
                return;
            const value = element.value;
            switch (element.tag) {
                case DicomTags_1.DICOM_TAG.FILE_META_INFORMATION_GROUP_LENGTH:
                    this.headerSize = this.position + value;
                    break;
                case DicomTags_1.DICOM_TAG.TRANSFER_SYNTAX_UID:
                    this.transferSyntax = value;
                    if (value === "1.2.840.10008.1.2") {
                        this.implicitVR = true;
                    }
                    else if (value === "1.2.840.10008.1.2.1.99") {
                        const inflator = new Inflator();
                        this.dicomBuffer = inflator.Inflate(this.dicomBuffer, this.headerSize, this.fileSize - this.headerSize);
                        this.fileSize = this.dicomBuffer.length;
                        this.headerSize = 0;
                        this.position = 0;
                    }
                    break;
                case DicomTags_1.DICOM_TAG.SPECIFIC_CHARACTER_SET:
                    this.textDecoder = this.createDicomTextDecoder(value);
                    break;
                case DicomTags_1.DICOM_TAG.PHOTOMETRIC_INTERPRETATION:
                    this.photometric = value.toUpperCase();
                    break;
                case DicomTags_1.DICOM_TAG.NUMBER_OF_FRAMES:
                    this.numberFrames = value ? parseInt(value) : value;
                    break;
                case DicomTags_1.DICOM_TAG.BITS_ALLOCATED:
                    try {
                        this.bitsAllocated = parseInt(value);
                    }
                    catch (err) {
                        console.log(err);
                    }
                    break;
                case DicomTags_1.DICOM_TAG.HIGH_BIT:
                    const hightBitValue = +value;
                    break;
                case DicomTags_1.DICOM_TAG.PIXEL_REPRESENTATION:
                    this.isUnsigned = (value === "0" || value === 0);
                    break;
                case DicomTags_1.DICOM_TAG.PIXEL_SPACING:
                    this.pixelSpacing = PixelSpacing_1.PixelSpacing.ParseDicomTag(value);
                    break;
                case DicomTags_1.DICOM_TAG.IMAGER_PIXEL_SPACING:
                    if (!this.pixelSpacing)
                        this.pixelSpacing = PixelSpacing_1.PixelSpacing.ParseDicomTag(value);
                    break;
                case DicomTags_1.DICOM_TAG.MODALITY:
                    this.modality = value;
                    switch (value) {
                        case "CR":
                        case "DX":
                        case "US":
                        case "NM":
                        case "XA":
                        case "RF":
                            this.isUnsigned = true;
                            break;
                        case "CT":
                        case "MR":
                        case "PET":
                            this.isUnsigned = false;
                            break;
                        default:
                            this.isUnsigned = true;
                            break;
                    }
                    break;
            }
        }
        fetchTag() {
            if (this.position + 4 > this.fileSize)
                return "";
            const group = this.dicomBuffer[this.position] + this.dicomBuffer[this.position + 1] * 256;
            const elem = this.dicomBuffer[this.position + 2] + this.dicomBuffer[this.position + 3] * 256;
            const tag = ((group + 0x10000).toString(16).substr(-4) + "_" + (elem + 0x10000).toString(16).substr(-4)).toUpperCase();
            return tag;
        }
        addValueToMainDataset(element) {
            if (element.tag !== DicomTags_1.DICOM_TAG.PIXEL_DATA) {
                if (!element.value.hasOwnProperty("buffer")) {
                    const value = element.value;
                    if (element.tag === DicomTags_1.DICOM_TAG.PATIENT_ID) {
                        if (!this.DicomTags[element.tag])
                            this.DicomTags[element.tag] = value;
                        else
                            this.DicomTags[element.tag + "_" + (this.pidCounter++)] = value;
                    }
                    else {
                        this.DicomTags[element.tag] = value;
                    }
                }
            }
        }
        processPixelDataSequence(rootElement) {
            while (true) {
                const tag = this.fetchTag();
                const VL = this.dicomBuffer[this.position + 4] + this.dicomBuffer[this.position + 5] * 256 + this.dicomBuffer[this.position + 6] * 65536 + this.dicomBuffer[this.position + 7] * 16777216;
                this.position += 8;
                if (tag === DicomTags_1.DICOM_TAG.DELIMITATION_SEQUENCE && VL > 4) {
                    let value;
                    const position = this.position;
                    try {
                        if (rootElement.VR === "OB") {
                            value = new Uint8Array(this.bufferSlice(position, position + VL));
                        }
                        else if (rootElement.VR === "OW") {
                            if (this.isUnsigned)
                                value = new Uint16Array(this.bufferSlice(position, position + VL));
                            else
                                value = new Int16Array(this.bufferSlice(position, position + VL));
                        }
                        else {
                            break;
                        }
                        rootElement.value.push(value);
                    }
                    catch (err) {
                        rootElement.value = value;
                        break;
                    }
                }
                else if (tag === DicomTags_1.DICOM_TAG.DELIMITATION_SEQUENCE_ITEMS_1 || tag === DicomTags_1.DICOM_TAG.DELIMITATION_SEQUENCE_ITEMS_2) {
                    break;
                }
                else if ((this.position + 8) >= this.fileSize) {
                    break;
                }
                this.position += VL;
            }
        }
        processSequence(rootElement) {
            if (rootElement) {
                if (rootElement.VL === 0)
                    return;
                const lengthUnknown = rootElement.VL === 0xFFFFFFFF;
                let limit;
                if (!lengthUnknown)
                    limit = this.position + rootElement.VL;
                let element;
                while (element = this.getNextElement()) {
                    if (!lengthUnknown && element.VL === 0xFFFFFFFF)
                        element.VL = limit - this.position;
                    this.fixVRValue(element);
                    this.readElementValue(element);
                    this.evaluateElementTag(element, true);
                    if (Number.isNaN(this.position)) {
                        break;
                    }
                    if ((this.position + 8) >= this.fileSize) {
                        rootElement.value.push(element);
                        break;
                    }
                    if (!lengthUnknown && this.position >= limit) {
                        rootElement.value.push(element);
                        break;
                    }
                    if (lengthUnknown && element.tag === DicomTags_1.DICOM_TAG.DELIMITATION_SEQUENCE_ITEMS_1) {
                        break;
                    }
                    if (lengthUnknown && element.tag === DicomTags_1.DICOM_TAG.DELIMITATION_SEQUENCE_ITEMS_2) {
                        break;
                    }
                    rootElement.value.push(element);
                }
            }
        }
        getBytes(count) {
            const buf = new ArrayBuffer(count);
            new Uint8Array(buf).set(this.dicomBuffer.subarray(this.position, this.position + count));
            return buf;
        }
        bufferSlice(start, end) {
            const bufLike = this.dicomBuffer.buffer;
            if (bufLike instanceof ArrayBuffer && typeof bufLike.slice === "function")
                return bufLike.slice(start, end);
            const src = this.dicomBuffer;
            const s = start | 0;
            const e = end === undefined ? src.byteLength : end;
            const out = new ArrayBuffer(Math.max(0, e - s));
            new Uint8Array(out).set(src.subarray(s, e));
            return out;
        }
        createDicomTextDecoder(charsetTagValue) {
            const dicomToJsEncoding = {
                "ISO_IR 6": "us-ascii",
                "ISO_IR 100": "iso-8859-1",
                "ISO_IR 101": "iso-8859-2",
                "ISO_IR 109": "iso-8859-3",
                "ISO_IR 110": "iso-8859-4",
                "ISO_IR 144": "iso-8859-5",
                "ISO_IR 127": "iso-8859-6",
                "ISO_IR 126": "iso-8859-7",
                "ISO_IR 138": "iso-8859-8",
                "ISO_IR 148": "iso-8859-9",
                "ISO_IR 166": "iso-8859-11",
                "ISO_IR 192": "utf-8",
                "GB18030": "gb18030",
                "GBK": "gbk",
                "ISO 2022 IR 13": "shift_jis",
                "ISO 2022 IR 87": "iso-2022-jp",
                "ISO 2022 IR 159": "iso-2022-jp",
                "ISO 2022 IR 149": "euc-kr",
                "ISO_IR 13": "shift_jis",
                "ISO_IR 87": "iso-2022-jp",
                "ISO_IR 159": "iso-2022-jp",
                "ISO_IR 149": "euc-kr",
                "ISO_IR 58": "gb2312",
            };
            let encoding = "us-ascii";
            if (charsetTagValue) {
                const normalized = charsetTagValue.trim().toUpperCase();
                if (dicomToJsEncoding[normalized]) {
                    encoding = dicomToJsEncoding[normalized];
                }
            }
            return new TextDecoder(encoding);
        }
    }
    exports.DicomParser = DicomParser;
});
class BitReader {
    constructor(buffer, start, length) {
        this.bitsLength = 0;
        this.bits = 0;
        this.buffer = buffer;
        this.pos = start;
        this.limit = start + length - 1;
    }
    ReadByte() {
        if (this.pos > this.limit)
            return -1;
        return this.buffer[this.pos++];
    }
    ReadBit() {
        if (this.bitsLength === 0) {
            const nextByte = this.ReadByte();
            if (nextByte < 0)
                throw new Error("Unexpected end of stream");
            this.bits = nextByte;
            this.bitsLength = 8;
        }
        const bit = (this.bits & 1) !== 0;
        this.bits >>= 1;
        --this.bitsLength;
        return bit;
    }
    Align() {
        this.bitsLength = 0;
    }
    ReadBytes(len) {
        if (this.bitsLength !== 0)
            throw new Error("BitReader not aligned");
        if (this.pos + len - 1 > this.limit)
            throw new Error("Unexpected end of stream");
        const out = new Uint8Array(len);
        out.set(this.buffer.subarray(this.pos, this.pos + len));
        this.pos += len;
        return out;
    }
    ReadLSB(length) {
        let data = 0;
        for (let i = 0; i < length; ++i) {
            if (this.ReadBit())
                data |= 1 << i;
        }
        return data;
    }
}
class Inflator {
    constructor() {
        this.encodedLengthStart = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258];
        this.encodedLengthAdditionalBits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
        this.encodedDistanceStart = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];
        this.encodedDistanceAdditionalBits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
        this.clenMap = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
        this.initializeStaticTrees();
    }
    pushArray(arr) {
        for (let i = 0, n = arr.length; i < n; i++)
            this.buffer.push(arr[i]);
    }
    Inflate(inputbuffer, start, length) {
        this.bitReader = new BitReader(inputbuffer, start, length);
        this.buffer = new Array(0);
        this.bufferPosition = 0;
        this.state = 0;
        this.blockFinal = false;
        const output = [];
        let byte;
        try {
            while ((byte = this.readByte()) >= 0) {
                output.push(byte);
            }
        }
        catch (err) {
            console.error("Inflation error: ", err);
        }
        return new Uint8Array(output);
    }
    buildCodes(lengths) {
        const codes = new Array(lengths.length);
        let maxBits = lengths[0];
        for (let i = 1; i < lengths.length; i++) {
            if (maxBits < lengths[i])
                maxBits = lengths[i];
        }
        const bitLengthsCount = new Array(maxBits + 1);
        for (let i = 0; i <= maxBits; i++)
            bitLengthsCount[i] = 0;
        for (let i = 0; i < lengths.length; i++) {
            ++bitLengthsCount[lengths[i]];
        }
        const nextCode = new Array(maxBits + 1);
        let code = 0;
        bitLengthsCount[0] = 0;
        for (let bits = 1; bits <= maxBits; bits++) {
            code = (code + bitLengthsCount[bits - 1]) << 1;
            nextCode[bits] = code;
        }
        for (let n = 0; n < codes.length; n++) {
            const len = lengths[n];
            if (len !== 0) {
                codes[n] = nextCode[len];
                nextCode[len]++;
            }
        }
        return codes;
    }
    initializeStaticTrees() {
        const codes = new Array(288);
        const codesLengths = new Array(288);
        for (let i = 0; i <= 143; i++) {
            codes[i] = 0x0030 + i;
            codesLengths[i] = 8;
        }
        for (let i = 144; i <= 255; i++) {
            codes[i] = 0x0190 + i - 144;
            codesLengths[i] = 9;
        }
        for (let i = 256; i <= 279; i++) {
            codes[i] = 0x0000 + i - 256;
            codesLengths[i] = 7;
        }
        for (let i = 280; i <= 287; i++) {
            codes[i] = 0x00C0 + i - 280;
            codesLengths[i] = 8;
        }
        this.staticCodes = this.buildTree(codes, codesLengths);
        const distances = new Array(32);
        const distancesLengths = new Array(32);
        for (let i = 0; i <= 31; i++) {
            distances[i] = i;
            distancesLengths[i] = 5;
        }
        this.staticDistances = this.buildTree(distances, distancesLengths);
    }
    buildTree(codes, lengths) {
        const nonEmptyCodes = [];
        for (let i = 0; i < codes.length; ++i) {
            if (lengths[i] > 0) {
                const code = {
                    bits: codes[i],
                    length: lengths[i],
                    index: i
                };
                nonEmptyCodes.push(code);
            }
        }
        return this.buildTreeBranch(nonEmptyCodes, 0, 0);
    }
    buildTreeBranch(codes, prefix, prefixLength) {
        if (codes.length === 0)
            return null;
        const zeros = [];
        const ones = [];
        const branch = {};
        branch.isLeaf = false;
        for (let i = 0; i < codes.length; ++i) {
            if (codes[i].length === prefixLength && codes[i].bits === prefix) {
                branch.isLeaf = true;
                branch.index = codes[i].index;
                break;
            }
            else {
                const nextBit = ((codes[i].bits >> (codes[i].length - prefixLength - 1)) & 1) > 0;
                if (nextBit)
                    ones.push(codes[i]);
                else
                    zeros.push(codes[i]);
            }
        }
        if (!branch.isLeaf) {
            branch.zero = this.buildTreeBranch(zeros, (prefix << 1), prefixLength + 1);
            branch.one = this.buildTreeBranch(ones, (prefix << 1) | 1, prefixLength + 1);
        }
        return branch;
    }
    readDynamicTrees(bitReader) {
        const hlit = bitReader.ReadLSB(5) + 257;
        const hdist = bitReader.ReadLSB(5) + 1;
        const hclen = bitReader.ReadLSB(4) + 4;
        const clen = new Array(19);
        for (let i = 0; i < clen.length; ++i)
            clen[i] = 0;
        for (let i = 0; i < hclen; ++i)
            clen[this.clenMap[i]] = bitReader.ReadLSB(3);
        const clenCodes = this.buildCodes(clen);
        const clenTree = this.buildTree(clenCodes, clen);
        const lengthsSequence = new Array(0);
        while (lengthsSequence.length < hlit + hdist) {
            let p = clenTree;
            while (!p.isLeaf) {
                p = bitReader.ReadBit() ? p.one : p.zero;
            }
            const code = p.index;
            switch (true) {
                case code <= 15:
                    lengthsSequence.push(code);
                    break;
                case code === 16:
                    const repeat1 = bitReader.ReadLSB(2) + 3;
                    for (let q = 0; q < repeat1; ++q)
                        lengthsSequence.push(lengthsSequence[lengthsSequence.length - 1]);
                    break;
                case code === 17:
                    const repeat2 = bitReader.ReadLSB(3) + 3;
                    for (let q = 0; q < repeat2; ++q)
                        lengthsSequence.push(0);
                    break;
                case code === 18:
                    const repeat3 = bitReader.ReadLSB(7) + 11;
                    for (let q = 0; q < repeat3; ++q)
                        lengthsSequence.push(0);
                    break;
                default:
                    break;
            }
        }
        const codesLengths = lengthsSequence.slice(0, hlit);
        const codes = this.buildCodes(codesLengths);
        const distancesLengths = lengthsSequence.slice(hlit, hlit + hdist);
        const distances = this.buildCodes(distancesLengths);
        const result = {
            codesTree: this.buildTree(codes, codesLengths),
            distancesTree: this.buildTree(distances, distancesLengths)
        };
        return result;
    }
    readByte() {
        while (this.bufferPosition >= this.buffer.length) {
            const item = this.decodeItem();
            if (item == null)
                return -1;
            switch (item.itemType) {
                case 0:
                    this.pushArray(item.array);
                    break;
                case 2:
                    this.buffer.push(item.symbol);
                    break;
                case 3: {
                    const dist = item.distance;
                    const len = item.length;
                    const start = this.buffer.length - dist;
                    if (dist >= len) {
                        this.pushArray(this.buffer.slice(start, start + len));
                        break;
                    }
                    if (dist === 1) {
                        const v = this.buffer[this.buffer.length - 1];
                        for (let k = 0; k < len; k++)
                            this.buffer.push(v);
                        break;
                    }
                    let j = start, remaining = len;
                    while (remaining > 0) {
                        const take = Math.min(remaining, dist);
                        for (let k = 0; k < take; k++)
                            this.buffer.push(this.buffer[j + k]);
                        j += take;
                        remaining -= take;
                    }
                    break;
                }
            }
        }
        const symbol = this.buffer[this.bufferPosition++];
        if (this.bufferPosition > 0x20000) {
            const keep = 0x18000;
            const shift = Math.max(0, this.buffer.length - keep);
            if (shift > 0) {
                this.buffer = this.buffer.slice(shift);
                this.bufferPosition -= shift;
            }
        }
        return symbol;
    }
    decodeItem() {
        if (this.state === 2)
            return null;
        if (this.state === 0) {
            this.blockFinal = this.bitReader.ReadBit();
            const blockType = this.bitReader.ReadLSB(2);
            switch (blockType) {
                case 0:
                    this.bitReader.Align();
                    const len = this.bitReader.ReadLSB(16);
                    const nlen = this.bitReader.ReadLSB(16);
                    if ((len & ~nlen) !== len)
                        throw new Error("Invalid block type 0 length");
                    const arr = this.bitReader.ReadBytes(len);
                    const thisItem = { itemType: 0, array: arr };
                    if (this.blockFinal)
                        this.state = 2;
                    return thisItem;
                case 1:
                    this.codesTree = this.staticCodes;
                    this.distancesTree = this.staticDistances;
                    this.state = 1;
                    break;
                case 2:
                    let dynamicTrees = this.readDynamicTrees(this.bitReader);
                    this.codesTree = dynamicTrees.codesTree;
                    this.distancesTree = dynamicTrees.distancesTree;
                    this.state = 1;
                    break;
                default:
                    throw new Error("Invalid block type (3)");
            }
        }
        const item = {};
        let p = this.codesTree;
        while (!p.isLeaf) {
            p = this.bitReader.ReadBit() ? p.one : p.zero;
        }
        if (p.index < 256) {
            item.itemType = 2;
            item.symbol = p.index;
        }
        else if (p.index > 256) {
            const lengthCode = p.index;
            if (lengthCode > 285)
                throw new Error("Invalid length code");
            let length = this.encodedLengthStart[lengthCode - 257];
            if (this.encodedLengthAdditionalBits[lengthCode - 257] > 0)
                length += this.bitReader.ReadLSB(this.encodedLengthAdditionalBits[lengthCode - 257]);
            p = this.distancesTree;
            while (!p.isLeaf) {
                p = this.bitReader.ReadBit() ? p.one : p.zero;
            }
            const distanceCode = p.index;
            let distance = this.encodedDistanceStart[distanceCode];
            if (this.encodedDistanceAdditionalBits[distanceCode] > 0)
                distance += this.bitReader.ReadLSB(this.encodedDistanceAdditionalBits[distanceCode]);
            item.itemType = 3;
            item.distance = distance;
            item.length = length;
        }
        else {
            item.itemType = 1;
            this.state = this.blockFinal ? 2 : 0;
        }
        return item;
    }
}
//# sourceMappingURL=DicomParser.js.map