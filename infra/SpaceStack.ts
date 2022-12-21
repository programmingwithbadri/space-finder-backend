import { Stack, StackProps } from 'aws-cdk-lib'
import {
    Code,
    Function as LambdaFunction,
    Runtime,
} from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'
import { join } from 'path'
export class SpaceStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props)

        const helloLambda = new LambdaFunction(this, 'helloLambda', {
            runtime: Runtime.NODEJS_16_X,
            code: Code.fromAsset(join(__dirname, '..', 'services', 'lambda')),
            handler: 'hello.main',
        })
    }
}
