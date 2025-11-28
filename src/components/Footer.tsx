import React from "react";

function Footer() {
  return (
    <footer className="relative z-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Developed by Sahil Lokhande
            </h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Passionate Full Stack Developer
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="https://github.com/Sahil26299"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/sahillokhande26"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://my-portfolio-next-mauve.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Portfolio
            </a>
            <a
              href="mailto:sahillokhande94@gmail.com"
              className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              Email
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-400 dark:text-gray-600">
          © {new Date().getFullYear()} TaskManager. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
