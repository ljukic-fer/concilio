import React from 'react'
import styles from '../style'
import { home1 } from '../assets'

const Hero = () => {
  return (
    <section id='home' className={`flex md:flex-row flex-col ${styles.paddingY}`}>

      <div className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}>

        <div className='flex flex-row justify-between items-center w-full'>
          <h1 className='flex-1 italic font-poppins font-semibold ss:text-[32px] text-[52px] text-black ss:leading-[70px] leading-[75px]'>
          “Coming together is a beginning. <br className='sm:block hidden' /> {" "}
            Keeping together is progress. {" "}
            Working together is success.” {" "}
            <p className=' not-italic text-center ml-10'> Henry Ford</p>
          </h1>

        </div>
      </div>
      <div className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`}>
        <img src={home1} alt="home1" className='w-[86%] relative z-[5]' />

        <div className='absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient' />
        <div className='absolute z-[1] w-[80%] h-[80%] rounded-full bottom-40 white__gradient' />
        <div className='absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient' />
      </div>

    </section>
  )
}

export default Hero