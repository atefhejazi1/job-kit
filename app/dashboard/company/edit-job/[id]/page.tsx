\"use client\";

import { useState, useEffect } from \"react\";
import { useRouter, useParams } from \"next/navigation\";
import { Formik, Form, Field, FieldArray, ErrorMessage } from \"formik\";
import * as Yup from \"yup\";
import Button from \"@/components/ui/Button\";
import ProtectedRoute from \"@/components/auth/ProtectedRoute\";
import { WorkType } from \"@/types/job.types\";
import { useAuth } from \"@/contexts/AuthContext\";
import {
  createApiHeaders,
  createApiHeadersWithoutContentType,
} from "@/lib/api-utils";
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
    .max(5000, "Job description must not exceed 5000 characters")
    .required("Job description is required"),
  requirements: Yup.array()
    .of(Yup.string().required("Requirement cannot be empty"))
    .min(1, "At least one requirement is needed")
    .required("Requirements are required"),
  location: Yup.string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must not exceed 100 characters")
    .required("Location is required"),
  workType: Yup.string()
    .oneOf([
      "FULL_TIME",
      "PART_TIME",
      "CONTRACT",
      "FREELANCE",
      "INTERNSHIP",
      "REMOTE",
    ])
    .required("Work type is required"),
  salaryMin: Yup.number()
    .nullable()
    .min(0, "Minimum salary must be non-negative")
    .test(
      "salary-range",
      "Maximum salary must be greater than minimum salary",
      function (value) {
        const { salaryMax } = this.parent;
        if (value && salaryMax) {
          return salaryMax > value;
        }
        return true;
      }
    ),
  salaryMax: Yup.number()
    .nullable()
    .min(0, "Maximum salary must be non-negative"),
  currency: Yup.string().required("Currency is required"),
  benefits: Yup.array()
    .of(Yup.string().required("Benefit cannot be empty"))
    .min(1, "At least one benefit is needed")
    .required("Benefits are required"),
  skills: Yup.array()
    .of(Yup.string().required("Skill cannot be empty"))
    .min(1, "At least one skill is needed")
    .required("Skills are required"),
  experienceLevel: Yup.string().required("Experience level is required"),
  deadline: Yup.date()
    .min(new Date(), "Deadline must be in the future")
    .required("Application deadline is required"),
});

const EditJobPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const params = useParams();
  const jobId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<JobFormData>({
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
  });

  // Fetch job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/dashboard/jobs/${jobId}`, {
          headers: createApiHeadersWithoutContentType(user),
        });
        if (response.ok) {
          const data = await response.json();
          const job = data.job;

          setInitialValues({
            title: job.title,
            description: job.description,
            requirements: job.requirements.length > 0 ? job.requirements : [""],
            location: job.location,
            workType: job.workType,
            salaryMin: job.salaryMin,
            salaryMax: job.salaryMax,
            currency: job.currency,
            benefits: job.benefits.length > 0 ? job.benefits : [""],
            skills: job.skills.length > 0 ? job.skills : [""],
            experienceLevel: job.experienceLevel,
            deadline: job.deadline
              ? new Date(job.deadline).toISOString().split("T")[0]
              : "",
          });
        } else {
          const errorData = await response.json();
          if (response.status === 401) {
            alert(
              "Authentication error. Please log out and log in again to continue."
            );
          } else {
            alert(
              "Failed to fetch job data: " +
                (errorData.error || "Unknown error")
            );
          }
          router.push("/dashboard/company/all-jobs");
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        alert(
          "Failed to fetch job data. Please check your connection and try again."
        );
        router.push("/dashboard/company/all-jobs");
      } finally {
        setLoading(false);
      }
    };

    if (jobId && user) {
      fetchJob();
    }
  }, [jobId, router, user]);

  const handleSubmit = async (
    values: JobFormData,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const response = await fetch(`/api/dashboard/jobs/${jobId}`, {
        method: "PATCH",
        headers: createApiHeaders(user),
        body: JSON.stringify({
          ...values,
          deadline: values.deadline
            ? new Date(values.deadline).toISOString()
            : null,
        }),
      });

      if (response.ok) {
        toast.success("Job updated successfully!");
        router.push("/dashboard/company/all-jobs");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update job");
      }
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Failed to update job");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-orange-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">Edit Job Posting</h1>
            <p className="mt-2 text-orange-100">
              Update your job posting details
            </p>
          </div>

          <div className="p-6">
            <Formik
              initialValues={initialValues}
              validationSchema={jobValidationSchema}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {({ values, errors, touched, isSubmitting }) => (
                <Form className="space-y-8">
                  {/* Basic Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Basic Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
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
                          placeholder="e.g., Senior Frontend Developer"
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
                          placeholder="e.g., New York, NY"
                        />
                        <ErrorMessage
                          name="location"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
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
                        placeholder="Describe the role, responsibilities, and what you're looking for..."
                      />
                      <ErrorMessage
                        name="description"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>

                  {/* Work Details */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Work Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          <option value="Lead/Principal">Lead/Principal</option>
                          <option value="Director/VP">Director/VP</option>
                        </Field>
                        <ErrorMessage
                          name="experienceLevel"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Application Deadline
                      </label>
                      <Field
                        name="deadline"
                        type="date"
                        className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                          errors.deadline && touched.deadline
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      />
                      <ErrorMessage
                        name="deadline"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>

                  {/* Salary Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
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
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="CAD">CAD (C$)</option>
                          <option value="AUD">AUD (A$)</option>
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
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Job Requirements
                    </h2>

                    <FieldArray name="requirements">
                      {({ push, remove }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Requirements *
                          </label>
                          {values.requirements.map((_, index) => (
                            <div key={index} className="flex gap-3 mb-3">
                              <Field
                                name={`requirements.${index}`}
                                type="text"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                placeholder="e.g., 3+ years of React experience"
                              />
                              {values.requirements.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => remove(index)}
                                  className="px-4 py-2 text-red-600 border-red-300 hover:bg-red-50"
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => push("")}
                            className="mt-2"
                          >
                            Add Requirement
                          </Button>
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
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Required Skills
                    </h2>

                    <FieldArray name="skills">
                      {({ push, remove }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Skills *
                          </label>
                          {values.skills.map((_, index) => (
                            <div key={index} className="flex gap-3 mb-3">
                              <Field
                                name={`skills.${index}`}
                                type="text"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                placeholder="e.g., JavaScript, React, Node.js"
                              />
                              {values.skills.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => remove(index)}
                                  className="px-4 py-2 text-red-600 border-red-300 hover:bg-red-50"
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => push("")}
                            className="mt-2"
                          >
                            Add Skill
                          </Button>
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
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Benefits & Perks
                    </h2>

                    <FieldArray name="benefits">
                      {({ push, remove }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Benefits *
                          </label>
                          {values.benefits.map((_, index) => (
                            <div key={index} className="flex gap-3 mb-3">
                              <Field
                                name={`benefits.${index}`}
                                type="text"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                placeholder="e.g., Health insurance, Flexible hours"
                              />
                              {values.benefits.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => remove(index)}
                                  className="px-4 py-2 text-red-600 border-red-300 hover:bg-red-50"
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => push("")}
                            className="mt-2"
                          >
                            Add Benefit
                          </Button>
                          <ErrorMessage
                            name="benefits"
                            component="p"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      )}
                    </FieldArray>
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
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? "Updating Job..." : "Update Job"}
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
};

export default EditJobPage;
