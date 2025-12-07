import Image from "next/image";

const whyChooseUsList = [
  {
    id: 1,
    title: "Easy to use",
    description:
      "The process of writing a resume is substantially sped up and simplified  by using our resume builder.",
    image: "/WhyChooseUs/seated man wearing headphones using laptop.png",
  },
  {
    id: 2,
    title: "Secure",
    description:
      "We respect your privacy & give you control over your content and your data with us.",
    image: "/WhyChooseUs/Online security.png",
  },
  {
    id: 3,
    title: "Cool Templates",
    description:
      "Our template designs help your resume standout in a pool of others.",
    image: "/WhyChooseUs/Web design.png",
  },
  {
    id: 4,
    title: "Intelligent Design",
    description:
      "With us, you won't have to bother about the minute details of resume development, such as font choice, layout, etc.",
    image: "/WhyChooseUs/Design Process.png",
  },
  {
    id: 5,
    title: " HR-Approved & ATS-Friendly",
    description:
      "The core design of our resume templates are HR-Approved & accepted by leading organizations.",
    image: "/WhyChooseUs/image 12.png",
  },
  {
    id: 6,
    title: "No Hidden Charges",
    description:
      "We’ve got a free version and our  premium pricing is clear. We notify you  about any new changes in good time.",
    image: "/WhyChooseUs/No messages.png",
  },
];

const WhyChooseUs = () => {
  return (
    <div className="py-12 lg:px-24 bg-white dark:bg-gray-900 transition-colors duration-500">
      {" "}
      <div className="text-center mb-12">
        {" "}
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 text-gray-900 dark:text-white">
          Benefits Of Using Our Product{" "}
        </h2>{" "}
        <h3 className="text-lg sm:text-xl md:text-2xl text-primary">
          Why Choose Us?{" "}
        </h3>{" "}
      </div>
      <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-6 sm:gap-8">
        {whyChooseUsList.map((item, index) => (
          <div
            key={index}
            className="w-full sm:w-[80%] md:w-[45%] lg:w-[30%] bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-700 hover:shadow-md dark:hover:shadow-gray-600 transition-shadow duration-300 rounded-2xl p-5 sm:p-6 flex items-start gap-4"
          >
            <Image
              src={item.image}
              alt={item.title}
              width={64}
              height={64}
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain flex-shrink-0"
            />
            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-gray-900 dark:text-white">
                {item.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
