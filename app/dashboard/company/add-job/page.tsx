'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { Plus, Minus, X, DollarSign, Calendar, MapPin, Briefcase } from 'lucide-react';
import Button from '@/components/ui/Button'; // Assuming you have this Button component
import { WorkType } from '@/types/job.types'; // Assuming this interface is correct
import { useAuth } from '@/contexts/AuthContext';
import { createApiHeaders } from '@/lib/api-utils';

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

// Global Reusable Input Styling
const baseInputStyle = 'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors dark:bg-slate-700 dark:text-gray-100 dark:border-slate-600';
const errorInputStyle = 'border-red-500 focus:border-red-500 dark:border-red-500';
const defaultInputStyle = 'border-gray-300 focus:border-primary';

// Custom Field Component with Error Handling (for better reusability and UX)
const FormField = ({ name, label, type = 'text', as = 'input', rows, placeholder, min, ...props }: any) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    <Field name={name}>
      {({ field, meta }: any) => (
        <>
          <Component as={as} 
            {...field} 
            {...props} 
            id={name} 
            type={type} 
            rows={rows} 
            placeholder={placeholder} 
            min={min}
            className={`${baseInputStyle} ${meta.touched && meta.error ? errorInputStyle : defaultInputStyle}`}
            aria-invalid={meta.touched && meta.error ? 'true' : 'false'}
            aria-describedby={meta.touched && meta.error ? `${name}-error` : undefined}
          />
          <ErrorMessage name={name} id={`${name}-error`} component="p" className="text-red-500 text-sm mt-1" />
        </>
      )}
    </Field>
  </div>
);

// Helper component for dynamic Field
const Component = ({ as: ComponentType = 'input', ...props }) => <ComponentType {...props} />;

// Validation Schema
const jobValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Job title must be at least 3 characters')
    .max(100, 'Job title must not exceed 100 characters')
    .required('Job title is required'),

  description: Yup.string()
    .min(50, 'Job description must be at least 50 characters')
    .max(2000, 'Job description must not exceed 2000 characters')
    .required('Job description is required'),

  location: Yup.string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must not exceed 100 characters')
    .required('Location is required'),

  workType: Yup.string()
    .oneOf(
      ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP', 'REMOTE'],
      'Please select a valid work type'
    )
    .required('Work type is required'),

  experienceLevel: Yup.string()
    .oneOf(
      ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
      'Please select a valid experience level'
    )
    .required('Experience level is required'),

  salaryMin: Yup.number()
    .nullable()
    .test('is-positive', 'Minimum salary must be positive', (value) => !value || value >= 0),

  salaryMax: Yup.number()
    .nullable()
    .test('is-positive', 'Maximum salary must be positive', (value) => !value || value >= 0)
    .test(
      'is-greater',
      'Maximum salary must be greater than minimum salary',
      function (value) {
        const { salaryMin } = this.parent;
        // Check only if both min and max are provided
        if (salaryMin !== null && value !== null && value <= salaryMin) {
          return false;
        }
        return true;
      }
    ),

  currency: Yup.string()
    .oneOf(['USD', 'EUR', 'GBP', 'CAD'], 'Please select a valid currency')
    .required('Currency is required'),

  requirements: Yup.array()
    .of(Yup.string().trim())
    .min(1, 'At least one requirement is needed')
    .test('has-valid-requirements', 'At least one non-empty requirement is needed', (value) => {
      return value && value.some((req) => req && req.trim().length > 0);
    })
    .required('Requirements are required'),

  skills: Yup.array()
    .of(Yup.string().trim())
    .min(1, 'At least one skill is needed')
    .test('has-valid-skills', 'At least one non-empty skill is needed', (value) => {
      return value && value.some((skill) => skill && skill.trim().length > 0);
    })
    .required('Skills are required'),

  benefits: Yup.array().of(Yup.string().trim()),

  deadline: Yup.date().min(new Date(), 'Deadline must be in the future').nullable(),
});

const initialValues: JobFormData = {
  title: '',
  description: '',
  requirements: [''],
  location: '',
  workType: 'FULL_TIME',
  salaryMin: null,
  salaryMax: null,
  currency: 'USD',
  benefits: [''],
  skills: [''],
  experienceLevel: 'Mid Level',
  deadline: '',
};

const AddJobPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Check if the user is authorized to post a job (assuming company user)
  if (!user) {
    // Optionally redirect or show an error if not logged in
    return <p className="text-center p-10 text-xl text-red-500">Access Denied: Please log in as a company user.</p>;
  }

  const handleSubmit = async (
    values: JobFormData,
    { setSubmitting, setFieldError }: any
  ) => {
    setIsLoading(true);

    try {
      // Clean up empty string entries from array fields before submission
      const submitData = {
        ...values,
        requirements: values.requirements.filter((req) => req.trim()),
        benefits: values.benefits.filter((benefit) => benefit.trim()),
        skills: values.skills.filter((skill) => skill.trim()),
        // Set null values to undefined so they are omitted in the JSON if not set (or use null if backend expects null)
        salaryMin: values.salaryMin === null ? undefined : values.salaryMin,
        salaryMax: values.salaryMax === null ? undefined : values.salaryMax,
        deadline: values.deadline || undefined,
      };

      const response = await fetch('/api/dashboard/jobs', {
        method: 'POST',
        headers: createApiHeaders(user),
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        // More robust error handling for specific fields
        if (data.fieldErrors) {
          Object.keys(data.fieldErrors).forEach(key => {
            setFieldError(key, data.fieldErrors[key]);
          });
        }
        throw new Error(data.error || 'Failed to create job');
      }

      toast.success('Job posted successfully!');
      router.push('/dashboard/company/all-jobs');
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to create job'
      );
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const ArrayItemInput = ({ name, index, placeholder, remove, showRemove }: { name: string, index: number, placeholder: string, remove: (index: number) => void, showRemove: boolean }) => (
    <div key={index} className="flex items-center gap-3">
      <Field
        name={`${name}.${index}`}
        type="text"
        className={`${baseInputStyle} ${defaultInputStyle} flex-1`}
        placeholder={placeholder}
      />
      {showRemove && (
        <button
          type="button"
          onClick={() => remove(index)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 dark:hover:bg-red-900/40"
          aria-label={`Remove item ${index + 1}`}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  const ArraySection = ({ title, name, placeholder }: { title: string, name: keyof JobFormData, placeholder: string }) => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-secondary dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2 flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-primary" /> {title} *
      </h2>
      <FieldArray name={name}>
        {({ push, remove, form }) => (
          <div className="space-y-3">
            {(form.values[name] as string[]).map((_, index) => (
              <ArrayItemInput
                key={index}
                name={name as string}
                index={index}
                placeholder={placeholder}
                remove={remove}
                showRemove={(form.values[name] as string[]).length > 1}
              />
            ))}

            <button
              type="button"
              onClick={() => push('')}
              className="flex items-center gap-1 text-primary hover:text-primary/80 font-medium px-2 py-1 rounded transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add {title.slice(0, -1)}
            </button>
            <ErrorMessage
              name={name as string}
              component="p"
              className="text-red-500 text-sm mt-1"
            />
          </div>
        )}
      </FieldArray>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-slate-700">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-secondary dark:text-white mb-2">
              🚀 Post New Job
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Fill in the details to create a new job posting for your company.
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={jobValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-10">
                {/* 1. Basic Information */}
                <section className="space-y-6">
                  <h2 className="text-xl font-semibold text-secondary dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" /> Basic Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Job Title */}
                    <div className="md:col-span-2">
                      <FormField
                        name="title"
                        label="Job Title *"
                        placeholder="e.g. Senior Software Developer"
                      />
                    </div>

                    {/* Location */}
                    <FormField
                      name="location"
                      label="Location *"
                      placeholder="e.g. New York, NY or Remote"
                      icon={<MapPin className="h-5 w-5 text-gray-400" />}
                    />

                    {/* Work Type */}
                    <FormField
                      name="workType"
                      label="Work Type *"
                      as="select"
                    >
                      <option value="FULL_TIME">Full Time</option>
                      <option value="PART_TIME">Part Time</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="FREELANCE">Freelance</option>
                      <option value="INTERNSHIP">Internship</option>
                      <option value="REMOTE">Remote</option>
                    </FormField>
                    
                    {/* Experience Level */}
                    <FormField
                      name="experienceLevel"
                      label="Experience Level *"
                      as="select"
                    >
                      <option value="Entry Level">Entry Level</option>
                      <option value="Mid Level">Mid Level</option>
                      <option value="Senior Level">Senior Level</option>
                      <option value="Executive">Executive</option>
                    </FormField>
                    
                    {/* Application Deadline */}
                    <FormField
                      name="deadline"
                      label="Application Deadline"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      icon={<Calendar className="h-5 w-5 text-gray-400" />}
                    />
                  </div>

                  {/* Job Description */}
                  <div>
                    <FormField
                      name="description"
                      label="Job Description *"
                      as="textarea"
                      rows={6}
                      placeholder="Describe the role, responsibilities, and what makes this position exciting (min 50 chars)..."
                    />
                  </div>
                </section>

                {/* 2. Salary Information */}
                <section className="space-y-6">
                  <h2 className="text-xl font-semibold text-secondary dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" /> Salary (Optional)
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Minimum Salary */}
                    <FormField
                      name="salaryMin"
                      label="Minimum Salary"
                      type="number"
                      placeholder="50000"
                      min="0"
                    />

                    {/* Maximum Salary */}
                    <FormField
                      name="salaryMax"
                      label="Maximum Salary"
                      type="number"
                      placeholder="80000"
                      min="0"
                    />

                    {/* Currency */}
                    <FormField
                      name="currency"
                      label="Currency *"
                      as="select"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="CAD">CAD</option>
                    </FormField>
                  </div>
                </section>

                {/* 3. Requirements & Skills & Benefits */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Requirements */}
                  <ArraySection
                    title="Requirements"
                    name="requirements"
                    placeholder="e.g. Bachelor's degree in Computer Science"
                  />

                  {/* Required Skills */}
                  <ArraySection
                    title="Required Skills"
                    name="skills"
                    placeholder="e.g. JavaScript, React, Node.js"
                  />
                </div>

                <ArraySection
                  title="Benefits & Perks"
                  name="benefits"
                  placeholder="e.g. Health insurance, Remote work, Flexible hours"
                />

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 rounded-xl transition font-semibold border border-primary text-primary hover:bg-gray-50 dark:hover:bg-slate-700/50 dark:text-primary dark:border-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className={`px-6 py-3 rounded-xl transition font-semibold text-white shadow-lg ${
                      isSubmitting || isLoading
                        ? 'bg-primary/50 cursor-not-allowed'
                        : 'bg-primary hover:bg-[#E04E00]'
                    }`}
                  >
                    {isSubmitting || isLoading ? 'Creating Job...' : 'Post Job'}
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

export default AddJobPage;