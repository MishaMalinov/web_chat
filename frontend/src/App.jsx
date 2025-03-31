import "./assets/app.css";
import { AuthProvider } from "./context/AuthContext";

import usePreventSwipe from "./utils/preventSwipe";
import AppRoutes from "./components/AppRoutes";

const App = () => {
  usePreventSwipe(); 
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
