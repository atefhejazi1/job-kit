import Image from "next/image";
import React from "react";

const Snapchat = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-10  py-12">
      {/* Left Side */}
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
          Snapshot of our simple-to-use editor
        </h2>

        <Image
          src="/Marketplace-pana.svg"
          alt="Marketplace Image"
          width={600}
          height={400}
          className="w-full h-auto object-cover rounded-2xl shadow-md"
        />
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex flex-col gap-6 text-center md:text-left">
        <p className="text-lg text-gray-700">
          All the flexibility & intuition you need to build a resume that stands out
        </p>

        <ul className="text-primary space-y-3">
          <li>
            <span className="font-bold">Multi-theme & type face</span> <br />
            for personalization.
          </li>
          <li>
            <span className="font-bold">Placeholder resume content</span> <br />
            to guide your filling.
          </li>
          <li>
            <span className="font-bold">Multiple layouts & templates</span> <br />
            to choose from.
          </li>
        </ul>

        <button className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition duration-300 w-fit mx-auto md:mx-0">
          Create Resume
        </button>

        {/* Stats */}
        <div className="mt-6">
          <h3 className="text-2xl font-semibold mb-4 text-primary">Our stats:</h3>

          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-6">
            <div className="bg-gray-100 rounded-2xl p-4 shadow-sm w-full sm:w-1/2">
              <h2 className="text-3xl font-bold text-primary">200+</h2>
              <h3 className="text-gray-700">Users</h3>
            </div>

            <div className="bg-gray-100 rounded-2xl p-4 shadow-sm w-full sm:w-1/2">
              <h2 className="text-3xl font-bold text-primary">3 mins</h2>
              <h3 className="text-gray-700">Average resume building time</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Snapchat;
