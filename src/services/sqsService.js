// Servicio para interactuar con SQS
const { SQSClient, SendMessageCommand, CreateQueueCommand, GetQueueUrlCommand } = require('@aws-sdk/client-sqs');
const { REGION, QUEUE_NAME } = require('../config');

const sqs = new SQSClient({ region: REGION });

// Obtiene la URL de la cola, si no existe la crea
async function getQueueUrl() {
  try {
    const res = await sqs.send(new GetQueueUrlCommand({ QueueName: QUEUE_NAME }));
    return res.QueueUrl;
  } catch (err) {
    if (err.name === 'QueueDoesNotExist' || err.$metadata?.httpStatusCode === 400) {
      const res = await sqs.send(new CreateQueueCommand({ QueueName: QUEUE_NAME }));
      return res.QueueUrl;
    }
    throw err;
  }
}

// Envía un mensaje a la cola con el contenido del boletín
async function enviarMensaje({ contenido, correo, imagen }) {
  const queueUrl = await getQueueUrl();

  await sqs.send(new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify({
      contenido,
      correo,
      imagen,
      timestamp: new Date().toISOString(),
    }),
  }));
}

module.exports = { enviarMensaje };
