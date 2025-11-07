"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Password visibility
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login form
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Login validation
  const [loginErrors, setLoginErrors] = useState({
    email: "",
    password: "",
  });
  const [loginTouched, setLoginTouched] = useState({
    email: false,
    password: false,
  });

  // Register form
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Register validation
  const [registerErrors, setRegisterErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [registerTouched, setRegisterTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // Login field validation
  const validateLoginField = (field: string, value: string) => {
    switch (field) {
      case "email":
        if (!value.trim()) {
          return "El email es obligatorio";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Email inválido";
        }
        return "";
      case "password":
        if (!value) {
          return "La contraseña es obligatoria";
        }
        return "";
      default:
        return "";
    }
  };

  // Register field validation
  const validateRegisterField = (field: string, value: string) => {
    switch (field) {
      case "name":
        if (!value.trim()) {
          return "El nombre es obligatorio";
        }
        return "";
      case "email":
        if (!value.trim()) {
          return "El email es obligatorio";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Email inválido";
        }
        return "";
      case "password":
        if (!value) {
          return "La contraseña es obligatoria";
        }
        if (value.length < 6) {
          return "Mínimo 6 caracteres";
        }
        return "";
      case "confirmPassword":
        if (!value) {
          return "Confirma tu contraseña";
        }
        if (value !== registerData.password) {
          return "Las contraseñas no coinciden";
        }
        return "";
      default:
        return "";
    }
  };

  // Login handlers
  const handleLoginFieldChange = (field: string, value: string) => {
    setLoginData({ ...loginData, [field]: value });
    if (loginTouched[field as keyof typeof loginTouched]) {
      setLoginErrors({ ...loginErrors, [field]: validateLoginField(field, value) });
    }
  };

  const handleLoginFieldBlur = (field: string) => {
    setLoginTouched({ ...loginTouched, [field]: true });
    setLoginErrors({ ...loginErrors, [field]: validateLoginField(field, loginData[field as keyof typeof loginData]) });
  };

  // Register handlers
  const handleRegisterFieldChange = (field: string, value: string) => {
    setRegisterData({ ...registerData, [field]: value });
    if (registerTouched[field as keyof typeof registerTouched]) {
      const error = validateRegisterField(field, value);
      setRegisterErrors({ ...registerErrors, [field]: error });
      
      // Re-validate confirmPassword if password changes
      if (field === "password" && registerTouched.confirmPassword) {
        setRegisterErrors({
          ...registerErrors,
          [field]: error,
          confirmPassword: registerData.confirmPassword !== value ? "Las contraseñas no coinciden" : "",
        });
      }
    }
  };

  const handleRegisterFieldBlur = (field: string) => {
    setRegisterTouched({ ...registerTouched, [field]: true });
    setRegisterErrors({ ...registerErrors, [field]: validateRegisterField(field, registerData[field as keyof typeof registerData]) });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todos los campos
    const emailError = validateLoginField("email", loginData.email);
    const passwordError = validateLoginField("password", loginData.password);

    setLoginErrors({
      email: emailError,
      password: passwordError,
    });

    setLoginTouched({
      email: true,
      password: true,
    });

    // Si hay errores, no continuar
    if (emailError || passwordError) {
      toast.error("Por favor corrige los errores del formulario");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn({
        email: loginData.email,
        password: loginData.password,
      });

      // Better Auth devuelve { data, error }
      if (result?.error) {
        toast.error(result.error.message || "Credenciales inválidas");
      } else if (result?.data?.user) {
        toast.success("Sesión iniciada correctamente");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("Error al iniciar sesión");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error?.message || "No se pudo conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todos los campos
    const nameError = validateRegisterField("name", registerData.name);
    const emailError = validateRegisterField("email", registerData.email);
    const passwordError = validateRegisterField("password", registerData.password);
    const confirmPasswordError = validateRegisterField("confirmPassword", registerData.confirmPassword);

    setRegisterErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    setRegisterTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Si hay errores, no continuar
    if (nameError || emailError || passwordError || confirmPasswordError) {
      toast.error("Por favor corrige los errores del formulario");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp({
        email: registerData.email,
        password: registerData.password,
        name: registerData.name,
      });

      // Better Auth devuelve { data, error }
      if (result?.error) {
        toast.error(result.error.message || "No se pudo crear la cuenta");
      } else if (result?.data?.user) {
        toast.success("Cuenta creada exitosamente");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("Error al crear la cuenta");
      }
    } catch (error: any) {
      console.error("Register error:", error);
      toast.error(error?.message || "No se pudo conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Gestión de Boda
          </CardTitle>
          <CardDescription>
            Administra los invitados de tu boda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4" suppressHydrationWarning>
                <div className="space-y-2" suppressHydrationWarning>
                  <Label htmlFor="login-email" className={loginErrors.email && loginTouched.email ? "text-red-600" : ""}>
                    Email *
                  </Label>
                  <div className="relative" suppressHydrationWarning>
                    <Input
                      id="login-email"
                      type="text"
                      placeholder="tu@email.com"
                      value={loginData.email}
                      onChange={(e) => handleLoginFieldChange("email", e.target.value)}
                      onBlur={() => handleLoginFieldBlur("email")}
                      disabled={isLoading}
                      className={
                        loginTouched.email && loginErrors.email
                          ? "border-red-500 focus-visible:ring-red-500 pr-10"
                          : loginTouched.email && !loginErrors.email
                          ? "border-green-500 focus-visible:ring-green-500 pr-10"
                          : ""
                      }
                    />
                    {loginTouched.email && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {loginErrors.email ? (
                          <span className="text-red-500 text-xl">⚠️</span>
                        ) : (
                          <span className="text-green-500 text-xl">✓</span>
                        )}
                      </div>
                    )}
                  </div>
                  {loginTouched.email && loginErrors.email && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <span>⚠️</span> {loginErrors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2" suppressHydrationWarning>
                  <Label htmlFor="login-password" className={loginErrors.password && loginTouched.password ? "text-red-600" : ""}>
                    Contraseña *
                  </Label>
                  <div className="relative" suppressHydrationWarning>
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => handleLoginFieldChange("password", e.target.value)}
                      onBlur={() => handleLoginFieldBlur("password")}
                      disabled={isLoading}
                      className={
                        loginTouched.password && loginErrors.password
                          ? "border-red-500 focus-visible:ring-red-500 pr-20"
                          : loginTouched.password && !loginErrors.password
                          ? "border-green-500 focus-visible:ring-green-500 pr-20"
                          : "pr-10"
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      tabIndex={-1}
                    >
                      {showLoginPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    {loginTouched.password && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {loginErrors.password ? (
                          <span className="text-red-500 text-xl">⚠️</span>
                        ) : (
                          <span className="text-green-500 text-xl">✓</span>
                        )}
                      </div>
                    )}
                  </div>
                  {loginTouched.password && loginErrors.password && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <span>⚠️</span> {loginErrors.password}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4" suppressHydrationWarning>
                <div className="space-y-2" suppressHydrationWarning>
                  <Label htmlFor="register-name" className={registerErrors.name && registerTouched.name ? "text-red-600" : ""}>
                    Nombre completo *
                  </Label>
                  <div className="relative" suppressHydrationWarning>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Juan Pérez"
                      value={registerData.name}
                      onChange={(e) => handleRegisterFieldChange("name", e.target.value)}
                      onBlur={() => handleRegisterFieldBlur("name")}
                      disabled={isLoading}
                      className={
                        registerTouched.name && registerErrors.name
                          ? "border-red-500 focus-visible:ring-red-500 pr-10"
                          : registerTouched.name && !registerErrors.name
                          ? "border-green-500 focus-visible:ring-green-500 pr-10"
                          : ""
                      }
                    />
                    {registerTouched.name && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {registerErrors.name ? (
                          <span className="text-red-500 text-xl">⚠️</span>
                        ) : (
                          <span className="text-green-500 text-xl">✓</span>
                        )}
                      </div>
                    )}
                  </div>
                  {registerTouched.name && registerErrors.name && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <span>⚠️</span> {registerErrors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2" suppressHydrationWarning>
                  <Label htmlFor="register-email" className={registerErrors.email && registerTouched.email ? "text-red-600" : ""}>
                    Email *
                  </Label>
                  <div className="relative" suppressHydrationWarning>
                    <Input
                      id="register-email"
                      type="text"
                      placeholder="tu@email.com"
                      value={registerData.email}
                      onChange={(e) => handleRegisterFieldChange("email", e.target.value)}
                      onBlur={() => handleRegisterFieldBlur("email")}
                      disabled={isLoading}
                      className={
                        registerTouched.email && registerErrors.email
                          ? "border-red-500 focus-visible:ring-red-500 pr-10"
                          : registerTouched.email && !registerErrors.email
                          ? "border-green-500 focus-visible:ring-green-500 pr-10"
                          : ""
                      }
                    />
                    {registerTouched.email && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {registerErrors.email ? (
                          <span className="text-red-500 text-xl">⚠️</span>
                        ) : (
                          <span className="text-green-500 text-xl">✓</span>
                        )}
                      </div>
                    )}
                  </div>
                  {registerTouched.email && registerErrors.email && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <span>⚠️</span> {registerErrors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2" suppressHydrationWarning>
                  <Label htmlFor="register-password" className={registerErrors.password && registerTouched.password ? "text-red-600" : ""}>
                    Contraseña *
                  </Label>
                  <div className="relative" suppressHydrationWarning>
                    <Input
                      id="register-password"
                      type={showRegisterPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) => handleRegisterFieldChange("password", e.target.value)}
                      onBlur={() => handleRegisterFieldBlur("password")}
                      disabled={isLoading}
                      className={
                        registerTouched.password && registerErrors.password
                          ? "border-red-500 focus-visible:ring-red-500 pr-20"
                          : registerTouched.password && !registerErrors.password
                          ? "border-green-500 focus-visible:ring-green-500 pr-20"
                          : "pr-10"
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      tabIndex={-1}
                    >
                      {showRegisterPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    {registerTouched.password && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {registerErrors.password ? (
                          <span className="text-red-500 text-xl">⚠️</span>
                        ) : (
                          <span className="text-green-500 text-xl">✓</span>
                        )}
                      </div>
                    )}
                  </div>
                  {registerTouched.password && registerErrors.password ? (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <span>⚠️</span> {registerErrors.password}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      Mínimo 6 caracteres
                    </p>
                  )}
                </div>
                <div className="space-y-2" suppressHydrationWarning>
                  <Label htmlFor="register-confirm-password" className={registerErrors.confirmPassword && registerTouched.confirmPassword ? "text-red-600" : ""}>
                    Confirmar Contraseña *
                  </Label>
                  <div className="relative">
                    <Input
                      id="register-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={registerData.confirmPassword}
                      onChange={(e) => handleRegisterFieldChange("confirmPassword", e.target.value)}
                      onBlur={() => handleRegisterFieldBlur("confirmPassword")}
                      disabled={isLoading}
                      className={
                        registerTouched.confirmPassword && registerErrors.confirmPassword
                          ? "border-red-500 focus-visible:ring-red-500 pr-20"
                          : registerTouched.confirmPassword && !registerErrors.confirmPassword
                          ? "border-green-500 focus-visible:ring-green-500 pr-20"
                          : "pr-10"
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    {registerTouched.confirmPassword && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {registerErrors.confirmPassword ? (
                          <span className="text-red-500 text-xl">⚠️</span>
                        ) : (
                          <span className="text-green-500 text-xl">✓</span>
                        )}
                      </div>
                    )}
                  </div>
                  {registerTouched.confirmPassword && registerErrors.confirmPassword && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <span>⚠️</span> {registerErrors.confirmPassword}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    "Crear Cuenta"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
