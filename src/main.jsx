import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import AuthScreen from "./auth/AuthScreen";
import App from "./App";
import "./index.css";

function Root() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <div className="auth-loading">LUNAR COMMAND · CONNECTING TO MISSION CONTROL…</div>;
  }

  if (!user) return <AuthScreen />;

  return (
    <>
      <div className="account-bar">
        <span><i /> AUTHENTICATED · {user.email}</span>
        <button onClick={signOut}>LOG OUT</button>
      </div>
      <App user={user} />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Root />
    </AuthProvider>
  </StrictMode>
);
