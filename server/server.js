import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from FinHelp!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (prompt.length === 0){
      res.status(200).send({
        bot: 'Please enter a question!'
      });
    } else if (prompt.length < 10) {
      res.status(200).send({
        bot: 'Please enter a question!'
      });
    } else {
      const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: isValidInput(`${prompt}`), //`${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 100, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
      });
      res.status(200).send({
        bot: response.data.choices[0].text
      });
    }

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

function isValidInput(userInput) {
  const capitalizedUserIn =
    userInput[0].toUpperCase() + userInput.slice(1).toLowerCase();
  return `Bop: Hello User, I'm a financial advisor looking to help you save money.
          User: Hello Bop, I am a person who would like to become more financially literate, and I have a few questions.
          Bop: How can I help you? what is your question?
          User: ${capitalizedUserIn}? 
          `;
}

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))