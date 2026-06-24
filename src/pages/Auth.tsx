import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { FormTextField } from "@/components/ui/form-text-field";
import { LoadingButton } from "@/components/ui/loading-button";
import { PasswordField } from "@/components/ui/password-field";
import { PasswordStrengthIndicator } from "@/components/ui/password-strength";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loginSchema, type SignInRequest, type SignUpRequest, signUpSchema } from "@/helper/auth";
import { useAuthForm } from "@/hooks/auth/use-auth-form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from "@react-oauth/google";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// O GoogleLogin só funciona dentro do GoogleOAuthProvider (montado em main.tsx
// quando VITE_CLIENT_ID existe). Sem o clientId, o botão não é renderizado.
const hasGoogleClientId = Boolean(import.meta.env.VITE_CLIENT_ID);

function GoogleAuthButton({ onCredential }: { onCredential: (idToken: string) => void }) {
  const { t, i18n } = useTranslation("auth");
  const { toast } = useToast();

  if (!hasGoogleClientId) return null;

  return (
    <>
      <div className="flex items-center gap-3 py-1">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">{t("or")}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={(credential) => {
            if (credential.credential) onCredential(credential.credential);
          }}
          onError={() => toast({ title: t("toast.googleErrorTitle"), description: t("toast.googleButtonErrorDescription"), variant: "destructive" })}
          theme="outline"
          size="large"
          text="continue_with"
          shape="rectangular"
          locale={i18n.resolvedLanguage}
        />
      </div>
    </>
  );
}

export default function Auth() {
  const { t } = useTranslation("auth");
  const { handleSignIn, handleGoogleSignIn, handleSignUp } = useAuthForm();

  const loginForm = useForm<SignInRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const signupForm = useForm<SignUpRequest>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
  });

  const signupPassword = signupForm.watch("password");

  return (
    <div className="page-shell relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-secondary/25 blur-3xl" />

      <Card className="w-full max-w-md border-glass bg-card/80 shadow-strong">
        <CardHeader className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-hero flex items-center justify-center mb-3 shadow-medium">
            <span className="text-white font-bold text-2xl">F</span>
          </div>
          <CardTitle className="text-3xl">{t("welcome")}</CardTitle>
          <CardDescription className="text-sm">{t("welcomeSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted/70 p-1">
              <TabsTrigger value="login">{t("tabLogin")}</TabsTrigger>
              <TabsTrigger value="signup">{t("tabSignup")}</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-4">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleSignIn)} className="space-y-4">
                  <FormTextField control={loginForm.control} name="email" label={t("email")} type="email" placeholder={t("emailPlaceholder")} />

                  <PasswordField control={loginForm.control} name="password" label={t("password")} placeholder={t("passwordPlaceholder")} />

                  <LoadingButton type="submit" className="w-full rounded-xl" isLoading={loginForm.formState.isSubmitting} loadingText={t("signingIn")}>
                    {t("signIn")}
                  </LoadingButton>
                  <div className="text-center">
                    <Link to="/forgot-password" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {t("forgotPassword")}
                    </Link>
                  </div>
                </form>
              </Form>
              <GoogleAuthButton onCredential={handleGoogleSignIn} />
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-4">
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(handleSignUp)} className="space-y-4">
                  <FormTextField control={signupForm.control} name="firstName" label={t("firstName")} placeholder={t("firstNamePlaceholder")} />
                  <FormTextField control={signupForm.control} name="lastName" label={t("lastName")} placeholder={t("lastNamePlaceholder")} />
                  <FormTextField control={signupForm.control} name="email" label={t("email")} type="email" placeholder={t("emailPlaceholder")} />

                  <PasswordField control={signupForm.control} name="password" label={t("password")} placeholder={t("signupPasswordPlaceholder")}>
                    <PasswordStrengthIndicator password={signupPassword} />
                  </PasswordField>

                  <LoadingButton type="submit" className="w-full rounded-xl" isLoading={signupForm.formState.isSubmitting} loadingText={t("signingUp")}>
                    {t("signUp")}
                  </LoadingButton>
                </form>
              </Form>
              <GoogleAuthButton onCredential={handleGoogleSignIn} />
            </TabsContent>
          </Tabs>

          <div className="text-center text-sm text-muted-foreground">{t("terms")}</div>
        </CardContent>
      </Card>
    </div>
  );
}
