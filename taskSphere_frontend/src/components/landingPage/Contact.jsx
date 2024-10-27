import React from 'react';

const Contact = () => {
  return (
    <div name="contact" className="flex flex-col md:flex-row items-center rounded-md justify-center min-h-3/4 bg-gray-200 p-2">
      <div className="w-full md:w-1/2 lg:w-1/3 p-6 bg-white  shadow-md rounded-lg">
        <h2 className="text-2xl font-sans text-center w-full font-normal text-gray-700 mb-4">Connect with us</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              required
              type="text"
              placeholder="Ex: Sara Wilson"
              className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              required
              type="email"
              placeholder="Ex: yourmail@gmail.com"
              className=" text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              placeholder="Write your message or question here"
              className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows="4"
              required
            ></textarea>
          </div>
          <div className=' text-center'>
            <button
              type="submit"
              className=" text-sm sm:text-base px-2 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reach out
            </button>
          </div>
        </form>
      </div>
      <div className="hidden md:block w-full md:w-1/2 lg:w-2/3 p-6">
        <img
          src="/contactus.webp"
          alt="Team working"
          className="w-full h-auto rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};

export default Contact;
