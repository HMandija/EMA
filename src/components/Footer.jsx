const Footer = () => {
  return (
    <footer className="py-20 px-4 md:px-12 lg:px-16 border-t border-gray-100 dark:border-neutral-800 mt-20 transition-colors duration-500 dark:bg-black">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0">
        {/* Viti dhe Emri me efekt Gold në Dark Mode */}
        <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 dark:gold-shimmer">
          © {new Date().getFullYear()} EMA
        </div>

        {/* Linket Sociale */}
        <div className="flex space-x-8 text-[10px] uppercase tracking-[0.3em]">
          <a
            href="https://www.linkedin.com/in/ersid-mandija-8a6334220/"
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:gold-shimmer transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://archinect.com/people/cover/150298688/ersid-mandija"
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:gold-shimmer transition-colors"
          >
            Archinect
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
