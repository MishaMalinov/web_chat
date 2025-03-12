import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css'; // Custom styles

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };
  const handleLogin = () => {
    // Simple validation
    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Simulating authentication
    localStorage.setItem("token", "dummy_token");
    navigate("/chat");
  };

  return (
    <div className="login-container d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="login-box p-4 shadow rounded">
        <h2 className="text-center text-primary mb-4">Login</h2>
        {error && <div className="alert alert-danger p-2">{error}</div>}
        <div className="form-group mb-3">
          <input 
            type="text" 
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
        <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>Login</button>
        <div className="text-center">
          <small className="text-muted">
            Don't have an account? <Link to="/register" className="text-primary">Register</Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
