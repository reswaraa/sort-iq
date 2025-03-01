'use client';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Sort-IQ | Smart Waste Detector</title>
        <meta
          name="description"
          content="Detect and classify waste using AI for better recycling"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-green-700 mb-6">
            Smart Waste Detection
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mb-10">
            Using advanced AI to identify and categorize waste for proper
            recycling and disposal
          </p>

          <div className="bg-white rounded-xl shadow-xl p-8 mb-12 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 p-6 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Real-time Detection
                </h2>
                <p className="text-gray-600">
                  Scan waste items using your camera and get instant
                  classification results
                </p>
                <div className="mt-8">
                  <Link
                    href="/scan"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105"
                  >
                    Try It Now
                  </Link>
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 p-6 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Static Waste Classification
                </h2>
                <p className="text-gray-600">
                  Upload an image and get immediate waste classification
                </p>
                <div className="mt-8">
                  <Link
                    href="/upload"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105"
                  >
                    Try It Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* <footer className="bg-green-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>
            © {new Date().getFullYear()} EcoScan Waste Detector. All rights
            reserved.
          </p>
          <p className="mt-2 text-green-200">
            Making sustainable waste management accessible to everyone
          </p>
        </div>
      </footer> */}
    </div>
  );
}
