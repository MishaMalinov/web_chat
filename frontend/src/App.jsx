import "./assets/app.css";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";

import usePreventSwipe from "./utils/preventSwipe";
import AppRoutes from "./components/AppRoutes";

const App = () => {
  usePreventSwipe();
  return (
    <AuthProvider>
      <ChatProvider>
        <AppRoutes />
      </ChatProvider>
    </AuthProvider>
  );
};

export default App;
