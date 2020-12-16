const config = require("../config");
const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);
chai.should();

const getVacancies = function (text) {
    return chai.request("https://api.hh.ru/")
        .get("vacancies")
        .query({ text: text, Authorization: config.authorizationToken });
};

const setRequestWaitingTime = function (context) {
    return context.timeout(10000);
};

const checkResponseOkStatus = function (res, done) {
    if (res && res.status === 200) {
        done();
    } else {
        done("Test failed");
    }
};

const checkResponseHeader = function (res, done, headerName) {
    if (res && res.header && res.header.hasOwnProperty(headerName)) {
        done();
    } else {
        done("Test failed");
    }
};

const checkResponseBody = function (res, done) {
    if (res && res.body) {
        done();
    } else {
        done("Test failed");
    }
};

const checkResponseBodyProperty = function (res, done, property) {
    if (res && res.body && res.body.hasOwnProperty(property)) {
        done();
    } else {
        done("Test failed");
    }
};

const checkRequestTrimmed = function (res, done) {
    if (res && res.body && res.body.hasOwnProperty("alternate_url")) {
        const textQueryParameters = res.body.alternate_url.split("&");
        if (
            res.body.alternate_url.indexOf("text") === -1 ||
            textQueryParameters &&
            textQueryParameters[1] &&
            textQueryParameters[1].split("=")[1] &&
            textQueryParameters[1].split("=")[1] === textQueryParameters[1].split("=")[1].trim()
        ) {
            done();
        } else {
            done("Test failed");
        }
    } else {
        done("Test failed");
    }
}

const checkResponseAlternateUrlAuthorization = function (res, done) {
    if (
        res &&
        res.body &&
        res.body.hasOwnProperty("alternate_url") &&
        res.body.alternate_url.toLowerCase().indexOf("authorization=") === -1
    ) {
        done();
    } else {
        done("Test failed");
    }
}

const runTests = function (text) {
    let response;

    before(function (done) {
        setRequestWaitingTime(this);
        console.log(`  Query text: '${text}'`);
        getVacancies(text).end(function (err, res) {
            response = res;
            done();
        });
    });

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

    it("alternate_url in response should not have authorization parameter", function (done) {
        checkResponseAlternateUrlAuthorization(response, done);
    });

    it("alternate_url text parameter in response should be trimmed", function (done) {
        checkRequestTrimmed(response, done);
    });
};

describe("Correct text", function () {
    runTests("javascript");
});

describe("Empty text", function () {
    runTests("");
});

describe("Cyrillic text", function () {
    runTests("джаваскрипт");
});

describe("Single cyrillic character", function () {
    runTests("а");
});

describe("Uppercase cyrillic text", function () {
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

describe("Query language exclamation mark operator", function () {
    runTests("!javascript");
});

describe("Query language asterisk operator", function () {
    runTests("java*");
});

describe("Query language OR operator", function () {
    runTests("javascript OR typescript");
});

describe("Query language OR operator with quotes", function () {
    runTests('"javascript developer" OR "typescript developer"');
});

describe("Query language AND operator", function () {
    runTests("javascript AND typescript");
});

describe("Query language AND operator with quotes", function () {
    runTests('"javascript developer" AND "typescript developer"');
});

describe("Query language NOT operator", function () {
    runTests("javascript NOT java");
});

describe("Query language multiple operators", function () {
    runTests('(javascript AND typescript) OR "react developer" NOT java');
});

describe("Query language ID field", function () {
    runTests("!ID:40601519");
});

describe("Query language NAME field", function () {
    runTests("NAME:java");
});

describe("Query language COMPANY_ID field", function () {
    runTests("!COMPANY_ID:1455");
});

describe("Query language COMPANY_NAME field", function () {
    runTests("COMPANY_NAME:headhunter");
});

describe("Query language DESCRIPTION field", function () {
    runTests("DESCRIPTION:java");
});

describe("Query language multiple fields", function () {
    runTests("!ID:40601519 AND NAME:java AND !COMPANY_ID:1455 AND COMPANY_NAME:headhunter AND DESCRIPTION:java");
});

describe("Space in first position", function () {
    runTests(" javascript html css");
});

describe("Space in last position", function () {
    runTests("javascript html css ");
});

describe("Multiple spaces on both ends", function () {
    runTests("     javascript html css     ");
});
