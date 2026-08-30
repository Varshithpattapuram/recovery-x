import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../supabase";

function Recover() {
  const { recoveryId } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function findItem() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("recovery_id", recoveryId)
        .maybeSingle();

      if (error) {
        console.error("Supabase error:", error);
        setError(error.message);
      } else if (!data) {
        setError("Recovery X item not found.");
      } else {
        setItem(data);
      }

      setLoading(false);
    }

    if (recoveryId) {
      findItem();
    } else {
      setError("Invalid Recovery X ID.");
      setLoading(false);
    }
  }, [recoveryId]);

  if (loading) {
    return (
      <div className="app">
        <header className="navbar">
          <Link to="/" className="logo">
            <span>RX</span>
            Recovery X
          </Link>
        </header>

        <main className="success-page">
          <div className="success-card">
            <h1>Finding your item...</h1>
            <p>Please wait.</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <header className="navbar">
          <Link to="/" className="logo">
            <span>RX</span>
            Recovery X
          </Link>
        </header>

        <main className="success-page">
          <div className="success-card">

            <div className="success-icon">
              !
            </div>

            <h1>Item Not Found</h1>

            <p>{error}</p>

            <div
              style={{
                marginTop: "15px",
                padding: "12px",
                background: "#f3f4f6",
                borderRadius: "8px",
                wordBreak: "break-all",
              }}
            >
              Recovery ID: {recoveryId}
            </div>

            <Link
              to="/"
              className="primary-btn"
              style={{
                display: "inline-block",
                marginTop: "20px",
                textDecoration: "none",
              }}
            >
              Go Home
            </Link>

          </div>
        </main>
      </div>
    );
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
          <Link to="/register">Register Item</Link>
        </nav>

      </header>

      <main className="success-page">

        <div className="success-card">

          <div className="success-icon">
            ✓
          </div>

          <h1>Item Found</h1>

          <p>
            This item is registered with Recovery X.
          </p>

          <div
            className="recovery-id"
            style={{ marginTop: "15px" }}
          >
            {item.recovery_id}
          </div>

          <div
            style={{
              textAlign: "left",
              marginTop: "25px",
              padding: "20px",
              background: "#f8fafc",
              borderRadius: "12px",
            }}
          >

            <h2>Item Information</h2>

            <p>
              <strong>Item:</strong>{" "}
              {item.item_name}
            </p>

            <p>
              <strong>Category:</strong>{" "}
              {item.category}
            </p>

          </div>

          <div
            style={{
              textAlign: "left",
              marginTop: "15px",
              padding: "20px",
              background: "#f8fafc",
              borderRadius: "12px",
            }}
          >

            <h2>Owner Information</h2>

            <p>
              <strong>Name:</strong>{" "}
              {item.owner_name}
            </p>

            <p>
              <strong>Mobile:</strong>{" "}
              {item.mobile}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {item.email}
            </p>

          </div>

          {item.location && (
            <div
              style={{
                marginTop: "15px",
                padding: "20px",
                background: "#f0fdf4",
                borderRadius: "12px",
              }}
            >

              <h2>Last Known Location</h2>

              <a
                href={item.location}
                target="_blank"
                rel="noreferrer"
                className="location-link"
              >
                📍 Open Location in Google Maps →
              </a>

            </div>
          )}

          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#fff7ed",
              borderRadius: "10px",
            }}
          >
            <strong>🔐 Recovery X</strong>

            <p style={{ fontSize: "14px" }}>
              If you found this item, please contact
              the owner using the information above
              to help return it safely.
            </p>
          </div>

        </div>

      </main>

    </div>
  );
}

export default Recover;