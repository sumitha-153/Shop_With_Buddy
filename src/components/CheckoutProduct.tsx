import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Loader2, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton';
import Modal from './Modal'

interface Product {
  images: string[]
  title: string
  price: number
  discountedPrice: number
}

interface ProductSummaryProps {
  productId: string
  quantity: number
  totalCost: number
}

export default function ProductSummary({ productId, quantity, totalCost }: ProductSummaryProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch product')
        }
        const data = await response.json()
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      {product && (
        <>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{product.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative h-64 w-full">
            <img
            src={product.images[0]}
            alt={product.title}
            className="w-72 h-72 object-cover rounded-md cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold">Quantity:{quantity}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold">Total Cost:${totalCost?.toFixed(2)}</p>
              {/* <p className="text-lg font-bold text-green-600">${totalCost.toFixed(2)}</p> */}
            </div>
          </CardContent>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <img
              src={product.images[0]}
              alt={product.title}
              className="max-w-5xl max-h-96 object-cover rounded-md"
            />
          </Modal>
        
        </>
      )}
    </Card>
  )
}