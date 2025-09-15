import * as awsx from "@pulumi/awsx";
import { cluster } from '../service/cluster';
import { appLoadBalancer, networkLoadBalancer } from '../service/load-balancer';

export const rabbitmqAdminTargetGroup = appLoadBalancer.createTargetGroup('rabbitmq-admin-target', {
    port: 15672,
    protocol: 'HTTP',
    healthCheck: {
        path: '/',
        protocol: 'HTTP'
    }
});

export const rabbitmqAdminHttpListener = appLoadBalancer.createListener('rabbitmq-admin-listener', {
    port: 15672,
    protocol: 'HTTP'
});

export const amqpTargetGroup = networkLoadBalancer.createTargetGroup('amqp-target', {
    protocol: 'TCP',
    port: 5672,
    targetType: 'ip',
    healthCheck: {
        protocol: 'TCP',
        port: '5672'
    }
});

export const amqpListener = networkLoadBalancer.createListemer('amqp-lister', {
    port: 5672,
    targetGroup: amqpTargetGroup,
});


export const rabbitMQService = new awsx.classic.ecs.FargateService('fargate-rabbitmq', {
    cluster,
    desiredCount: 1,
    waitForSteadyState: false,
    taskDefinition: {
        container: {
            image: 'rabbitmq:3-management',
            cpu: 256,
            memory: 512,
            portMappings: [
                rabbitmqAdminHttpListener,
                amqpListener
            ],
            environment: [
                {
                    name: 'RABBITMQ_DEFAULT_USER', 
                    value:'admin',
                }, 
                {
                    name: 'RABBITMQ_DEFAULT_PASS',
                    value: 'admin'
                }
            ]
        }
    }
});