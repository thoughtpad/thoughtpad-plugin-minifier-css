var should = require('should'),
    app = require('./../src/main'),
    co = require('co'),
    fs = require('co-fs'),
    man = require('thoughtpad-plugin-manager'),
    thoughtpad;

describe("css minify plugin", function () {
    it("should register correctly to events", function () {
        thoughtpad = man.registerPlugins([app]);

        thoughtpad.subscribe("css-postcompile-complete", function *() {
            true.should.be.true;
        });

        co(function *() {
            yield thoughtpad.notify("css-postcompile-request", { contents: "d" });
        })();
    });

    it("should ignore requests with no content", function () {
        thoughtpad = man.registerPlugins([app]);

        thoughtpad.subscribe("css-postcompile-complete", function *() {
            true.should.be.false;
        });

        co(function *() {
            yield thoughtpad.notify("css-postcompile-request", { contents: "" });
        })();
    });

    it("should minify css from file", function (done) {
        var filename = __dirname + '/file.js';
        thoughtpad = man.registerPlugins([app]);

        thoughtpad.subscribe("css-postcompile-complete", function *(contents) {
            yield fs.unlink(filename);
            contents.should.equal('.class1{width:100%}');                        
        });

        co(function *() {
            yield fs.writeFile(filename, ".class1 {\n\twidth: 100%;\n}");
            yield thoughtpad.notify("css-postcompile-request", { contents: [filename] });
            done();
        })();
        
    });

    it("should minify css from string", function (done) {
        thoughtpad = man.registerPlugins([app]);

        thoughtpad.subscribe("css-postcompile-complete", function *(contents) {
            contents.should.equal('.class1{width:100%}');
        });

        co(function *() {
            yield thoughtpad.notify("css-postcompile-request", { contents: ".class1 {\n\twidth: 100%;\n}" });
            done();
        })();
    });
});