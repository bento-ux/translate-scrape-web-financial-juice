const http = require('http');
const translate = require('@iamtraction/google-translate');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const Tgfancy = require("tgfancy");


function sendTelegramMessage(text) {
  const botToken = '6670866791:AAET0NyCaYDK35IKUu_BeLWpeh2v_e_N8Gg';
  const chatId = '@bentoreq'; // Ganti dengan chat_id yang sesuai
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  const params = {
    chat_id: '-1001826771810',
    text: text,
    parse_mode: 'html'
  };

  axios.get(apiUrl, { params })
    .then((response) => {
      console.log('Message sent successfully:', response.data);
    })
    .catch((error) => {
      console.error('Error sending message:', error.message);
    });
}

const botToken = '6670866791:AAET0NyCaYDK35IKUu_BeLWpeh2v_e_N8Gg';
const bot = new TelegramBot(botToken, { polling: true });


const chatId = '-1001826771810';

async function sendMessageToChannel(message_title) {
  // const bot = new Tgfancy(botToken, {
  //   tgfancy: {
  //     orderedSending: true,
  //   },
  // });
  // bot.sendMessage(chatId, message_title);

  bot.sendMessage(chatId,message_title).then(() => {
  });
}

async function translateAndSendMessage(title) {
  try {
    const res = await translate(title, { to: 'id' });
    console.log(res.text); // OUTPUT: You are amazing!
    await sendMessageToChannel(res.text);
    // sendTelegramMessage(res.text)
  } catch (error) {
    console.error("Gagal melakukan terjemahan:", error);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.headers['content-type'] === 'application/json') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      (async () => {
          try {
            const jsonData = JSON.parse(body); // Parse the JSON data into an object
            
            if (!Array.isArray(jsonData)) {
              throw new Error('Invalid JSON data. Expected an array.');
            }
            // jsonData.reverse();

            // Perulangan untuk mengakses setiap objek JSON
            for (let i = jsonData.length - 1; i >= 0; i--) {
              const item = jsonData[i];
              if (item.title) {
                await translateAndSendMessage(item.title);
              }
            }

          } catch (error) {
            res.statusCode = 400;
            res.end('Invalid JSON data');
          }
      })();
    });
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

server.listen(3001, () => {
  console.log('Server listening on port 3001');
});
