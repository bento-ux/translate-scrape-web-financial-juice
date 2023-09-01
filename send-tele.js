const TelegramBot = require('node-telegram-bot-api');

const botToken = '6670866791:AAET0NyCaYDK35IKUu_BeLWpeh2v_e_N8Gg';
const bot = new TelegramBot(botToken, { polling: true });

const chatId = '-1001826771810'; // ID channel yang ingin Anda kirimkan pesan

// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, 'Halo, selamat datang di bot!');
// });

// Fungsi untuk mengirim pesan ke channel
function sendMessageToChannel(message_title) {
  return bot.sendMessage(chatId, message_title);
}

export default sendMessageToChannel;

// Panggil fungsi sendMessageToChannel sesuai kebutuhan Anda, misalnya saat ada peristiwa tertentu.
// sendMessageToChannel(param);
