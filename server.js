import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config(); // .env ファイルを読み込む



const app = express();
const PORT = 3000;


app.use(bodyParser.json());
app.use(express.static(path.join("public"))); 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ルートエンドポイント       
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// POSTエンドポイント
app.post('/', async(req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: '文章が空です。' });
  }

  console.log(text)

  try {
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {"role": "system", "content": "あなたは短歌と俳句の添削専門アシスタントです。ユーザーが送った短歌や俳句に対して、①五七五（俳句）や五七五七七（短歌）の形式を確認し、厳密すぎない柔軟な音数判定を行ってください。②多少の字余りや字足らずは詩的表現として尊重し、自然なリズムであれば指摘しないでください。③良い表現や感情の動きを褒めてみましょう。④返答は130文字程度にまとめてください。⑤ユーザーが短歌や俳句以外のものを送った場合は「短歌や俳句を入力してな」と返してください。"},
        { role: "user", content: text },
      ],
    });

    const correctedText = gptResponse.choices[0].message.content.trim();

    console.log(correctedText)

    res.json({ correctedText }); 
  } catch (error) {
    console.error('GPTエラー:', error);
    res.status(500).json({ error: 'GPTの応答取得中にエラーが発生しました。' });
  }
});



// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server is running on http://0.0.0.0:${PORT}`);
// });









