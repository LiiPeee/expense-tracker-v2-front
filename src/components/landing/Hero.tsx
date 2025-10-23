import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-hero text-white px-4 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Controle Suas Finanças
            <br />
            <span className="text-blue-100">Com Inteligência</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-50 mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            Organize seu dinheiro, acompanhe gastos e alcance seus objetivos financeiros de forma simples e eficiente.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/auth")}
            className="gap-2 shadow-strong animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 hover:scale-105 transition-transform"
          >
            Começar Agora
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Por Que Escolher Nossa Plataforma?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-card rounded-2xl p-8 shadow-medium hover:shadow-strong transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-card-foreground">Controle Total</h3>
              <p className="text-muted-foreground">
                Visualize todas as suas receitas e despesas em um só lugar. Tome decisões informadas sobre seu dinheiro.
              </p>
            </div>

            <div className="bg-gradient-card rounded-2xl p-8 shadow-medium hover:shadow-strong transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-card-foreground">Segurança</h3>
              <p className="text-muted-foreground">
                Seus dados financeiros estão protegidos com criptografia de ponta e autenticação segura via Google.
              </p>
            </div>

            <div className="bg-gradient-card rounded-2xl p-8 shadow-medium hover:shadow-strong transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-card-foreground">Rápido e Fácil</h3>
              <p className="text-muted-foreground">
                Interface intuitiva e moderna. Adicione transações em segundos e acompanhe seu progresso em tempo real.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
