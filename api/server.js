// import { Configuration, OpenAIApi } from 'openai';

// // 環境変数からAPIキーを取得して設定
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY, // Vercelの環境変数で設定されているAPIキー
// });



// // POSTリクエストのハンドラー
// app.post('/api/server', async (req, res) => {
//   try {
//     const { text } = req.body; // クライアントからのデータを取得
//     const response = await openai.createChatCompletion({
//       model: 'gpt-4o', 
//       messages: [
//         { role: 'system', content: 'あなたは短歌と俳句の添削専門アシスタントです。ユーザーが送った短歌や俳句に対して、①五七五（俳句）や五七五七七（短歌）の形式を確認し、厳密すぎない柔軟な音数判定を行ってください。②多少の字余りや字足らずは詩的表現として尊重し、自然なリズムであれば指摘しないでください。③良い表現や感情の動きを褒めてみましょう。④返答は130文字程度にまとめてください。⑤ユーザーが短歌や俳句以外のものを送った場合は「短歌や俳句を入力してな」と返してください。' },
//         { role: 'user', content: text },
//       ],
//     });

//     // AIからの応答をクライアントに返す
//     res.json({ result: response.data.choices[0].message.content });
//   } catch (error) {
//     console.error('Error processing request:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });









import OpenAI from 'openai';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/server', async (req, res) => {
  try {
    const { text } = req.body;
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'あなたは短歌と俳句の添削専門アシスタントです。ユーザーが送った短歌や俳句に対して、①五七五（俳句）や五七五七七（短歌）の形式を確認し、厳密すぎない柔軟な音数判定を行ってください。②多少の字余りや字足らずは詩的表現として尊重し、自然なリズムであれば指摘しないでください。③良い表現や感情の動きを褒めてみましょう。④返答は130文字程度にまとめてください。⑤ユーザーが短歌や俳句以外のものを送った場合は「短歌や俳句を入力してな」と返してください。' },
        { role: 'user', content: text }, 
      ]
    });
    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

