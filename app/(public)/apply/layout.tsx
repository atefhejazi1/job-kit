import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply for Job",
  description:
    "Submit your job application easily and securely. Upload your resume and cover letter to apply for your dream job.",
};

export default function ApplyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
