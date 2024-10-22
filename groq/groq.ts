import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function aiTagging(imageData: string) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "give three tags in an array without any hashtags or numbers for this image and never use the word myth. if any thing hindu just tell hindu, don't give description or anything extra ",
          },
          {
            type: "image_url",
            image_url: {
              url: imageData,
            },
          },
        ],
      },
      {
        role: "assistant",
        content: "",
      },
    ],
    model: "llama-3.2-11b-vision-preview",
    temperature: 1,
    max_tokens: 1024,
    top_p: 1,
    stream: false,
    stop: null,
  });

  // console.log(chatCompletion.choices[0].message.content);
  return chatCompletion.choices[0].message.content;
}
