namespace Efferent.Frontend.WebClient
{
    /*
    DICOM documentation
    Datasets:  https://dicom.nema.org/medical/Dicom/2024e/output/chtml/part05/chapter_7.html
    Sequences: https://dicom.nema.org/medical/Dicom/2024e/output/chtml/part05/sect_7.5.html
    VR types:  https://dicom.nema.org/medical/Dicom/2024e/output/chtml/part05/sect_6.2.html
    */
    export class DicomParser
    {
        private dicomBuffer: Uint8Array;
        private position: number = 0;
        private fileSize: number;
        private pidCounter: number = 1;
        private isDebug: boolean;
        private ismainImage: boolean;
        private headerSize: number = 128;
        private numberFrames: number;
        private textDecoder: TextDecoder;
        private textDecoderUTF8: TextDecoder;

        public isUnsigned: boolean = true;
        public bitsAllocated: number;
        public transferSyntax: string;
        public modality: string;
        public photometric: string;
        public DicomTags: object = {};
        public image: Uint8Array;
        public reachedPixelData: boolean = false;
        public implicitVR: boolean = false;
        public pixelSpacing: PixelSpacing;

        constructor(buffer: Uint8Array, debug: boolean = false)
        {
            this.dicomBuffer = buffer;
            this.isDebug = debug;
            this.fileSize = buffer.length;
            this.textDecoder = this.createDicomTextDecoder();
            this.textDecoderUTF8 = new TextDecoder("utf-8");

            if (this.fileSize < 140)
                return;

            if (
                buffer[128] !== 0x44 || // 'D'
                buffer[129] !== 0x49 || // 'I'
                buffer[130] !== 0x43 || // 'C'
                buffer[131] !== 0x4D    // 'M'
            ) return;

            this.position = 132;

            let element: DicomElement;

            while (element = this.getNextElement())
            {
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

        private getNextElement(): DicomElement
        {
            if (this.image && this.ismainImage)
                return null;

            try
            {
                let VR: string;
                let VL: number;
                const tag = this.fetchTag();

                // if (this.implicitVR && !tag.startsWith("0002"))
                if (this.implicitVR && this.position >= this.headerSize)
                {
                    VL = this.dicomBuffer[this.position + 4] + this.dicomBuffer[this.position + 5] * 256 + this.dicomBuffer[this.position + 6] * 65536 + this.dicomBuffer[this.position + 7] * 16777216;
                    this.position += 8;
                }
                else
                {
                    switch (tag)
                    {
                        case "FFFE_E000":
                        case "FFFE_E00D":
                        case "FFFE_E0DD":
                            VL = this.dicomBuffer[this.position + 4] + this.dicomBuffer[this.position + 5] * 256 + this.dicomBuffer[this.position + 6] * 65536 + this.dicomBuffer[this.position + 7] * 16777216;
                            this.position += 8;
                            break;
                        default:
                            VR = String.fromCharCode(this.dicomBuffer[this.position + 4]) + String.fromCharCode(this.dicomBuffer[this.position + 5]);

                            switch (VR)
                            {
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

                return  new DicomElement(tag, VR, "", VL);
            }
            catch (err)
            {
                return null;
            }
        }

        private fixVRValue(element: DicomElement): void
        {
            // Issue found with some RGB images (RAW)
            if (this.transferSyntax === "1.2.840.10008.1.2.1"  && element.tag === "7FE0_0010")
            {
                if (element.VR === "OW" && this.photometric === "RGB")
                    element.VR = "OB";
                else if (element.VR === "OW" && this.bitsAllocated === 8 && (this.modality === "XA" || this.modality === "RF" || this.modality === "US"))
                    element.VR = "OB";
                else if ((this.modality === "MG" || this.modality === "DX") && this.bitsAllocated === 16)
                    element.VR = "OW";
            }
        }

        private readElementValue(element: DicomElement): void
        {
            let position: number = this.position;

            if (this.implicitVR && position >= this.headerSize)
            {
                const tag: string = this.fetchTag();

                if (element.VL === 0xFFFFFFFF || tag === "FFFE_E000")
                {
                    element.value = [];
                    this.processSequence(element);
                }
                else if (element.VL > 1024)
                {
                    element.value = "[LONG CONTENT]";
                    this.position += element.VL;
                }
                else
                {
                    const bytes = this.dicomBuffer.subarray(position, position + element.VL);
                    element.value = this.textDecoder.decode(bytes).replace(/[\0\s]+$/, '');
                    this.position += element.VL;
                }

                return;
            }

            if (element.tag === "7FE0_0010" && element.VL === 0xFFFFFFFF && (element.VR === "OB" || element.VR === "OW"))
            {
                element.value = [];
                this.processPixelDataSequence(element);

                if (!this.numberFrames || (this.numberFrames && this.numberFrames === 1)) {
                    this.image = (element.value && Array.isArray(element.value)) ? (element.value as Array<any>)[element.value.length - 1] : element.value;
                }
                else if (this.numberFrames > 1)
                {
                    this.image = element.value;
                }

                return;
            }

            switch (element.VR)
            {
                case "AE": // Application Entity
                case "AS": // Age String
                case "AT": // Attribute Tag
                case "CS": // Code String
                case "DA": // Date
                case "DS": // Decimal String
                case "DT": // Date/Time
                case "IS": // Integer String
                case "LO": // Long String
                case "LT": // Long Text
                case "PN": // Person Name
                case "SH": // Short String
                case "ST": // Short Text
                case "TM": // Time
                case "UI": // Unique Identifier
                case "UT": // Unlimited Text
                    {
                        const bytes = this.dicomBuffer.subarray(position, position + element.VL);
                        element.value = this.textDecoder.decode(bytes).replace(/[\0\s]+$/, '');
                    }
                    break;
                case "UR": // URI/URL
                case "UC": // Unlimited Characters (UTF-8 string)
                    {
                        const bytes = this.dicomBuffer.subarray(position, position + element.VL);
                        element.value = this.textDecoderUTF8.decode(bytes).replace(/[\0\s]+$/, '');
                    }
                    break;
                case "OD": // Other Double
                    element.value = new Float64Array(this.bufferSlice(position, position + element.VL));
                    break;
                case "OL": // Other Long
                    element.value = new Uint32Array(this.bufferSlice(position, position + element.VL));
                    break;
                case "FL": // Floating Point Single (4 bytes)
                    if (element.VL == 4)
                        element.value = (new Float32Array(this.getBytes(4)))[0];
                    else
                        element.value = Array.prototype.slice.call(new Float32Array(this.getBytes(element.VL)));
                    break;
                case "FD": // Floating Point Double (8 bytes)
                    if (element.VL == 8)
                        element.value = (new Float64Array(this.getBytes(8)))[0];
                    else
                        element.value = Array.prototype.slice.call(new Float32Array(this.getBytes(element.VL)));
                    break;
                case "OB": // Other Byte
                    if (this.bitsAllocated === 8)
                    {
                        element.value = new Uint8Array(this.bufferSlice(position, position + element.VL));
                    }
                    else
                    {
                        try
                        {
                            if (this.isUnsigned)
                                element.value = new Uint16Array(this.bufferSlice(position, position + element.VL));
                            else
                                element.value = new Int16Array(this.bufferSlice(position, position + element.VL));
                        }
                        catch (err) {
                            try
                            {
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
                case "OW": // Other Word
                    try
                    {
                        if (this.isUnsigned)
                            element.value = new Uint16Array(this.bufferSlice(position, position + element.VL));
                        else
                            element.value = new Int16Array(this.bufferSlice(position, position + element.VL));
                    }
                    catch (err) {
                        element.value = "";
                    }
                    break;
                case "OF": // Other Float
                    element.value = new Float32Array(this.bufferSlice(position, position + element.VL));
                    break;
                case "OV": // Other 64-bit Very Long (unsigned)
                    if (typeof BigUint64Array !== "undefined")
                    {
                        element.value = new BigUint64Array(this.bufferSlice(position, position + element.VL));
                    } else {
                        element.value = null;
                        if (this.isDebug)
                            console.warn("BigUint64Array not supported in this browser. Skipping OV value.");
                    }
                    break;
                case "SL": // Signed Long
                    if (element.VL == 4)
                        element.value = (new Int32Array(this.getBytes(4)))[0];
                    else
                        element.value = Array.prototype.slice.call(new Int32Array(this.getBytes(element.VL)));
                    break;
                case "SS": // Signed Short
                    if (element.VL == 2)
                        element.value = (new Int16Array(this.getBytes(2)))[0];
                    else
                        element.value = Array.prototype.slice.call(new Int16Array(this.getBytes(element.VL)));
                    break;
                case "SV": // Signed Very Long
                    if (typeof BigInt64Array !== "undefined")
                    {
                        element.value = new BigInt64Array(this.bufferSlice(position, position + element.VL));
                    } else {
                        element.value = null;
                        if (this.isDebug)
                            console.warn("BigInt64Array not supported in this browser. Skipping SV value.");
                    }
                    break;
                case "UL": // Unsigned Long
                    if (element.VL == 4)
                        element.value = (new Uint32Array(this.getBytes(4)))[0];
                    else
                        element.value = Array.prototype.slice.call(new Uint32Array(this.getBytes(element.VL)));
                    break;
                case "US": // Unsigned Short
                    if (element.VL == 2)
                        element.value = (new Uint16Array(this.getBytes(2)))[0];
                    else
                        element.value = Array.prototype.slice.call(new Uint16Array(this.getBytes(element.VL)));
                    break;
                case "UN": // Unknown
                    element.value = new Uint8Array(this.bufferSlice(position, position + element.VL));
                    break;
                case "UV": // Unsigned Very Long
                    if (typeof BigUint64Array !== "undefined")
                    {
                        element.value = new BigUint64Array(this.bufferSlice(position, position + element.VL));
                    } else {
                        element.value = null;
                        if (this.isDebug)
                            console.warn("BigUint64Array not supported in this browser. Skipping UV value.");
                    }
                    break;
                case "SQ": // Sequence of Items
                    element.value = [];
                    this.processSequence(element);
                    return;
                default:
                    if (element.tag === "FFFE_E000")
                    {
                        element.value = [];
                        this.processSequence(element);
                        return;
                    }
                    break;
            }

            if (element.VL !== 0xFFFFFFFF)
                this.position += element.VL;
        }

        private evaluateElementTag(element: DicomElement, isSequence: boolean): void
        {
            if (element.tag === "7FE0_0010" && element.VL !== 0xFFFFFFFF)
            {
                this.reachedPixelData = true;

                if (this.implicitVR)  // Parsing of image is not supported for Implicit VR
                    return;

                /*if (this.transferSyntax === "1.2.840.10008.1.2.4.50" && element.VR === "OB")
                {
                    try
                    {
                        let imageBuffer: Uint8Array = this.validateIsJpeg(this.position + 20, this.dicomBuffer.length - 8);
                        element.value = imageBuffer;
                    }
                    catch (err) {
                        if (this.isDebug)
                            console.log(err);
                    }
                }

                this.image = element.value;*/

                if (!isSequence && this.image)
                    this.ismainImage = true;

                return;
            }

            if (isSequence)
                return;

            const value: any = element.value;

            switch (element.tag)
            {
                case DICOM_TAG.FILE_META_INFORMATION_GROUP_LENGTH:
                    this.headerSize = this.position + value;
                    break;
                case DICOM_TAG.TRANSFER_SYNTAX_UID:
                    this.transferSyntax = value;

                    if (value === "1.2.840.10008.1.2") // Implicit VR LE
                    {
                        this.implicitVR = true;
                    }
                    else if (value === "1.2.840.10008.1.2.1.99") // Compressed Explicit VR LE
                    {
                        const inflator: Inflator = new Inflator();
                        this.dicomBuffer = inflator.Inflate(this.dicomBuffer, this.headerSize, this.fileSize - this.headerSize);
                        this.fileSize = (<Uint8Array>this.dicomBuffer).length;
                        this.headerSize = 0;
                        this.position = 0;
                    }
                    break;
                case DICOM_TAG.SPECIFIC_CHARACTER_SET:
                    this.textDecoder = this.createDicomTextDecoder(value);
                    break;
                case DICOM_TAG.PHOTOMETRIC_INTERPRETATION:
                    this.photometric = value.toUpperCase();
                    // this.isUnsigned = (this.photometric !== "MONOCHROME2");
                    break;
                case DICOM_TAG.NUMBER_OF_FRAMES:
                    this.numberFrames = value ? parseInt(value) : value;
                    break;
                case DICOM_TAG.BITS_ALLOCATED:
                    try
                    {
                        this.bitsAllocated = parseInt(value);
                    }
                    catch (err) {
                        Efferent.Frontend.WebClient.Utils.DebugConsoleLog(err);
                    }
                    break;
                case DICOM_TAG.HIGH_BIT:
                    const hightBitValue = +value;
                    break;
                case DICOM_TAG.PIXEL_REPRESENTATION:
                    this.isUnsigned = (value === "0" || value === 0);
                    break;
                case DICOM_TAG.PIXEL_SPACING:
                    this.pixelSpacing = PixelSpacing.ParseDicomTag(value);
                    break;
                case DICOM_TAG.IMAGER_PIXEL_SPACING:
                    if (!this.pixelSpacing)
                        this.pixelSpacing = PixelSpacing.ParseDicomTag(value);
                    break;
                case DICOM_TAG.MODALITY:
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

        private fetchTag(): string
        {
            if (this.position + 4 > this.fileSize)
                return "";

            const group: number = this.dicomBuffer[this.position] + this.dicomBuffer[this.position + 1] * 256;
            const elem: number = this.dicomBuffer[this.position + 2] + this.dicomBuffer[this.position + 3] * 256;
            const tag: string = ((group + 0x10000).toString(16).substr(-4) + "_" + (elem + 0x10000).toString(16).substr(-4)).toUpperCase();

            return tag;
        }

        private addValueToMainDataset(element: DicomElement): void
        {
            if (element.tag !== DICOM_TAG.PIXEL_DATA)
            {
                if (!element.value.hasOwnProperty("buffer"))
                {
                    const value: any = element.value;

                    if (element.tag === DICOM_TAG.PATIENT_ID) // Patient ID
                    {
                        if (!this.DicomTags[element.tag])
                            this.DicomTags[element.tag] = value;
                        else
                            this.DicomTags[element.tag + "_" + (this.pidCounter++)] = value;
                    }
                    else
                    {
                        this.DicomTags[element.tag] = value;
                    }
                }
            }
        }

        private processPixelDataSequence(rootElement: DicomElement): void
        {
            while (true)
            {
                const tag: string = this.fetchTag();
                const VL: number = this.dicomBuffer[this.position + 4] + this.dicomBuffer[this.position + 5] * 256 + this.dicomBuffer[this.position + 6] * 65536 + this.dicomBuffer[this.position + 7] * 16777216;
                this.position += 8;

                if (tag === DICOM_TAG.DELIMITATION_SEQUENCE && VL > 4)
                {
                    let value: any;
                    const position: number = this.position;

                    try
                    {
                        if (rootElement.VR === "OB")
                        {
                            value = new Uint8Array(this.bufferSlice(position, position + VL));
                        }
                        else if (rootElement.VR === "OW")
                        {
                            if (this.isUnsigned)
                                value = new Uint16Array(this.bufferSlice(position, position + VL));
                            else
                                value = new Int16Array(this.bufferSlice(position, position + VL));
                        }
                        else
                        {
                            break;
                        }

                        rootElement.value.push(value);
                    }
                    catch (err) {
                        rootElement.value = value;
                        break;
                    }
                }
                else if (tag === DICOM_TAG.DELIMITATION_SEQUENCE_ITEMS_1 || tag === DICOM_TAG.DELIMITATION_SEQUENCE_ITEMS_2)
                {
                    // console.log("breaking because of tag");
                    break;
                }
                else if ((this.position + 8) >= this.fileSize)
                {
                    // console.log("breaking because of position");
                    break;
                }

                this.position += VL;
            }
        }

        private processSequence(rootElement: DicomElement): void
        {
            if (rootElement)
            {
                if (rootElement.VL === 0)
                    return;

                const lengthUnknown: boolean = rootElement.VL === 0xFFFFFFFF;
                let limit: number;

                if (!lengthUnknown)
                    limit = this.position + rootElement.VL;

                let element: DicomElement;
                while (element = this.getNextElement())
                {
                    if (!lengthUnknown && element.VL === 0xFFFFFFFF)
                        element.VL = limit - this.position;

                    this.fixVRValue(element);
                    this.readElementValue(element);
                    this.evaluateElementTag(element, true);

                    if (Number.isNaN(this.position))
                    {
                        break;
                    }

                    if ((this.position + 8) >= this.fileSize)
                    {
                        // console.log("breaking because of position");
                        rootElement.value.push(element);
                        break;
                    }

                    if (!lengthUnknown && this.position >= limit)
                    {
                        // console.log("breaking because of limit");
                        rootElement.value.push(element);
                        break;
                    }

                    if (lengthUnknown && element.tag === DICOM_TAG.DELIMITATION_SEQUENCE_ITEMS_1)
                    {
                        // console.log("breaking because of tag");
                        break;
                    }

                    if (lengthUnknown && element.tag === DICOM_TAG.DELIMITATION_SEQUENCE_ITEMS_2)
                    {
                        // console.log("breaking because of tag");
                        break;
                    }

                    rootElement.value.push(element);
                }
            }
        }

        private getBytes(count: number): ArrayBuffer
        {
            const buf = new ArrayBuffer(count);
            new Uint8Array(buf).set(
                this.dicomBuffer.subarray(this.position, this.position + count)
            );
            return buf;
        }

        private bufferSlice(start: number, end: number): ArrayBuffer
        {
            const bufLike = this.dicomBuffer.buffer;

            if (bufLike instanceof ArrayBuffer && typeof bufLike.slice === "function")
                return bufLike.slice(start, end); // typed as ArrayBuffer

            const src = this.dicomBuffer;
            const s = start | 0;
            const e = end === undefined ? src.byteLength : end;
            const out = new ArrayBuffer(Math.max(0, e - s));
            new Uint8Array(out).set(src.subarray(s, e));
            return out;
        }

        private createDicomTextDecoder(charsetTagValue?: string): TextDecoder
        {
            const dicomToJsEncoding: { [key: string]: string } =
            {
                "ISO_IR 6": "us-ascii",           // Default: US-ASCII (7-bit)
                "ISO_IR 100": "iso-8859-1",       // Latin-1 (Western Europe)
                "ISO_IR 101": "iso-8859-2",       // Latin-2 (Central/Eastern Europe)
                "ISO_IR 109": "iso-8859-3",       // Latin-3 (South European)
                "ISO_IR 110": "iso-8859-4",       // Latin-4 (North European)
                "ISO_IR 144": "iso-8859-5",       // Cyrillic
                "ISO_IR 127": "iso-8859-6",       // Arabic
                "ISO_IR 126": "iso-8859-7",       // Greek
                "ISO_IR 138": "iso-8859-8",       // Hebrew
                "ISO_IR 148": "iso-8859-9",       // Latin-5 (Turkish)
                "ISO_IR 166": "iso-8859-11",      // Thai
                "ISO_IR 192": "utf-8",            // Unicode UTF-8
                "GB18030": "gb18030",             // Chinese (PRC)
                "GBK": "gbk",                     // Chinese (simplified, subset of gb18030)
                "ISO 2022 IR 13": "shift_jis",    // Japanese (JIS X 0201)
                "ISO 2022 IR 87": "iso-2022-jp",  // Japanese (JIS X 0208)
                "ISO 2022 IR 159": "iso-2022-jp", // Japanese (JIS X 0212) — limited support in JS
                "ISO 2022 IR 149": "euc-kr",      // Korean
                "ISO_IR 13": "shift_jis",         // Japanese (Katakana)
                "ISO_IR 87": "iso-2022-jp",       // Japanese (Kanji)
                "ISO_IR 159": "iso-2022-jp",      // Japanese (Kanji supplement)
                "ISO_IR 149": "euc-kr",           // Korean
                "ISO_IR 58": "gb2312",            // Chinese (simplified, legacy encoding)
            };

            let encoding = "us-ascii";

            if (charsetTagValue)
            {
                const normalized = charsetTagValue.trim().toUpperCase();
                if (dicomToJsEncoding[normalized])
                {
                    encoding = dicomToJsEncoding[normalized];
                }
            }

            return new TextDecoder(encoding);
        }
    }

    class BitReader
    {
        private bitsLength: number;
        private bits: number;
        private buffer: Uint8Array;
        private limit: number;
        private pos: number;

        constructor(buffer: Uint8Array, start: number, length: number)
        {
            this.bitsLength = 0;
            this.bits = 0;
            this.buffer = buffer;
            this.pos = start;
            this.limit = start + length - 1;
        }

        public ReadByte(): number
        {
            if (this.pos > this.limit)
                return -1;

            return this.buffer[this.pos++];
        }

        public ReadBit(): boolean
        {
            if (this.bitsLength === 0)
            {
                const nextByte: number = this.ReadByte();

                if (nextByte < 0)
                    throw new Error("Unexpected end of stream");

                this.bits = nextByte;
                this.bitsLength = 8;
            }

            const bit: boolean = (this.bits & 1) !== 0;
            this.bits >>= 1;
            --this.bitsLength;

            return bit;
        }

        public Align(): void
        {
            this.bitsLength = 0;
        }

        public ReadBytes(len: number): Uint8Array
        {
            if (this.bitsLength !== 0)
                throw new Error("BitReader not aligned");
            if (this.pos + len - 1 > this.limit)
                throw new Error("Unexpected end of stream");
            const out = new Uint8Array(len);
            out.set(this.buffer.subarray(this.pos, this.pos + len));
            this.pos += len;
            return out;
        }

        public ReadLSB(length: number): number
        {
            let data: number = 0;

            for (let i = 0; i < length; ++i)
            {
                if (this.ReadBit())
                    data |= 1 << i;
            }

            return data;
        }
    }

    class Inflator
    {
        private staticCodes: Array<number>;
        private staticDistances: Array<number>;
        private bitReader: BitReader;
        private buffer: Array<any>;
        private bufferPosition: number;
        private state: number;
        private blockFinal: boolean;
        private codesTree: any;
        private distancesTree: any;

        private readonly encodedLengthStart = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258];

        private readonly encodedLengthAdditionalBits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];

        private readonly encodedDistanceStart = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];

        private readonly encodedDistanceAdditionalBits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];

        private readonly clenMap = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];

        constructor()
        {
            this.initializeStaticTrees();
        }

=        private pushArray(arr: ArrayLike<number>): void
        {
            for (let i = 0, n = arr.length; i < n; i++) this.buffer.push(arr[i]);
        }

        public Inflate(inputbuffer: Uint8Array, start: number, length: number): Uint8Array
        {
            this.bitReader = new BitReader(inputbuffer, start, length);
            this.buffer = new Array(0);
            this.bufferPosition = 0;
            this.state = 0;
            this.blockFinal = false;

            const output: Array<number> = [];
            let byte: number;

            try {
                while ((byte = this.readByte()) >= 0)
                {
                    output.push(byte);
                }
            } catch (err) {
                console.error("Inflation error: ", err);
            }

            return new Uint8Array(output);
        }

        private buildCodes(lengths: Array<number>): Array<number>
        {
            const codes: Array<number> = new Array(lengths.length);
            let maxBits: number = lengths[0];

            for (let i = 1; i < lengths.length; i++)
            {
                if (maxBits < lengths[i])
                    maxBits = lengths[i];
            }

            const bitLengthsCount: Array<number> = new Array(maxBits + 1);

            for (let i = 0; i <= maxBits; i++) bitLengthsCount[i] = 0;

            for (let i = 0; i < lengths.length; i++)
            {
                ++bitLengthsCount[lengths[i]];
            }

            const nextCode: Array<number> = new Array(maxBits + 1);
            let code: number = 0;
            bitLengthsCount[0] = 0;

            for (let bits = 1; bits <= maxBits; bits++)
            {
                code = (code + bitLengthsCount[bits - 1]) << 1;
                nextCode[bits] = code;
            }

            for (let n = 0; n < codes.length; n++)
            {
                const len: number = lengths[n];

                if (len !== 0)
                {
                    codes[n] = nextCode[len];
                    nextCode[len]++;
                }
            }

            return codes;
        }

        private initializeStaticTrees(): void
        {
            const codes: Array<number> = new Array<number>(288);
            const codesLengths: Array<number> = new Array<number>(288);

            for (let i = 0; i <= 143; i++)
            {
                codes[i] = 0x0030 + i;
                codesLengths[i] = 8;
            }

            for (let i = 144; i <= 255; i++)
            {
                codes[i] = 0x0190 + i - 144;
                codesLengths[i] = 9;
            }

            for (let i = 256; i <= 279; i++)
            {
                codes[i] = 0x0000 + i - 256;
                codesLengths[i] = 7;
            }

            for (let i = 280; i <= 287; i++)
            {
                codes[i] = 0x00C0 + i - 280;
                codesLengths[i] = 8;
            }

            this.staticCodes = this.buildTree(codes, codesLengths);

            const distances: Array<number> = new Array(32);
            const distancesLengths: Array<number> = new Array(32);

            for (let i = 0; i <= 31; i++)
            {
                distances[i] = i;
                distancesLengths[i] = 5;
            }

            this.staticDistances = this.buildTree(distances, distancesLengths);
        }

        private buildTree(codes: Array<number>, lengths: Array<number>): any // branch
        {
            const nonEmptyCodes: Array<object> = [];

            for (let i = 0; i < codes.length; ++i)
            {
                if (lengths[i] > 0)
                {
                    const code: object = {
                        bits : codes[i],
                        length : lengths[i],
                        index : i
                    };

                    nonEmptyCodes.push(code);
                }
            }

            return this.buildTreeBranch(nonEmptyCodes, 0, 0);
        }

        private buildTreeBranch(codes: Array<any>, prefix: number, prefixLength: number): object // branch
        {
            if (codes.length === 0)
                return null;

            const zeros: Array<object> = [];
            const ones: Array<object> = [];
            const branch: any = {};
            branch.isLeaf = false;

            for (let i = 0; i < codes.length; ++i)
            {
                if (codes[i].length === prefixLength && codes[i].bits === prefix)
                {
                    branch.isLeaf = true;
                    branch.index = codes[i].index;
                    break;
                }
                else
                {
                    const nextBit: boolean = ((codes[i].bits >> (codes[i].length - prefixLength - 1)) & 1) > 0;

                    if (nextBit)
                        ones.push(codes[i]);
                    else
                        zeros.push(codes[i]);
                }
            }

            if (!branch.isLeaf)
            {
                branch.zero = this.buildTreeBranch(zeros, (prefix << 1), prefixLength + 1);
                branch.one = this.buildTreeBranch(ones, (prefix << 1) | 1, prefixLength + 1);
            }

            return branch;
        }

        private readDynamicTrees(bitReader: BitReader): object // {codestree, distancestree}
        {
            const hlit: number = bitReader.ReadLSB(5) + 257;
            const hdist: number = bitReader.ReadLSB(5) + 1;
            const hclen: number = bitReader.ReadLSB(4) + 4;

            const clen: Array<number> = new Array(19);

            for (let i = 0; i < clen.length; ++i)
                clen[i] = 0;

            for (let i = 0; i < hclen; ++i)
                clen[this.clenMap[i]] = bitReader.ReadLSB(3);

            const clenCodes: Array<number> = this.buildCodes(clen);
            const clenTree: object = this.buildTree(clenCodes, clen);

            const lengthsSequence: Array<any> = new Array(0);

            while (lengthsSequence.length < hlit + hdist)
            {
                let p: any = clenTree;

                while (!p.isLeaf)
                {
                    p = bitReader.ReadBit() ? p.one : p.zero;
                }

                const code = p.index;

                switch (true)
                {
                    case code <= 15:
                        lengthsSequence.push(code);
                        break;
                    case code === 16:
                        const repeat1: number = bitReader.ReadLSB(2) + 3;
                        for (let q = 0; q < repeat1; ++q)
                            lengthsSequence.push(lengthsSequence[lengthsSequence.length - 1]);
                        break;
                    case code === 17:
                        const repeat2: number = bitReader.ReadLSB(3) + 3;
                        for (let q = 0; q < repeat2; ++q)
                            lengthsSequence.push(0);
                        break;
                    case code === 18:
                        const repeat3: number = bitReader.ReadLSB(7) + 11;
                        for (let q = 0; q < repeat3; ++q)
                            lengthsSequence.push(0);
                        break;
                    default:
                        break;
                }
            }

            const codesLengths: Array<any> = lengthsSequence.slice(0, hlit);
            const codes: Array<number> = this.buildCodes(codesLengths);
            const distancesLengths: Array<any> = lengthsSequence.slice(hlit, hlit + hdist);
            const distances: Array<number> = this.buildCodes(distancesLengths);

            const result: object =
            {
                codesTree: this.buildTree(codes, codesLengths),
                distancesTree: this.buildTree(distances, distancesLengths)
            };

            return result;
        }

        private readByte(): number
        {
            while (this.bufferPosition >= this.buffer.length)
            {
                const item: any = this.decodeItem();

                if (item == null)
                    return -1;

                switch (item.itemType)
                {
                    case 0:
                        this.pushArray(item.array);
                        break;
                    case 2:
                        this.buffer.push(item.symbol);
                        break;
                    case 3: {
                        const dist = item.distance;
                        const len  = item.length;
                        const start = this.buffer.length - dist;
                        // Fast path: non-overlapping copy
                        if (dist >= len) {
                            this.pushArray(this.buffer.slice(start, start + len));
                            break;
                        }
                        // Fast path: distance == 1 (RLE)
                        if (dist === 1) {
                            const v = this.buffer[this.buffer.length - 1];
                            for (let k = 0; k < len; k++) this.buffer.push(v);
                            break;
                        }
                        // General overlap-safe copy
                        let j = start, remaining = len;
                        while (remaining > 0) {
                            const take = Math.min(remaining, dist);
                            for (let k = 0; k < take; k++) this.buffer.push(this.buffer[j + k]);
                            j += take;
                            remaining -= take;
                        }
                        break;
                    }
                }
            }

            const symbol: number = this.buffer[this.bufferPosition++];

            if (this.bufferPosition > 0x20000)
            {
                const keep = 0x18000; // keep last ~98KB
                const shift = Math.max(0, this.buffer.length - keep);
                if (shift > 0)
                {
                    this.buffer = this.buffer.slice(shift);
                    this.bufferPosition -= shift;
                }
            }

            return symbol;
        }

        private decodeItem(): object // item
        {
            if (this.state === 2)
                return null;

            if (this.state === 0)
            {
                this.blockFinal = this.bitReader.ReadBit();
                const blockType: number = this.bitReader.ReadLSB(2);

                switch (blockType)
                {
                    case 0:
                        this.bitReader.Align();
                        const len: number = this.bitReader.ReadLSB(16);
                        const nlen: number = this.bitReader.ReadLSB(16);

                        if ((len & ~nlen) !== len)
                            throw new Error("Invalid block type 0 length");

                        const arr: Uint8Array = this.bitReader.ReadBytes(len);
                        const thisItem: any = { itemType: 0, array: arr };

                        if (this.blockFinal)
                            this.state = 2;

                        return thisItem;
                    case 1:
                        this.codesTree = this.staticCodes;
                        this.distancesTree = this.staticDistances;
                        this.state = 1;
                        break;
                    case 2:
                        let dynamicTrees: any = this.readDynamicTrees(this.bitReader);
                        this.codesTree = dynamicTrees.codesTree;
                        this.distancesTree = dynamicTrees.distancesTree;
                        this.state = 1;
                        break;
                    default:
                        throw new Error("Invalid block type (3)");
                }
            }

            const item: any = {};
            let p: any = this.codesTree;

            while (!p.isLeaf)
            {
                p = this.bitReader.ReadBit() ? p.one : p.zero;
            }

            if (p.index < 256)
            {
                item.itemType = 2;
                item.symbol = p.index;
            }
            else if (p.index > 256)
            {
                const lengthCode: number = p.index;

                if (lengthCode > 285)
                    throw new Error("Invalid length code");

                let length: number = this.encodedLengthStart[lengthCode - 257];

                if (this.encodedLengthAdditionalBits[lengthCode - 257] > 0)
                    length += this.bitReader.ReadLSB(this.encodedLengthAdditionalBits[lengthCode - 257]);

                p = this.distancesTree;

                while (!p.isLeaf)
                {
                    p = this.bitReader.ReadBit() ? p.one : p.zero;
                }

                const distanceCode: number = p.index;
                let distance: number = this.encodedDistanceStart[distanceCode];

                if (this.encodedDistanceAdditionalBits[distanceCode] > 0)
                    distance += this.bitReader.ReadLSB(this.encodedDistanceAdditionalBits[distanceCode]);

                item.itemType = 3;
                item.distance = distance;
                item.length = length;
            }
            else
            {
                item.itemType = 1;
                this.state = this.blockFinal ? 2 : 0;
            }

            return item;
        }
    }
}
