
'use client'

import { useEffect, useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Package, Truck, CheckCircle, X, MapPin, FileText, Clock, CreditCard, ChevronRight } from 'lucide-react'
import Image from "next/image"
import { useAuth } from '../context/AuthContext'
import React from 'react'
import SkeletonLoader from '@/components/SkeletonLoader'

interface OrderItem {
  date: string
  price: number
  productId: number
  quantity: number
  title: string
  image: string
}

interface ShippingInfo {
  address: string
  city: string
  postalCode: string
  country: string
  state: string
}

interface UserData {
  shippingInfo: ShippingInfo
}

export default function UserOrdersPage() {
  const { userName } = useAuth()
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (!userName) return
      try {
        const [ordersResponse, userResponse] = await Promise.all([
          fetch(`/api/orders?name=${encodeURIComponent(userName)}`),
          fetch(`/api/user?name=${encodeURIComponent(userName)}`)
        ])

        if (!ordersResponse.ok || !userResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const [ordersData, userData] = await Promise.all([
          ordersResponse.json(),
          userResponse.json()
        ])

        setOrders(ordersData)
        setUserData(userData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userName])

  const TrackingStep = ({ step, label, isActive, isCompleted }: { step: number; label: string; isActive: boolean; isCompleted: boolean }) => (
    <div className={`flex items-center gap-3 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
      <div className={`
        flex items-center justify-center w-10 h-10 rounded-full border-2
        ${isCompleted ? 'bg-primary border-primary text-primary-foreground' : 
          isActive ? 'border-primary text-primary' : 
          'border-muted-foreground text-muted-foreground'}
      `}>
        {isCompleted ? <CheckCircle className="w-5 h-5" /> : step}
      </div>
      <span className={`text-lg ${isActive ? 'font-medium' : ''}`}>{label}</span>
    </div>
  )

  if (loading) return <SkeletonLoader/>
  if (error) return <div className="flex justify-center items-center h-screen"><p className="text-lg text-red-500">Error: {error}</p></div>
  if (!orders || orders.length === 0) return <div className="flex justify-center items-center h-screen"><p className="text-lg">No orders found.</p></div>

  return (
    <div className="max-w-[1200px] mx-auto py-12 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      
      {userData && userData.shippingInfo && (
        <Card className="mb-8 w-72 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold flex items-center gap-2 text-green-700">
              <MapPin className="h-5 w-5" />
              Default Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <p className="font-medium text-gray-800">{userData.shippingInfo.address}</p>
            <p>{userData.shippingInfo.city}, {userData.shippingInfo.state} {userData.shippingInfo.postalCode}</p>
            <p>{userData.shippingInfo.country}</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-8">
        {orders.map((order, index) => (
          <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="font-normal text-sm">
                      Processing
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9">
                        Track Order
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-white">
                      <DialogHeader>
                        <div className="flex justify-between items-center">
                          <DialogTitle className="text-2xl font-bold text-gray-800">
                            {order.title}
                          </DialogTitle>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            {/* <X className="h-4 w-4" /> */}
                          </Button>
                        </div>
                      </DialogHeader>
                      <div className="py-6">
                        <div className="space-y-8">
                          <TrackingStep
                            step={1}
                            label="Order Received"
                            isActive={true}
                            isCompleted={true}
                          />
                          <TrackingStep
                            step={2}
                            label="Processing"
                            isActive={true}
                            isCompleted={false}
                          />
                          <TrackingStep
                            step={3}
                            label="Shipped"
                            isActive={false}
                            isCompleted={false}
                          />
                          <TrackingStep
                            step={4}
                            label="Delivered"
                            isActive={false}
                            isCompleted={false}
                          />
                        </div>
                        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <h4 className="font-semibold mb-2 text-green-800">Estimated Delivery</h4>
                          <p className="text-sm text-green-600">
                            Your order is expected to arrive within 3-5 business days.
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg border bg-gray-50">
                  <img
                    src={order.image}
                    alt={order.title}
                    className="transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800">{order.title}</h3>
                  <div className="text-sm text-gray-600">
                    Quantity: {order.quantity}
                  </div>
                  <div className="text-lg font-medium text-gray-900">
                    ${order.price.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Total</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${order.price.toFixed(2)}
                  </div>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                {/* <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium text-gray-800">Visa •••• 4242</span>
                </div> */}
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-600">Delivery Method:</span>
                  <span className="font-medium text-gray-800">Standard Shipping</span>
                </div>
              </div>
            </CardContent>
            {/* <CardFooter className="bg-gray-50 py-4 px-6">
              <Button variant="link" className="ml-auto text-blue-600 hover:text-blue-800">
                View Details
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter> */}
          </Card>
        ))}
      </div>
    </div>
  )
}