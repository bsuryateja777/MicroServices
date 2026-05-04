const kafka = require("./kafkaClient");

const createConsumer = (groupId) => {
  return kafka.consumer({ groupId });
};

const runConsumer = async (consumer, topic, handler) => {
  await consumer.connect();

  await consumer.subscribe({
    topic,
    fromBeginning: false,
  });

  console.log(`✅ Consumer running on ${topic}`);

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const event = JSON.parse(message.value.toString());

        if (!event?.type || !event?.data) {
          console.log("❌ Invalid event format");
          return;
        }

        await handler(event);
      } catch (err) {
        console.error("❌ Consumer Error:", err.message);
      }
    },
  });
};

module.exports = { createConsumer, runConsumer };