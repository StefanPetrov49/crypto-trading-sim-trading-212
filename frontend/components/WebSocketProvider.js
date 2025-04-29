import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updatePrice } from "@/redux/cryptoPricesSlice";

const symbols = [
    'BTC/USD', 'ETH/USD', 'USDT/USD', 'XRP/USD', 'BNB/USD',
    'SOL/USD', 'USDC/USD', 'DOGE/USD', 'ADA/USD', 'TRX/USD',
    'WBTC/USD', 'SUI/USD', 'LINK/USD', 'AVAX/USD', 'XLM/USD',
    'SHIB/USD', 'TON/USD', 'BCH/USD', 'DOT/USD', 'LTC/USD'
];

export default function WebSocketProvider() {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const ws = new WebSocket('wss://ws.kraken.com/v2');

        ws.onopen = () => {
            ws.send(JSON.stringify({
                method: 'subscribe',
                params: {
                    channel: 'ticker',
                    symbol: symbols
                },
            }));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.method === 'subscribe' && data.success) return;

                if (data.channel === 'ticker' && ['snapshot', 'update'].includes(data.type)) {
                    const symbol = data.data[0].symbol;
                    const newPrice = parseFloat(data.data[0].last);

                    if (symbols.includes(symbol)) {
                        dispatch(updatePrice({
                            symbol,
                            price: newPrice,
                        }));
                    }
                }
            } catch (err) {
                console.error('WebSocket message parse error', err);
            }
        };

        return () => {
            ws.close();
        };
    }, [dispatch]);

    return null; // this component does not render anything
}
