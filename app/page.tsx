
'use client';

import { Hero } from './sections/Hero';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center p-8">
      <Hero />
      
      <footer className="fixed bottom-0 w-full text-center p-4 text-gray-600">
        Made with ❤️ by <a href="https://reloop-website.vercel.app" className="text-black">Reloop</a>
      </footer>
    </div>
  );
}
