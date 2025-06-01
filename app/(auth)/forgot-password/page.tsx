"use client";

import ForgotPasswordForm from "./forgot-password-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted">
      <div className="container flex flex-1 items-center justify-center py-12">
        <Card className="w-full max-w-md border-2 border-primary/20 rounded-xl shadow-xl bg-white/80 backdrop-blur-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Restaurar senha
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
              Informe o seu email para receber o link de redefinição
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ForgotPasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
