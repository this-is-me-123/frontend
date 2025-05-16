import React, { useEffect, useState } from "react";

const backend_url = process.env.REACT_APP_BACKEND_URL;

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedModel, setSelectedModel] = useState("Lana");
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Fetch users with loading and error handling
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${backend_url}/users`);
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Sanitize input to avoid script injection
  const sanitizeMessage = (msg) => {
    const div = document.createElement("div");
    div.textContent = msg;
    return div.innerHTML;
  };

  // Send message and get AI reply from backend
  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    const cleanMessage = sanitizeMessage(message.trim());

    // Append admin message locally
    const newMessage = { from: "admin", text: cleanMessage };
    setChatHistory((prev) => [...prev, newMessage]);
    setMessage("");

    setChatLoading(true);
    try {
      const res = await fetch(`${backend_url}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: selectedModel, message: cleanMessage }),
      });

      if (!res.ok) throw new Error("Failed to get AI response");
      const data = await res.json();

      setChatHistory((prev) => [
        ...prev,
        { from: selectedModel, text: data.reply || "No response" },
      ]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { from: "system", text: "Failed to get reply. Please try again." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="p-6 font-sans max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        {loading && <p>Loading users...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && (
          <ul className="bg-white shadow rounded-lg divide-y">
            {users.map((user) => (
              <li key={user.id} className="p-4">
                <span className="font-medium">{user.name}</span>{" "}
                <span className="text-gray-500">(Joined: {user.joined})</span>
              </li>
            ))}
          </ul>
        )}
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
          disabled={message.trim() === "" || chatLoading}
          aria-disabled={message.trim() === "" || chatLoading}
          className={`px-4 py-2 rounded mb-6 ${
            message.trim() === "" || chatLoading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {chatLoading ? "Sending..." : "Send"}
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
