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
    // Optionally send to backend here
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Admin Dashboard</h1>

      {/* Users Section */}
      <section>
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} (Joined: {user.joined})
            </li>
          ))}
        </ul>
      </section>

      {/* Analytics */}
      <section>
        <h2>Analytics</h2>
        <p>Tips: 0</p>
        <p>Messages: 0</p>
      </section>

      {/* Chat Section */}
      <section style={{ marginTop: "2rem" }}>
        <h2>Chat</h2>
        <label>
          Select Model:
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            style={{ marginLeft: "1rem" }}
          >
            <option value="Lana">Lana</option>
            <option value="Mia">Mia</option>
            <option value="Chloe">Chloe</option>
          </select>
        </label>
        <div style={{ marginTop: "1rem" }}>
          <textarea
            rows={3}
            style={{ width: "100%", marginBottom: "0.5rem" }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
        <div>
          <h3>Chat History</h3>
          <ul>
            {chatHistory.map((msg, index) => (
              <li key={index}>
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
