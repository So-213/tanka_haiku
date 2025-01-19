// import { Configuration, OpenAIApi } from 'openai';

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY, // 環境変数からAPIキーを読み込む
// });

// const openai = new OpenAIApi(configuration);

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     try {
//       const { text } = req.body;

//       // テキストがない場合のエラーチェック
//       if (!text) {
//         return res.status(400).json({ error: 'テキストが送信されていません。' });
//       }

//       console.log('Received text:', text); // デバッグ用

//       // OpenAI APIを呼び出す
//       const completion = await openai.createCompletion({
//         model: 'gpt-4o', // 使用するモデルを指定
//         prompt: `あなたは短歌と俳句の添削専門アシスタントです。ユーザーが送った短歌や俳句に対して、①五七五（俳句）や五七五七七（短歌）の形式を確認し、厳密すぎない柔軟な音数判定を行ってください。②多少の字余りや字足らずは詩的表現として尊重し、自然なリズムであれば指摘しないでください。③良い表現や感情の動きを褒めてみましょう。④返答は130文字程度にまとめてください。⑤ユーザーが短歌や俳句以外のものを送った場合は「短歌や俳句を入力してな」と返してください。: ${text}`,
//         max_tokens: 100, // 必要に応じてトークン数を調整
//       });

//       // OpenAIの結果をレスポンスとして返す
//       const aiResponse = completion.data.choices[0].text.trim();
//       res.status(200).json({ message: aiResponse });

//     } catch (error) {
//       console.error('Error processing request:', error);
//       res.status(500).json({ error: 'サーバーエラーが発生しました。' });
//     }
//   } else {
//     // POST以外のリクエストにはエラーレスポンスを返す
//     res.status(405).json({ error: 'このエンドポイントではPOSTリクエストのみ許可されています。' });
//   }
// }


import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({ error: 'テキストが送信されていません。' });
      }

      const completion = await openai.createCompletion({
        model: 'gpt-4o',
        prompt: `俳句/短歌を添削してください: ${text}`,
        max_tokens: 100,
      });

      res.status(200).json({ message: completion.data.choices[0].text.trim() });
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ error: 'サーバーエラーが発生しました。' });
    }
  } else {
    res.status(405).json({ error: 'このエンドポイントではPOSTリクエストのみ許可されています。' });
  }
}

