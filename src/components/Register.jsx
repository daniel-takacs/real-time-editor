import { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // Assuming the server sends back a success message
        setSuccessMessage(
          data.message || "Registration successful! Please login."
        );
        setErrorMessage("");
        navigate("/");
      } else {
        const errorData = await response.json();
        setErrorMessage(
          errorData.message || "An error occurred. Please try again."
        );
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage("Failed to connect to the server. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="register-container">
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
