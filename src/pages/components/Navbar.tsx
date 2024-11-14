import { useState } from 'react'
import Link from 'next/link'
import { Heart, ShoppingCart, Package, Search, Menu } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar({ isAuthenticated, toggleAuth, userName }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">Shop with your buddy</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/products">Products</Link>
          </nav>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="mr-2 px-0 text-base hover:bg-transparent focus:ring-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[300px] overflow-scroll">
            <DropdownMenuItem>
              <Link href="/">Shop with your buddy</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/products">Products</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex w-full items-center gap-4 md:w-auto">
          <form className="flex-1 md:flex-initial">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full bg-background pl-8 md:w-[300px] lg:w-[300px]"
              />
            </div>
          </form>
          <nav className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon">
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Favorites</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <Package className="h-4 w-4" />
                  <span className="sr-only">Orders</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="sr-only">Cart</span>
                </Button>
                <span className="hidden text-sm font-medium md:inline-block">Welcome, {userName}</span>
              </>
            ) : (
              <Button onClick={toggleAuth} variant="outline" className="hidden md:inline-flex">
                Login
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
} 