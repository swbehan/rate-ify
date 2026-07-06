import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useUser } from "../context/UserContext.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the browser's default full-page form POST
    setError("");

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData); // { email, password }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // let the browser store the session cookie
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Invalid credentials");
        return;
      }

      // Logged in — update the shared user state and route home client-side.
      const data = await res.json();
      setUser(data.user);
      navigate("/");
    } catch (err) {
      console.error("Login request failed", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <h1>Login to rate anything you desire</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" name="email" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
          />
        </Form.Group>

        {error && <div className="text-danger mb-3">{error}</div>}

        <div>
          <Button className="me-2" variant="primary" type="submit">
            Login
          </Button>
          <Button href="/register" variant="secondary">
            Register
          </Button>
        </div>
      </Form>
    </>
  );
}
