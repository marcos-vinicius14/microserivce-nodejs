import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as docker from "@pulumi/docker-build"
import { cluster } from '../service/cluster';
import { orderDockerImage } from '../images/order'
import { rabbitmqAdminHttpListener } from './rabbitmq'


export const orderService = new awsx.classic.ecs.FargateService('fargate-orders', {
    cluster,
    desiredCount: 1,
    waitForSteadyState: false,
    taskDefinition: {
        container: {
            image: orderDockerImage.ref,
            cpu: 256,
            memory: 512
        },
        environment: [
            {
                name: 'BROKER_URL',
                value: pulumi.interpolate`amqp://admin:admin${rabbitmqAdminHttpListener.endpoint.port}`
            },
            {
                name: 'DATABASE_URL',
                value:'example_url'
            }
        ]
    }
});