const kafka = require("./kafkaClient");

const producer = kafka.producer();

let isConnected = false;

const connectProducer = async () => {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
    console.log("✅ Producer Connected");
  }
};

const sendEvent = async (topic, payload) => {
  await connectProducer();

  await producer.send({
    topic,
    messages: [
      {
        value: JSON.stringify(payload),
      },
    ],
  });
};

module.exports = { sendEvent };