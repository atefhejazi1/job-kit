import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 transition-colors duration-300">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand Info */}
          <div>
            <h2 className="text-primary text-xl font-semibold mb-2">
              Future Resume
            </h2>
            <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">
              Create your resume in a minute, get your dream job in a blink.
            </p>

            <ul className="flex space-x-4 text-lg">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  <FaFacebook />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  <FaTwitter />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  <FaLinkedin />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  <FaInstagram />
                </a>
              </li>
            </ul>
          </div>

          {/* Terms & Policies */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Terms & Policies
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-primary text-gray-700 dark:text-gray-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary text-gray-700 dark:text-gray-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Company
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-primary text-gray-700 dark:text-gray-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary text-gray-700 dark:text-gray-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary text-gray-700 dark:text-gray-400 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Contact
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-primary text-gray-700 dark:text-gray-400 transition-colors">
                  (+234) 8089466435
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary text-gray-700 dark:text-gray-400 transition-colors">
                  agencycr@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-300 dark:border-gray-700"></div>

        {/* Footer Bottom */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-500">
          © {new Date().getFullYear()} Future Resume. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
