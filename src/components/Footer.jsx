const Footer = () => {
  return (
    <footer className="py-20 px-4 md:px-12 lg:px-16 border-t border-gray-100 mt-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0">
        <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400">
          © {new Date().getFullYear()} EMA
        </div>
        <div className="flex space-x-8 text-[10px] uppercase tracking-[0.3em]">
          <a
            href="https://www.linkedin.com/in/ersid-mandija-8a6334220/"
            className="hover:text-gray-400"
          >
            LinkedIn
          </a>
          <a
            href="https://archinect.com/people/cover/150298688/ersid-mandija"
            className="hover:text-gray-400"
          >
            Archinect
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
