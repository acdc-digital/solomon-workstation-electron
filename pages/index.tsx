import Image from 'next/image';
import { useState } from 'react';
import Sidebar from '../components/Sidebar'; // Import Sidebar component, adjust the path as necessary

export default function Home() {
  const [isCodeVisible, setIsCodeVisible] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-cyan-500 to-blue-700 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <header className="absolute top-10 left-[250px]"> {/* Adjust left value based on Sidebar width */}
          <h1 className="text-5xl font-bold drop-shadow-md">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-200 via-green-400 to-blue-500">Solomon Chat</span>
          </h1>
          <p className="mt-2 text-lg font-light">
            Your gateway to seamless communication and collaboration.
          </p>
        </header>

        <section className="flex flex-col items-center justify-center">
          <Image
            src="/next.svg" // Replace with your logo
            alt="Solomon Chat Logo"
            width={150}
            height={150}
            priority
          />

          <button
            className="mt-10 rounded-full bg-white px-6 py-3 text-sm font-medium text-gray-800 transition duration-300 ease-in-out hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-300"
            onClick={() => setIsCodeVisible(!isCodeVisible)}
          >
            {isCodeVisible ? 'Hide' : 'Show'} Secret Code
          </button>

          {isCodeVisible && (
            <div className="mt-5 rounded bg-black/50 p-4">
              <code className="break-words">SC-123456789</code> {/* This could be a dynamic token */}
            </div>
          )}
        </section>

        <footer className="absolute bottom-10 flex w-full justify-center text-xs">
          <span>
            Crafted with ❤️ by the Solomon Team
          </span>
        </footer>
      </main>
    </div>
  );
}

