import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Pull the field values straight off the form via their `name` attributes.
    const formData = new FormData(e.target);
    // { name, email, password }
    const payload = Object.fromEntries(formData); 

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Surface the server's message (e.g. "User already exists").
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Registration failed");
        return;
      }

      // Registration succeeded — send them to the login page to sign in.
      navigate("/login");
    } catch (err) {
      console.error("Registration request failed", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <h1>Register</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="input" placeholder="Enter your name" name="name" />
        </Form.Group>

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
            Register
          </Button>
        </div>

        <div>
          Do you have an account? <a href="/login">Login Here</a>
        </div>
      </Form>
    </>
  );
}
