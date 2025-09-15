import * as pulumi from '@pulumi/pulumi';

import { orderService } from './src/service/order';
import { rabbitMQService } from './src/service/rabbitmq'
import { appLoadBalancer } from './src/service/load-balancer';



export const ordersId = orderService.service.id;
export const rabbitmqId = rabbitMQService.service.id;
export const rabbitMQAdminURL = pulumi.interpolate`http:${appLoadBalancer.listeners[0].endpoint.hostname}:15672`;

