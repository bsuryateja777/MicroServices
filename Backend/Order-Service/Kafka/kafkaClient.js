const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "microservices-app",
  brokers: ["kafka:9092"],
});

module.exports = kafka;