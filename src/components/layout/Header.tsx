import { Button } from "@/components/ui/button";
import { LogOut, User, LayoutDashboard, Tags, Users, MapPin, List } from "lucide-react";
import { signOut } from "@/lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

interface HeaderProps {
  user?: any;
}

export const Header = ({ user }: HeaderProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Erro ao sair");
      return;
    }
    toast.success("Você saiu com sucesso");
    navigate("/");
  };

  return (
    <header className="border-b bg-card shadow-soft">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-bold text-foreground">FinControl</span>
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
            <Link to="/categories">
              <Button variant="ghost" size="sm" className="gap-2">
                <Tags className="w-4 h-4" />
                Categorias
              </Button>
            </Link>
            <Link to="/contacts">
              <Button variant="ghost" size="sm" className="gap-2">
                <Users className="w-4 h-4" />
                Contatos
              </Button>
            </Link>
            <Link to="/addresses">
              <Button variant="ghost" size="sm" className="gap-2">
                <MapPin className="w-4 h-4" />
                Endereços
              </Button>
            </Link>
          </nav>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
