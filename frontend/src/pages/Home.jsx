import {FaArrowRightLong } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
const Home = () => {
  return (
    <>
      <div className="flex items-center justify-center mt-[10%]  flex-col ">
        <h1 className="text-xl font-bold">Select what type of user  you are ?</h1>
        <div className="flex items-center justify-center gap-5 text-lg m-10">
            <Link to='/student' className="border-2 border-black rounded-lg p-20 cursor-pointer ">
                I am Student <span className='text-2xl'><FaArrowRightLong /></span>
            </Link>
            <Link to='/teacher' className="border-2 border-black rounded-lg p-20 cursor-pointer ">
                I am Teacher  <span className='text-2xl'><FaArrowRightLong /></span>
            </Link>
        </div>
      </div>
    </>
  )
}

export default Home