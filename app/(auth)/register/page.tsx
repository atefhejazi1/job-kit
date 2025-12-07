"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser } from "react-icons/fi";
import Shape from "@/components/ui/shapes/Shape";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

const registerSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  userType: Yup.string()
    .oneOf(["USER", "COMPANY"], "Please select account type")
    .required("Account type is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  acceptTerms: Yup.boolean().oneOf([true], "You must accept the terms"),

  // Company fields
  companyName: Yup.string().when("userType", {
    is: "COMPANY",
    then: (schema) => schema.required("Company name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  industry: Yup.string().when("userType", {
    is: "COMPANY",
    then: (schema) => schema.required("Industry is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  companySize: Yup.string().when("userType", {
    is: "COMPANY",
    then: (schema) => schema.required("Company size is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  location: Yup.string().when("userType", {
    is: "COMPANY",
    then: (schema) => schema.required("Location is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  // Job Seeker fields
  firstName: Yup.string().when("userType", {
    is: "USER",
    then: (schema) => schema.required("First name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  lastName: Yup.string().when("userType", {
    is: "USER",
    then: (schema) => schema.required("Last name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  phone: Yup.string().when("userType", {
    is: "USER",
    then: (schema) => schema.required("Phone number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  city: Yup.string().when("userType", {
    is: "USER",
    then: (schema) => schema.required("City is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const initialValues = {
  email: "",
  userType: "USER",
  password: "",
  confirmPassword: "",
  acceptTerms: false,

  // Company fields
  companyName: "",
  industry: "",
  companySize: "",
  location: "",
  website: "",
  description: "",

  // Job Seeker fields
  firstName: "",
  lastName: "",
  phone: "",
  city: "",
  country: "",
  currentPosition: "",
  experienceLevel: "",
};

export default function RegisterPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const { login } = useAuth();

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting, setFieldError }: any
  ) => {
    try {
      // Prepare data based on user type
      const baseData = {
        email: values.email,
        userType: values.userType,
        password: values.password,
      };

      let additionalData = {};

      if (values.userType === "COMPANY") {
        additionalData = {
          companyName: values.companyName,
          industry: values.industry,
          companySize: values.companySize,
          location: values.location,
          website: values.website || null,
          description: values.description || null,
        };
      } else if (values.userType === "USER") {
        additionalData = {
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          city: values.city,
          country: values.country || null,
          currentPosition: values.currentPosition || null,
          experienceLevel: values.experienceLevel || null,
        };
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...baseData,
          ...additionalData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error.includes("email")) {
          setFieldError("email", data.error);
        } else if (data.error.includes("password")) {
          setFieldError("password", data.error);
        } else {
          toast.error(data.error);
        }
        return;
      }

      toast.success("Account created successfully!");

      login(data.user);

      if (values.userType === "COMPANY") {
        window.location.href = "/dashboard/company";
      } else {
        window.location.href = "/dashboard/user";
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      <Shape
        type="square"
        className="absolute top-20 left-10 animate-bounce opacity-20"
        size={60}
      />
      <Shape
        type="triangle"
        className="absolute top-40 right-20 animate-bounce opacity-20"
        size={80}
      />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="bg-primary w-12 h-12 rounded-full flex justify-center items-center text-white font-bold text-xl">
              JK
            </span>
            <h1 className="text-3xl font-bold text-gray-900">JobKit</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Create an account
          </h2>
          <p className="text-gray-600">
            Start building your professional resume
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <Formik
            initialValues={initialValues}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Account Type
                  </label>
                  <Field name="userType">
                    {({ field }: any) => (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label className="relative cursor-pointer">
                          <input
                            {...field}
                            type="radio"
                            value="USER"
                            checked={field.value === "USER"}
                            className="sr-only"
                          />
                          <div
                            className={`p-4 border-2 rounded-lg transition-all ${
                              field.value === "USER"
                                ? "border-primary bg-primary/5"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-4 h-4 rounded-full border-2 transition-colors ${
                                  field.value === "USER"
                                    ? "border-primary bg-primary"
                                    : "border-gray-300"
                                }`}
                              >
                                {field.value === "USER" && (
                                  <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  Job Seeker
                                </div>
                                <div className="text-sm text-gray-600">
                                  Looking for opportunities
                                </div>
                              </div>
                            </div>
                          </div>
                        </label>
                        <label className="relative cursor-pointer">
                          <input
                            {...field}
                            type="radio"
                            value="COMPANY"
                            checked={field.value === "COMPANY"}
                            className="sr-only"
                          />
                          <div
                            className={`p-4 border-2 rounded-lg transition-all ${
                              field.value === "COMPANY"
                                ? "border-primary bg-primary/5"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-4 h-4 rounded-full border-2 transition-colors ${
                                  field.value === "COMPANY"
                                    ? "border-primary bg-primary"
                                    : "border-gray-300"
                                }`}
                              >
                                {field.value === "COMPANY" && (
                                  <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  Company
                                </div>
                                <div className="text-sm text-gray-600">
                                  Hiring professionals
                                </div>
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                    )}
                  </Field>
                  <ErrorMessage
                    name="userType"
                    component="p"
                    className="text-sm text-error flex items-center gap-1"
                  />
                </div>

                {/* Dynamic Fields Based on Account Type */}
                <Field name="userType">
                  {({ field }: any) => (
                    <>
                      {field.value === "COMPANY" && (
                        <div className="space-y-4 border-t pt-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Company Information
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label
                                htmlFor="companyName"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Company Name *
                              </label>
                              <Field
                                id="companyName"
                                name="companyName"
                                type="text"
                                placeholder="Enter company name"
                                className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                                  errors.companyName && touched.companyName
                                    ? "border-error bg-red-50"
                                    : "border-gray-300 bg-white hover:border-gray-400"
                                }`}
                              />
                              <ErrorMessage
                                name="companyName"
                                component="p"
                                className="text-sm text-error"
                              />
                            </div>

                            <div className="space-y-2">
                              <label
                                htmlFor="industry"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Industry *
                              </label>
                              <Field
                                as="select"
                                id="industry"
                                name="industry"
                                className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                                  errors.industry && touched.industry
                                    ? "border-error bg-red-50"
                                    : "border-gray-300 bg-white hover:border-gray-400"
                                }`}
                              >
                                <option value="">Select industry</option>
                                <option value="Technology">Technology</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Finance">Finance</option>
                                <option value="Education">Education</option>
                                <option value="Manufacturing">
                                  Manufacturing
                                </option>
                                <option value="Retail">Retail</option>
                                <option value="Consulting">Consulting</option>
                                <option value="Other">Other</option>
                              </Field>
                              <ErrorMessage
                                name="industry"
                                component="p"
                                className="text-sm text-error"
                              />
                            </div>

                            <div className="space-y-2">
                              <label
                                htmlFor="companySize"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Company Size *
                              </label>
                              <Field
                                as="select"
                                id="companySize"
                                name="companySize"
                                className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                                  errors.companySize && touched.companySize
                                    ? "border-error bg-red-50"
                                    : "border-gray-300 bg-white hover:border-gray-400"
                                }`}
                              >
                                <option value="">Select company size</option>
                                <option value="1-10">1-10 employees</option>
                                <option value="11-50">11-50 employees</option>
                                <option value="51-200">51-200 employees</option>
                                <option value="201-500">
                                  201-500 employees
                                </option>
                                <option value="501-1000">
                                  501-1000 employees
                                </option>
                                <option value="1000+">1000+ employees</option>
                              </Field>
                              <ErrorMessage
                                name="companySize"
                                component="p"
                                className="text-sm text-error"
                              />
                            </div>

                            <div className="space-y-2">
                              <label
                                htmlFor="location"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Location *
                              </label>
                              <Field
                                id="location"
                                name="location"
                                type="text"
                                placeholder="Enter company location"
                                className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                                  errors.location && touched.location
                                    ? "border-error bg-red-50"
                                    : "border-gray-300 bg-white hover:border-gray-400"
                                }`}
                              />
                              <ErrorMessage
                                name="location"
                                component="p"
                                className="text-sm text-error"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label
                              htmlFor="website"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Company Website
                            </label>
                            <Field
                              id="website"
                              name="website"
                              type="url"
                              placeholder="https://yourcompany.com"
                              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white hover:border-gray-400"
                            />
                          </div>

                          <div className="space-y-2">
                            <label
                              htmlFor="description"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Company Description
                            </label>
                            <Field
                              as="textarea"
                              id="description"
                              name="description"
                              rows={3}
                              placeholder="Tell us about your company..."
                              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white hover:border-gray-400"
                            />
                          </div>
                        </div>
                      )}

                      {field.value === "USER" && (
                        <div className="space-y-4 border-t pt-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Personal Information
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label
                                htmlFor="firstName"
                                className="block text-sm font-medium text-gray-700"
                              >
                                First Name *
                              </label>
                              <Field
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="Enter first name"
                                className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                                  errors.firstName && touched.firstName
                                    ? "border-error bg-red-50"
                                    : "border-gray-300 bg-white hover:border-gray-400"
                                }`}
                              />
                              <ErrorMessage
                                name="firstName"
                                component="p"
                                className="text-sm text-error"
                              />
                            </div>

                            <div className="space-y-2">
                              <label
                                htmlFor="lastName"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Last Name *
                              </label>
                              <Field
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Enter last name"
                                className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                                  errors.lastName && touched.lastName
                                    ? "border-error bg-red-50"
                                    : "border-gray-300 bg-white hover:border-gray-400"
                                }`}
                              />
                              <ErrorMessage
                                name="lastName"
                                component="p"
                                className="text-sm text-error"
                              />
                            </div>

                            <div className="space-y-2">
                              <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Phone Number *
                              </label>
                              <Field
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="Enter phone number"
                                className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                                  errors.phone && touched.phone
                                    ? "border-error bg-red-50"
                                    : "border-gray-300 bg-white hover:border-gray-400"
                                }`}
                              />
                              <ErrorMessage
                                name="phone"
                                component="p"
                                className="text-sm text-error"
                              />
                            </div>

                            <div className="space-y-2">
                              <label
                                htmlFor="city"
                                className="block text-sm font-medium text-gray-700"
                              >
                                City *
                              </label>
                              <Field
                                id="city"
                                name="city"
                                type="text"
                                placeholder="Enter your city"
                                className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                                  errors.city && touched.city
                                    ? "border-error bg-red-50"
                                    : "border-gray-300 bg-white hover:border-gray-400"
                                }`}
                              />
                              <ErrorMessage
                                name="city"
                                component="p"
                                className="text-sm text-error"
                              />
                            </div>

                            <div className="space-y-2">
                              <label
                                htmlFor="country"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Country
                              </label>
                              <Field
                                id="country"
                                name="country"
                                type="text"
                                placeholder="Enter your country"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white hover:border-gray-400"
                              />
                            </div>

                            <div className="space-y-2">
                              <label
                                htmlFor="experienceLevel"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Experience Level
                              </label>
                              <Field
                                as="select"
                                id="experienceLevel"
                                name="experienceLevel"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white hover:border-gray-400"
                              >
                                <option value="">
                                  Select experience level
                                </option>
                                <option value="Entry Level">Entry Level</option>
                                <option value="Mid Level">Mid Level</option>
                                <option value="Senior Level">
                                  Senior Level
                                </option>
                                <option value="Executive">Executive</option>
                              </Field>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label
                              htmlFor="currentPosition"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Current Position
                            </label>
                            <Field
                              id="currentPosition"
                              name="currentPosition"
                              type="text"
                              placeholder="e.g. Software Developer"
                              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white hover:border-gray-400"
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </Field>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className={`w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                        errors.email && touched.email
                          ? "border-error bg-red-50"
                          : "border-gray-300 bg-white hover:border-gray-400"
                      }`}
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-sm text-error flex items-center gap-1"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className={`w-full pl-10 pr-12 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                        errors.password && touched.password
                          ? "border-error bg-red-50"
                          : "border-gray-300 bg-white hover:border-gray-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-primary transition-colors" />
                      ) : (
                        <FiEye className="h-5 w-5 text-gray-400 hover:text-primary transition-colors" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-sm text-error flex items-center gap-1"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className={`w-full pl-4 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                      errors.confirmPassword && touched.confirmPassword
                        ? "border-error bg-red-50"
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }`}
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="p"
                    className="text-sm text-error flex items-center gap-1"
                  />
                </div>

                <div className="flex items-center">
                  <Field
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary/20 border-gray-300 rounded"
                  />

                  <label
                    htmlFor="acceptTerms"
                    className="ml-2 text-sm text-gray-700"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary underline">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                <ErrorMessage
                  name="acceptTerms"
                  component="p"
                  className="text-sm text-error flex items-center gap-1"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-6 py-3 rounded-md transition font-medium ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-primary text-white hover:bg-[#E04E00]"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating account...
                    </div>
                  ) : (
                    "Create account"
                  )}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:text-[#E04E00] transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>

        <Shape
          type="rectangle"
          className="absolute bottom-20 right-10 animate-bounce opacity-10"
          size={40}
        />
      </div>
    </div>
  );
}
