const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const binance = require('node-binance-api');
var router = express.Router();
const cors = require('cors');
const _ = require('lodash');
const http = require('http');
const WebSocket = require('ws');
const settings = require('./settings.json');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

binance.options({
    APIKEY: settings.APIKEY,
    APISECRET: settings.APISECRET, 
    test: true
});

const portfolios = [
    'BTCUSDT',
    'ETHUSDT',
    'NEOUSDT',
    'BNBUSDT',
    'EOSETH',
    'ADAETH'
];

app.get('/api/allOrders', (req, res) => {
    binance.allOrders("ETHUSDT", (error, orders, symbol) => {
        console.log(symbol+" orders:", orders);
        res.send(orders);
    });
});

app.get('/api/snapshots', (req, res) => {

});

app.get('/api/ticker/prices', (req, res) => {
    binance.prices((error, prices) => {
        res.send(prices);
    });
});

app.get('/api/balances', (req, res) => {
    binance.balance((error, balances) => {
        res.send(balances);
    })
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server })
wss.on('connection', (ws, req) => {
    console.log('connection');

    ws.on('message', (message) => {
        console.log('message', message)
    });

    ws.on('error', () => {
        console.log('err');
    });

    binance.websockets.prevDay(false, (error, response) => {
        if (_.includes(portfolios, response.symbol)) {
            ws.send(JSON.stringify(response));
        }
    });
});

server.listen(3000, () => console.log('Listening on %d', server.address().port))