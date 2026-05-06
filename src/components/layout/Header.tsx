import { Button } from "@/components/ui/button";
import { useAuthForm } from "@/hooks/auth/use-auth-form";
import { BarChart2, LayoutDashboard, List, LogOut, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  user?: { email?: string } | string;
}

export const Header = ({ user }: HeaderProps) => {
  const { handleLogOut, isLoading } = useAuthForm();
  const location = useLocation();

  const navLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return isActive
      ? "gap-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
      : "gap-2 rounded-full text-foreground/80 hover:text-foreground hover:bg-background/70";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/70 backdrop-blur-xl shadow-soft">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-soft">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-foreground leading-none">Controle Financeiro</span>
              <p className="text-xs text-muted-foreground mt-1">Painel de gestão pessoal</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-2 p-1 rounded-full border border-white/60 bg-white/60 backdrop-blur-md">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className={navLinkClass("/dashboard")}>
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/transactions-list">
              <Button variant="ghost" size="sm" className={navLinkClass("/transactions-list")}>
                <List className="w-4 h-4" />
                Transações
              </Button>
            </Link>
            <Link to="/contacts">
              <Button variant="ghost" size="sm" className={navLinkClass("/contacts")}>
                <Users className="w-4 h-4" />
                Contatos
              </Button>
            </Link>
            <Link to="/reports">
              <Button variant="ghost" size="sm" className={navLinkClass("/reports")}>
                <BarChart2 className="w-4 h-4" />
                Relatórios
              </Button>
            </Link>
          </nav>
        </div>

        {user && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-full border-white/70 bg-white/70 hover:bg-white"
            onClick={handleLogOut}
            disabled={isLoading}
          >
            <LogOut className="w-4 h-4" />
            {isLoading ? "Saindo..." : "Sair"}
          </Button>
        )}
      </div>
    </header>
  );
};
