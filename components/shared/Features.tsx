import React from "react";
import { Sparkles, Zap, Shield, Target, Clock, Award } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Resume Builder",
      description:
        "Our AI analyzes job descriptions and suggests the best content for your resume",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant ATS Optimization",
      description:
        "Ensure your resume passes Applicant Tracking Systems with our smart formatting",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Privacy Protected",
      description:
        "Your personal information is encrypted and secure. We never share your data",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Job Matching",
      description:
        "Get matched with relevant job opportunities based on your skills and experience",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "5-Minute Setup",
      description:
        "Create a professional resume in minutes, not hours. Pre-filled templates save time",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Expert Reviews",
      description:
        "Get your resume reviewed by industry experts and career coaches",
      color: "from-red-500 to-pink-500",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-orange-50/30 dark:from-gray-800 dark:via-gray-900 dark:to-gray-900/30 transition-colors duration-500">
      {" "}
      <div className="max-w-7xl mx-auto px-4">
        {" "}
        <div className="text-center mb-16">
          {" "}
          <div className="inline-flex items-center gap-3 mb-6">
            {" "}
            <div className="w-8 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>{" "}
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Why Choose Our Platform?{" "}
            </h2>{" "}
            <div className="w-8 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>{" "}
          </div>{" "}
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Everything you need to create a standout resume and land your dream
            job. Our platform combines cutting-edge technology with proven
            career expertise.{" "}
          </p>{" "}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-orange-200 transform hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-orange-600 transition-colors">
                {feature.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>

              <div className="mt-6 w-0 group-hover:w-full h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full transition-all duration-500"></div>
            </div>
          ))}
        </div>
        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 md:p-12 text-white shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Build Your Professional Resume?
            </h3>
            <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of successful job seekers who trusted our platform
              to land their dream careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg">
                Start Building Now
              </button>
              <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-all transform hover:scale-105">
                View Templates
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
