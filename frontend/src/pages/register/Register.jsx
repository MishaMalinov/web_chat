import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import './register.css'; // Custom styles

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleRegister = async () => {
    // Validation checks
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", {
        username: username,
        email: email,
        password: password,
        password_confirmation: password,
      });

      // Save token in local storage
      // Redirect to chat page
      navigate("/login");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Registration failed.");
      } else {
        setError("Network error. Please try again.");
      }
    }

  };

  return (
    <div className="register-container d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="register-box p-4 shadow rounded">
        <h2 className="text-center text-primary mb-4">Register</h2>
        {error && <div className="alert alert-danger p-2">{error}</div>}
        <div className="form-group mb-3">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>
        <div className="form-group mb-3">
          <input 
            type="email" 
            className="form-control" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div className="form-group mb-3">
          <input 
            type="password" 
            className="form-control" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <button className="btn btn-primary w-100 mb-3" onClick={handleRegister}>Register</button>
        <div className="text-center">
          <small className="text-muted">
            Already have an account? <Link to="/login" className="text-primary">Login</Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Register;
