namespace Efferent
{
    /*
    DICOM documentation
    Datasets:  https://dicom.nema.org/medical/Dicom/2024e/output/chtml/part05/chapter_7.html
    Sequences: https://dicom.nema.org/medical/Dicom/2024e/output/chtml/part05/sect_7.5.html
    VR types:  https://dicom.nema.org/medical/Dicom/2024e/output/chtml/part05/sect_6.2.html
    */

    export class DicomReader
    {
        private position: number = 0;
        private fileSize: number;
        private pidCounter: number = 1;
        private isDebug: boolean;
        private ismainImage: boolean;
        private headerSize: number = 128;
        private numberFrames: number;
        private textDecoder: TextDecoder;
        private dictionary: DicomDictionary;

        public dicomBuffer: Uint8Array;
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

        private readonly longVRs = new Set([
            "OB", "OD", "OL", "OF", "OV", "OW",
            "SQ", "SV", "UC", "UN", "UR", "UT", "UV"
        ]);

        constructor(buffer: Uint8Array, debug: boolean = false)
        {
            this.dicomBuffer = buffer;
            this.isDebug = debug;
            this.fileSize = buffer.length;
            this.textDecoder = DicomTextDecoder.ASCII;
            this.dictionary = new DicomDictionary();

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
                    VR = this.dictionary.GetVR(tag);

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

                            if (this.longVRs.has(VR)) {
                                VL = this.dicomBuffer[this.position + 8]
                                + this.dicomBuffer[this.position + 9] * 256
                                + this.dicomBuffer[this.position + 10] * 65536
                                + this.dicomBuffer[this.position + 11] * 16777216;
                                this.position += 12;
                            } else {
                                VL = this.dicomBuffer[this.position + 6]
                                + this.dicomBuffer[this.position + 7] * 256;
                                this.position += 8;
                            }
                            break;
                    }
                }

                if (VR && VR !== "SQ" && tag !== "7FE0_0010" && VL === 0xFFFFFFFF)
                    return null;

                return new DicomElement(tag, VR, "", VL);
            }
            catch (err)
            {
                // console.error(err);
                return null;
            }
        }

        private fixVRValue(element: DicomElement): void
        {
            // Issue found with some RGB images (RAW)
            if (this.transferSyntax === "1.2.840.10008.1.2.1" && element.tag === "7FE0_0010")
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

            if (this.implicitVR && !element.VR && position >= this.headerSize)
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

                if (!this.numberFrames || (this.numberFrames && this.numberFrames === 1))
                {
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
                        element.value = DicomTextDecoder.UTF8.decode(bytes).replace(/[\0\s]+$/, '');
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
                        catch (err)
                        {
                            try
                            {
                                if (this.isUnsigned)
                                    element.value = new Uint8Array(this.bufferSlice(position, position + element.VL));
                                else
                                    element.value = new Int8Array(this.bufferSlice(position, position + element.VL));
                            }
                            catch (err2)
                            {
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
                    catch (err)
                    {
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
                    } else
                    {
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
                    } else
                    {
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
                    } else
                    {
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
                    if (element.tag === DICOM_TAG.DELIMITATION_SEQUENCE)
                    {
                        element.value = {};
                        this.processSequenceItem(element);
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
    
                this.image = element.value;

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
                    this.textDecoder = DicomTextDecoder.CreateDicomTextDecoder(value);
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
                    catch (err)
                    {
                        console.log(err);
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

                    switch (value)
                    {
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
            const tag: string = (
                (group + 0x10000).toString(16).slice(-4) + "_" +
                (elem + 0x10000).toString(16).slice(-4)
            ).toUpperCase();

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
                    catch (err)
                    {
                        rootElement.value = value;
                        break;
                    }
                }
                else if (tag === DICOM_TAG.SEQUENCE_DELIMITATION_ITEM || tag === DICOM_TAG.ITEM_DELIMITATION_ITEM)
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

        private processSequenceItem(rootElement: DicomElement): void
        {

            if (rootElement)
            {
                if (rootElement.VL === 0)
                    return;

                const lengthUnknown: boolean = rootElement.VL === 0xFFFFFFFF;
                let limit: number = Infinity;

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
                        break;

                    if (element.tag === DICOM_TAG.ITEM_DELIMITATION_ITEM)
                        break;

                    if ((this.position + 8) >= this.fileSize)
                    {
                        // console.log("breaking because of position");
                        rootElement.value[element.tag] = element.value; 
                        break;
                    }

                    if (!lengthUnknown && this.position >= limit)
                    {
                        // console.log("breaking because of limit");
                        rootElement.value[element.tag] = element.value; 
                        break;
                    }

                    if (lengthUnknown && element.tag === DICOM_TAG.SEQUENCE_DELIMITATION_ITEM)
                        break;

                    rootElement.value[element.tag] = element.value; 
                }
            }
        }

        private processSequence(rootElement: DicomElement): void
        {
            if (rootElement)
            {
                if (rootElement.VL === 0)
                    return;

                const lengthUnknown: boolean = rootElement.VL === 0xFFFFFFFF;
                let limit: number = Infinity;

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

                    if (lengthUnknown && element.tag === DICOM_TAG.SEQUENCE_DELIMITATION_ITEM)
                    {
                        // console.log("breaking because of tag");
                        break;
                    }

                    rootElement.value.push(element.value);

                    if (Number.isNaN(this.position))
                        break;

                    if ((this.position + 8) >= this.fileSize)
                    {
                        // console.log("breaking because of position");
                        break;
                    }

                    if (!lengthUnknown && this.position >= limit)
                    {
                        // console.log("breaking because of limit");
                        break;
                    }

                    const tag = this.fetchTag();
                    if (tag == DICOM_TAG.ITEM_DELIMITATION_ITEM)
                    {
                        break;
                    }

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
    }
}