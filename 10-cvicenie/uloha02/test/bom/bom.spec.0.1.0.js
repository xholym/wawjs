const bom = require("../../src/bom/");
const assert = require("assert");
const fs = require("fs");

describe("bom.js tests", function () {

    it("should remove bom if in file", function (done) {

        let chunks = [];

        let file = `${__dirname}/data/with-bom.txt`;
        fs.createReadStream(file)
            .pipe(bom.remove())
            .on("error", done)
            .on("data", (chunk) => chunks.push(chunk))
            .on("finish", () => {

                let chunk = Buffer.concat(chunks);

                fs.readFile(file, (err, data) => {
                    assert(
                        chunk.equals(data.slice(3)),
                        `unexpected \n${JSON.stringify(chunk)}`
                    );
                    done();
                });

            });
    });

    it("Should not (remove bom) change file without bom", function (done) {

        let chunks = [];

        let file = `${__dirname}/data/without-bom.txt`;
        fs.createReadStream(file)
            .pipe(bom.remove())
            .on("error", done)
            .on("data", (chunk) => chunks.push(chunk))
            .on("finish", () => {

                let chunk = Buffer.concat(chunks);

                fs.readFile(file, (err, data) => {
                    assert(
                        chunk.equals(data),
                        `unexpected \n${JSON.stringify(chunk)}`
                    );
                    done();
                });

            });
    });

    it("should remove bom when chunk size is 2", function (done) {
        const chunks = []
        let file = `${__dirname}/data/with-bom.txt`;
        fs.createReadStream(file, {highWaterMark: 2})
            .pipe(bom.remove())
            .on("error", done)
            .on("data", (chunk) => chunks.push(chunk))
            .on("finish", () => {

                let chunk = Buffer.concat(chunks);

                fs.readFile(file, (err, data) => {
                    assert(
                        chunk.equals(data.slice(3)),
                        `unexpected \n${JSON.stringify(chunk)}`
                    );
                    done();
                });

            });
    });

    it("should remove bom when chunk size is 1", function (done) {
        const chunks = []
        let file = `${__dirname}/data/with-bom.txt`;
        fs.createReadStream(file, {highWaterMark: 1})
            .pipe(bom.remove())
            .on("error", done)
            .on("data", (chunk) => chunks.push(chunk))
            .on("finish", () => {

                let chunk = Buffer.concat(chunks);

                fs.readFile(file, (err, data) => {
                    assert(
                        chunk.equals(data.slice(3)),
                        `unexpected \n${JSON.stringify(chunk)}`
                    );
                    done();
                });

            });
    });
});