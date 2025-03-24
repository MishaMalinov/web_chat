import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './home.css'; // Custom styles

const Home = () => {
  return (
    <div className="home-container d-flex flex-column align-items-center justify-content-center vh-100">
      <h1 className="text-primary mb-4">Welcome to Web Chat</h1>
      <div className="d-flex gap-3">
        <Link className="btn btn-primary px-4" to="/login">Login</Link>
        <Link className="btn btn-outline-primary px-4" to="/register">Register</Link>
      </div>
    </div>
  );
};

export default Home;
