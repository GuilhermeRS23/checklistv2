const Footer = () => {
  const currentDate = new Date().getFullYear();

  return (
    <footer className="shadow-sm bg-gray-800">
      <div className="w-full mx-auto max-w-screen p-4 md:flex md:items-center md:justify-between">
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <a href="#" className="hover:underline">V1.2.1</a>
          </li>
        </ul>
        <span className="text-sm text-gray-100 sm:text-center dark:text-gray-400">© {currentDate} <a href="https://github.com/GuilhermeRS23" className="hover:underline">Guilherme R.Silva</a>. All Rights Reserved.
        </span>
      </div>
    </footer>
  )
};

export default Footer;
