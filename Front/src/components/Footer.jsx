import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-sm">
          &copy; 2024 Your Company Name. All rights reserved.
        </div>
        <div className="flex space-x-4">
          <a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a>
          <a href="/terms" className="text-gray-400 hover:text-white">Terms of Service</a>
          <a href="/contact" className="text-gray-400 hover:text-white">Contact Us</a>
        </div>
      </div>
    </footer>
  )
}
