import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-indigo-100 text-gray-800">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-8 border border-purple-100">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-200 mt-16 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
          <p className="text-center text-gray-500 text-sm">
            © 2026 African Nations League • All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
