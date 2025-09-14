import '@opentelemetry/auto-instrumentations-node/register'
import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import { z } from 'zod';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { randomUUID } from 'node:crypto';
import { trace } from '@opentelemetry/api'
import { sendOrderCreated } from '../broker/messages/order-created.ts';
import { db } from '../db/client.ts';
import { schema } from '../db/schema/index.ts';
const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: '*', // Em produção, restrinja para o domínio: 'https://meu-dominio.com'
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.post('/orders', {
  schema: { 
    body: z.object({
      amount: z.number(),
    }),
  },
}, async (request, reply) => { 
  const { amount } = request.body;
  console.log(`[ORDERS] Creating order with amount: ${amount}`);

  const orderId: string = randomUUID();


  sendOrderCreated({
    orderId: orderId,
    amount,
    customer: {
      id: randomUUID()
    }
  });

  await db.insert(schema.orders).values({
    id: orderId,
    customerId: randomUUID(),
    amount
  })


  trace.getActiveSpan()?.setAttribute('orderId', orderId)
  
  
  return reply.status(201).send({ message: 'Order created' });
});


app.get('/health', (request, reply) => {
  return reply.send('OK');
});

app.listen({ host: '0.0.0.0', port: 3333 }).then(() => {
  console.log('[ORDERS] Server listening on http://localhost:3333');
});