import React, { useState } from 'react';
import axios from 'axios';
import { Copy, LinkIcon, Loader2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';

const UrlShortener: React.FC = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isValidUrl = (input: string) => {
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,})|' + // domain name
      'localhost|' + // localhost
      '\\d{1,3}(\\.\\d{1,3}){3})' + // OR IP (v4) address
      '(\\:\\d+)?(\\/[-a-zA-Z0-9@:%_\\+.~#?&//=]*)?$', // port and path
      'i'
    );
    return !!urlPattern.test(input);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidUrl(url)) {
      toast.error('Please enter a valid URL!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL_SHORT, {
        originalUrl: url,
      });
      setShortUrl(response.data.shortUrl);
      toast.success('URL shortened successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error shortening URL:', error);
      toast.error('Something went wrong. Please try again!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.info('Copied to clipboard!', {
      position: 'top-right',
      autoClose: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  from-gray-100 to-gray-500 ">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center text-black mb-6">Shorten Your URL</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your long URL here"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <LinkIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <button
                type="submit"
                className={`w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Shortening...
                  </span>
                ) : (
                  'Shorten URL'
                )}
              </button>
            </form>

            {shortUrl && (
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-purple-700 mb-2">Your Shortened URL:</p>
                <div className="flex items-center space-x-2">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex-grow truncate"
                  >
                    {shortUrl}
                  </a>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 text-purple-600 hover:text-purple-800 focus:outline-none"
                    title="Copy to clipboard"
                  >
                    <Copy size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UrlShortener;
