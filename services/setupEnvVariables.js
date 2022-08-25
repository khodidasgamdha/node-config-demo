const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");

const configFolderPath = path.join(__dirname, "..", "config");
const configFilePath = path.join(__dirname, "..", "config", "config.json");
const databaseFilePath = path.join(__dirname, "..", "config", "database.json");
const envFilePath = path.join(__dirname, "..", ".env");

// create config files if not exists
if (!fs.existsSync(configFolderPath)) {
    fs.mkdirSync(configFolderPath);
}
if (!fs.existsSync(configFilePath)) {
    fs.closeSync(fs.openSync(configFilePath, "w"));
}
if (!fs.existsSync(databaseFilePath)) {
    fs.closeSync(fs.openSync(databaseFilePath, "w"));
}
if (!fs.existsSync(envFilePath)) {
    fs.closeSync(fs.openSync(envFilePath, "w"));
}

const questions = [];

// Add data in config.json if not available
const configFileData = fs.readFileSync(configFilePath, "utf-8");

if (configFileData?.trim()) {
    const data = JSON.parse(configFileData);
    if (![true, false].includes(data["allowBody"])) {
        questions.push({
            type: "confirm",
            name: "allow_body",
            message: "Wants to Setup Allow Body ?",
        });
    }
    if (![true, false].includes(data["allowHeaders"])) {
        questions.push({
            type: "confirm",
            name: "allow_headers",
            message: "Wants to Setup Allow Headers ?",
        });
    }
} else {
    questions.push(
        {
            type: "confirm",
            name: "allow_body",
            message: "Wants to Setup Allow Body ?",
        },
        {
            type: "confirm",
            name: "allow_headers",
            message: "Wants to Setup Allow Headers ?",
        }
    );
}

// Add data in databse.json if not available
const databseFileData = fs.readFileSync(databaseFilePath, "utf-8");

if (databseFileData?.trim()) {
    const data = JSON.parse(databseFileData);
    if (!data["development"]) {
        questions.push(
            {
                type: "input",
                name: "username",
                message: "Enter Development type Database username :",
            },
            {
                type: "input",
                name: "password",
                message: "Enter Development type Database password :",
            },
            {
                type: "input",
                name: "database",
                message: "Enter Development type Database database name :",
            },
            {
                type: "input",
                name: "host",
                message: "Enter Development type Database host :",
            },
            {
                type: "input",
                name: "dialect",
                message: "Enter Development type Database dialect :",
            },
            {
                type: "confirm",
                name: "logging",
                message: "Do you want to add logging ?",
            }
        );
    } else {
        if (data["development"] && !data["development"]["username"]) {
            questions.push({
                type: "input",
                name: "username",
                message: "Enter Development type Database username :",
            });
        }
        if (data["development"] && !data["development"]["password"]) {
            questions.push({
                type: "input",
                name: "password",
                message: "Enter Development type Database password :",
            });
        }
        if (data["development"] && !data["development"]["database"]) {
            questions.push({
                type: "input",
                name: "database",
                message: "Enter Development type Database database name :",
            });
        }
        if (data["development"] && !data["development"]["host"]) {
            questions.push({
                type: "input",
                name: "host",
                message: "Enter Development type Database host :",
            });
        }
        if (data["development"] && !data["development"]["dialect"]) {
            questions.push({
                type: "input",
                name: "dialect",
                message: "Enter Development type Database dialect :",
            });
        }
        if (
            data["development"] &&
            ![false, true].includes(data["development"]["logging"])
        ) {
            questions.push({
                type: "confirm",
                name: "logging",
                message: "Do you want to add logging ?",
            });
        }
    }
} else {
    questions.push(
        {
            type: "input",
            name: "username",
            message: "Enter Development type Database username :",
        },
        {
            type: "input",
            name: "password",
            message: "Enter Development type Database password :",
        },
        {
            type: "input",
            name: "database",
            message: "Enter Development type Database database :",
        },
        {
            type: "input",
            name: "host",
            message: "Enter Development type Database host :",
        },
        {
            type: "input",
            name: "dialect",
            message: "Enter Development type Database dialect :",
        },
        {
            type: "confirm",
            name: "logging",
            message: "Do you want to add logging ?",
        }
    );
}

// Add data in .env if not available
const envFileData = fs.readFileSync(envFilePath, "utf-8").split("\n");
if (envFileData.length) {
    const envKeys = envFileData.map((el) => el.split("=")[0]);
    if (!envKeys.includes("PORT")) {
        questions.push({
            type: "number",
            name: "port",
            message: "Enter port value :",
        });
    }
    if (!envKeys.includes("API_KEY")) {
        questions.push({
            type: "input",
            name: "api_key",
            message: "Enter API key :",
        });
    }
} else {
    questions.push(
        {
            type: "number",
            name: "port",
            message: "Enter port value :",
        },
        {
            type: "input",
            name: "api_key",
            message: "Enter API key :",
        }
    );
}

const setupConfig = () => {
    inquirer.prompt(questions).then((ans) => {
        let configData = {};
        let databaseData = {};

        if (configFileData) {
            configData = JSON.parse(configFileData);
        }
        if (databseFileData) {
            databaseData = JSON.parse(databseFileData);
        }

        if ([true, false].includes(ans.allow_body)) {
            configData["allowBody"] = ans.allow_body;
        }
        if ([true, false].includes(ans.allow_headers)) {
            configData["allowHeaders"] = ans.allow_headers;
        }
        fs.writeFileSync(configFilePath, JSON.stringify(configData));

        if (!databaseData["development"]) {
            databaseData["development"] = {};
        }
        if (ans.username) {
            databaseData["development"]["username"] = ans.username;
        }
        if (ans.password) {
            databaseData["development"]["password"] = ans.password;
        }
        if (ans.database) {
            databaseData["development"]["database"] = ans.database;
        }
        if (ans.host) {
            databaseData["development"]["host"] = ans.host;
        }
        if (ans.dialect) {
            databaseData["development"]["dialect"] = ans.dialect;
        }
        if ([true, false].includes(ans.logging)) {
            databaseData["development"]["logging"] = ans.logging;
        }
        fs.writeFileSync(databaseFilePath, JSON.stringify(databaseData));

        let envData = "";
        if (ans.port) {
            envData += `PORT=${ans.port}\n`;
        }
        if (ans.api_key) {
            envData += `API_KEY=${ans.api_key}\n`;
        }
        fs.appendFileSync(envFilePath, envData);
    });
};

if (questions.length) {
    setupConfig();
}
