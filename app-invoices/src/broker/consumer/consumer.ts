import { orders } from "../channels/order.ts";

orders.consume('orders', async message => {
    if (!message) {
        return null
    }
    console.log(message.toString());

    orders.ack(message);
}, {
    noAck: false
})