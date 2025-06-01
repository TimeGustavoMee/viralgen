"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Login, loginWithToken } from "../actions";
import { useEffect } from "react";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Login via token
  const tokenMutation = useMutation({
    mutationFn: async (code: string) => loginWithToken(code),
    onSuccess: (data) => {
      if (!data.error) {
        location.reload();
      }
    },
  });

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      tokenMutation.mutate(code);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // Login com e-mail e senha
  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);
      return Login(formData);
    },
    onSuccess: (data) => {
      router.push("/dashboard");
    },
  });

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate(values);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted">
      <div className="container flex flex-1 items-center justify-center py-12">
        <Card className="w-full max-w-md border-2 border-primary/20 rounded-xl shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader className="space-y-1 text-center">
              <Link href="/" className="inline-block mb-4">
                <span className="text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ViralGen
                </span>
              </Link>
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription>
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email", { required: "Email is required" })}
                  className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:text-primary/90"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Logging in..." : "Log In"}
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary hover:text-primary/90 font-medium"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
