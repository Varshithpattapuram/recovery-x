import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="app">

      <header className="navbar">
        <Link to="/" className="logo">
          <span>RX</span>
          Recovery X
        </Link>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/dashboard">My Items</Link>
          <Link to="/register" className="nav-register">
            Register
          </Link>
        </nav>
      </header>

      <main className="home-page">

        <section className="hero">

          <div className="hero-content">

            <div className="badge">
              SMART LOST-ITEM RECOVERY
            </div>

            <h1>
              Give your belongings
              <br />
              <span>a way back.</span>
            </h1>

            <p>
              Recovery X connects lost belongings with their owners
              using a unique identity and QR code.
            </p>

            <div className="hero-buttons">
              <Link to="/register" className="primary-btn">
                Register an item
              </Link>

              <Link to="/dashboard" className="secondary-btn">
                My Items
              </Link>
            </div>

          </div>

          <div className="hero-visual">

            <div className="qr-box">
              <div className="fake-qr">
                <span>RX</span>
              </div>

              <strong>Scan to Recover</strong>
              <small>
                Every item has a unique Recovery X identity.
              </small>
            </div>

          </div>

        </section>

        <section className="how-section">

          <div className="section-heading">
            <span>HOW IT WORKS</span>
            <h2>Lost item. Simple recovery.</h2>
          </div>

          <div className="steps">

            <div className="step">
              <b>01</b>
              <h3>Register</h3>
              <p>
                Add your item and recovery information.
              </p>
            </div>

            <div className="step">
              <b>02</b>
              <h3>Attach QR</h3>
              <p>
                Generate and attach your unique QR code.
              </p>
            </div>

            <div className="step">
              <b>03</b>
              <h3>Recover</h3>
              <p>
                A finder scans the QR and contacts you.
              </p>
            </div>

          </div>

        </section>

      </main>

      <footer>
        <span>© 2026 Recovery X</span>
        <span>Find • Connect • Recover</span>
      </footer>

    </div>
  );
}

export default Home;