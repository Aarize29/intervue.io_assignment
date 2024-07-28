import { FaArrowRightLong } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-500 to-gray-800 flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-lg flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Select your user type</h1>
        <div className="flex items-center justify-center gap-8 text-lg">
          <Link to='/student' className="bg-gray-800 hover:bg-gray-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 ease-in-out flex items-center gap-2">
            I am a Student <FaArrowRightLong className='text-2xl' />
          </Link>
          <Link to='/teacher' className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 ease-in-out flex items-center gap-2">
            I am a Teacher <FaArrowRightLong className='text-2xl' />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
