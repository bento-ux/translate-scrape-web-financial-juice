const http = require('http');
const translate = require('@iamtraction/google-translate');
const TelegramBot = require('node-telegram-bot-api');

const botToken = '6670866791:AAET0NyCaYDK35IKUu_BeLWpeh2v_e_N8Gg';
const bot = new TelegramBot(botToken, { polling: true });

const chatId = '-1001826771810';
async function sendMessageToChannel(message_title) {
  await bot.sendMessage(chatId, message_title);
}

async function translateAndSendMessage(title) {
  try {
    const res = await translate(title, { to: 'id' });
    console.log("--------------- PEMBATAS TRANSLATE ------------");
    console.log(res.text); // OUTPUT: You are amazing!
    await sendMessageToChannel(res.text);
  } catch (error) {
    console.error("Gagal melakukan terjemahan:", error);
  }
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.headers['content-type'] === 'application/json') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const jsonData = JSON.parse(body); // Parse the JSON data into an object
        const title = jsonData.title; // Access the value of "title" property
        console.log(title); // Display the value of "title"
        
        translateAndSendMessage(title);
      } catch (error) {
        res.statusCode = 400;
        res.end('Invalid JSON data');
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
