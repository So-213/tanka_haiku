import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config(); // .env ファイルを読み込む

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join("public"))); 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ルートエンドポイント       
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html')); // process.cwd()でVercelのルートに対応
});

// POSTエンドポイント
app.post('/app/server', async (req, res) => {
  try {
    console.log('POSTリクエストを受信:', req.body);
    const { text } = req.body;
    if (!text) {
      console.log('リクエストのテキストが空です');
      return res.status(400).json({ error: '文章が空です。' });
    }

    // GPTの応答を取得
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {"role": "system", "content": "あなたは短歌と俳句の添削専門アシスタントです。ユーザーが送った短歌や俳句に対して、①五七五（俳句）や五七五七七（短歌）の形式を確認し、厳密すぎない柔軟な音数判定を行ってください。②多少の字余りや字足らずは詩的表現として尊重し、自然なリズムであれば指摘しないでください。③良い表現や感情の動きを褒めてみましょう。④返答は130文字程度にまとめてください。⑤ユーザーが短歌や俳句以外のものを送った場合は「短歌や俳句を入力してな」と返してください。"},
        { role: "user", content: text },
      ],
    });

    const correctedText = gptResponse.choices[0].message.content.trim();
    console.log('GPT応答:', correctedText);

    res.json({ correctedText });
  } catch (error) {
    console.error('サーバー側でエラーが発生:', error.message);
    res.status(500).json({ error: 'サーバー側でエラーが発生しました。' });
  }
});


// エクスポート（Vercel用）
export default app;
