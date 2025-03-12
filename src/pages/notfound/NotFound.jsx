import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './notfound.css'; // Custom styles

const NotFound = () => {
  return (
    <div className="notfound-container d-flex flex-column align-items-center justify-content-center vh-100">
      <h1 className="text-danger display-1">404</h1>
      <h2 className="text-secondary mb-3">Page Not Found</h2>
      <p className="text-muted">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary mt-3">Go Home</Link>
    </div>
  );
};

export default NotFound;
