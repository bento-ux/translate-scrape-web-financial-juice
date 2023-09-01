const http = require('http');
const translate = require('@iamtraction/google-translate');
const TelegramBot = require('node-telegram-bot-api');
const kue = require('kue');

const queue = kue.createQueue();

const botToken = '6441985725:AAHPooUgJkfka4tLMTUY2io4UBgCaW-BPtg';
const bot = new TelegramBot(botToken, { polling: true });


const chatId = '-1001805207095';

async function sendMessageToChannel(message_title) {
  bot.sendMessage(chatId,message_title).then(() => {
  });
}

function addToQueueWithDelay(message) {
    const job = queue.create('sendMessage', { message }).save(function(err) {
      if (err) {
        console.error('Gagal menambahkan tugas ke dalam antrean:', err);
      } else {
        console.log('Tugas ditambahkan ke dalam antrean.');
      }
    }).delay(3000); // Menambahkan penundaan (delay) sebelum tugas dijalankan
  }
  
  // Proses tugas dari antrean
  queue.process('sendMessage', function(job, done) {
    sendMessageToChannel(job.data.message);
    done();
  });

async function translateAndSendMessage(title) {
  try {
    const res = await translate(title, { to: 'id' });
    console.log(res.text);
    // await sendMessageToChannel(res.text);
    addToQueueWithDelay(res.text)
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
