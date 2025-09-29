// Dashboard.jsx
import React, { useState } from "react";
import "./Dashboard.css";
import { Button } from "@shadcn/ui";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Lost");

  const items = [
    {
      id: 1,
      title: "iPhone 13 Pro",
      category: "Electronics",
      description: "Blue iPhone 13 Pro with clear case. Small crack on screen.",
      location: "Library",
      time: "1 day ago",
      status: "Lost",
      urgent: true,
      img: "https://images.unsplash.com/photo-1580910051074-7b5e03a2a76e"
    },
    {
      id: 2,
      title: "Red Backpack",
      category: "Bags",
      description: "Nike backpack with laptop & notes.",
      location: "Student Center",
      time: "2 days ago",
      status: "Lost",
      urgent: false,
      img: "https://images.unsplash.com/photo-1524492449090-1a065f2d4c88"
    },
    {
      id: 3,
      title: "Car Keys",
      category: "Keys",
      description: "Honda car keys with blue keychain.",
      location: "Parking Lot",
      time: "3 days ago",
      status: "Lost",
      urgent: true,
      img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f"
    },
    {
      id: 4,
      title: "Water Bottle",
      category: "Accessories",
      description: "Metal water bottle found near gym.",
      location: "Gym",
      time: "4 hours ago",
      status: "Found",
      urgent: false,
      img: "https://images.unsplash.com/photo-1602143407151-7114b5f3f5cf"
    }
  ];

  const filteredItems =
    activeTab === "All"
      ? items
      : items.filter((i) => i.status === activeTab);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">🎒 CampusHub</h2>
        <ul>
          <li className={activeTab === "Lost" ? "active" : ""} onClick={() => setActiveTab("Lost")}>Lost Items</li>
          <li className={activeTab === "Found" ? "active" : ""} onClick={() => setActiveTab("Found")}>Found Items</li>
          <li className={activeTab === "All" ? "active" : ""} onClick={() => setActiveTab("All")}>All Items</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main">
        <header className="topbar">
          <h1>{activeTab} Items</h1>
          <button className="report-btn">+ Report Item</button>
        </header>

        <div className="cards">
          {filteredItems.map((item) => (
            <div key={item.id} className={`card ${item.urgent ? "urgent" : ""}`}>
              <div className="img-box">
                <img src={item.img} alt={item.title} />
                {item.urgent && <span className="badge urgent-badge">Urgent</span>}
                <span className="badge status">{item.status}</span>
              </div>
              <div className="content">
                <h3>{item.title}</h3>
                <p className="category">{item.category}</p>
                <p className="desc">{item.description}</p>
                <p className="meta">📍 {item.location}</p>
                <p className="meta">⏱ Lost: {item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
