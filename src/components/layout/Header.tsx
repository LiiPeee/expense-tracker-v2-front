import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthForm } from "@/hooks/auth/use-auth-form";
import { BarChart2, LayoutDashboard, List, LogOut, Menu, PiggyBank, Users } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  user?: { email?: string } | string | null;
}

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/transactions-list", icon: List, label: "Transações" },
  { to: "/contacts", icon: Users, label: "Contatos" },
  { to: "/budgets", icon: PiggyBank, label: "Orçamentos" },
  { to: "/reports", icon: BarChart2, label: "Relatórios" },
];

export const Header = ({ user: _user }: HeaderProps) => {
  const { handleLogOut, isLoading } = useAuthForm();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return isActive
      ? "gap-2 rounded-xl bg-primary/10 text-primary font-semibold hover:bg-primary/15 border border-primary/20"
      : "gap-2 rounded-xl text-foreground/70 hover:text-foreground hover:bg-background/60";
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

          <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl border border-white/60 bg-white/60 backdrop-blur-md">
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to}>
                <Button variant="ghost" size="sm" className={navLinkClass(to)}>
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl border-white/70 bg-white/70 hover:bg-white hidden sm:flex"
            onClick={handleLogOut}
            disabled={isLoading}
          >
            <LogOut className="w-4 h-4" />
            {isLoading ? "Saindo..." : "Sair"}
          </Button>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-xl">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-white/95 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-8 mt-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-soft">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
                <div>
                  <span className="text-base font-bold text-foreground leading-none">Controle Financeiro</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Painel de gestão pessoal</p>
                </div>
              </div>

              <nav className="flex flex-col gap-1">
                {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                  <Link key={to} to={to} onClick={() => setMobileOpen(false)}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-base ${navLinkClass(to)}`}
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </Button>
                  </Link>
                ))}
              </nav>

              <div className="absolute bottom-6 left-4 right-4">
                <Button
                  variant="outline"
                  className="w-full gap-2 rounded-xl"
                  onClick={() => { setMobileOpen(false); handleLogOut(); }}
                  disabled={isLoading}
                >
                  <LogOut className="w-4 h-4" />
                  {isLoading ? "Saindo..." : "Sair"}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
