import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css'; // Custom styles
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username,setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };
  const handleLogin = async () => {
    // Simple validation
    if (!username || !password) {
      setError("Both fields are required.");
      return;
    }
    // if (!isValidEmail(email)) {
    //   setError("Please enter a valid email address.");
    //   return;
    // }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        username: username,
        password: password
      });

      // Save token in local storage
      localStorage.setItem("token", response.data.token);
      // Redirect to chat page
      navigate("/chat");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Network error. Please try again.");
      }
    } 
  };

  return (
    <div className="login-container d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="login-box p-4 shadow rounded">
        <h2 className="text-center text-primary mb-4">Login</h2>
        {error && <div className="alert alert-danger p-2">{error}</div>}
        <div className="form-group mb-3">
          {/* <input 
            type="text" 
            className="form-control" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          /> */}
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
