"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "@/components/ui/Button";
import LogoUploader from "@/components/ui/LogoUploader";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { CompanyFormData, CompanySize } from "@/types/company.types";
import { useAuth } from "@/contexts/AuthContext";
import {
  createApiHeaders,
  createApiHeadersWithoutContentType,
} from "@/lib/api-utils";
import toast from "react-hot-toast";

// Validation Schema
const companyValidationSchema = Yup.object().shape({
  companyName: Yup.string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters")
    .required("Company name is required"),
  industry: Yup.string()
    .min(2, "Industry must be at least 2 characters")
    .max(50, "Industry must not exceed 50 characters"),
  companySize: Yup.string(),
  location: Yup.string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must not exceed 100 characters"),
  website: Yup.string().url("Please enter a valid URL").nullable(),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"),
  contactPhone: Yup.string()
    .matches(/^[+]?[\d\s-()]+$/, "Please enter a valid phone number")
    .min(10, "Phone number must be at least 10 digits"),
  contactEmail: Yup.string().email("Please enter a valid email address"),
  establishedYear: Yup.number()
    .min(1800, "Established year must be after 1800")
    .max(new Date().getFullYear(), "Established year cannot be in the future")
    .nullable(),
});

function CompanySettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [logoUploading, setLogoUploading] = useState(false);
  const [initialValues, setInitialValues] = useState<CompanyFormData>({
    companyName: "",
    industry: "",
    companySize: "",
    location: "",
    website: "",
    description: "",
    logo: "",
    contactPhone: "",
    contactEmail: "",
    establishedYear: null,
  });

  // Fetch company data
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!user?.companyId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/dashboard/company/profile", {
          headers: createApiHeadersWithoutContentType(user),
        });
        if (response.ok) {
          const data = await response.json();
          const company = data.company;

          const formData: CompanyFormData = {
            companyName: company.companyName || "",
            industry: company.industry || "",
            companySize: company.companySize || "",
            location: company.location || "",
            website: company.website || "",
            description: company.description || "",
            logo: company.logo || "",
            contactPhone: company.contactPhone || "",
            contactEmail: company.contactEmail || "",
            establishedYear: company.establishedYear || null,
          };

          setInitialValues(formData);
          if (company.logo) {
            setLogoPreview(company.logo);
          }
        } else {
          console.error("Failed to fetch company data");
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [user]);

  const handleSubmit = async (
    values: CompanyFormData,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const response = await fetch("/api/dashboard/company/profile", {
        method: "PUT",
        headers: createApiHeaders(user),
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Company settings updated successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update company settings");
      }
    } catch (error) {
      console.error("Error updating company settings:", error);
      toast.error("Failed to update company settings");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading company settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-linear-to-r from-primary to-orange-600 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Company Settings
                </h1>
                <p className="mt-2 text-orange-100">
                  Manage your company profile and information
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <Formik
              initialValues={initialValues}
              validationSchema={companyValidationSchema}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {({ values, errors, touched, isSubmitting }) => (
                <Form className="space-y-8">
                  {/* Company Logo */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <LogoUploader
                      currentLogo={values.logo || ""}
                      onLogoChange={(logoUrl: string) => {
                        values.logo = logoUrl || "";
                        setLogoPreview(logoUrl || "");
                      }}
                      onUploadStateChange={setLogoUploading}
                      disabled={isSubmitting || logoUploading}
                    />
                  </div>

                  {/* Basic Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Basic Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name *
                        </label>
                        <Field
                          name="companyName"
                          type="text"
                          className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                            errors.companyName && touched.companyName
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter company name"
                        />
                        <ErrorMessage
                          name="companyName"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Industry *
                        </label>
                        <Field
                          name="industry"
                          type="text"
                          className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                            errors.industry && touched.industry
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="e.g., Technology, Healthcare, Finance"
                        />
                        <ErrorMessage
                          name="industry"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Size *
                        </label>
                        <Field
                          as="select"
                          name="companySize"
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        >
                          <option value="">Select company size</option>
                          <option value="1-10">1-10 employees</option>
                          <option value="11-50">11-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="201-500">201-500 employees</option>
                          <option value="501-1000">501-1000 employees</option>
                          <option value="1000+">1000+ employees</option>
                        </Field>
                        <ErrorMessage
                          name="companySize"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Established Year
                        </label>
                        <Field
                          name="establishedYear"
                          type="number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          placeholder="e.g., 2015"
                          min="1800"
                          max={new Date().getFullYear()}
                        />
                        <ErrorMessage
                          name="establishedYear"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Description *
                      </label>
                      <Field
                        as="textarea"
                        name="description"
                        rows={4}
                        className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                          errors.description && touched.description
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="Describe your company, its mission, and what makes it unique..."
                      />
                      <ErrorMessage
                        name="description"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Contact Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location *
                        </label>
                        <Field
                          name="location"
                          type="text"
                          className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                            errors.location && touched.location
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="e.g., New York, NY"
                        />
                        <ErrorMessage
                          name="location"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <Field
                          name="website"
                          type="url"
                          className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                            errors.website && touched.website
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="https://yourcompany.com"
                        />
                        <ErrorMessage
                          name="website"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Phone *
                        </label>
                        <Field
                          name="contactPhone"
                          type="tel"
                          className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                            errors.contactPhone && touched.contactPhone
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="+1 (555) 123-4567"
                        />
                        <ErrorMessage
                          name="contactPhone"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Email *
                        </label>
                        <Field
                          name="contactEmail"
                          type="email"
                          className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                            errors.contactEmail && touched.contactEmail
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="contact@yourcompany.com"
                        />
                        <ErrorMessage
                          name="contactEmail"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-4 pt-6 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/dashboard/company/all-jobs")}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || logoUploading}
                      className="flex-1"
                    >
                      {logoUploading
                        ? "Uploading Logo..."
                        : isSubmitting
                        ? "Updating..."
                        : "Update Company Settings"}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CompanySettingsPageWrapper() {
  return (
    <ProtectedRoute requiredUserType="COMPANY">
      <CompanySettingsPage />
    </ProtectedRoute>
  );
}
