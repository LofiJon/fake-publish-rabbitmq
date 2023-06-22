const amqp = require('amqplib');
const express = require('express');
const app = express();
const port = 3000; 

async function publishMessage() {
    try {
      // Conecte-se ao servidor RabbitMQ
      const connection = await amqp.connect('amqp://admin:admin@localhost');
      const channel = await connection.createChannel();
  
      // Declare uma fila para publicar as mensagens
      const queueName = 'QUEUE';
      await channel.assertQueue(queueName, { durable: true });
      
      const jsonData = {
        message: 'Mensagem'
      };

      // Defina a mensagem a ser publicada
      const message = JSON.stringify(jsonData);
  
      // Publique a mensagem na fila
      channel.sendToQueue(queueName, Buffer.from(message));
  
      console.log('Mensagem publicada:', message);
  
      // Feche a conexão após a publicação da mensagem
      await channel.close();
      await connection.close();
    } catch (error) {
      console.error('Erro:', error);
    }
  }
  
app.listen(port, () => {
    console.log(`Servidor está executando na porta ${port}`);
    setInterval(async() => {
        await publishMessage()
    },10000)
  });

