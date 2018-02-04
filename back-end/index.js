const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const binance = require("node-binance-api");
var router = express.Router();
const cors = require("cors");
const _ = require("lodash");
const http = require("http");
const WebSocket = require("ws");
const settings = require("./settings.json");
const fs = require("fs");
const axios = require("axios");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

binance.options({
    APIKEY: settings.APIKEY,
    APISECRET: settings.APISECRET, 
    test: true
});

const portfolios = [
    "BTCUSDT",
    "ETHUSDT",
    "NEOUSDT",
    "BNBUSDT",
    "EOSETH",
    "ADAETH"
];

app.get("/api/allOrders", (req, res) => {
    binance.allOrders("ETHUSDT", (error, orders, symbol) => {
        res.send(orders);
    });
});

app.get("/api/ticker/prices", (req, res) => {
    binance.prices((error, prices) => {
        res.send(prices);
    });
});

app.get("/api/balances", (req, res) => {
    binance.balance((error, balances) => {
        res.send(balances);
    })
});


app.get("/api/snapshots", (req, res) => {
    readSnapshots((data) => {
        res.send(data);
    })
});

app.post("/api/addSnapshot", (req, res) => {
    addSnapshot(req.body, (snapshots) => {
        res.send("");
    });
});

app.post("/api/deleteSnapshot", (req, res) => {
    deleteSnapshot(req.body, (snapshots) => {
        res.send("");
    });
});

const cnyusdUrl = "https://www.binance.com/exchange/public/cnyusd";
app.get("/api/cnyusd", (req, res) => {
    axios.get(cnyusdUrl).then((cnyusd) => {
        res.send(cnyusd.data.rate + "");
    });
});

const SnapshotFilePath = "./db/snapshots.json";
function addSnapshot(snapshot, callback) {
    readSnapshots((snapshots) => {
        snapshots.push(snapshot);
        let json = JSON.stringify(snapshots);
        fs.writeFile(SnapshotFilePath, json, "utf8", () => {
            callback(snapshots);
        });
    })
}

function deleteSnapshot(snapshot, callback) {
    readSnapshots((snapshots) => {
        let index = snapshots.findIndex(s => s.timestamp === snapshot.timestamp);
        snapshots.splice(index, 1);
        let json = JSON.stringify(snapshots);
        fs.writeFile(SnapshotFilePath, json, "utf8", () => {
            callback(snapshots);
        });
    })
}

function readSnapshots(callback) {
    fs.readFile(SnapshotFilePath, "utf8", (error, data) => {
        let snapshots = JSON.parse(data);
        callback(snapshots);
    })
}

const server = http.createServer(app);
const wss = new WebSocket.Server({ server })
wss.on("connection", (ws, req) => {
    console.log("connection");

    ws.on("message", (message) => {
        console.log("message", message)
    });

    ws.on("error", () => {
        console.log("err");
    });

    binance.websockets.prevDay(false, (error, response) => {
        if (_.includes(portfolios, response.symbol)) {
            ws.send(JSON.stringify(response));
        }
    });
});

server.listen(3000, () => console.log("Listening on %d", server.address().port))