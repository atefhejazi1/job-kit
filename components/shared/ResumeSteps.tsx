import Shape from "@/components/ui/shapes/Shape";
import Image from "next/image";

const steps = [
  {
    id: 1,
    title: "Pick a Template",
    description: "Fill in the blanks and see results in real-time.",
    image: "/resumeSteps/step1.png",
  },
  {
    id: 2,
    title: "Customize Your Layout",
    description: "Give your document a professional and elegant look.",
    image: "/resumeSteps/step2.png",
  },
  {
    id: 3,
    title: "Hit 'Download!'",
    description: "Download your resume, apply, get more interviews.",
    image: "/resumeSteps/step3.png",
  },
];

const ResumeSteps = () => {
  return (
    <div className="py-16 relative overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-500">
      {" "}
      <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold mb-12 leading-tight relative z-10 text-gray-900 dark:text-white">
        Build your <span className="text-primary">resume</span> in 3 steps{" "}
      </h2>
      <div className="flex flex-col gap-12 relative z-10">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex flex-col md:flex-row items-center justify-center rounded-2xl p-6 md:p-10 shadow-md text-center md:text-left gap-6 md:gap-10 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
        ${step.id === 2 ? "md:flex-row-reverse" : ""}`}
          >
            <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 relative flex-shrink-0">
              <Image
                src={step.image}
                alt={step.title}
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            <div className="text-primary flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
              <h2 className="text-5xl sm:text-6xl font-bold">{step.id}.</h2>
              <div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                  {step.title}
                </h3>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        <Shape
          type="triangle"
          className="absolute bottom-20 right-4 md:bottom-48 md:right-10 animate-bounce"
          size={50}
        />
        <Shape
          type="square"
          className="absolute top-4 right-4 md:top-10 md:right-10 animate-bounce"
          size={50}
        />
        <Shape
          type="rectangle"
          className="hidden md:block absolute top-64 left-96 animate-bounce"
          size={70}
        />
      </div>
    </div>
  );
};

export default ResumeSteps;
