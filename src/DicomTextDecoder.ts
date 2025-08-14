namespace Efferent
{
    export class DicomTextDecoder
    {
        // Charset documentation: https://dicom.nema.org/medical/dicom/current/output/chtml/part18/chapter_d.html
        
        private static readonly dicomToJsEncoding: Record<string, string> = {
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
            "ISO_IR 58": "gb2312"
        };

        public static ASCII = new TextDecoder("us-ascii");
        public static UTF8 = new TextDecoder("utf-8");

        /** Accepts 0008,0005 value: string (e.g. "ISO_IR 100") */
        public static CreateDicomTextDecoder(charsetTagValue?: string): TextDecoder
        {
            let encoding = "us-ascii";

            if (charsetTagValue)
            {
                const normalized = charsetTagValue.trim().toUpperCase();

                if (this.dicomToJsEncoding[normalized])
                    encoding = this.dicomToJsEncoding[normalized];
            }

            return new TextDecoder(encoding);
        }
    }
}