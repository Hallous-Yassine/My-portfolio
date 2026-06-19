import { useState } from "react";
import { Github, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { loginWithGitHub } from "@/admin/lib/cms-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminLoginProps {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGitHub();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="text-4xl font-bold font-share-tech">Portfolio CMS</h1>
          <p className="text-muted-foreground">
            A modern editor for projects, experience, certifications, and journey content.
          </p>
        </div>

        <Card className="border-border/60 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Sign in to continue</CardTitle>
            <CardDescription>
              Authenticate with GitHub to read and publish content to your repository.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full h-11" disabled={loading} onClick={() => void handleLogin()}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Github className="h-4 w-4 mr-2" />
              )}
              {loading ? "Connecting..." : "Continue with GitHub"}
            </Button>

            {error && <p className="text-sm text-destructive text-center">{error}</p>}

            <div className="rounded-lg border border-border/50 bg-muted/20 p-4 text-sm text-muted-foreground space-y-2">
              <div className="flex items-center gap-2 text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="font-medium">What you can edit</span>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                <li>Projects with images, tech stack, and GitHub links</li>
                <li>Professional experience and highlights</li>
                <li>Certifications and credential links</li>
                <li>Journey gallery posts with photo albums</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
