import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read JobKit's privacy policy to understand how we collect, use, and protect your personal information.",
};

export default function PrivacyLayout({
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
