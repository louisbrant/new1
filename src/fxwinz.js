import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import useragent from "express-useragent";
import path from "path";
import dir from "../dir.js";
import mongoose from "./config/mongoose";
import router from "./router";

mongoose();

const port = 2083;
const app = express();
const http = require("http").createServer(app);
app.use(useragent.express());
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
app.use(bodyParser.text({ type: "text/html" }));

app.use(express.static(dir.dirname + "/client"));
app.use(express.static(path.join(__dirname, "upload")));

app.use("/api", router);
app.get("*", (req, res) => res.sendFile(dir.dirname + "/client/index.html"));

http.listen(port, () => {
  console.log("server listening on:", port);
});
