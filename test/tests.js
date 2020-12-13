const config = require("../config");
const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);
chai.should();

const getVacancies = text => {
    return chai.request("https://api.hh.ru/")
        .get("vacancies")
        .set("text", text)
        .set("Authorization", config.authorizationToken);
};

describe("Functional tests", () => {
    describe("http status", () => {
        it("should have status code 200", done => {
            getVacancies("javascript").then(res => {
                res.should.have.status(200);
                done();
            });
        });
    });
});
