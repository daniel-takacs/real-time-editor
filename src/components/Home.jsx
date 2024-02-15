import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useHistory for redirection
import "./Login.css"; // Add this line to import the CSS styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate(); // For redirecting after login

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backendUrl}/auth/login`, {
        // Adjust the URL as needed
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        console.log("Login Success:");
        // Assuming 'data' contains a token, save it for future requests
        localStorage.setItem("token", data.token);

        // Redirect to another page upon successful login, e.g., a user dashboard
        navigate("/editor"); // Change '/dashboard' to your desired route
      } else {
        // Handle unsuccessful login attempts
        console.error("Login Failed:", data.message);
        // Optionally, implement logic to display an error message to the user
      }
    } catch (error) {
      console.error("Login request error:", error);
      // Handle network errors or unexpected issues
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="input-wrapper">
          <input
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Password"
            value={password}
            className="password-input"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div
            onClick={togglePasswordVisibility}
            className="toggle-password"
          >
            <FontAwesomeIcon icon={isPasswordVisible ? faEyeSlash : faEye} />
          </div>
        </div>
        <button type="submit">Login</button>
        {/* Register Link */}
        <Link to="/register">
          <button type="button">Register</button>
        </Link>
      </form>
    </div>
  );
}

export default Home;
