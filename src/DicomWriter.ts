import { DicomElement } from "./DicomElement";

export class DicomWriter
{
    private dataset: DicomElement[];
    private buffer: DynamicBinaryBuffer;
    private pixelData: Uint8Array;

    constructor()
    {
        this.dataset = [];
    }

    public AddPixelData(pixelData: Uint8Array): void
    {
        this.pixelData = pixelData;
    }

    public AddElement(element: DicomElement, isRoot: boolean = true): void
    {
        element.tag = element.tag.replace(/[(),_\s]/g, "");

        switch (element.VR)
        {
            case "US":
            case "SS":
                element.VL = 2;
                if (Array.isArray(element.value))
                    element.VL *= element.value.length;
                else
                    element.value = [element.value];
                break;
            case "UL":
            case "SL":
            case "FL":
                element.VL = 4;
                if (Array.isArray(element.value))
                    element.VL *= element.value.length;
                else
                    element.value = [element.value];
                break;
            case "UV":
            case "SV":
            case "FD":
                element.VL = 8;
                if (Array.isArray(element.value))
                    element.VL *= element.value.length;
                else
                    element.value = [element.value];
                break;
            case "AE":
            case "AS":
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
            case "UC":
            case "UI":
            case "UR":
            case "UT":
                if (!element.value)
                    element.value = "";
                element.VL = (element.value as string).length;
                break;
            case "OB":
                element.VL = (element.value as Uint8Array).length;
                break;
            case "OW":
                element.VL = (element.value as Uint16Array).length * 2;
                break;
            case "SQ":
                element.VL = 0xFFFFFFFF;
                (element.value as DicomElement[]).forEach(e => this.AddElement(e, false));
                break;
            default:
                throw "Unsupported VR";
        }

        if (isRoot)
            this.dataset.push(element);
    }

    public Serialize(dataset?: DicomElement[]): Uint8Array | null
    {
        var isRoot = true;
        var sortedValues: DicomElement[];

        if (dataset)
        {
            sortedValues = dataset;
            isRoot = false;
        }
        else
        {
            sortedValues = this.dataset;
        }

        sortedValues.sort((a, b) => a.tag.localeCompare(b.tag));

        if (isRoot)
        {
            if (sortedValues.length == 0)
                throw "The dataset is empty";

            if (!sortedValues[0].tag.startsWith("0002"))
                throw "Missing header tags";

            this.buffer = new DynamicBinaryBuffer();

            for (var i = 0; i < 128; i++)
                this.buffer.AppendByte(0);

            for (var i = 0; i < 4; i++)
                this.buffer.AppendByte("DICM".charCodeAt(i));
        }

        var headerSizeStored = false;

        if (!isRoot)
        {
            this.buffer.AppendIntValue(0xFFFE, 2);
            this.buffer.AppendIntValue(0xE000, 2);
            this.buffer.AppendIntValue(0xFFFFFFFF, 4);
        }

        sortedValues.forEach((element: DicomElement) =>
        {
            // Dicom tag
            var group = element.tag.substring(0, 4);
            var elem = element.tag.substring(4, 8);

            if (group > "0002" && isRoot && !headerSizeStored)
            {
                var headerSize = this.buffer.GetLength() - 144;
                this.buffer.SetIntValue(headerSize, 4, 140);
                headerSizeStored = true;
            }

            this.buffer.AppendIntValue(parseInt(group, 16), 2);
            this.buffer.AppendIntValue(parseInt(elem, 16), 2);

            // VR
            this.buffer.AppendByte(element.VR.charCodeAt(0));
            this.buffer.AppendByte(element.VR.charCodeAt(1));

            // VL
            var len = Math.round(element.VL / 2) * 2;

            if (element.VR == "OB" || element.VR == "OW")
            {
                this.buffer.AppendIntValue(0, 2);
                this.buffer.AppendIntValue(len, 4);
            }
            else if (element.VR == "SQ")
            {
                this.buffer.AppendIntValue(0, 2);
                this.buffer.AppendIntValue(0xFFFFFFFF, 4);
            }
            else
            {
                this.buffer.AppendIntValue(len, 2);
            }

            switch (element.VR)
            {
                case "US":
                case "SS":
                    element.value.forEach(val => this.buffer.AppendIntValue(val as number, 2));
                    break;
                case "UL":
                case "SL":
                    element.value.forEach(val => this.buffer.AppendIntValue(val as number, 4));
                    break;
                case "UV":
                case "SV":
                    element.value.forEach(val => this.buffer.AppendIntValue(val as number, 8));
                    break;
                case "FL":
                    element.value.forEach(val => this.buffer.AppendFloatValue(val as number, false));
                    break;
                case "FD":
                    element.value.forEach(val => this.buffer.AppendFloatValue(val as number, true));
                    break;
                case "AE":
                case "AS":
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
                case "UC":
                case "UR":
                case "UT":
                    this.buffer.AppendString(element.value as string, false);
                    break;
                case "UI":
                    this.buffer.AppendString(element.value as string, true);
                    break;
                case "OB":
                    this.buffer.AppendBuffer8(element.value as Uint8Array)
                    break;
                case "OW":
                    this.buffer.AppendBuffer16(element.value as Uint16Array)
                    break;
                case "SQ":
                    // Sequence delimitacion with unknown length, as described in https://dicom.nema.org/dicom/2013/output/chtml/part05/sect_7.5.html#table_7.5-2
                    this.Serialize(element.value as DicomElement[]);

                    this.buffer.AppendIntValue(0xFFFE, 2);
                    this.buffer.AppendIntValue(0xE0DD, 2);
                    this.buffer.AppendIntValue(0, 4);

                    break;
            }
        });

        if (!isRoot)
        {
            this.buffer.AppendIntValue(0xFFFE, 2);
            this.buffer.AppendIntValue(0xE00D, 2);
            this.buffer.AppendIntValue(0, 4);

        }
        else if (this.pixelData)
        {
            var prefix = [
                0xE0, 0x7F, 0x10, 0x00,
                0x4F, 0x42,
                0x00, 0x00,
                0xFF, 0xFF, 0xFF, 0xFF,
                0xFE, 0xFF, 0x00, 0xE0,
                0x04, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0xFE, 0xFF, 0x00, 0xE0
            ];

            var suffix = [
                0xFE, 0xFF, 0xDD, 0xE0,
                0x00, 0x00, 0x00, 0x00
            ]

            var length = Math.ceil(this.pixelData.length / 2) * 2;

            this.buffer.AppendBuffer8(new Uint8Array(prefix));
            this.buffer.AppendIntValue(length, 4)
            this.buffer.AppendBuffer8(this.pixelData);
            this.buffer.AppendBuffer8(new Uint8Array(suffix));
        }

        return isRoot ? this.buffer.GetBuffer() : null;
    }
}

