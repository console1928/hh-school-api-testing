require("dotenv").config({ path: ".env" });

const authorizationToken = process.env.AUTHORIZATION_TOKEN;

const config = {
    authorizationToken
};

module.exports = config;
