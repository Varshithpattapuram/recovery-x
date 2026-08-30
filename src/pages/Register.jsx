import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import QRCode from "qrcode";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ownerName: "",
    mobile: "",
    email: "",
    itemName: "",
    category: "",
    location: "",
    latitude: "",
    longitude: "",
  });

  const [qrCode, setQrCode] = useState("");
  const [recoveryId, setRecoveryId] = useState("");
  const [recoveryUrl, setRecoveryUrl] = useState("");

  const [loading, setLoading] = useState(false);

  // Handle input changes
  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Generate unique Recovery X ID
  function generateRecoveryId() {
    const randomPart = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    return `RX-${randomPart}`;
  }

  // Get current Google Maps location
  function getLocation() {
    if (!navigator.geolocation) {
      alert("Your browser does not support location services.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const mapsUrl =
          `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

        setForm((previous) => ({
          ...previous,
          location: mapsUrl,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        }));
      },

      (error) => {
        if (error.code === 1) {
          alert(
            "Location permission was denied. Please allow location access."
          );
        } else if (error.code === 2) {
          alert("Your location could not be found.");
        } else if (error.code === 3) {
          alert("Location request timed out.");
        } else {
          alert("Unable to get your location.");
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  // Register item
  async function handleSubmit(e) {
    e.preventDefault();

    // Check required fields
    if (
      !form.ownerName.trim() ||
      !form.mobile.trim() ||
      !form.email.trim() ||
      !form.itemName.trim() ||
      !form.category
    ) {
      alert("Please fill all required fields.");
      return;
    }

    // Basic mobile validation
    if (form.mobile.length < 10) {
      alert("Please enter a valid mobile number.");
      return;
    }

    setLoading(true);

    try {
      // Generate unique ID
      const id = generateRecoveryId();

      // Recovery page URL
      const url =
        `${window.location.origin}/recover/${id}`;

      // Generate real QR code
      const qr = await QRCode.toDataURL(url, {
        width: 500,
        margin: 2,
        errorCorrectionLevel: "H",
      });

      // Create item object
      const newItem = {
        id: id,

        ownerName: form.ownerName.trim(),

        mobile: form.mobile.trim(),

        email: form.email.trim(),

        itemName: form.itemName.trim(),

        category: form.category,

        location: form.location,

        latitude: form.latitude,

        longitude: form.longitude,

        qr: qr,

        recoveryUrl: url,

        createdAt: new Date().toISOString(),
      };

      // Get existing items
      const existingItems =
        JSON.parse(
          localStorage.getItem("recoveryXItems")
        ) || [];

      // Save new item
      localStorage.setItem(
        "recoveryXItems",
        JSON.stringify([
          ...existingItems,
          newItem,
        ])
      );

      // Show QR
      setRecoveryId(id);
      setQrCode(qr);
      setRecoveryUrl(url);

    } catch (error) {
      console.error(error);
      alert("Something went wrong while creating the QR code.");
    } finally {
      setLoading(false);
    }
  }

  // Download QR
  function downloadQR() {
    if (!qrCode) return;

    const link = document.createElement("a");

    link.href = qrCode;

    link.download =
      `${recoveryId}-Recovery-X.png`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }

  // Open recovery page
  function openRecoveryPage() {
    navigate(`/recover/${recoveryId}`);
  }

  // ------------------------------------------------
  // SUCCESS SCREEN
  // ------------------------------------------------

  if (recoveryId) {
    return (
      <div className="app">

        <header className="navbar">

          <Link to="/" className="logo">
            <span>RX</span>
            Recovery X
          </Link>

          <nav>
            <Link to="/">Home</Link>

            <Link to="/dashboard">
              My Items
            </Link>
          </nav>

        </header>

        <main className="success-page">

          <div className="success-card">

            <div className="success-icon">
              ✓
            </div>

            <h1>
              Item Registered!
            </h1>

            <p>
              Your Recovery X identity has
              been successfully created.
            </p>

            {/* Recovery ID */}

            <div className="recovery-id">
              {recoveryId}
            </div>

            {/* QR CODE */}

            <img
              src={qrCode}
              alt="Recovery X QR Code"
              className="generated-qr"
            />

            <h3>
              Your Recovery X QR Code
            </h3>

            <p className="qr-info">
              Download this QR code and
              attach it to your item.
            </p>

            {/* Recovery URL */}

            <div
              style={{
                marginTop: "15px",
                padding: "12px",
                background: "#f3f4f6",
                borderRadius: "8px",
                fontSize: "12px",
                wordBreak: "break-all",
              }}
            >
              {recoveryUrl}
            </div>

            {/* Buttons */}

            <div className="success-actions">

              <button
                onClick={downloadQR}
                className="primary-btn"
              >
                Download QR
              </button>

              <button
                onClick={openRecoveryPage}
                className="secondary-btn"
              >
                View Recovery Page
              </button>

            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="secondary-btn"
              style={{
                marginTop: "12px",
                width: "100%",
              }}
            >
              Go to My Items
            </button>

          </div>

        </main>

      </div>
    );
  }

  // ------------------------------------------------
  // REGISTRATION FORM
  // ------------------------------------------------

  return (
    <div className="app">

      {/* NAVBAR */}

      <header className="navbar">

        <Link to="/" className="logo">
          <span>RX</span>
          Recovery X
        </Link>

        <nav>

          <Link to="/">
            Home
          </Link>

          <Link to="/dashboard">
            My Items
          </Link>

        </nav>

      </header>

      {/* MAIN FORM */}

      <main className="form-page">

        <div className="form-header">

          <span>
            REGISTER YOUR ITEM
          </span>

          <h1>
            Give your item
            <br />
            a Recovery X identity.
          </h1>

          <p>
            Register your belongings and generate
            a unique QR code that helps people
            return them to you.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="register-form"
        >

          {/* OWNER INFORMATION */}

          <div className="form-section">

            <h2>
              👤 Owner Information
            </h2>

            <div className="form-grid">

              {/* NAME */}

              <div className="input-group">

                <label>
                  Owner Name *
                </label>

                <input
                  type="text"
                  name="ownerName"
                  value={form.ownerName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />

              </div>

              {/* MOBILE */}

              <div className="input-group">

                <label>
                  📱 Mobile Number *
                </label>

                <input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  maxLength="10"
                  required
                />

              </div>

              {/* EMAIL */}

              <div className="input-group full">

                <label>
                  📧 Email ID *
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />

              </div>

            </div>

          </div>

          {/* ITEM INFORMATION */}

          <div className="form-section">

            <h2>
              🎒 Item Information
            </h2>

            <div className="form-grid">

              {/* ITEM NAME */}

              <div className="input-group">

                <label>
                  Item Name *
                </label>

                <input
                  type="text"
                  name="itemName"
                  value={form.itemName}
                  onChange={handleChange}
                  placeholder="Example: College Bag"
                  required
                />

              </div>

              {/* CATEGORY */}

              <div className="input-group">

                <label>
                  📂 Category *
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select category
                  </option>

                  <option value="Electronics">
                    Electronics
                  </option>

                  <option value="Bag">
                    Bag
                  </option>

                  <option value="Wallet">
                    Wallet
                  </option>

                  <option value="Keys">
                    Keys
                  </option>

                  <option value="Documents">
                    Documents
                  </option>

                  <option value="Vehicle">
                    Vehicle
                  </option>

                  <option value="Jewellery">
                    Jewellery
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

            </div>

          </div>

          {/* LOCATION */}

          <div className="form-section">

            <h2>
              📍 Google Maps Location
            </h2>

            <p className="location-description">
              Save the current location using
              your device's GPS and Google Maps.
            </p>

            <button
              type="button"
              onClick={getLocation}
              className="location-btn"
            >
              📍 Use My Current Location
            </button>

            {/* LOCATION SUCCESS */}

            {form.location && (

              <div
                style={{
                  marginTop: "18px",
                  padding: "15px",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "10px",
                }}
              >

                <strong>
                  ✓ Location saved
                </strong>

                <p
                  style={{
                    margin: "8px 0",
                    fontSize: "13px",
                  }}
                >
                  Latitude: {form.latitude}
                  <br />
                  Longitude: {form.longitude}
                </p>

                <a
                  href={form.location}
                  target="_blank"
                  rel="noreferrer"
                  className="location-link"
                >
                  Open location in Google Maps →
                </a>

              </div>

            )}

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            className="generate-btn"
            disabled={loading}
          >

            {loading
              ? "Generating..."
              : "Generate Recovery X ID & QR"}

          </button>

        </form>

      </main>

    </div>
  );
}

export default Register;