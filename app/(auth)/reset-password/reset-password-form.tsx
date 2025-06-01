"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { resetPassword } from "../actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

interface ResetPasswordFormValues {
  password: string;
  password_confirmation: string;
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setLoading(true);

    if (values.password !== values.password_confirmation) {
      setError("password_confirmation", { message: "Passwords do not match" });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("password", values.password);
    formData.append("password_confirmation", values.password_confirmation);

    // Look for token in query params (could be "token" or "code")
    const token = searchParams.get("token") || searchParams.get("code") || "";

    if (!token) {
      setError("password", { message: "Invalid or missing token." });
      setLoading(false);
      return;
    }

    const response = await resetPassword(formData, token);

    if (response.status === "success") {
      toast.success("Password Reset", {
        description: "Your password has been reset successfully.",
      });
      router.push("/login");
    } else {
      setError("password", { message: response.status || "Unknown error" });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Field: New Password */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your new password"
            {...register("password", { required: "Password is required" })}
            className="w-full rounded-lg border-2 border-primary/20 focus-visible:ring-primary p-2 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Field: Confirm Password */}
      <div className="space-y-2">
        <label
          htmlFor="password_confirmation"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="password_confirmation"
            type={showPasswordConfirmation ? "text" : "password"}
            placeholder="Confirm your new password"
            {...register("password_confirmation", {
              required: "Confirmation is required",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            className="w-full rounded-lg border-2 border-primary/20 focus-visible:ring-primary p-2 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPasswordConfirmation((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            tabIndex={-1}
          >
            {showPasswordConfirmation ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
        {errors.password_confirmation && (
          <p className="text-sm text-red-500">
            {errors.password_confirmation.message}
          </p>
        )}
      </div>

      {/* Reset Button */}
      <Button
        type="submit"
        disabled={loading}
        className={`w-full rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );
}
