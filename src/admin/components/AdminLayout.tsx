import { ReactNode } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Award,
  Briefcase,
  Camera,
  ExternalLink,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Sparkles,
} from "lucide-react";
import { clearStoredToken } from "@/admin/lib/cms-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAssetPath } from "@/lib/paths";
import type { GitHubUser } from "@/admin/lib/types";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/experiences", label: "Experience", icon: Briefcase },
  { to: "/admin/certifications", label: "Certifications", icon: Award },
  { to: "/admin/gallery", label: "Journey", icon: Camera },
];

interface AdminLayoutProps {
  user: GitHubUser;
  onLogout: () => void;
}

export function AdminShell({ user, onLogout }: AdminLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearStoredToken();
    onLogout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/60 bg-card/40 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <Link to="/admin" className="font-share-tech text-lg font-semibold hover:text-primary transition-colors">
                Portfolio CMS
              </Link>
              <p className="text-xs text-muted-foreground hidden sm:block">Content manager</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <a href={getAssetPath("/")} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Live site
              </a>
            </Button>
            <div className="hidden sm:flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar_url} alt={user.login} />
                <AvatarFallback>{user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{user.login}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="rounded-xl border border-border/60 bg-card/60 backdrop-blur p-3 h-fit lg:sticky lg:top-24">
            <nav className="space-y-1">
              {NAV.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      isActive
                        ? "bg-primary/15 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
            <Separator className="my-4" />
            <p className="px-3 text-xs text-muted-foreground leading-relaxed">
              Hero, About, Contact, and SEO are still edited in source code.
            </p>
          </aside>

          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

interface PageLayoutProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function AdminLayout({ title, description, actions, children }: PageLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-share-tech">{title}</h1>
          {description && <p className="text-muted-foreground mt-2 max-w-2xl">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
