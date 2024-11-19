'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { SiGitter, SiInstagram, SiFacebook } from 'react-icons/si'

export default function Footer() {
  const [openModal, setOpenModal] = useState<string | null>(null)

  const handleOpenModal = (modalName: string) => {
    setOpenModal(modalName)
  }

  const handleCloseModal = () => {
    setOpenModal(null)
  }

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-gray-300">E-Shop is your one-stop destination for all your shopping needs. We offer a wide range of products across various categories.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><button onClick={() => handleOpenModal('contact')} className="text-gray-300 hover:text-white">Contact Us</button></li>
              <li><button onClick={() => handleOpenModal('faq')} className="text-gray-300 hover:text-white">FAQ</button></li>
              <li><button onClick={() => handleOpenModal('shipping')} className="text-gray-300 hover:text-white">Shipping Information</button></li>
              {/* <li><Link href="/returns" className="text-gray-300 hover:text-white">Returns & Exchanges</Link></li> */}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com" className="text-gray-300 hover:text-white" target="_blank" rel="noopener noreferrer">
                <SiFacebook className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com" className="text-gray-300 hover:text-white" target="_blank" rel="noopener noreferrer">
                <SiInstagram className="h-6 w-6" />
              </a>
            <a href="https://www.twitter.com" className="text-gray-300 hover:text-white" target="_blank" rel="noopener noreferrer">
              <SiGitter className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-300">
        <p>&copy; 2023 E-Shop. All rights reserved.</p>
      </div>
    </div>
    <Dialog open={openModal === 'contact'} onOpenChange={handleCloseModal}>
        <DialogContent className='bg-white'>
          <DialogHeader>
            <DialogTitle>Contact Us</DialogTitle>
            <DialogDescription>
              Get in touch with our customer support team.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p>Email: support@e-shop.com</p>
            <p>Phone: 1-800-123-4567</p>
            <p>Hours: Monday - Friday, 9am - 5pm EST</p>
          </div>
        </DialogContent>
      </Dialog><Dialog  open={openModal === 'faq'} onOpenChange={handleCloseModal}>
        <DialogContent className='bg-white'>
          <DialogHeader>
            <DialogTitle>Frequently Asked Questions</DialogTitle>
          </DialogHeader>
          <div className="mt-4 bg-white">
            <h4 className="font-semibold">How long does shipping take?</h4>
            <p>Standard shipping usually takes 3-5 business days.</p>
            <h4 className="font-semibold mt-2">What is your return policy?</h4>
            <p>We offer a 30-day return policy for most items.</p>
          </div>
        </DialogContent>
      </Dialog><Dialog open={openModal === 'shipping'} onOpenChange={handleCloseModal}>
        <DialogContent className='bg-white'>
          <DialogHeader>
            <DialogTitle>Shipping Information</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p>We offer the following shipping options:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Standard Shipping (3-5 business days)</li>
              <li>Express Shipping (1-2 business days)</li>
              <li>International Shipping (7-14 business days)</li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  )
}