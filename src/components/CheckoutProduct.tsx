// import { useEffect, useState } from 'react'
// import Image from 'next/image'
// import { Loader2, ShoppingCart } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { Skeleton } from '@/components/ui/skeleton';
// import Modal from './Modal'

// interface Product {
//   images: string[]
//   title: string
//   price: number
//   discountedPrice: number
// }

// interface ProductSummaryProps {
//   productId: string
//   quantity: number
//   totalCost: number
// }

// export default function ProductSummary({ productId, quantity, totalCost }: ProductSummaryProps) {
//   const [product, setProduct] = useState<Product | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [isModalOpen, setIsModalOpen] = useState(false)


//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await fetch(`/api/products/${productId}`)
//         if (!response.ok) {
//           throw new Error('Failed to fetch product')
//         }
//         const data = await response.json()
//         setProduct(data)
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'An unknown error occurred')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchProduct()
//   }, [productId])

//   if (loading) {
//     return (
//       <Card className="w-full max-w-md mx-auto">
//         <CardHeader>
//           <Skeleton className="h-8 w-3/4" />
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <Skeleton className="h-64 w-full" />
//           <Skeleton className="h-4 w-1/2" />
//           <Skeleton className="h-4 w-1/4" />
//         </CardContent>
//       </Card>
//     )
//   }

//   if (error) {
//     return (
//       <Card className="w-full max-w-md mx-auto">
//         <CardContent className="flex items-center justify-center h-64">
//           <p className="text-red-500">Error: {error}</p>
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <Card className="w-auto max-w-md mx-auto">
//       {product && (
//         <>
//           <CardHeader>
//             <CardTitle className="text-2xl font-bold">{product.title}</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4 flex flex-1">
//             <div className="relative h-64 w-full">
//             <img
//             src={product.images[0]}
//             alt={product.title}
//             className="w-32 h-32 object-cover rounded-md cursor-pointer"
//             onClick={() => setIsModalOpen(true)}
//           />
//             </div>
//             <div className='flex flex-col'>
//               <div className="flex justify-between items-center">
//                 <p className="text-lg font-bold">Quantity:{quantity}</p>
//               </div>
//               <div className="flex justify-between items-center">
//                 <p className="text-lg font-bold">Total Cost:${totalCost?.toFixed(2)}</p>
//               </div>
//             </div>
//           </CardContent>

//           <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//             <img
//               src={product.images[0]}
//               alt={product.title}
//               className="max-w-5xl max-h-96 object-cover rounded-md"
//             />
//           </Modal>
        
//         </>
//       )}
//     </Card>
//   )
// }


'use client'

import { useEffect, useState } from 'react'
// import Image from 'next/image'
import {  ZoomIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { motion } from 'framer-motion'

interface Product {
  images: string[]
  title: string
  price: number
  discountedPrice: number
}

interface ProductSummaryProps {
  readonly productId: string
  readonly quantity: number
  readonly totalCost: number
}

export default function ProductSummary({ productId, quantity, totalCost }: ProductSummaryProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex p-6 space-x-6">
          <Skeleton className="h-48 w-48 rounded-md" />
          <div className="space-y-4 flex-1">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!product) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-2xl mx-auto overflow-hidden">
        <CardContent className="p-6">
          <div className="flex space-x-6">
            <div className="relative w-48 h-48 flex-shrink-0">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="absolute right-2 top-2 p-2" size="icon">
                    <ZoomIn className="h-4 w-4" />
                    <span className="sr-only">Zoom image</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover rounded-md"
                  />
                </DialogContent>
              </Dialog>
              <img
                src={product.images[0]}
                alt={product.title}
                // layout="fill"
                // objectFit="cover"
                className="rounded-md"
              />
            </div>
            <div className="flex-1 space-y-4">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl font-bold line-clamp-2">{product.title}</CardTitle>
              </CardHeader>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                  <p className="text-lg font-semibold">{quantity}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-muted-foreground">Price per item</p>
                  <div className="text-lg font-medium text-gray-900">
          ${(Number(totalCost.toFixed(2)) / quantity).toFixed(2)}
        </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <p className="text-base font-medium">Total Cost</p>
                  <p className="text-xl font-bold">${totalCost.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}