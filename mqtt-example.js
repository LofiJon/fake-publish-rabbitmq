const mqtt = require('mqtt');
const express = require('express');
const app = express();
const port = 3001;

async function publish() {
  try {
    const client = mqtt.connect('mqtt://ip', { username: 'admin', password: 'admin' });

    const topic = 'QUEUE';
    const jsonData = {
      message: "message"
    };
    const message = JSON.stringify(jsonData);
    console.log(message);

    client.on('connect', () => {
      client.publish(topic, message);
      console.log('Mensagem publicada com sucesso no tópico:', topic);
      client.end();
    });
  } catch (error) {
    console.error('Erro:', error);
  }
}

app.listen(port, () => {
  console.log(`Servidor está executando na porta ${port}`);
  setInterval(async () => {
    await publish();
    console.log("enviando dados simulados");
  }, 3000);
});