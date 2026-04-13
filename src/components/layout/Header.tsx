import { Button } from "@/components/ui/button";
import { useAuthForm } from "@/hooks/auth/use-auth-form";
import { BarChart2, LayoutDashboard, List, LogOut, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  user?: { email?: string } | string;
}

export const Header = ({ user }: HeaderProps) => {
  const { handleLogOut, isLoading } = useAuthForm();

  return (
    <header className="border-b bg-card shadow-soft">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-bold text-foreground">Controle Financeiro</span>
          </Link>

          <nav className="hidden md:flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/transactions-list">
              <Button variant="ghost" size="sm" className="gap-2">
                <List className="w-4 h-4" />
                Transações
              </Button>
            </Link>
            <Link to="/contacts">
              <Button variant="ghost" size="sm" className="gap-2">
                <Users className="w-4 h-4" />
                Contatos
              </Button>
            </Link>
            <Link to="/reports">
              <Button variant="ghost" size="sm" className="gap-2">
                <BarChart2 className="w-4 h-4" />
                Relatórios
              </Button>
            </Link>
          </nav>
        </div>

        {user && (
          <Button variant="outline" size="sm" className="gap-2" onClick={handleLogOut} disabled={isLoading}>
            <LogOut className="w-4 h-4" />
            {isLoading ? "Saindo..." : "Sair"}
          </Button>
        )}
      </div>
    </header>
  );
};
