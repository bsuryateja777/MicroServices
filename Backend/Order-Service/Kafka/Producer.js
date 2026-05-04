const kafka = require("./kafkaClient");

const producer = kafka.producer();

let connected = false;

const connectProducer = async () => {
  if (!connected) {
    await producer.connect();
    connected = true;
    console.log("✅ Producer Connected");
  }
};

// 🔥 GENERIC FUNCTION
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