import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {

  const [items, setItems] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    const saved =
      JSON.parse(localStorage.getItem("recoveryXItems")) || [];

    setItems(saved);

  }, []);

  function deleteItem(id) {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this item?"
      );

    if (!confirmDelete) return;

    const updated =
      items.filter(item => item.id !== id);

    localStorage.setItem(
      "recoveryXItems",
      JSON.stringify(updated)
    );

    setItems(updated);
  }

  function editItem(item) {

    localStorage.setItem(
      "recoveryXEditItem",
      JSON.stringify(item)
    );

    navigate("/register");
  }

  return (

    <div className="app">

      <header className="navbar">

        <Link to="/" className="logo">
          <span>RX</span>
          Recovery X
        </Link>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/register">Register</Link>
        </nav>

      </header>

      <main className="dashboard">

        <div className="dashboard-header">

          <div>
            <span>MY RECOVERY X</span>

            <h1>My Items</h1>

            <p>
              Manage all your registered belongings.
            </p>
          </div>

          <Link
            to="/register"
            className="primary-btn"
          >
            + Register Item
          </Link>

        </div>

        {items.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              RX
            </div>

            <h2>No items registered</h2>

            <p>
              Register your first item and generate
              its Recovery X QR code.
            </p>

            <Link
              to="/register"
              className="primary-btn"
            >
              Register My First Item
            </Link>

          </div>

        ) : (

          <div className="items-grid">

            {items.map(item => (

              <div
                className="item-card"
                key={item.id}
              >

                <div className="item-card-top">

                  <div className="item-icon">
                    🎒
                  </div>

                  <span className="category">
                    {item.category}
                  </span>

                </div>

                <h2>{item.itemName}</h2>

                <p>
                  Owner: {item.ownerName}
                </p>

                <div className="item-id">
                  {item.id}
                </div>

                {item.location && (

                  <a
                    href={item.location}
                    target="_blank"
                    rel="noreferrer"
                    className="map-link"
                  >
                    📍 Open Google Maps
                  </a>

                )}

                <div className="card-actions">

                  <a
                    href={item.qr}
                    target="_blank"
                    rel="noreferrer"
                    className="action-btn"
                  >
                    QR
                  </a>

                  <button
                    onClick={() => editItem(item)}
                    className="action-btn"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteItem(item.id)}
                    className="action-btn delete"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default Dashboard;