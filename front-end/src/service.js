import axios from 'axios'

const backendUrl = '/api'
const ws = new WebSocket('ws://localhost:3000')

function get(url) {
    return axios.get(backendUrl + url);
}

export default {
    prices() {
        return get('/ticker/prices').then((res) => {
            store.updatePrices(res.data)
        })
    },
    wsPrices() {
        ws.addEventListener('open', () => {
            ws.send('something');
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
    orders() {
        return get('/allOrders').then((res) => {
            store.updateOrders(res.data);
        });
    },
    snapshots() {
        return get('/snapshots').then(res => {
            store.updateSnapshots(res.data);
        })
    },
    balances() {
        return get('/balances').then(res => {
            store.updateBalances(res.data);
        })
    }
}
