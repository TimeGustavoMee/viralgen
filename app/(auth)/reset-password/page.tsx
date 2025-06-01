"use client";

import ResetPasswordForm from "./reset-password-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted">
      <div className="container flex flex-1 items-center justify-center py-12">
        <Card className="w-full max-w-md border-2 border-primary/20 rounded-xl shadow-xl bg-white">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              Redefinir senha
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Insira sua nova senha e confirme para redefinir
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ResetPasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
