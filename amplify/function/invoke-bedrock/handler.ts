import { Context, Handler, APIGatewayProxyEvent } from 'aws-lambda';
import { Writable } from 'stream';
import { BedrockRuntimeClient, InvokeModelWithResponseStreamCommand } from "@aws-sdk/client-bedrock-runtime";

declare global {
  namespace awslambda {
    function streamifyResponse(
      f: (
        event: APIGatewayProxyEvent,
        responseStream: Writable,
        _context: Context
      ) => Promise<void>
    ): Handler;
  }
}
type eventType = {  prompt: string }

const modelId = "anthropic.claude-3-haiku-20240307-v1:0";

export const handler: Handler = awslambda.streamifyResponse(
  async (event: APIGatewayProxyEvent, responseStream: Writable, _context: Context) => 
  {
    const client = new BedrockRuntimeClient({ region: "ap-northeast-1" });
    const values = Object.values(event);
    const prompt = values[0] || "default prompt";
    const payload = { 
        anthropic_version: "bedrock-2023-05-31", 
        max_tokens: 1000, 
        messages: [
            { role: "user", content: [{ type: "text", text: prompt }] }
        ]
    };

    const command = new InvokeModelWithResponseStreamCommand({
        contentType: "application/json", 
        body: JSON.stringify(payload), 
        modelId
    });

    try {
        const apiResponse = await client.send(command);
        if (apiResponse.body) {
            for await (const item of apiResponse.body) {
                if (item.chunk) {
                    const chunk = JSON.parse(new TextDecoder().decode(item.chunk.bytes));
                    responseStream.write(chunk.delta?.text || "");
                }
            }
        }
    } catch (error) {
        console.error("Bedrock Error Details:", JSON.stringify(error, null, 2));
        responseStream.write(`An error occurred: ${error.message}`);
    } finally {
        responseStream.end();
    }
  }
);


