import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AdminShell } from "@/admin/components/AdminLayout";
import AdminLogin from "@/admin/pages/AdminLogin";
import AdminOAuthCallback from "@/admin/pages/AdminOAuthCallback";
import SiteContentPage from "@/admin/pages/SiteContentPage";
import CollectionPage, { AdminOverview } from "@/admin/pages/CollectionPage";
import { clearStoredToken, getStoredToken } from "@/admin/lib/cms-auth";
import { fetchCurrentUser } from "@/admin/lib/cms-api";
import type { GitHubUser } from "@/admin/lib/types";

export default function AdminApp() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const verifySession = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setCheckingAuth(false);
      return;
    }

    try {
      const profile = await fetchCurrentUser();
      setUser(profile);
    } catch {
      clearStoredToken();
      setUser(null);
    } finally {
      setCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    void verifySession();
  }, [verifySession]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="oauth-callback" element={<AdminOAuthCallback />} />
        <Route path="login" element={user ? <Navigate to="/admin" replace /> : <AdminLogin />} />

        {user ? (
          <Route element={<AdminShell user={user} onLogout={() => setUser(null)} />}>
            <Route index element={<AdminOverview />} />
            <Route path="site" element={<SiteContentPage />} />
            <Route path="projects" element={<CollectionPage collectionKey="projects" />} />
            <Route path="experiences" element={<CollectionPage collectionKey="experiences" />} />
            <Route path="certifications" element={<CollectionPage collectionKey="certifications" />} />
            <Route path="gallery" element={<CollectionPage collectionKey="gallery" />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        )}
      </Routes>
    </>
  );
}
