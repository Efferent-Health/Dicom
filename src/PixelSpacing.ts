namespace Efferent
{
    export class PixelSpacing
    {
        public PixelX: number;
        public PixelY: number;
        public Units: string;
        public CalibrationFactor: number;

        constructor(pixelX?: number, pixelY?: number, units?: string)
        {
            this.PixelX = pixelX || 1;
            this.PixelY = pixelY || (pixelX || 1);
            this.Units = units || (pixelX ? "mm" : "px");
            this.CalibrationFactor = pixelX || pixelY || 1;
        }

        public static ParseDicomTag(tagValue: string): PixelSpacing
        {
            try
            {
                var values = tagValue.split("\\");

                var c = parseFloat(values[0]);
                var r = parseFloat(values[1]);
                return new PixelSpacing(c, r, "mm");
            }
            catch
            {
                return null;
            }
        }
    }
}