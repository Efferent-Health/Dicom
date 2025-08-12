
    class DynamicBinaryBuffer
    {
        private buffer: Uint8Array;
        private length: number;
        private increment: number = 4096;

        constructor()
        {
            this.buffer = new Uint8Array(this.increment);
            this.length = 0;
        }

        public AppendBuffer8(data: Uint8Array)
        {
            if (data.length == 0)
                return;

            this.ensureCapacity(data.length);
            this.buffer.set(data, this.length);
            this.length += data.length;

            if (data.length % 2 == 1) // Padding
                this.AppendByte(0);
        }

        public AppendBuffer16(data: Uint16Array)
        {
            if (data.length == 0)
                return;

            this.ensureCapacity(data.length * 2);
            this.buffer.set(data, this.length);
            this.length += data.length * 2;
        }

        public AppendByte(byte: number)
        {
            this.ensureCapacity(1);
            this.buffer[this.length++] = byte;
        }

        public AppendIntValue(value: number, length: number)
        {
            this.ensureCapacity(length);

            for (var i = 0; i < length; i++)
            {
                var byte = (value >>> (i*8)) & 0xFF;
                this.buffer[this.length++] = byte;
            }
        }

        public SetIntValue(value: number, length: number, position: number)
        {
            for (var i = 0; i < length; i++)
            {
                var byte = (value >>> (i*8)) & 0xFF;
                this.buffer[position + i] = byte;
            }
        }

        public AppendFloatValue(value: number, double: boolean)
        {
            let buff = new Uint8Array(double ? 8 : 4);
            let view = new DataView(buff.buffer);

            if (double)
                view.setFloat64(0, value, true);
            else
                view.setFloat32(0, value, true);

            this.AppendBuffer8(buff);
        }

        public AppendString(value: string, padWithNull: boolean)
        {
            if (value.length == 0)
                return;

            this.ensureCapacity(value.length);

            for (var i = 0; i < value.length; i++)
                this.buffer[this.length++] = value.charCodeAt(i);

            if (value.length % 2 == 1) // Padding
                this.AppendByte(padWithNull ? 0 : 32);
        }

        public GetBuffer(): Uint8Array
        {
            var newBuffer = this.buffer.slice(0, this.length);
            // delete this.buffer;
            this.buffer = newBuffer;
            return this.buffer;
        }

        public GetLength(): number
        {
            return this.length;
        }

        private ensureCapacity(additionalSize: number)
        {
            var requiredSize = this.length + Math.max(this.increment, additionalSize + this.increment);

            if (requiredSize > this.buffer.length)
            {
                var newBuffer = new Uint8Array(requiredSize);
                newBuffer.set(this.buffer);

                // delete this.buffer;
                this.buffer = newBuffer;
            }
        }
    }