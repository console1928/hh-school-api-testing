const config = require("../config");
const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);
chai.should();

const getVacancies = function (text) {
    return chai.request("https://api.hh.ru/")
        .get("vacancies")
        .set("text", encodeURIComponent(text))
        .set("Authorization", config.authorizationToken);
};

const setRequestWaitingTime = function (context) {
    return context.timeout(10000);
};

const checkResponseOkStatus = function (res, done) {
    if (res.status === 200) {
        done();
    } else {
        done("Test failed");
    }
};

const checkResponseHeader = function (res, done, headerName) {
    if (res.header.hasOwnProperty(headerName)) {
        done();
    } else {
        done("Test failed");
    }
};

const checkResponseBody = function (res, done) {
    if (res.body) {
        done();
    } else {
        done("Test failed");
    }
};

const checkResponseBodyProperty = function (res, done, property) {
    if (res.body && res.body.hasOwnProperty(property)) {
        done();
    } else {
        done("Test failed");
    }
};

const runTests = function (text) {
    let response;

    before(function (done) {
        setRequestWaitingTime(this);
        getVacancies(text).end(function (err, res) {
            response = res;
            done();
        });
    });
    if (true) {
        it("should return status code 200", function (done) {
            checkResponseOkStatus(response, done);
        });

        it("should return content-type header", function (done) {
            checkResponseHeader(response, done, "content-type");
        });

        it("should return connection header", function (done) {
            checkResponseHeader(response, done, "connection");
        });

        it("should return cache-control header", function (done) {
            checkResponseHeader(response, done, "cache-control");
        });

        it("should return expires header", function (done) {
            checkResponseHeader(response, done, "expires");
        });

        it("should return access-control-allow-origin header", function (done) {
            checkResponseHeader(response, done, "access-control-allow-origin");
        });

        it("should return body", function (done) {
            checkResponseBody(response, done);
        });

        it("should return items property in body", function (done) {
            checkResponseBodyProperty(response, done, "items");
        });

        it("should return found property in body", function (done) {
            checkResponseBodyProperty(response, done, "found");
        });

        it("should return pages property in body", function (done) {
            checkResponseBodyProperty(response, done, "pages");
        });

        it("should return per_page property in body", function (done) {
            checkResponseBodyProperty(response, done, "per_page");
        });

        it("should return page property in body", function (done) {
            checkResponseBodyProperty(response, done, "page");
        });

        it("should return clusters property in body", function (done) {
            checkResponseBodyProperty(response, done, "clusters");
        });

        it("should return arguments property in body", function (done) {
            checkResponseBodyProperty(response, done, "arguments");
        });

        it("should return alternate_url property in body", function (done) {
            checkResponseBodyProperty(response, done, "alternate_url");
        });
    }
};

describe("Correct text", function () {
    runTests("javascript");
});

describe("Empty text", function () {
    runTests("");
});

describe("Encoded cyrillic text", function () {
    runTests("джаваскрипт");
});

describe("Single encoded cyrillic character", function () {
    runTests("а");
});

describe("Encoded uppercase cyrillic text", function () {
    runTests("ДЖАВАСКРИПТ");
});

describe("Single character", function () {
    runTests("a");
});

describe("Uppercase single character", function () {
    runTests("A");
});

describe("Single space", function () {
    runTests(" ");
});

describe("Multiple spaces", function () {
    runTests("          ");
});

describe("Incorrect word", function () {
    runTests("ghdfgsd");
});

describe("Uppercase incorrect word", function () {
    runTests("AGHJFRY");
});

describe("256 characters length word", function () {
    runTests("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
});

describe("Timeout test", function () {
    runTests("javascript");
});

describe("Special characters", function () {
    runTests("<([{\\^-=$!|]})?*+.>");
});

describe("Null", function () {
    runTests("null");
});

describe("Undefined", function () {
    runTests("undefined");
});

describe("False", function () {
    runTests("false");
});

describe("True", function () {
    runTests("true");
});

describe("Zero", function () {
    runTests("0");
});

describe("Single number", function () {
    runTests("9");
});

describe("Multiple numbers", function () {
    runTests("999");
});

describe("Negative number", function () {
    runTests("-999");
});

describe("256 characters length number", function () {
    runTests("9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999");
});

describe("256 characters length negative number", function () {
    runTests("-9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999");
});

describe("Multiple words", function () {
    runTests("javascript html css");
});

describe("Empty quotes", function () {
    runTests('""');
});

describe("Quoted phrase", function () {
    runTests('"javascript html css"');
});
