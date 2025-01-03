import "./Landing.scss";

import HeroStanding from "./images/hero-standing.png";
import Dragon from "./images/dragon.png";
import { Link } from "react-router-dom";

export function Landing() {
  return (
    <div id='ld-sheet' className='py-10'>
      <div className='mb-16 flex flex-col items-start justify-between gap-y-4 px-8 md:flex-row md:px-20'>
        <img src='/logo-name.png' className='h-28 w-28' />
        <Link to='/login' id='ld-login-btn'>
          Login
        </Link>
      </div>

      <section id='ld-grad' className='flex flex-col px-8 md:px-16 lg:flex-row'>
        <img
          src={Dragon}
          id='ld-dragon'
          className='w-[164px] md:w-[256px] lg:w-[325px]'
        />
        <img className='w-[700px] shrink-0' src={HeroStanding} />
        <div className='mt-16 min-w-0'>
          <h1 className='text-lg font-black !leading-tight xs:text-2xl md:text-3xl lg:text-4xl xl:text-[3rem]'>
            Welcome to <br /> WonderSeed
          </h1>
          {/* <p className='text-md mt-8 max-w-[400px] xs:text-lg md:text-xl lg:text-2xl xl:text-3xl'> */}
            {/* Lorem, ipsum dolor sit amet consectetur adipisicing elit. */}
          {/* </p> */}
          <Link to='/login'>
            <button className='w-button mb-28 mt-12 w-full sm:w-auto'>
              Get Started
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
