const express = require("express");
const {items} = require("./fakeDb")
const morgan = require("morgan")

const app = express();

const routes = require("./router");

app.use(express.json());

app.use(morgan('dev'));

app.use("/items", routes)

module.exports = app