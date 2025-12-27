import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read JobKit's terms of service to understand the rules and guidelines for using our platform.",
};

export default function TermsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>
    </>
  );
}
