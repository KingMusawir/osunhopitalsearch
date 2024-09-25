import Image from 'next/image';
import background from '../public/bg.png';
import logo from '../public/logo.png';
import SearchBar from './_components/searchbar';

export default function Page() {
  return (
    <main className='mt-24'>
      <div className='absolute inset-0 z-0'>
        <Image
          src={background}
          fill
          alt='The Osun State Hospital'
          className='object-cover object-top filter brightness-50 blur-sm'
          placeholder='blur'
          quality={80}
        />
        <div className='absolute inset-0 bg-black bg-opacity-40'></div>
      </div>

      <div className='relative z-50 text-center'>
        <div className='flex items-center justify-center mt-8'>
          <Image
            src={logo}
            width={100}
            height={100}
            placeholder='blur'
            quality={80}
            className='block md:hidden'
            alt='Osun State Logo'
          />
        </div>
        <h1 className='mb-10 text-4xl font-normal tracking-tight md:text-8xl text-primary-50'>
          Welcome to Osun Hospital Search
        </h1>

        <p className='inline-block px-8 py-6 text-lg font-semibold transition-all bg-accent-500 text-primary-800 hover:bg-accent-600'>
          Search for nearby Hospitals
        </p>
        <SearchBar />

        <div className='flex items-center justify-center mt-8'>
          <Image
            src={logo}
            width={400}
            height={400}
            placeholder='blur'
            quality={80}
            className='hidden md:block'
            alt='Osun State Logo'
          />
        </div>
      </div>
    </main>
  );
}
