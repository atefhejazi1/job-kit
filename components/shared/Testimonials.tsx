const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Frontend Developer",
    message:
      "Future Resume made job applications so easy! I created a professional resume in minutes and landed an interview within a week.",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    name: "Michael Brown",
    role: "Software Engineer",
    message:
      "I love the simplicity and design of Future Resume. It helped me stand out in the job market effortlessly.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Amina Khaled",
    role: "UI/UX Designer",
    message:
      "The templates are modern and easy to customize. Highly recommend it for anyone looking for a clean and fast resume builder!",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const Testimonials = () => {
  return (
    <section
      className="bg-gray-50 dark:bg-gray-900 py-16 transition-colors duration-500"
      id="testimonials"
    >
      {" "}
      <div className="text-center">
        {" "}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Testimonials From Our Previous Users{" "}
        </h2>{" "}
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
          Hear what our happy users have to say about their experience with{" "}
          <span className="text-primary font-semibold"> Future Resume</span>.{" "}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-700 p-6 text-left flex flex-col items-center hover:shadow-lg hover:dark:shadow-gray-600 hover:-translate-y-2 transform transition duration-300"
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-20 h-20 rounded-full object-cover mb-4"
              />
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 italic text-center">
                “{t.message}”
              </p>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {t.name}
              </h3>
              <p className="text-primary text-sm">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
