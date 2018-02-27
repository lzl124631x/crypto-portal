import axios from 'axios';

const backendUrl = '/api';
const ws = new WebSocket('ws://localhost:3000');

function get(url, params) {
    return axios.get(backendUrl + url, { params });
}

function post(url, params) {
    return axios.post(backendUrl + url, params);
}

export default {
    prices() {
        return get('/ticker/prices').then((res) => {
            store.updatePrices(res.data);
        });
    },
    wsPrices() {
        ws.addEventListener('open', () => {
            ws.send('front-end: Hi.');
        });

        ws.addEventListener('message', (res) => {
            store.updateTicker(JSON.parse(res.data));
        });

        ws.addEventListener('error', (error) => {
            console.log('error', error);
        });

        ws.addEventListener('close', (error) => {
            console.log('close');
        });
    },
    orders(symbol) {
        return get('/allOrders', { symbol }).then((res) => {
            store.updateOrders(symbol, res.data);
        });
    },
    snapshots() {
        return get('/snapshots').then(res => {
            store.updateSnapshots(res.data);
        })
    },
    addSnapshot(snapshot) {
        return post('/addSnapshot', snapshot).then(res => {
            store.addSnapshot(snapshot);
        });
    },
    deleteSnapshot(snapshot) {
        return post('/deleteSnapshot', { timestamp: snapshot.timestamp }).then(res => {
            store.deleteSnapshot(snapshot);
        });
    },
    balances() {
        return get('/balances').then(res => {
            store.updateBalances(res.data);
        })
    },
    usdcny() {
        return get('/usdcny').then(res => {
            store.updateusdcny(res.data);
        });
    }
}
