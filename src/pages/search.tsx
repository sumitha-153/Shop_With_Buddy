'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface Product {
  id: number
  title: string
  brand: string
  rating: number
  price: number
  discountedPrice: number
  discountPercentage: number
  description: string
  shippingInformation: string
  returnPolicy: string
  images: string[]
}

const SkeletonLoader = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {[...Array(8)].map((_, i) => (
      <Card key={i} className="overflow-hidden">
        <CardContent className="p-4">
          <Skeleton className="w-full h-40 rounded-md mb-2" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-2/3 h-4" />
        </CardContent>
      </Card>
    ))}
  </div>
)

export default function SearchResults() {
  const router = useRouter()
  const { q } = router.query
  
  const [products, setProducts] = useState<Product[]>([])
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        setProducts(data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unknown error occurred')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    if (q && products.length > 0) {
      const filteredResults = products.filter(product =>
        product.title.toLowerCase().includes(Array.isArray(q) ? q[0].toLowerCase() : q.toLowerCase())
      )
      setSearchResults(filteredResults)
    } else {
      setSearchResults([])
    }
  }, [q, products])

  if (loading) return <SkeletonLoader />
  if (error) return <p className="text-center text-red-500">Error: {error}</p>

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h3 className="text-3xl font-bold mb-6 text-center">
        Search Results for "{q}"
      </h3>
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="relative h-48 mb-4">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    width={200}
                    height={200}
         
                    className="rounded-md"
                  />
                </div>
                <h2 className="text-xl font-semibold mb-2 line-clamp-1">
                  <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors duration-300">
                    {product.title}
                  </Link>
                </h2>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                  {/* <Button variant="outline" size="sm">Add to Cart</Button> */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No results found.</p>
      )}
    </div>
  )
}