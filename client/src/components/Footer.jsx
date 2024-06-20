import React from 'react'
import styles from '../style'
import { ferlogo } from '../assets'

const Footer = () => {
  return (
    <section className={`${styles.flexCenter} ${styles.paddingY} flex-col`}>

      <div className='w-full flex justify-between items-center md:flex-row flex-col pt-6 border-t-[1px] border-t-[#3f3e45]'>
        <p className='font-poppins font-normal text-center text-[18px] leading-[27px] text-stone-700'>
          Concilio®2024
        </p>
        <div className='flex flex-row md:mt-0 mt-6'>
          <a href='https://www.fer.unizg.hr/' target='_blank'>
            <img src={ferlogo} alt="ferlogo" className='ml-auto w-[20%] relative z-[5]'/>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Footer