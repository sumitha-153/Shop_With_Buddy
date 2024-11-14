import { Button } from '@/components/ui/button'
import Navbar from './Navbar' 
import {useState} from 'react'
import Link from 'next/link'
import { Heart,ShoppingCart } from 'lucide-react'


export default function Component() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState('John')

  // Toggle authentication for demonstration
  const toggleAuth = () => {
    setIsAuthenticated(!isAuthenticated)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isAuthenticated={isAuthenticated} toggleAuth={toggleAuth} userName={userName} />
      <main className="flex-1">
        {/* Your main content goes here */}
        <div className="container py-6">
          <h1 className="text-2xl font-bold">Welcome to our Ecommerce Store</h1>
          <p className="mt-2">This is where your main content would go.</p>
          <Button onClick={toggleAuth} className="mt-4">
            {isAuthenticated ? 'Logout' : 'Login'}
          </Button>
        </div>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-4 py-6 md:flex-row md:items-center md:gap-6">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">© 2023 Shop with your buddy. All rights reserved.</p>
          </div>
          <nav className="flex gap-4 text-sm font-medium">
            <Link className="text-muted-foreground hover:underline" href="#">
              <Heart/>
            </Link>
            <Link className="text-muted-foreground hover:underline" href="#">
              <ShoppingCart/>
            </Link>
            <Link className="text-muted-foreground hover:underline" href="#">
              Orders
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
} 