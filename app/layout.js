import '@/app/_styles/globals.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { QueryProvider } from './_components/QueryProvider';

export const metadata = {
  title: {
    template: '%s / OsunHop',
    default: 'Welcome / The OsunHop',
  },
  description:
    'Find hospital in near by location,  in the heart of the Osun State',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className='flex flex-col min-h-screen bg-accent-100 text-primary-100'>
        <QueryProvider>
          <div className='grid flex-1 px-[0.4rem] py-12 md:px-8 '>
            <main className='w-full mx-auto max-w-[90rem] '>{children}</main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
