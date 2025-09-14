import { OrderCreatedMessage } from '../../../../contracts/messages/order-created-message.ts'
import { channels } from '../channels/index.ts'

export function sendOrderCreated(data: OrderCreatedMessage ) {
    channels.orders.sendToQueue('orders', Buffer.from(JSON.stringify(data)));
}