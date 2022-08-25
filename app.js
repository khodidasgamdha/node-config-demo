require("dotenv").config();
const express = require("express");
require("./services/setupEnvVariables");

const app = express();

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
    res.status(200).send("Apis are working");
});

app.listen(PORT);
