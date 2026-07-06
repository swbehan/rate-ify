import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./navbar.css";
import { useNavigate } from "react-router";
import { useUser } from "../../context/UserContext.jsx";

export default function NavBar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // send the session cookie so the server knows who to log out
      });
    } catch (error) {
      console.error("Logout failed", error);
    }
    // Clear the cached user so the navbar re-renders logged-out, then route
    // home client-side — no full page reload needed.
    setUser(null);
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="nav-bar-outer-container">
      <Container>
        <Navbar.Brand className="brand-name" href="/">
          Rate-ify
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link>Welcome ({user.name})!</Nav.Link>
                <Nav.Link onClick={handleLogout} >
                  Logout
                </Nav.Link>
              </>
            ) : (
              <Nav.Link href="/login">Login</Nav.Link>
            )}
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
