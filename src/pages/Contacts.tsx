import { ContactFormDialog } from "@/components/contacts/ContactFormDialog";
import { Header } from "@/components/layout/Header";
import { TableLoadingState } from "@/components/ui/async-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshAllButton } from "@/components/ui/RefreshAll";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { maskPhone } from "@/helper/utils";
import { useContact } from "@/hooks/contact/use-contact";
import { Inbox, Pencil, Trash2 } from "lucide-react";

const Contacts = () => {
  const {
    editingContact,
    formData,
    isDialogOpen,
    isSubmitting,
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

  return (
    <div className="page-shell">
      <Header user={null} />

      <main className="container mx-auto px-4 py-8 lg:py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="rounded-3xl border border-glass bg-card/70 backdrop-blur-md px-6 py-6 shadow-medium flex-1 mr-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Contatos</h2>
            <p className="text-muted-foreground">Gerencie seus contatos</p>
          </div>

          <ContactFormDialog
            editingContact={editingContact}
            formData={formData}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            handleSubmit={handleSubmit}
            handleDialogClose={handleDialogClose}
            handleZipCodeBlur={handleZipCodeBlur}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
          />
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
