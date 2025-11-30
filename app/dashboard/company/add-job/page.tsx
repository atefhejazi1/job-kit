\"use client\";

import { useState } from \"react\";
import { useRouter } from \"next/navigation\";
import { Formik, Form, Field, ErrorMessage, FieldArray } from \"formik\";
import * as Yup from \"yup\";
import Button from \"@/components/ui/Button\";
import ProtectedRoute from \"@/components/auth/ProtectedRoute\";
import { WorkType } from \"@/types/job.types\";
import { useAuth } from \"@/contexts/AuthContext\";
import { createApiHeaders } from \"@/lib/api-utils\";
import toast from "react-hot-toast";

interface JobFormData {
  title: string;
  description: string;
  requirements: string[];
  location: string;
  workType: WorkType;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  benefits: string[];
  skills: string[];
  experienceLevel: string;
  deadline: string;
}

// Validation Schema
const jobValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Job title must be at least 3 characters")
    .max(100, "Job title must not exceed 100 characters")
    .required("Job title is required"),

  description: Yup.string()
    .min(50, "Job description must be at least 50 characters")
    .max(2000, "Job description must not exceed 2000 characters")
    .required("Job description is required"),

  location: Yup.string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must not exceed 100 characters")
    .required("Location is required"),

  workType: Yup.string()
    .oneOf(
      [
        "FULL_TIME",
        "PART_TIME",
        "CONTRACT",
        "FREELANCE",
        "INTERNSHIP",
        "REMOTE",
      ],
      "Please select a valid work type"
    )
    .required("Work type is required"),

  experienceLevel: Yup.string()
    .oneOf(
      ["Entry Level", "Mid Level", "Senior Level", "Executive"],
      "Please select a valid experience level"
    )
    .required("Experience level is required"),

  salaryMin: Yup.number().min(0, "Minimum salary must be positive").nullable(),

  salaryMax: Yup.number()
    .min(0, "Maximum salary must be positive")
    .test(
      "is-greater",
      "Maximum salary must be greater than minimum salary",
      function (value) {
        const { salaryMin } = this.parent;
        if (salaryMin && value && value <= salaryMin) {
          return false;
        }
        return true;
      }
    )
    .nullable(),

  currency: Yup.string()
    .oneOf(["USD", "EUR", "GBP", "CAD"], "Please select a valid currency")
    .required("Currency is required"),

  requirements: Yup.array()
    .of(Yup.string().trim())
    .test(
      "has-valid-requirements",
      "At least one requirement is needed",
      function (value) {
        return value && value.some((req) => req && req.trim().length > 0);
      }
    )
    .required("Requirements are required"),

  skills: Yup.array()
    .of(Yup.string().trim())
    .test("has-valid-skills", "At least one skill is needed", function (value) {
      return value && value.some((skill) => skill && skill.trim().length > 0);
    })
    .required("Skills are required"),

  benefits: Yup.array().of(Yup.string().trim()),

  deadline: Yup.date()
    .min(new Date(), "Deadline must be in the future")
    .nullable(),
});

const initialValues: JobFormData = {
  title: "",
  description: "",
  requirements: [""],
  location: "",
  workType: "FULL_TIME",
  salaryMin: null,
  salaryMax: null,
  currency: "USD",
  benefits: [""],
  skills: [""],
  experienceLevel: "Mid Level",
  deadline: "",
};

const AddJobPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    values: JobFormData,
    { setSubmitting, setFieldError }: any
  ) => {
    setIsLoading(true);

    try {
      const submitData = {
        ...values,
        requirements: values.requirements.filter((req) => req.trim()),
        benefits: values.benefits.filter((benefit) => benefit.trim()),
        skills: values.skills.filter((skill) => skill.trim()),
        salaryMin: values.salaryMin || undefined,
        salaryMax: values.salaryMax || undefined,
        deadline: values.deadline || undefined,
      };

      const response = await fetch("/api/dashboard/jobs", {
        method: "POST",
        headers: createApiHeaders(user),
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific field errors
        if (data.error.includes("title")) {
          setFieldError("title", data.error);
        } else if (data.error.includes("description")) {
          setFieldError("description", data.error);
        } else if (data.error.includes("location")) {
          setFieldError("location", data.error);
        } else {
          throw new Error(data.error || "Failed to create job");
        }
        return;
      }

      toast.success("Job posted successfully!");
      router.push("/dashboard/company/all-jobs");
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create job"
      );
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary mb-2">
              Post New Job
            </h1>
            <p className="text-gray-600">
              Fill in the details to create a new job posting
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={jobValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-secondary border-b border-gray-200 pb-2">
                    Basic Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title *
                      </label>
                      <Field
                        name="title"
                        type="text"
                        className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                          errors.title && touched.title
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="e.g. Senior Software Developer"
                      />
                      <ErrorMessage
                        name="title"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

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
                        placeholder="e.g. New York, NY or Remote"
                      />
                      <ErrorMessage
                        name="location"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Work Type *
                      </label>
                      <Field
                        as="select"
                        name="workType"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      >
                        <option value="FULL_TIME">Full Time</option>
                        <option value="PART_TIME">Part Time</option>
                        <option value="CONTRACT">Contract</option>
                        <option value="FREELANCE">Freelance</option>
                        <option value="INTERNSHIP">Internship</option>
                        <option value="REMOTE">Remote</option>
                      </Field>
                      <ErrorMessage
                        name="workType"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience Level *
                      </label>
                      <Field
                        as="select"
                        name="experienceLevel"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      >
                        <option value="Entry Level">Entry Level</option>
                        <option value="Mid Level">Mid Level</option>
                        <option value="Senior Level">Senior Level</option>
                        <option value="Executive">Executive</option>
                      </Field>
                      <ErrorMessage
                        name="experienceLevel"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Application Deadline
                      </label>
                      <Field
                        name="deadline"
                        type="date"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        min={new Date().toISOString().split("T")[0]}
                      />
                      <ErrorMessage
                        name="deadline"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description *
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      rows={6}
                      className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                        errors.description && touched.description
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                    />
                    <ErrorMessage
                      name="description"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Salary Information */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-secondary border-b border-gray-200 pb-2">
                    Salary Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Salary
                      </label>
                      <Field
                        name="salaryMin"
                        type="number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="50000"
                        min="0"
                        value={values.salaryMin ?? ""}
                      />
                      <ErrorMessage
                        name="salaryMin"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Salary
                      </label>
                      <Field
                        name="salaryMax"
                        type="number"
                        className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                          errors.salaryMax && touched.salaryMax
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="80000"
                        min="0"
                        value={values.salaryMax ?? ""}
                      />
                      <ErrorMessage
                        name="salaryMax"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <Field
                        as="select"
                        name="currency"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="CAD">CAD</option>
                      </Field>
                      <ErrorMessage
                        name="currency"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-secondary border-b border-gray-200 pb-2">
                    Requirements *
                  </h2>

                  <FieldArray name="requirements">
                    {({ push, remove }) => (
                      <div className="space-y-3">
                        {values.requirements.map((requirement, index) => (
                          <div key={index} className="flex gap-2">
                            <Field
                              name={`requirements.${index}`}
                              type="text"
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                              placeholder="e.g. Bachelor's degree in Computer Science"
                            />
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="px-3 py-2 text-red-500 hover:text-red-700 disabled:opacity-50"
                              disabled={values.requirements.length === 1}
                            >
                              Remove
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => push("")}
                          className="text-primary hover:text-primary/80 font-medium"
                        >
                          + Add Requirement
                        </button>
                        <ErrorMessage
                          name="requirements"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Skills */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-secondary border-b border-gray-200 pb-2">
                    Required Skills *
                  </h2>

                  <FieldArray name="skills">
                    {({ push, remove }) => (
                      <div className="space-y-3">
                        {values.skills.map((skill, index) => (
                          <div key={index} className="flex gap-2">
                            <Field
                              name={`skills.${index}`}
                              type="text"
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                              placeholder="e.g. JavaScript, React, Node.js"
                            />
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="px-3 py-2 text-red-500 hover:text-red-700 disabled:opacity-50"
                              disabled={values.skills.length === 1}
                            >
                              Remove
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => push("")}
                          className="text-primary hover:text-primary/80 font-medium"
                        >
                          + Add Skill
                        </button>
                        <ErrorMessage
                          name="skills"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Benefits */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-secondary border-b border-gray-200 pb-2">
                    Benefits & Perks
                  </h2>

                  <FieldArray name="benefits">
                    {({ push, remove }) => (
                      <div className="space-y-3">
                        {values.benefits.map((benefit, index) => (
                          <div key={index} className="flex gap-2">
                            <Field
                              name={`benefits.${index}`}
                              type="text"
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                              placeholder="e.g. Health insurance, Remote work, Flexible hours"
                            />
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="px-3 py-2 text-red-500 hover:text-red-700 disabled:opacity-50"
                              disabled={values.benefits.length === 1}
                            >
                              Remove
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => push("")}
                          className="text-primary hover:text-primary/80 font-medium"
                        >
                          + Add Benefit
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2 rounded-md transition font-medium border border-primary text-primary hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className={`px-6 py-2 rounded-md transition font-medium bg-primary text-white hover:bg-[#E04E00] cursor-pointer ${
                      isSubmitting || isLoading
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isSubmitting || isLoading ? "Creating Job..." : "Post Job"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

function AddJobPageComponent() {
  return <AddJobPage />;
}

export default function AddJobPageWrapper() {
  return (
    <ProtectedRoute requiredUserType="COMPANY">
      <AddJobPageComponent />
    </ProtectedRoute>
  );
}
