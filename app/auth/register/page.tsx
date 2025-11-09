"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser } from "react-icons/fi";
import Shape from "@/components/ui/shapes/Shape";

const registerSchema = Yup.object().shape({
	name: Yup.string().required("Full name is required"),
	email: Yup.string().email("Invalid email address").required("Email is required"),
	password: Yup.string()
		.min(6, "Password must be at least 6 characters")
		.required("Password is required"),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref("password")], "Passwords must match")
		.required("Please confirm your password"),
	acceptTerms: Yup.boolean().oneOf([true], "You must accept the terms"),
});

const initialValues = {
	name: "",
	email: "",
	password: "",
	confirmPassword: "",
	acceptTerms: false,
};

export default function RegisterPage() {
	const [showPassword, setShowPassword] = React.useState(false);

	const handleSubmit = async (values: typeof initialValues, { setSubmitting, setFieldError }: any) => {
		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: values.name,
					email: values.email,
					password: values.password,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				// عرض الخطأ المناسب
				if (data.error.includes('email')) {
					setFieldError('email', data.error);
				} else if (data.error.includes('password')) {
					setFieldError('password', data.error);
				} else {
					alert(data.error);
				}
				return;
			}

			// نجح التسجيل
			alert('Account created successfully! Please login.');
			// يمكنك إضافة redirect هنا
			window.location.href = '/auth/login';
			
		} catch (error) {
			console.error('Registration error:', error);
			alert('Something went wrong. Please try again.');
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
					<h2 className="text-2xl font-bold text-gray-900 mb-2">Create an account</h2>
					<p className="text-gray-600">Start building your professional resume</p>
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
									<label htmlFor="name" className="block text-sm font-medium text-gray-700">
										Full name
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<FiUser className="h-5 w-5 text-gray-400" />
										</div>
										<Field
											id="name"
											name="name"
											type="text"
											placeholder="Your full name"
											className={`w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
												errors.name && touched.name
													? 'border-error bg-red-50'
													: 'border-gray-300 bg-white hover:border-gray-400'
											}`}
										/>
									</div>
									<ErrorMessage name="name" component="p" className="text-sm text-error flex items-center gap-1" />
								</div>

								<div className="space-y-2">
									<label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
													? 'border-error bg-red-50'
													: 'border-gray-300 bg-white hover:border-gray-400'
											}`}
										/>
									</div>
									<ErrorMessage name="email" component="p" className="text-sm text-error flex items-center gap-1" />
								</div>

								<div className="space-y-2">
									<label htmlFor="password" className="block text-sm font-medium text-gray-700">
										Password
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<FiLock className="h-5 w-5 text-gray-400" />
										</div>
										<Field
											id="password"
											name="password"
											type={showPassword ? 'text' : 'password'}
											placeholder="Create a password"
											className={`w-full pl-10 pr-12 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
												errors.password && touched.password
													? 'border-error bg-red-50'
													: 'border-gray-300 bg-white hover:border-gray-400'
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
									<ErrorMessage name="password" component="p" className="text-sm text-error flex items-center gap-1" />
								</div>

								<div className="space-y-2">
									<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
										Confirm Password
									</label>
									<Field
										id="confirmPassword"
										name="confirmPassword"
										type={showPassword ? 'text' : 'password'}
										placeholder="Confirm your password"
										className={`w-full pl-4 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
											errors.confirmPassword && touched.confirmPassword
												? 'border-error bg-red-50'
												: 'border-gray-300 bg-white hover:border-gray-400'
										}`}
									/>
									<ErrorMessage name="confirmPassword" component="p" className="text-sm text-error flex items-center gap-1" />
								</div>

								<div className="flex items-center">
									<Field
										id="acceptTerms"
										name="acceptTerms"
										type="checkbox"
										className="h-4 w-4 text-primary focus:ring-primary/20 border-gray-300 rounded"
									/>
									<label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-700">
										I agree to the <Link href="/terms" className="text-primary underline">Terms</Link> and <Link href="/privacy" className="text-primary underline">Privacy Policy</Link>
									</label>
								</div>

								<button
									type="submit"
									disabled={isSubmitting}
									className={`w-full px-6 py-3 rounded-md transition font-medium ${
										isSubmitting
											? 'bg-gray-400 cursor-not-allowed text-white'
											: 'bg-primary text-white hover:bg-[#E04E00]'
									}`}
								>
									{isSubmitting ? (
										<div className="flex items-center justify-center gap-2">
											<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
											Creating account...
										</div>
									) : (
										'Create account'
									)}
								</button>
							</Form>
						)}
					</Formik>

					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600">
							Already have an account?{' '}
							<Link href="/auth/login" className="font-medium text-primary hover:text-[#E04E00] transition-colors">
								Sign in
							</Link>
						</p>
					</div>
				</div>

				<div className="mt-8 text-center">
					<p className="text-xs text-gray-500">By creating an account you agree to our <Link href="/terms" className="text-primary hover:underline">Terms</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link></p>
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
