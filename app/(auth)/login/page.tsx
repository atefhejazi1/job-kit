"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";
import Shape from "@/components/ui/shapes/Shape";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const initialValues = {
  email: "",
  password: "",
  rememberMe: false,
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const { login } = useAuth();
  const [returnUrl, setReturnUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setReturnUrl(params.get("returnUrl"));
  }, []);

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting, setFieldError }: any
  ) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        setFieldError("email", data.error);
        return;
      }

      toast.success(`Welcome back, ${data.user.name}!`);
      login(data.user, data.accessToken, data.refreshToken);

      if (returnUrl) window.location.href = returnUrl;
      else if (data.user.userType === "COMPANY")
        window.location.href = "/dashboard/company";
      else window.location.href = "/dashboard/user";
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden
      bg-gray-50 dark:bg-gray-950">

      {/* Shapes */}
      <Shape
        type="square"
        className="absolute top-20 left-10 animate-bounce opacity-20 dark:opacity-10"
        size={60}
      />
      <Shape
        type="triangle"
        className="absolute top-40 right-20 animate-bounce opacity-20 dark:opacity-10"
        size={80}
      />
      <Shape
        type="rectangle"
        className="absolute bottom-32 left-32 animate-bounce opacity-20 dark:opacity-10"
        size={70}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="bg-primary w-12 h-12 rounded-full flex justify-center items-center text-white font-bold text-xl">
              JK
            </span>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              JobKit
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to access your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800
          rounded-2xl shadow-lg p-8">

          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                    <Field
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      className={`w-full pl-10 pr-4 py-3 border rounded-md transition-colors
                        bg-white dark:bg-gray-800
                        text-gray-900 dark:text-white
                        focus:ring-2 focus:ring-primary/20 focus:border-primary
                        ${
                          errors.email && touched.email
                            ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                            : "border-gray-300 dark:border-gray-700"
                        }`}
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      className={`w-full pl-10 pr-12 py-3 border rounded-md transition-colors
                        bg-white dark:bg-gray-800
                        text-gray-900 dark:text-white
                        focus:ring-2 focus:ring-primary/20 focus:border-primary
                        ${
                          errors.password && touched.password
                            ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                            : "border-gray-300 dark:border-gray-700"
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-primary"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* Remember */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Field
                      type="checkbox"
                      name="rememberMe"
                      className="rounded border-gray-300 dark:border-gray-700"
                    />
                    Remember me
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-6 py-3 rounded-md font-medium transition
                    ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-primary text-white hover:bg-orange-600"
                    }`}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
              </Form>
            )}
          </Formik>

          {/* Register */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>

        <Shape
          type="rectangle"
          className="absolute bottom-20 right-10 animate-bounce opacity-10 dark:opacity-5"
          size={40}
        />
      </div>
    </div>
  );
}
