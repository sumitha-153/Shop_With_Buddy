
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { CreditCard, MapPin, Info, ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/context/AuthContext'
import ProductSummary from '@/components/CheckoutProduct'

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'IN', name: 'India' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
]

const states = {
  US: [
    { code: 'CA', name: 'California' },
    { code: 'NY', name: 'New York' },
    { code: 'TX', name: 'Texas' },
    { code: 'FL', name: 'Florida' },
    { code: 'IL', name: 'Illinois' },
  ],
  IN: [
    { code: 'TN', name: 'Tamil Nadu' },
    { code: 'KA', name: 'Karnataka' },
    { code: 'MH', name: 'Maharashtra' },
  ],
}

export default function Checkout() {
  const router = useRouter()
  const { userName } = useAuth()
  const [productId, setProductId] = useState<string | null>(null)
  const [product, setProduct] = useState<{
    images: string[],
    title: string,
    brand: string,
    rating: number,
    price: number,
    discountedPrice: number,
    discountPercentage: number,
    description: string,
    shippingInformation: string,
    returnPolicy: string,
  } | null>(null)

  const [shippingInfo, setShippingInfo] = useState<{ address: string, city: string, postalCode: string, country: string, state: string }[]>([])
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isEditingShipping, setIsEditingShipping] = useState(false)
  const [isEditingPayment, setIsEditingPayment] = useState(false)
  const [totalCost, setTotalCost] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(1)
  const [currentStep, setCurrentStep] = useState(1)
  const [defaultAddressIndex, setDefaultAddressIndex] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const productIdFromUrl = searchParams.get('productId')
      const quantityFromUrl = searchParams.get('quantity')
      const totalCostFromUrl = searchParams.get('totalCost')
      if (productIdFromUrl) setProductId(productIdFromUrl)
      if (quantityFromUrl) setQuantity(parseInt(quantityFromUrl, 10))
      if (totalCostFromUrl) setTotalCost(parseFloat(totalCostFromUrl))
    }
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user?name=${encodeURIComponent(userName)}`)
        const data = await response.json()
        if (data.shippingInfo) setShippingInfo(data.shippingInfo)
        if (data.paymentInfo) setPaymentInfo(data.paymentInfo)
      } catch (err) {
        console.error('Failed to fetch user data:', err)
      }
    }

    fetchUserData()
  }, [userName])

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api/products/${productId}`)
          if (!response.ok) {
            throw new Error('Failed to fetch product')
          }
          const data = await response.json()
          setProduct(data)
        } catch (err) {
          console.error('Failed to fetch product:', err)
        }
      }

      fetchProduct()
    }
  }, [productId])

  const handleInputChange = (name: string, value: string, index?: number) => {
    if (index !== undefined) {
      setShippingInfo((prevState) => {
        const updatedShippingInfo = Array.isArray(prevState) ? [...prevState] : []
        updatedShippingInfo[index] = { ...updatedShippingInfo[index], [name]: value }
        return updatedShippingInfo
      })
    } else {
      setPaymentInfo((prevState) => ({ ...prevState, [name]: value }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!shippingInfo[defaultAddressIndex]?.address) newErrors.address = 'Address is required.'
    if (!shippingInfo[defaultAddressIndex]?.city) newErrors.city = 'City is required.'
    if (!shippingInfo[defaultAddressIndex]?.postalCode) newErrors.postalCode = 'Postal code is required.'
    if (!shippingInfo[defaultAddressIndex]?.country) newErrors.country = 'Country is required.'
    if (!shippingInfo[defaultAddressIndex]?.state) newErrors.state = 'State is required.'
    if (!paymentInfo.cardNumber) newErrors.cardNumber = 'Card number is required.'
    else if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(paymentInfo.cardNumber)) newErrors.cardNumber = 'Card number must be in the format 1234 5678 9012 3456.'
    if (!paymentInfo.expiryDate) newErrors.expiryDate = 'Expiry date is required.'
    else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) newErrors.expiryDate = 'Expiry date must be in the format MM/YY.'
    if (!paymentInfo.cvv) newErrors.cvv = 'CVV is required.'
    else if (!/^\d{3}$/.test(paymentInfo.cvv)) newErrors.cvv = 'CVV must be a 3-digit number.'
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          productId: parseInt(productId as string, 10),
          shippingInfo: shippingInfo[defaultAddressIndex],
          quantity,
          totalCost,
          paymentInfo,
          image: product?.images[0],
          status: 'Processing',
        }),
      })
      if (!response.ok) throw new Error('Failed to place order')
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Order placed successfully!')
      router.push('/orders')
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Failed to place order.')
    }
  }

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, shippingInfo, paymentInfo }),
      })
      toast.success('Information updated successfully!')
      setIsEditingShipping(false)
      setIsEditingPayment(false)
      router.replace({ pathname: '/checkout', query: { productId: productId ?? '' } })
    } catch (error) {
      console.error('Update info error:', error)
      toast.error('Failed to update information.')
    }
  }

  const handleNextStep = () => setCurrentStep((prevStep) => prevStep + 1)
  const handlePreviousStep = () => setCurrentStep((prevStep) => prevStep - 1)

  const handleDefaultAddressChange = (index: number) => {
    setDefaultAddressIndex(index)
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          address: shippingInfo[defaultAddressIndex].address,
          city: shippingInfo[defaultAddressIndex].city,
          postalCode: shippingInfo[defaultAddressIndex].postalCode,
          country: shippingInfo[defaultAddressIndex].country,
          state: shippingInfo[defaultAddressIndex].state,
        }),
      })
      const data = await response.json()
      setShippingInfo((prev) => [...prev, data])
      setIsEditingShipping(false)
    } catch (error) {
      console.error('Failed to add address:', error)
      toast.error('Failed to add address.')
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <MapPin className="w-6 h-6 mb-2" />
              <span className="text-sm">Shipping</span>
            </div>
            <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <CreditCard className="w-6 h-6 mb-2" />
              <span className="text-sm">Payment</span>
            </div>
            <div className={`flex flex-col items-center ${currentStep === 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <Info className="w-6 h-6 mb-2" />
              <span className="text-sm">Summary</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            {!isEditingShipping ? (
              <div className="space-y-2">
                <CardContent className="text-sm text-gray-600">
                  <p className="font-medium text-gray-800">{shippingInfo[defaultAddressIndex]?.address}</p>
                  <p>{shippingInfo[defaultAddressIndex]?.city}, {shippingInfo[defaultAddressIndex]?.state} {shippingInfo[defaultAddressIndex]?.postalCode}</p>
                  <p>{shippingInfo[defaultAddressIndex]?.country}</p>
                </CardContent>
                <Button variant="outline" onClick={() => setIsEditingShipping(true)}>Change Address</Button>
              </div>
            ) : (
              <form onSubmit={handleUpdateInfo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={shippingInfo[defaultAddressIndex]?.address}
                    onChange={(e) => handleInputChange('address', e.target.value, defaultAddressIndex)}
                    placeholder="123 Main St"
                    required
                  />
                  {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={shippingInfo[defaultAddressIndex]?.city}
                    onChange={(e) => handleInputChange('city', e.target.value, defaultAddressIndex)}
                    placeholder="New York"
                    required
                  />
                  {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={shippingInfo[defaultAddressIndex]?.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value, defaultAddressIndex)}
                    placeholder="10001"
                    required
                  />
                  {errors.postalCode && <p className="text-sm text-red-500">{errors.postalCode}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={shippingInfo[defaultAddressIndex]?.country}
                    onValueChange={(value) => handleInputChange('country', value, defaultAddressIndex)}
                  >
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select
                    value={shippingInfo[defaultAddressIndex]?.state}
                    onValueChange={(value) => handleInputChange('state', value, defaultAddressIndex)}
                    disabled={!shippingInfo[defaultAddressIndex]?.country || !states[shippingInfo[defaultAddressIndex]?.country as keyof typeof states]}
                  >
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {shippingInfo[defaultAddressIndex]?.country &&
                        states[shippingInfo[defaultAddressIndex]?.country as keyof typeof states]?.map((state) => (
                          <SelectItem key={state.code} value={state.code}>
                            {state.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setIsEditingShipping(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update</Button>
                </div>
              </form>
            )}
          </CardContent>
          {!isEditingShipping && (
            <CardFooter className="flex justify-end">
              <Button onClick={handleNextStep}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          )}
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateInfo} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  value={paymentInfo.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  required
                />
                {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  value={paymentInfo.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  placeholder="MM/YY"
                  required
                />
                {errors.expiryDate && <p className="text-sm text-red-500">{errors.expiryDate}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  name="cvv"
                  value={paymentInfo.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  placeholder="123"
                  required
                />
                {errors.cvv && <p className="text-sm text-red-500">{errors.cvv}</p>}
              </div>
            </form>
          </CardContent>
          {!isEditingPayment && (
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousStep}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNextStep}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          )}
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {productId && <ProductSummary productId={productId} quantity={quantity} totalCost={totalCost} />}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePreviousStep}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleSubmit}>
              Place Order
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}