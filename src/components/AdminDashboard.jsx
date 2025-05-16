import React, { useEffect, useState } from "react";

const backend_url = "https://onlyfans-ai-dashboard-production.up.railway.app";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedModel, setSelectedModel] = useState("Lana");
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${backend_url}/users`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleSendMessage = () => {
    if (message.trim() === "") return;
    const newMessage = { from: "admin", text: message };
    setChatHistory((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <div className="p-6 font-sans max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        <ul className="bg-white shadow rounded-lg divide-y">
          {users.map((user) => (
            <li key={user.id} className="p-4">
              <span className="font-medium">{user.name}</span>{" "}
              <span className="text-gray-500">(Joined: {user.joined})</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Analytics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded shadow">
            <p className="text-sm text-gray-700">Tips</p>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-green-100 p-4 rounded shadow">
            <p className="text-sm text-gray-700">Messages</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Chat</h2>
        <div className="mb-4">
          <label htmlFor="model-select" className="block mb-1 font-medium">
            Select Model
          </label>
          <select
            id="model-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="Lana">Lana</option>
            <option value="Mia">Mia</option>
            <option value="Chloe">Chloe</option>
          </select>
        </div>

        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
        />

        <button
          onClick={handleSendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
        >
          Send
        </button>

        <div>
          <h3 className="text-lg font-semibold mb-2">Chat History</h3>
          <ul className="space-y-2">
            {chatHistory.map((msg, index) => (
              <li key={index} className="bg-gray-100 p-2 rounded">
                <strong>{msg.from}:</strong> {msg.text}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
