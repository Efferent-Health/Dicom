namespace Efferent
{
    export class DicomElement
    {
        public tag: string;
        public value: any;
        public VR: string;
        public VL: number;

        constructor(tag: string, VR: string, value: any, VL: number = 0)
        {
            this.tag = tag;
            this.VR = VR;
            this.value = value;
            this.VL = VL;
        }

        public ToString(indent: number): string
        {
            if (Array.isArray(this.value))
            {
                let response: string = "  ".repeat(indent) + this.tag + " " + (this.VR || "??") + " " + this.VL + " Array:\r\n";

                for (let i = 0; i < this.value.length; i++)
                    response += this.value[i].ToString(indent + 1) + "\r\n";

                return response;
            }
            else
            {
                let valueStr: string;

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
}