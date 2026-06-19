import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { consumeOAuthCallbackHash, setStoredToken } from "@/admin/lib/cms-auth";

export default function AdminOAuthCallback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Completing sign in…");

  useEffect(() => {
    const { token, error } = consumeOAuthCallbackHash();

    if (error) {
      setMessage(error);
      window.setTimeout(() => navigate("/admin/login", { replace: true }), 2500);
      return;
    }

    if (token) {
      setStoredToken(token);
      navigate("/admin", { replace: true });
      return;
    }

    setMessage("No sign-in token received. Redirecting…");
    window.setTimeout(() => navigate("/admin/login", { replace: true }), 1500);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
