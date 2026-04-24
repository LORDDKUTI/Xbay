import React from 'react'
import timber from '../assets/IMG_9845.PNG'

const Home = () => {
  return (
    <div>
      <div style={{ padding: "40px",backgroundColor:"orangered", textAlign: "center" }}>
        <h1 className='text-[15px] font-bold '>Welcome to Your Store</h1>
        <p className='text-[15px] font-bold '>Modern shopping experience loading...</p>
      </div>
      <div className=' items-center flex flex-col px-3'>
        <h1 className=' font-bold text-shadow-2xs py-3 text-shadow-black text-xl text-[#0b388c93]'>Check out our NEWEST TIMBERRICK SNEAKERS.!!</h1>
        <div relative>
          <span className=' pl-2.5 z-10 absolute bottom-10 text-shadow-2xs text-shadow-black text-3xl text-[#850b8c93]/80 font-extrabold'>Built Incredibly for any SETTINGs</span>
          <img className=' shadow-2xl hover:blur-[0] blur-[1.48px] rounded-[6.6px]' src={timber} alt="" />
        </div>
      </div>
    </div>

  )
}

export default Home







