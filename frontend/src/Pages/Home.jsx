import React from "react";
import { MainIcon } from "../Utils/Icons";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800 px-6 py-12">
      {/* HERO */}
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex flex-row items-center justify-center gap-4">
          <MainIcon size={32} className="-translate-y-1" />

          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            CloudCart
          </h1>
        </div>

        <p className="text-xl text-gray-600 mb-6">
          A Scalable Microservices E-Commerce Platform
        </p>

        <p className="text-md text-gray-500 max-w-3xl mx-auto leading-relaxed">
          Built using the MERN stack and containerized with Docker, CloudCart
          demonstrates real-world microservices architecture including API
          Gateway routing, isolated services, and cloud-ready deployment
          strategies using AWS and Azure.
        </p>
      </div>

      {/* SERVICES ARCHITECTURE */}
      <div className="max-w-6xl mx-auto mt-16">
        <h2 className="text-2xl font-semibold text-center mb-10">
          System Architecture
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* API Gateway */}
          <div className="bg-white shadow-md rounded-2xl p-6 border">
            <h3 className="font-semibold text-lg mb-2">API Gateway</h3>
            <p className="text-sm text-gray-600">
              Central entry point managing routing, authentication, and request
              forwarding to backend services.
            </p>
          </div>

          {/* Auth Service */}
          <div className="bg-white shadow-md rounded-2xl p-6 border">
            <h3 className="font-semibold text-lg mb-2">Auth Service</h3>
            <p className="text-sm text-gray-600">
              Handles user registration, login, JWT authentication, and session
              management.
            </p>
          </div>

          {/* Product Service */}
          <div className="bg-white shadow-md rounded-2xl p-6 border">
            <h3 className="font-semibold text-lg mb-2">Product Service</h3>
            <p className="text-sm text-gray-600">
              Manages product listings, pricing, and inventory across the
              platform.
            </p>
          </div>

          {/* Order Service */}
          <div className="bg-white shadow-md rounded-2xl p-6 border">
            <h3 className="font-semibold text-lg mb-2">Order Service</h3>
            <p className="text-sm text-gray-600">
              Handles order placement, tracking, and status updates.
            </p>
          </div>

          {/* Wallet Service */}
          <div className="bg-white shadow-md rounded-2xl p-6 border">
            <h3 className="font-semibold text-lg mb-2">Wallet Service</h3>
            <p className="text-sm text-gray-600">
              Manages user balance, transactions, and payment flows.
            </p>
          </div>

          {/* Messaging */}
          <div className="bg-white shadow-md rounded-2xl p-6 border">
            <h3 className="font-semibold text-lg mb-2">Event / Messaging</h3>
            <p className="text-sm text-gray-600">
              Enables asynchronous communication between services (Kafka /
              queues).
            </p>
          </div>
        </div>
      </div>

      {/* TECH STACK */}
      <div className="max-w-6xl mx-auto mt-20 flex flex-col md:flex-row justify-around gap-10">
        <div>
          <h2 className="text-xl font-semibold mb-4">⚙️ Tech Stack</h2>
          <ul className="space-y-2 text-gray-600">
            <li>Frontend: React + Tailwind CSS</li>
            <li>Backend: Node.js + Express</li>
            <li>Database: MongoDB (per service)</li>
            <li>Authentication: JWT + Cookies</li>
            <li>Containers: Docker</li>
          </ul>
        </div>

        <hr className="h-64 border-l border-dashed border-gray-600 -translate-y-6" />

        <div>
          <h2 className="text-xl font-semibold mb-4">☁️ Deployment Ready</h2>
          <ul className="space-y-2 text-gray-600">
            <li>Docker Compose for local orchestration</li>
            <li>AWS ECS / App Runner support</li>
            <li>Azure Container Apps compatible</li>
            <li>Environment-based configuration</li>
            <li>Scalable microservices design</li>
          </ul>
        </div>
      </div>

      {/* FOOTER NOTE */}
      <div className="text-center mt-5 text-sm text-gray-400">
        Built to demonstrate production-grade microservices architecture 🚀
      </div>
    </div>
  );
}
