//
const { Transform } = require("stream");

module.exports = {
    add: function() {
        return new AddBom();
    },
    remove: function() {
        return new RemoveBom();
    }
}

const bom = Buffer.from([0xEF, 0xBB, 0xBF]);
const bufLength = (bufs) =>
    bufs.reduce((a, { length }) => a + length, 0);
const hasBom = (buf) => buf.slice(0, 3).equals(bom);

const AddBom = transformBom(data => hasBom(data) ? data : Buffer.concat([bom,data]))
const RemoveBom = transformBom(data => hasBom(data) ? data.slice(3) : data)

function transformBom(transform) {
    return class TransBom extends Transform {

        constructor() {
            super();
            this._bomDone = false;
            this._buff = [];
        }

        _transform(chunk, enc, cb) {
            if (this._bomDone)
                return cb(null, chunk);

            this._buff.push(chunk);
            if (bufLength(this._buff) >= 3)
                this._pushBuffered();

            cb();
        }

        _flush(cb) {
            if (!this._bomDone)
                this._pushBuffered();
            cb();
        }

        _pushBuffered() {
            let chunk = Buffer.concat([...this._buff]);
            chunk = transform(chunk)
            this.push(chunk);
            this._bomDone = true;
            this._buff = null;
        }
    }
}