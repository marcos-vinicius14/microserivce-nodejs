import '@opentelemetry/auto-instrumentations-node/register'
import '../broker/consumer/consumer.ts'

import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: '*', // Em produção, restrinja para o domínio: 'https://meu-dominio.com'
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get('/health', (request, reply) => {
  return reply.send('OK');
});

app.listen({ host: '0.0.0.0', port: 3334 }).then(() => {
  console.log('[INVOICES] Server listening on http://localhost:3334');
});