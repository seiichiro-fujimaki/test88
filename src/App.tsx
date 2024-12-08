import { useState } from 'react'
import './App.css'
import { Authenticator } from '@aws-amplify/ui-react'
import { InvokeCommand, InvokeWithResponseStreamCommand, LambdaClient } from '@aws-sdk/client-lambda'
import { fetchAuthSession } from 'aws-amplify/auth'
import outputs from "../amplify_outputs.json"

import hason1 from './assets/hason.jpeg'
import hason2 from './assets/hason2.jpeg'
import hason3 from './assets/hason3.jpeg'

function App() {
  const [text, setText] = useState("")
  const [prompt, setPrompt] = useState("")
  const [aiMessage, setAiMessage] = useState("")

  async function invokeHelloWorld() {
    const { credentials } = await fetchAuthSession()
    const awsRegion = outputs.auth.aws_region
    const functionName = outputs.custom.helloWorldFunctionName
    const labmda = new LambdaClient({ credentials: credentials, region: awsRegion })
    const command = new InvokeCommand({
      FunctionName: functionName,
    });
    const apiResponse = await labmda.send(command);
    if (apiResponse.Payload) {
      const payload = JSON.parse(new TextDecoder().decode(apiResponse.Payload))
      setText(payload.message)
    }
  }

  async function invokeBedrock() {
    const { credentials } = await fetchAuthSession()
    const awsRegion = outputs.auth.aws_region
    const functionName = outputs.custom.invokeBedrockFunctionName
    const labmda = new LambdaClient({ credentials: credentials, region: awsRegion })

    const command = new InvokeWithResponseStreamCommand({
          FunctionName: functionName,
          Payload: new TextEncoder().encode(JSON.stringify({ prompt: prompt }))
    })
    const apiResponse = await labmda.send(command);

    let completeMessage = ''
    if (apiResponse.EventStream) {
      for await (const item of apiResponse.EventStream) {
        if (item.PayloadChunk) {
          const payload = new TextDecoder().decode(item.PayloadChunk.Payload)
          completeMessage = completeMessage + payload
          setAiMessage(completeMessage)
        }
      }
    }
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <>
          <img src={hason1}  height = "300XP"  width  = "300XP"  alt="hason1" className="yane"/>
          <img src={hason2}  height = "300XP"  width  = "300XP"  alt="hason2" className="yane"/> 
          <img src={hason3}  height = "300XP"  width  = "300XP"  alt="hason3" className="yane"/> 
          <p>
            User: {user?.signInDetails?.loginId}
          </p>
          <p>
            <button onClick={invokeHelloWorld}>invokeHelloWorld</button>
            <div>{text}</div>
          </p>
          <p>
            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              style={{ width: '50vw', textAlign: 'left' }}
            ></textarea>
            <br />


            <button onClick={invokeBedrock}>検査実行</button> 
		        <div style={{ width: '50vw', textAlign: 'left', whiteSpace: 'pre-wrap' }} 
		            dangerouslySetInnerHTML={{ __html: aiMessage }}>
            </div>

            <br />
            <button onClick={signOut}>サインアウト</button>
          </p>
        </>
      )}
    </Authenticator>
  )
}

export default App
