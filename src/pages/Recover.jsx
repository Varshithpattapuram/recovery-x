import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase";

export default function Recover() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function findItem() {
      console.log("Recovery ID:", id);

      if (!id) {
        setError("Recovery ID is missing.");
        setLoading(false);
        return;
      }

      const recoveryId = id.trim().toUpperCase();

      const { data, error: dbError } = await supabase
        .from("items")
        .select("*")
        .eq("recovery_id", recoveryId)
        .maybeSingle();

      console.log("Supabase data:", data);
      console.log("Supabase error:", dbError);

      if (dbError) {
        setError(dbError.message);
        setLoading(false);
        return;
      }

      if (!data) {
        setError(`No item found for ${recoveryId}`);
        setLoading(false);
        return;
      }

      setItem(data);
      setLoading(false);
    }

    findItem();
  }, [id]);

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Finding item...</h2>
      </div>
    );
  }

  if (!item) {
    return (
      <div style={styles.center}>
        <div>
          <h1>❌ Item Not Found</h1>

          <p>{error}</p>

          <p>
            Recovery ID: <strong>{id || "Missing"}</strong>
          </p>

          <a href="/">Go Home</a>
        </div>
      </div>
    );
  }

  const mapUrl =
    item.latitude != null && item.longitude != null
      ? `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`
      : item.location;

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.success}>✓</div>

        <h1>Item Found</h1>

        <p style={styles.subtext}>
          This item is registered with Recovery X.
        </p>

        <h2>{item.recovery_id}</h2>

        <hr />

        <h3>Item Information</h3>

        <p>
          <strong>Item:</strong> {item.item_name}
        </p>

        <p>
          <strong>Category:</strong> {item.category}
        </p>

        <hr />

        <h3>Owner Information</h3>

        <p>
          <strong>Name:</strong> {item.owner_name}
        </p>

        <p>
          <strong>Mobile:</strong> {item.mobile}
        </p>

        <p>
          <strong>Email:</strong> {item.email}
        </p>

        {mapUrl && (
          <>
            <hr />

            <h3>Last Known Location</h3>

            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              📍 Open Location in Google Maps →
            </a>
          </>
        )}

        <hr />

        <p style={styles.footer}>
          🔐 Recovery X
        </p>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "30px 20px",
    fontFamily: "Arial, sans-serif",
  },

  card: {
    maxWidth: "600px",
    margin: "0 auto",
    background: "#ffffff",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },

  success: {
    fontSize: "55px",
    textAlign: "center",
  },

  subtext: {
    color: "#666",
  },

  footer: {
    textAlign: "center",
    color: "#777",
  },
};