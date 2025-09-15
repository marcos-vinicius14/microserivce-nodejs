import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as docker from "@pulumi/docker-build"

const ordersECRRepository = new awsx.ecr.Repository('orders-ecr', {
    forceDelete: true,
});

const orderECRToken = aws.ecr.getAuthorizationTokenOutput({
    registryId: ordersECRRepository.repository.registryId
});

export const orderDockerImage = new docker.Image('orders-image', {
    tags: [
        pulumi.interpolate`${ordersECRRepository.repository.repositoryUrl}:latest`
    ],
    context: {
        location: '../app/orders'
    },
    push: true,
    platforms: [
        'linux/386'
    ],
    registries: [
        {
            address: ordersECRRepository.repository.repositoryUrl,
            username: orderECRToken.userName,
            password: orderECRToken.password
        }
    ]
});
