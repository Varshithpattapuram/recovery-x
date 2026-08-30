import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Recover() {

  const { id } = useParams();

  const [item, setItem] = useState(null);

  useEffect(() => {

    const items =
      JSON.parse(localStorage.getItem("recoveryXItems")) || [];

    const found =
      items.find(item => item.id === id);

    setItem(found);

  }, [id]);

  if (!item) {

    return (

      <div className="recovery-page">

        <div className="recovery-card">

          <div className="error-icon">
            ?
          </div>

          <h1>Item Not Found</h1>

          <p>
            This Recovery X ID does not exist
            in this browser.
          </p>

          <Link to="/" className="primary-btn">
            Go Home
          </Link>

        </div>

      </div>
    );
  }

  return (

    <div className="recovery-page">

      <div className="recovery-card">

        <div className="recovery-logo">
          RX
        </div>

        <div className="found-badge">
          ✓ ITEM FOUND
        </div>

        <h1>
          Help return this item
        </h1>

        <p className="recovery-subtitle">
          This item is registered with Recovery X.
        </p>

        <div className="recovery-item">

          <span>ITEM</span>

          <h2>
            {item.itemName}
          </h2>

          <p>
            {item.category}
          </p>

        </div>

        <div className="recovery-details">

          <div>
            <span>Recovery ID</span>
            <strong>{item.id}</strong>
          </div>

          <div>
            <span>Owner</span>
            <strong>{item.ownerName}</strong>
          </div>

        </div>

        <div className="contact-buttons">

          <a
            href={`tel:${item.mobile}`}
            className="contact-btn"
          >
            📞 Call Owner
          </a>

          <a
            href={`mailto:${item.email}`}
            className="contact-btn"
          >
            ✉ Email Owner
          </a>

        </div>

        {item.location && (

          <a
            href={item.location}
            target="_blank"
            rel="noreferrer"
            className="maps-btn"
          >
            📍 Open Google Maps
          </a>

        )}

        <p className="return-message">
          Thank you for helping return this item
          to its owner.
        </p>

      </div>

    </div>
  );
}

export default Recover;