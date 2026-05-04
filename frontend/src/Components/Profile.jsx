import React from 'react'

 export default function Profile({ user, setActiveTab }) {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile Details</h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500 text-sm">Full Name</p>
            <p className="font-medium">{user.name}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Email Address</p>
            <p className="font-medium">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

        <div className="flex gap-4 flex-wrap">

          <button
            onClick={() => setActiveTab("orders")}
            className="px-4 py-2 bg-black text-white rounded-lg hover:opacity-90"
          >
            View Orders
          </button>

          <button
            onClick={() => setActiveTab("wallet")}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Wallet
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Edit Profile
          </button>

        </div>
      </div>

      {/* Portfolio Section */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2">Developer Portfolio</h2>
        <p className="text-gray-600 mb-4">
          Check out my work, projects, and technical experience.
        </p>

        <a
          href="https://portfolio-g8xb.onrender.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Visit Portfolio
        </a>
      </div>
    </>
  )
}