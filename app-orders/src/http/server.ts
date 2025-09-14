import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import { z } from 'zod';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { channels } from '../broker/channels/index.ts';
import { db } from '../db/client.ts';
import { schema } from '../db/schema/index.ts';
import { randomUUID } from 'node:crypto';
const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: '*', // Em produção, restrinja para o seu domínio: 'https://meu-dominio.com'
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



  await channels.orders.sendToQueue('orders', Buffer.from('Hello World'));

  await db.insert(schema.orders).values({
    id: randomUUID(),
    customerId: randomUUID(),
    amount: amount
  })
  
  return reply.status(201).send({ message: 'Order created' });
});


app.get('/health', (request, reply) => {
  return reply.send('OK');
});

app.listen({ host: '0.0.0.0', port: 3333 }).then(() => {
  console.log('[ORDERS] Server listening on http://localhost:3333');
});