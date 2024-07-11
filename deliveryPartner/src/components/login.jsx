import React, { useState } from 'react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';


const Login=()=>{
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };
    
        
          

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('https://img.freepik.com/premium-photo/top-view-delicious-hamburger-with-vegetables_134731-1522.jpg?w=740')"}}>
      <div className="max-w-md w-full sm:p-6 bg-white bg-opacity-80 rounded-md shadow-lg overflow-hidden animate-fade-in">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <div className="mt-6 flex flex-col items-center justify-center space-y-4">
          <span className="text-gray-700 text-xl font-medium">Login via using</span>
          <div className="flex justify-center space-x-4">
  <a href="your_facebook_login_url" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 ease-in-out">
    <FaFacebook size={24} />
  </a>
  <a href="your_google_login_url" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-300 ease-in-out">
    <FaGoogle size={24} />
  </a>
</div>

        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm space-y-5">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-300 ease-in-out"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-300 ease-in-out"
                placeholder="Password"
              />
            </div>
          </div>
    
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
    
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>
    
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 ease-in-out"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
        
}
export default Login