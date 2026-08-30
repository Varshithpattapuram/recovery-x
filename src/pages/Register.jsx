import { useState } from "react";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import { supabase } from "../supabase";

function Register() {
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

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [recoveryId, setRecoveryId] = useState("");
  const [recoveryUrl, setRecoveryUrl] = useState("");
  const [qrCode, setQrCode] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function generateRecoveryId() {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let randomPart = "";

    for (let i = 0; i < 6; i++) {
      randomPart +=
        characters[Math.floor(Math.random() * characters.length)];
    }

    return `RX-${randomPart}`;
  }

  function getLocation() {
    if (!navigator.geolocation) {
      alert("Location is not supported by this browser.");
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
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          location: mapsUrl,
        }));
      },
      (error) => {
        console.error(error);

        if (error.code === 1) {
          alert(
            "Location permission was denied. Please allow location access."
          );
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

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.ownerName.trim() ||
      !form.mobile.trim() ||
      !form.email.trim() ||
      !form.itemName.trim() ||
      !form.category.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (!/^\d{10}$/.test(form.mobile.trim())) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      // ==========================================
      // 1. GENERATE RECOVERY ID
      // ==========================================

      const newRecoveryId = generateRecoveryId();

      // ==========================================
      // 2. IMPORTANT:
      // USE YOUR PERMANENT VERCEL DOMAIN
      // ==========================================

      const newRecoveryUrl =
        `https://recovery-x-blue.vercel.app/recover/${newRecoveryId}`;

      // ==========================================
      // 3. GENERATE QR
      // ==========================================

      const newQrCode = await QRCode.toDataURL(newRecoveryUrl, {
        width: 500,
        margin: 2,
        errorCorrectionLevel: "H",
      });

      // ==========================================
      // 4. SAVE TO SUPABASE
      // ==========================================
      //
      // DO NOT send "id".
      // Supabase generates the bigint id automatically.
      //

      const itemData = {
        recovery_id: newRecoveryId,
        owner_name: form.ownerName.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim(),
        item_name: form.itemName.trim(),
        category: form.category.trim(),
        location: form.location || null,
        latitude: form.latitude
          ? parseFloat(form.latitude)
          : null,
        longitude: form.longitude
          ? parseFloat(form.longitude)
          : null,
        qr: newQrCode,
        recovery_url: newRecoveryUrl,
      };

      console.log("Saving to Supabase:", itemData);

      const { data, error } = await supabase
        .from("items")
        .insert([itemData])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);

        alert(`Database error: ${error.message}`);

        return;
      }

      console.log("Successfully registered:", data);

      // ==========================================
      // 5. SHOW SUCCESS
      // ==========================================

      setRecoveryId(newRecoveryId);
      setRecoveryUrl(newRecoveryUrl);
      setQrCode(newQrCode);
      setSuccess(true);

    } catch (error) {
      console.error("Registration error:", error);

      alert(
        `Something went wrong while registering: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  }

  function downloadQR() {
    if (!qrCode) return;

    const link = document.createElement("a");

    link.href = qrCode;
    link.download = `${recoveryId}-Recovery-X.png`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }

  function registerAnotherItem() {
    setForm({
      ownerName: "",
      mobile: "",
      email: "",
      itemName: "",
      category: "",
      location: "",
      latitude: "",
      longitude: "",
    });

    setSuccess(false);
    setRecoveryId("");
    setRecoveryUrl("");
    setQrCode("");
  }

  // ==========================================
  // SUCCESS PAGE
  // ==========================================

  if (success) {
    return (
      <div className="app">

        <header className="navbar">

          <Link to="/" className="logo">
            <span>RX</span>
            Recovery X
          </Link>

          <nav>
            <Link to="/">Home</Link>
          </nav>

        </header>

        <main className="form-page">

          <div
            className="success-card"
            style={{
              maxWidth: "600px",
              margin: "40px auto",
              padding: "30px",
              textAlign: "center",
            }}
          >

            <div
              style={{
                fontSize: "50px",
                marginBottom: "10px",
              }}
            >
              ✓
            </div>

            <h1>Item Registered Successfully!</h1>

            <p>
              Your item has been registered with Recovery X.
            </p>

            <div
              style={{
                margin: "25px auto",
                padding: "12px 20px",
                background: "#f3f4f6",
                borderRadius: "10px",
                fontSize: "22px",
                fontWeight: "bold",
                letterSpacing: "2px",
              }}
            >
              {recoveryId}
            </div>

            {/* QR CODE */}

            <img
              src={qrCode}
              alt="Recovery X QR Code"
              style={{
                width: "280px",
                height: "280px",
                display: "block",
                margin: "20px auto",
              }}
            />

            <h3>Your Recovery X QR Code</h3>

            <p>
              Scan this QR code to view the recovery information.
            </p>

            {/* IMPORTANT: SHOW THE URL */}

            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                background: "#f5f5f5",
                borderRadius: "8px",
                wordBreak: "break-all",
                fontSize: "13px",
              }}
            >
              {recoveryUrl}
            </div>

            {/* DOWNLOAD */}

            <button
              type="button"
              onClick={downloadQR}
              className="generate-btn"
              style={{
                marginTop: "20px",
              }}
            >
              Download QR Code
            </button>

            {/* OPEN RECOVERY PAGE */}

            <a
              href={recoveryUrl}
              target="_blank"
              rel="noreferrer"
              className="location-link"
              style={{
                display: "block",
                marginTop: "20px",
              }}
            >
              Open Recovery Page →
            </a>

            {/* REGISTER ANOTHER */}

            <button
              type="button"
              onClick={registerAnotherItem}
              className="secondary-btn"
              style={{
                marginTop: "20px",
              }}
            >
              Register Another Item
            </button>

          </div>

        </main>

      </div>
    );
  }

  // ==========================================
  // REGISTRATION FORM
  // ==========================================

  return (
    <div className="app">

      <header className="navbar">

        <Link to="/" className="logo">
          <span>RX</span>
          Recovery X
        </Link>

        <nav>
          <Link to="/">Home</Link>
        </nav>

      </header>

      <main className="form-page">

        <div className="form-header">

          <span>REGISTER YOUR ITEM</span>

          <h1>
            Give your item
            <br />
            a Recovery X identity.
          </h1>

          <p>
            Register your belongings and generate
            a unique QR code to help return them
            if they are lost.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="register-form"
        >

          {/* OWNER INFORMATION */}

          <div className="form-section">

            <h2>👤 Owner Information</h2>

            <div className="form-grid">

              <div className="input-group">

                <label>Owner Name *</label>

                <input
                  type="text"
                  name="ownerName"
                  value={form.ownerName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />

              </div>

              <div className="input-group">

                <label>📱 Mobile Number *</label>

                <input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  required
                />

              </div>

              <div className="input-group full">

                <label>📧 Email *</label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />

              </div>

            </div>

          </div>

          {/* ITEM INFORMATION */}

          <div className="form-section">

            <h2>🎒 Item Information</h2>

            <div className="form-grid">

              <div className="input-group">

                <label>Item Name *</label>

                <input
                  type="text"
                  name="itemName"
                  value={form.itemName}
                  onChange={handleChange}
                  placeholder="Example: College Bag"
                  required
                />

              </div>

              <div className="input-group">

                <label>📂 Category *</label>

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

            <h2>📍 Last Known Location</h2>

            <p>
              Save the current location of your item.
            </p>

            <button
              type="button"
              onClick={getLocation}
              className="location-btn"
            >
              📍 Use My Current Location
            </button>

            {form.location && (

              <div
                style={{
                  marginTop: "15px",
                  padding: "15px",
                  background: "#f0fdf4",
                  borderRadius: "10px",
                }}
              >

                <strong>✓ Location saved</strong>

                <p>
                  Latitude: {form.latitude}
                  <br />
                  Longitude: {form.longitude}
                </p>

                <a
                  href={form.location}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Location in Google Maps →
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
              ? "Saving..."
              : "Generate Recovery X ID & QR"}
          </button>

        </form>

      </main>

    </div>
  );
}

export default Register;