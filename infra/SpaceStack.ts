import { Stack, StackProps } from 'aws-cdk-lib'
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway'
import {
    Code,
    Function as LambdaFunction,
    Runtime,
} from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'
import { join } from 'path'

export class SpaceStack extends Stack {
    private api = new RestApi(this, 'SpaceApi')
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props)

        const helloLambda = new LambdaFunction(this, 'helloLambda', {
            runtime: Runtime.NODEJS_16_X,
            code: Code.fromAsset(join(__dirname, '..', 'services', 'lambda')),
            handler: 'hello.main',
        })

        // API Lambda Integration
        const helloLambdaIntegration = new LambdaIntegration(helloLambda)
        const helloLambdaResource = this.api.root.addResource('hello')
        helloLambdaResource.addMethod('GET', helloLambdaIntegration)
    }
}
