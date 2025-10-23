namespace Efferent
{
    export class DicomDictionary
    {
        private dictionary: Record<string, [string, string, string]>;

        constructor()
        {            
        }

        public GetDictionary(): Record<string, [string, string, string]>
        {
            this.expandDicomDictionary(DICOM_DICT);

            return this.dictionary;
        }

        public GetVR(dicomtag: string): string
        {
            this.expandDicomDictionary(DICOM_DICT);

            const vr = this.dictionary[dicomtag]?.[0]

            return vr?.includes("/") ? undefined : vr;
        }

        public GetVM(dicomtag: string): string
        {
            this.expandDicomDictionary(DICOM_DICT);

            return this.dictionary[dicomtag]?.[1];
        }

        public GetDescription(dicomtag: string): string
        {
            this.expandDicomDictionary(DICOM_DICT);

            return this.dictionary[dicomtag]?.[2];
        }

        private expandDicomDictionary(csv: string): void
        {
            if (this.dictionary)
                return;

            const lines = csv.trim().split(/\r?\n/);

            if (lines.length < 2)
                return;

            const dataLines = lines.slice(1);
            const dict: Record<string, [string, string, string]> = {};

            let prevDesc = "";
            let olderDesc = "";
            let prevVR = "";
            let group = "0000";

            for (let i = 0; i < dataLines.length; ++i)
            {
                const line = dataLines[i];
                const row = [];
                let field = "";

                for (let j = 0; j < line.length; ++j)
                {
                    const c = line[j];
                    if (c === ',' && row.length < 3)
                    {
                        row.push(field);
                        field = "";
                    } else
                    {
                        field += c;
                    }
                }
                row.push(field);

                if (row.length < 4)
                    continue;

                let tag = row[0].trim();
                let vr = row[1].trim();
                let vm = row[2].trim();
                let desc = row[3].trim();
                let key: string;

                if (!vr)
                    vr = prevVR;
                if (!vm)
                    vm = "1";
                
                prevVR = vr;

                if (tag.length === 8)
                {
                    group = tag.substring(0, 4)
                    key = group + "_" + tag.substring(4, 8);
                } else if (tag.length <= 4)
                {
                    key = group + "_" + tag.padStart(4, "0");
                }

                // Description: resolve $n and %n
                // $n refers to word n (1-based) from prevDesc, %n from olderDesc
                const prevWords = prevDesc.split(/\s+/);
                const olderWords = olderDesc.split(/\s+/);
                desc = desc.replace(/\$(\d+)/g, (_, n) => prevWords[parseInt(n) - 1] ?? "");
                desc = desc.replace(/%(\d+)/g, (_, n) => olderWords[parseInt(n) - 1] ?? "");
                // Save for next
                olderDesc = prevDesc;
                prevDesc = desc;
                dict[key] = [vr, vm, desc];
            }

            this.dictionary = dict;
        }

        public printDict()
        {
            this.expandDicomDictionary(DICOM_DICT);

            for (const [tag, [vr, vm, desc]] of Object.entries(this.dictionary))
            {
                console.log(`${tag},${vr},${vm},${desc}`);
            }
        }
    }
}