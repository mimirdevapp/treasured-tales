import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-white">
      <h1 className="text-7xl md:text-9xl font-agraham text-gray-800 mb-6">
        404
      </h1>

      <p className="font-cormorant text-xl md:text-2xl text-gray-600 mb-8">
        The page you’re looking for does not exist.
      </p>

      <Link
        to="/"
        className="px-8 py-3 border border-[#8C5117] text-[#8C5117] hover:bg-[#8C5117] hover:text-white transition-all font-montserrat tracking-wider"
      >
        GO HOME
      </Link>
    </div>
  );
};

export default NotFound;
