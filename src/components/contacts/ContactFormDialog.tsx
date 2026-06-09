import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { ContactForm, ContactTypeValue } from "@/helper/contact";
import { Plus } from "lucide-react";

interface ContactFormDialogProps {
  editingContact: boolean;
  formData: ContactForm;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleDialogClose: () => void;
  handleZipCodeBlur: () => void;
  setFormData: (data: ContactForm) => void;
}

export function ContactFormDialog({
  editingContact,
  formData,
  isDialogOpen,
  setIsDialogOpen,
  handleSubmit,
  handleDialogClose,
  handleZipCodeBlur,
  setFormData,
}: ContactFormDialogProps) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-xl" onClick={handleDialogClose}>
          <Plus className="w-4 h-4" />
          Novo Contato
        </Button>
      </DialogTrigger>
      <DialogContent className="border-white/60 bg-white/90 backdrop-blur-md sm:max-w-[560px] flex flex-col max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{editingContact ? "Editar Contato" : "Novo Contato"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="space-y-4 overflow-y-auto flex-1 pr-1">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: João Silva"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Ex: joao@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Ex: (11) 99999-9999"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="document">Documento</Label>
              <Input
                id="document"
                value={formData.document}
                onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                placeholder="Ex: 111.555.333-14"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="typeContact">Tipo de Contato</Label>
              <Select
                value={formData.typeContact}
                onValueChange={(value) => setFormData({ ...formData, typeContact: value as ContactTypeValue })}
              >
                <SelectTrigger id="typeContact">
                  <SelectValue placeholder="Selecione tipo de contato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Pessoal</SelectItem>
                  <SelectItem value="2">Empresa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Rua</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                placeholder="Ex: Avenida Paulista"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Ex: Sao Paulo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Ex: SP"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                onBlur={handleZipCodeBlur}
                placeholder="Ex: 01311-000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Ex: Brasil"
                required
              />
            </div>
            <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <Label htmlFor="isPrimary">Contato principal</Label>
              <Switch
                id="isPrimary"
                checked={formData.isPrimary}
                onCheckedChange={(value) => setFormData({ ...formData, isPrimary: value })}
              />
            </div>
          </div>
          <Button type="submit" className="w-full rounded-xl mt-4">
            {editingContact ? "Atualizar" : "Criar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
