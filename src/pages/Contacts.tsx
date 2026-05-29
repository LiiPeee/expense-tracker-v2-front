import { Header } from "@/components/layout/Header";
import { TableLoadingState } from "@/components/ui/async-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshAllButton } from "@/components/ui/RefreshAll";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ContactTypeValue } from "@/helper/contact";
import { maskPhone } from "@/helper/utils";
import { useContact } from "@/hooks/contact/use-contact";
import { Inbox, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

const Contacts = () => {
  const {
    editingContact,
    formData,
    isDialogOpen,
    isRefreshing,
    contacts,
    setIsDialogOpen,
    getAllContact,
    handleEdit,
    handleSubmit,
    handleZipCodeBlur,
    handleDialogClose,
    setFormData,
    handleDelete,
  } = useContact();

  const didFetchRef = useRef(false);

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
    void getAllContact();
  }, [getAllContact]);

  return (
    <div className="page-shell">
      <Header user={null} />

      <main className="container mx-auto px-4 py-8 lg:py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="rounded-3xl border border-white/50 bg-white/70 backdrop-blur-md px-6 py-6 shadow-medium flex-1 mr-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Contatos</h2>
            <p className="text-muted-foreground">Gerencie seus contatos</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 rounded-xl" onClick={() => handleDialogClose()}>
                <Plus className="w-4 h-4" />
                Novo Contato
              </Button>
            </DialogTrigger>
            <DialogContent className="border-white/60 bg-white/90 backdrop-blur-md sm:max-w-[560px] flex flex-col max-h-[90vh]">
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
                    <Label htmlFor="country">Pais</Label>
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
        </div>

        <RefreshAllButton isRefreshing={isRefreshing} onRefresh={getAllContact} />
        <Card className="rounded-2xl reveal-up stagger-2">
          <CardHeader>
            <CardTitle>Lista de Contatos</CardTitle>
          </CardHeader>
          <CardContent>
            {isRefreshing && contacts.length === 0 ? (
              <TableLoadingState columns={4} rows={6} />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <div className="empty-state">
                          <Inbox className="w-6 h-6 text-muted-foreground" />
                          <p className="text-sm font-medium text-foreground">Nenhum contato cadastrado</p>
                          <p className="text-xs text-muted-foreground">Use o botao Novo Contato para criar o primeiro registro.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    contacts.map((contact) => (
                      <TableRow key={contact.id ?? contact.email ?? contact.name} className="table-row-lift">
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{maskPhone(contact.phone)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full hover:scale-105 transition-transform"
                              onClick={() => handleEdit(contact)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full hover:scale-105 transition-transform"
                              onClick={() => contact.id && handleDelete(contact.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Contacts;
