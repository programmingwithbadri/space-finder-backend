import { DynamoDB } from 'aws-sdk';
import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Context,
} from 'aws-lambda';
import { addCorsHeader, getEventBody } from '../../Shared/Utils';
const TABLE_NAME = process.env.TABLE_NAME as string;
const PRIMARY_KEY = process.env.PRIMARY_KEY as string;
const dbClient = new DynamoDB.DocumentClient();

async function handler(
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from DynamoDB',
    };
    addCorsHeader(result);

    const requestBody = getEventBody(event);
    const spaceId = event.queryStringParameters?.[PRIMARY_KEY];
    if (requestBody && spaceId) {
        const key = Object.keys(requestBody)[0];
        const keyValue = requestBody[key];
        try {
            const response = await dbClient
                .update({
                    TableName: TABLE_NAME,
                    Key: {
                        [PRIMARY_KEY]: spaceId,
                    },
                    UpdateExpression: 'set :zzzNew = :new',
                    ExpressionAttributeNames: {
                        ':zzzNew': key,
                    },
                    ExpressionAttributeValues: {
                        ':new': keyValue,
                    },
                    ReturnValues: 'UPDATED_NEW',
                })
                .promise();
            result.body = JSON.stringify(response);
        } catch (error) {
            result.body = error.message;
        }
    }

    return result;
}
