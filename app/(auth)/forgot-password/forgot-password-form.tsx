"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { forgotPassword } from "../actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

type ForgotPasswordFormValues = {
  email: string;
};

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setLoading(true);
    const formData = new FormData();
    formData.append("email", values.email);

    const response = await forgotPassword(formData);

    if (response.status === "success") {
      toast({
        title: "Email sent",
        description: "Check your inbox to reset your password.",
      });
    } else {
      setError("email", { message: response.status || "Error sending email" });
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="your@example.com"
          {...register("email", { required: "Email is required" })}
          className="w-full rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className={`w-full rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Loading..." : "Reset Password"}
      </Button>
    </form>
  );
}
