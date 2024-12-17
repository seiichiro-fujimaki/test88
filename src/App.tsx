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

 // Base64エンコード関数
 const convertToBase64 = async (imageUrl: string) => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result?.toString().split(',')[1]); // Base64部分のみ取得
    reader.readAsDataURL(blob);
  });
};

  async function invokeBedrock() {
    const { credentials } = await fetchAuthSession()
    const awsRegion = outputs.auth.aws_region
    const functionName = outputs.custom.invokeBedrockFunctionName
    const labmda = new LambdaClient({ credentials: credentials, region: awsRegion })

   // 画像をBase64形式に変換
   const base64Image = await convertToBase64(hason1);

   // Lambdaに送信するPayloadを作成
   const payload = {
    prompt: prompt,
    image: base64Image, // Base64形式の画像データ
  };

    const command = new InvokeWithResponseStreamCommand({
          FunctionName: functionName,
          Payload: new TextEncoder().encode(JSON.stringify( payload ))
    })

    const apiResponse = await labmda.send(command);

    let completeMessage = ''
    if (apiResponse.EventStream) {
      for await (const item of apiResponse.EventStream) {
        if (item.PayloadChunk) {
          const payload = new TextDecoder().decode(item.PayloadChunk.Payload)
          // completeMessage = completeMessage + payload
          completeMessage += payload
          setAiMessage(completeMessage)
        }
      }
    }
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <>
          <p>
            自動高所点検・検査：　
            UserName:   {user?.signInDetails?.loginId}
          </p>
          <img src={hason1}  height = "300XP"  width  = "300XP"  alt="hason1" className="yane"/>
          <img src={hason2}  height = "300XP"  width  = "300XP"  alt="hason2" className="yane"/> 
          <img src={hason3}  height = "300XP"  width  = "300XP"  alt="hason3" className="yane"/> 
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
          <p>
            <button onClick={invokeHelloWorld}>Invoke_Confirmation</button>
            <div>{text}</div>
          </p>

        </>
      )}
    </Authenticator>
  )
}

export default App
