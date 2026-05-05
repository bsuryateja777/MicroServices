
export default function Settings() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="bg-white p-6 rounded-2xl shadow space-y-4">

        <div>
          <p className="font-medium">Change Password</p>
          <button className="text-blue-600 text-sm">Update</button>
        </div>

        <div>
          <p className="font-medium">Notifications</p>
          <button className="text-blue-600 text-sm">Manage</button>
        </div>

        <div>
          <p className="font-medium">Privacy</p>
          <button className="text-blue-600 text-sm">Control</button>
        </div>

      </div>
    </>
  )
}