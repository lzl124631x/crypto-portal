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
    binance.allOrders(req.query.symbol, (error, orders, symbol) => {
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
    deleteSnapshot(req.body.timestamp, (snapshots) => {
        res.send("");
    });
});

const usdcnyUrl = "https://www.binance.com/exchange/public/cnyusd";
app.get("/api/usdcny", (req, res) => {
    axios.get(usdcnyUrl).then((usdcny) => {
        res.send(usdcny.data.rate + "");
    });
});

const SnapshotFilePath = "./db/snapshots.json";
function addSnapshot(snapshot, callback) {
    readSnapshots((snapshots) => {
        snapshots.unshift(snapshot);
        let json = JSON.stringify(snapshots);
        fs.writeFile(SnapshotFilePath, json, "utf8", () => {
            callback(snapshots);
        });
    })
}

function deleteSnapshot(timestamp, callback) {
    readSnapshots((snapshots) => {
        let index = snapshots.findIndex(s => s.timestamp === timestamp);
        if (index == -1) {
            console.log('notfound', timestamp)
            callback(snapshots);
            return;
        }
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