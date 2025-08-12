class BitReader
{
    private bitsLength: number;
    private bits: number;
    private buffer: Uint8Array;
    private limit: number;
    private pos: number;

    constructor(buffer: Uint8Array, start: number, length: number) {
        this.bitsLength = 0;
        this.bits = 0;
        this.buffer = buffer;
        this.pos = start;
        this.limit = start + length - 1;
    }

    public ReadByte(): number {
        if (this.pos > this.limit)
            return -1;

        return this.buffer[this.pos++];
    }

    public ReadBit(): boolean {
        if (this.bitsLength === 0) {
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

    public Align(): void {
        this.bitsLength = 0;
    }

    public ReadBytes(len: number): Uint8Array {
        if (this.bitsLength !== 0)
            throw new Error("BitReader not aligned");
        if (this.pos + len - 1 > this.limit)
            throw new Error("Unexpected end of stream");
        const out = new Uint8Array(len);
        out.set(this.buffer.subarray(this.pos, this.pos + len));
        this.pos += len;
        return out;
    }

    public ReadLSB(length: number): number {
        let data: number = 0;

        for (let i = 0; i < length; ++i) {
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

    private pushArray(arr: ArrayLike<number>): void
    {
        for (let i = 0, n = arr.length; i < n; i++) this.buffer.push(arr[i]);
    }

    public Inflate(inputbuffer: Uint8Array, start: number, length: number): Uint8Array {
        this.bitReader = new BitReader(inputbuffer, start, length);
        this.buffer = new Array(0);
        this.bufferPosition = 0;
        this.state = 0;
        this.blockFinal = false;

        const output: Array<number> = [];
        let byte: number;

        try {
            while ((byte = this.readByte()) >= 0) {
                output.push(byte);
            }
        } catch (err) {
            console.error("Inflation error: ", err);
        }

        return new Uint8Array(output);
    }

    private buildCodes(lengths: Array<number>): Array<number> {
        const codes: Array<number> = new Array(lengths.length);
        let maxBits: number = lengths[0];

        for (let i = 1; i < lengths.length; i++) {
            if (maxBits < lengths[i])
                maxBits = lengths[i];
        }

        const bitLengthsCount: Array<number> = new Array(maxBits + 1);

        for (let i = 0; i <= maxBits; i++) bitLengthsCount[i] = 0;

        for (let i = 0; i < lengths.length; i++) {
            ++bitLengthsCount[lengths[i]];
        }

        const nextCode: Array<number> = new Array(maxBits + 1);
        let code: number = 0;
        bitLengthsCount[0] = 0;

        for (let bits = 1; bits <= maxBits; bits++) {
            code = (code + bitLengthsCount[bits - 1]) << 1;
            nextCode[bits] = code;
        }

        for (let n = 0; n < codes.length; n++) {
            const len: number = lengths[n];

            if (len !== 0) {
                codes[n] = nextCode[len];
                nextCode[len]++;
            }
        }

        return codes;
    }

    private initializeStaticTrees(): void {
        const codes: Array<number> = new Array<number>(288);
        const codesLengths: Array<number> = new Array<number>(288);

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

        const distances: Array<number> = new Array(32);
        const distancesLengths: Array<number> = new Array(32);

        for (let i = 0; i <= 31; i++) {
            distances[i] = i;
            distancesLengths[i] = 5;
        }

        this.staticDistances = this.buildTree(distances, distancesLengths);
    }

    private buildTree(codes: Array<number>, lengths: Array<number>): any // branch
    {
        const nonEmptyCodes: Array<object> = [];

        for (let i = 0; i < codes.length; ++i) {
            if (lengths[i] > 0) {
                const code: object = {
                    bits: codes[i],
                    length: lengths[i],
                    index: i
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

        for (let i = 0; i < codes.length; ++i) {
            if (codes[i].length === prefixLength && codes[i].bits === prefix) {
                branch.isLeaf = true;
                branch.index = codes[i].index;
                break;
            }
            else {
                const nextBit: boolean = ((codes[i].bits >> (codes[i].length - prefixLength - 1)) & 1) > 0;

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

        while (lengthsSequence.length < hlit + hdist) {
            let p: any = clenTree;

            while (!p.isLeaf) {
                p = bitReader.ReadBit() ? p.one : p.zero;
            }

            const code = p.index;

            switch (true) {
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

    private readByte(): number {
        while (this.bufferPosition >= this.buffer.length) {
            const item: any = this.decodeItem();

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

        if (this.bufferPosition > 0x20000) {
            const keep = 0x18000; // keep last ~98KB
            const shift = Math.max(0, this.buffer.length - keep);
            if (shift > 0) {
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

        if (this.state === 0) {
            this.blockFinal = this.bitReader.ReadBit();
            const blockType: number = this.bitReader.ReadLSB(2);

            switch (blockType) {
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

        while (!p.isLeaf) {
            p = this.bitReader.ReadBit() ? p.one : p.zero;
        }

        if (p.index < 256) {
            item.itemType = 2;
            item.symbol = p.index;
        }
        else if (p.index > 256) {
            const lengthCode: number = p.index;

            if (lengthCode > 285)
                throw new Error("Invalid length code");

            let length: number = this.encodedLengthStart[lengthCode - 257];

            if (this.encodedLengthAdditionalBits[lengthCode - 257] > 0)
                length += this.bitReader.ReadLSB(this.encodedLengthAdditionalBits[lengthCode - 257]);

            p = this.distancesTree;

            while (!p.isLeaf) {
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
        else {
            item.itemType = 1;
            this.state = this.blockFinal ? 2 : 0;
        }

        return item;
    }
}
