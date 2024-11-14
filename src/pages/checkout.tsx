// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/router'
// import { toast } from 'react-toastify'
// import { CreditCard, MapPin,Info } from 'lucide-react'

// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Separator } from '@/components/ui/separator'
// import { useAuth } from '@/context/AuthContext'
// import ProductSummary from '@/components/CheckoutProduct'

// const countries = [
//   { code: 'US', name: 'United States' },
//   { code: 'CA', name: 'Canada' },
//   { code: 'GB', name: 'United Kingdom' },
//   { code: 'AU', name: 'Australia' },
//   { code: 'IN', name: 'India' },
//   { code: 'DE', name: 'Germany' },
//   { code: 'FR', name: 'France' },
// ]

// const states = {
//   US: [
//     { code: 'CA', name: 'California' },
//     { code: 'NY', name: 'New York' },
//     { code: 'TX', name: 'Texas' },
//     { code: 'FL', name: 'Florida' },
//     { code: 'IL', name: 'Illinois' },
//   ],
//   IN: [
//     { code: 'TN', name: 'Tamil Nadu' },
//     { code: 'KA', name: 'Karnataka' },
//     { code: 'MH', name: 'Maharashtra' },
//   ],
// }

// export default function Checkout() {
//   const router = useRouter()
//   const { userName } = useAuth()
//   const [productId, setProductId] = useState<string | null>(null)
//   const [shippingInfo, setShippingInfo] = useState({
//     address: '',
//     city: '',
//     postalCode: '',
//     country: '',
//     state: '',
//   })
//   const [paymentInfo, setPaymentInfo] = useState({
//     cardNumber: '',
//     expiryDate: '',
//     cvv: '',
//   })
//   const [errors, setErrors] = useState<{ [key: string]: string }>({})
//   const [isEditingShipping, setIsEditingShipping] = useState(false)
//   const [isEditingPayment, setIsEditingPayment] = useState(false)
//   const [totalCost, setTotalCost] = useState<number>(0)
//   const [quantity, setQuantity] = useState<number>(1)
//   const [currentStep, setCurrentStep] = useState(1)


  
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const searchParams = new URLSearchParams(window.location.search)
//       const productIdFromUrl = searchParams.get('productId')
//       const quantityFromUrl = searchParams.get('quantity')
//       const totalCostFromUrl = searchParams.get('totalCost')
//       if (productIdFromUrl) {
//         setProductId(productIdFromUrl)
//       }
//       if (quantityFromUrl) {
//         setQuantity(parseInt(quantityFromUrl, 10))
//       }
//       if (totalCostFromUrl) {
//         setTotalCost(parseFloat(totalCostFromUrl))
//       }
//     }
//   }, [])

//   console.log("Quantity");
//   console.log(quantity);
  
  

//   useEffect(() => {
//        const fetchUserData = async () => {
//       try {
//         const response = await fetch(`/api/user?name=${encodeURIComponent(userName)}`)
//         // if (!response.ok) {
//         //   throw new Error('Failed to fetch user data')
//         // }
//         const data = await response.json()
//         if (data.shippingInfo) {
//           setShippingInfo(data.shippingInfo)
//         }
//         if (data.paymentInfo) {
//           setPaymentInfo(data.paymentInfo)
//         }
//       } catch (err) {
//         console.error('Failed to fetch user data:', err)
//       }
//     }

//     fetchUserData()
//   }, [userName])

//   const handleInputChange = (name: string, value: string, setState: React.Dispatch<React.SetStateAction<any>>) => {
//     setState((prevState: any) => ({ ...prevState, [name]: value }))
//   }

//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {}
//     if (!shippingInfo.address) newErrors.address = 'Address is required.'
//     if (!shippingInfo.city) newErrors.city = 'City is required.'
//     if (!shippingInfo.postalCode) newErrors.postalCode = 'Postal code is required.'
//     if (!shippingInfo.country) newErrors.country = 'Country is required.'
//     if (!shippingInfo.state) newErrors.state = 'State is required.'
//     if (!paymentInfo.cardNumber) newErrors.cardNumber = 'Card number is required.'
//     if (!paymentInfo.expiryDate) newErrors.expiryDate = 'Expiry date is required.'
//     if (!paymentInfo.cvv) newErrors.cvv = 'CVV is required.'
//     return newErrors
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const validationErrors = validateForm()
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors)
//       return
//     }
//     console.log("Product id:");
//     console.log(parseInt(productId as string, 10));

//     try {
//       const response = await fetch('/api/orders', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userName,
//           productId: parseInt(productId as string, 10),
//           shippingInfo,
//           quantity,
//           totalCost,
//           paymentInfo,
//         }),
//       })
//       if (!response.ok) {
//         throw new Error('Failed to place order')
//       }
//       await new Promise((resolve) => setTimeout(resolve, 1000))
//       toast.success('Order placed successfully!')
//       router.push('/orders')
//     } catch (error) {
//       console.error('Checkout error:', error)
//       toast.error('Failed to place order.')
//     }
//   }

//   const handleUpdateInfo = async (e:React.FormEvent) => {
//     e.preventDefault()
//     try {
//       const response = await fetch('/api/user', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userName,
//           shippingInfo,
//           paymentInfo,
//         }),
//       })
//       console.log("Response:");
//       console.log(response);

//       toast.success('Information updated successfully!')
//       setIsEditingShipping(false)
//       setIsEditingPayment(false)
//       router.replace({
//         pathname: '/checkout',
//         query: { productId: productId ?? '', 
//           // quantity: quantity.toString(),
//           // totalCost: totalCost.toString(),
//         },

//       })

//     } catch (error) {
//       console.error('Update info error:', error)
//       toast.error('Failed to update information.')
//     }
//   }

//   const handleNextStep = () => {
//     setCurrentStep((prevStep) => prevStep + 1)
//   }

//   const handlePreviousStep = () => {
//     setCurrentStep((prevStep) => prevStep - 1)
//   }

//   return (
//     <div className="container mx-auto p-6 max-w-3xl">
//       <div className="flex items-center justify-between mb-6">
//         <div className={`flex items-center ${currentStep === 1 ? 'text-blue-600' : 'text-gray-400'}`}>
//           <MapPin className="w-6 h-6" />
//           <span className="ml-2">Shipping Info</span>
//         </div>
//         <div className={`flex items-center ${currentStep === 2 ? 'text-blue-600' : 'text-gray-400'}`}>
//           <CreditCard className="w-6 h-6" />
//           <span className="ml-2">Payment Info</span>
//         </div>
//         <div className={`flex items-center ${currentStep === 3 ? 'text-blue-600' : 'text-gray-400'}`}>
//           <Info className="w-6 h-6" />
//           <span className="ml-2">Details</span>
//         </div>
//       </div>

//       {currentStep === 1 && (
//         <div className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Shipping Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-2">
//               {!isEditingShipping ? (
//                 <>
//                   <p><strong>Address:</strong> {shippingInfo.address}</p>
//                   <p><strong>City:</strong> {shippingInfo.city}</p>
//                   <p><strong>Postal Code:</strong> {shippingInfo.postalCode}</p>
//                   <p><strong>Country:</strong> {shippingInfo.country}</p>
//                   <p><strong>State:</strong> {shippingInfo.state}</p>
//                   <Button variant="outline" onClick={() => setIsEditingShipping(true)}>Change Address</Button>
//                 </>
//               ) : (
//                 <form onSubmit={handleUpdateInfo} className="space-y-4">
//                   <div className="grid gap-2">
//                     <Label htmlFor="address">Address</Label>
//                     <Input
//                       id="address"
//                       name="address"
//                       value={shippingInfo.address}
//                       onChange={(e) => handleInputChange('address', e.target.value, setShippingInfo)}
//                       placeholder="123 Main St"
//                       required
//                     />
//                     {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor="city">City</Label>
//                     <Input
//                       id="city"
//                       name="city"
//                       value={shippingInfo.city}
//                       onChange={(e) => handleInputChange('city', e.target.value, setShippingInfo)}
//                       placeholder="New York"
//                       required
//                     />
//                     {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor="postalCode">Postal Code</Label>
//                     <Input
//                       id="postalCode"
//                       name="postalCode"
//                       value={shippingInfo.postalCode}
//                       onChange={(e) => handleInputChange('postalCode', e.target.value, setShippingInfo)}
//                       placeholder="10001"
//                       required
//                     />
//                     {errors.postalCode && <p className="text-sm text-red-500">{errors.postalCode}</p>}
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor="country">Country</Label>
//                     <Select
//                       value={shippingInfo.country}
//                       onValueChange={(value) => handleInputChange('country', value, setShippingInfo)}
//                     >
//                       <SelectTrigger id="country">
//                         <SelectValue placeholder="Select Country" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {countries.map((country) => (
//                           <SelectItem key={country.code} value={country.code}>
//                             {country.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor="state">State</Label>
//                     <Select
//                       value={shippingInfo.state}
//                       onValueChange={(value) => handleInputChange('state', value, setShippingInfo)}
//                       disabled={!shippingInfo.country || !states[shippingInfo.country as keyof typeof states]}
//                     >
//                       <SelectTrigger id="state">
//                         <SelectValue placeholder="Select State" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {shippingInfo.country &&
//                           states[shippingInfo.country as keyof typeof states]?.map((state) => (
//                             <SelectItem key={state.code} value={state.code}>
//                               {state.name}
//                             </SelectItem>
//                           ))}
//                       </SelectContent>
//                     </Select>
//                     {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
//                   </div>
//                   <CardFooter className="flex justify-between">
//                     <Button variant="outline" onClick={() => setIsEditingShipping(false)}>
//                       Cancel
//                     </Button>
//                     <Button type="submit">Update</Button>
//                   </CardFooter>
//                 </form>
//               )}
//             </CardContent>
//           </Card>
//           {!isEditingShipping && (
//             <CardFooter className="flex justify-between">
//               <Button variant="outline" onClick={handlePreviousStep}>
//                 Back
//               </Button>
//               <Button onClick={handleNextStep}>Next</Button>
//             </CardFooter>
//           )}
//         </div>
//       )}

//       {currentStep === 2 && (
//         <div className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Payment Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-2">
//               {!isEditingPayment ? (
//                 <>
//                   <p><strong>Card Number:</strong> **** **** **** {paymentInfo.cardNumber.slice(-4)}</p>
//                   <p><strong>Expiry Date:</strong> {paymentInfo.expiryDate}</p>
//                   <p><strong>CVV:</strong> {paymentInfo.cvv}</p>
//                   <Button variant="outline" onClick={() => setIsEditingPayment(true)}>Change Payment Info</Button>
//                 </>
//               ) : (
//                 <form onSubmit={handleUpdateInfo} className="space-y-4">
//                   <div className="grid gap-2">
//                     <Label htmlFor="cardNumber">Card Number</Label>
//                     <Input
//                       id="cardNumber"
//                       name="cardNumber"
//                       value={paymentInfo.cardNumber}
//                       onChange={(e) => handleInputChange('cardNumber', e.target.value, setPaymentInfo)}
//                       placeholder="1234 5678 9012 3456"
//                       required
//                     />
//                     {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber}</p>}
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor="expiryDate">Expiry Date</Label>
//                     <Input
//                       id="expiryDate"
//                       name="expiryDate"
//                       value={paymentInfo.expiryDate}
//                       onChange={(e) => handleInputChange('expiryDate', e.target.value, setPaymentInfo)}
//                       placeholder="MM/YY"
//                       required
//                     />
//                     {errors.expiryDate && <p className="text-sm text-red-500">{errors.expiryDate}</p>}
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor="cvv">CVV</Label>
//                     <Input
//                       id="cvv"
//                       name="cvv"
//                       value={paymentInfo.cvv}
//                       onChange={(e) => handleInputChange('cvv', e.target.value, setPaymentInfo)}
//                       placeholder="123"
//                       required
//                     />
//                     {errors.cvv && <p className="text-sm text-red-500">{errors.cvv}</p>}
//                   </div>
//                   <CardFooter className="flex justify-between">
//                     <Button variant="outline" onClick={() => setIsEditingPayment(false)}>
//                       Cancel
//                     </Button>
//                     <Button type="submit">Update</Button>
//                   </CardFooter>
//                 </form>
//               )}
//             </CardContent>
//           </Card>
//           {!isEditingPayment && (
//             <CardFooter className="flex justify-between">
//               <Button variant="outline" onClick={handlePreviousStep}>
//                 Back
//               </Button>
//               <Button onClick={handleNextStep}>Next</Button>
//             </CardFooter>
//           )}
//         </div>
//       )}

//           {currentStep === 3 && (
//         <>{productId && <ProductSummary productId={productId} quantity={quantity} totalCost={totalCost} />}</>
//       )}


//     </div>
//   )
// }






'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { CreditCard, MapPin, Info, ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/context/AuthContext'
import ProductSummary from '@/components/CheckoutProduct'

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'India', name: 'India' },
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
  India: [
    { code: 'Tamil Nadu', name: 'Tamil Nadu' },
    { code: 'Karnataka', name: 'Karnataka' },
    { code: 'Maharastara', name: 'Maharashtra' },
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


  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    state: '',
  })
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





  const handleInputChange = (name: string, value: string, setState: React.Dispatch<React.SetStateAction<any>>) => {
    setState((prevState: any) => ({ ...prevState, [name]: value }))
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!shippingInfo.address) newErrors.address = 'Address is required.'
    if (!shippingInfo.city) newErrors.city = 'City is required.'
    if (!shippingInfo.postalCode) newErrors.postalCode = 'Postal code is required.'
    if (!shippingInfo.country) newErrors.country = 'Country is required.'
    if (!shippingInfo.state) newErrors.state = 'State is required.'
    if (!paymentInfo.cardNumber) newErrors.cardNumber = 'Card number is required.'
    if (!paymentInfo.expiryDate) newErrors.expiryDate = 'Expiry date is required.'
    if (!paymentInfo.cvv) newErrors.cvv = 'CVV is required.'
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
          shippingInfo,
          quantity,
          totalCost,
          paymentInfo,
          image:product?.images[0],
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
                <p><strong>Address:</strong> {shippingInfo.address}</p>
                <p><strong>City:</strong> {shippingInfo.city}</p>
                <p><strong>Postal Code:</strong> {shippingInfo.postalCode}</p>
                <p><strong>Country:</strong> {shippingInfo.country}</p>
                <p><strong>State:</strong> {shippingInfo.state}</p>
                <Button variant="outline" onClick={() => setIsEditingShipping(true)}>Change Address</Button>
              </div>
            ) : (
              <form onSubmit={handleUpdateInfo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value, setShippingInfo)}
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
                    value={shippingInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value, setShippingInfo)}
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
                    value={shippingInfo.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value, setShippingInfo)}
                    placeholder="10001"
                    required
                  />
                  {errors.postalCode && <p className="text-sm text-red-500">{errors.postalCode}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={shippingInfo.country}
                    onValueChange={(value) => handleInputChange('country', value, setShippingInfo)}
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
                    value={shippingInfo.state}
                    onValueChange={(value) => handleInputChange('state', value, setShippingInfo)}
                    disabled={!shippingInfo.country || !states[shippingInfo.country as keyof typeof states]}
                  >
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {shippingInfo.country &&
                        states[shippingInfo.country as keyof typeof states]?.map((state) => (
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
            {!isEditingPayment ? (
              <div className="space-y-2">
                <p><strong>Card Number:</strong> **** **** **** {paymentInfo.cardNumber.slice(-4)}</p>
                <p><strong>Expiry Date:</strong> {paymentInfo.expiryDate}</p>
                <p><strong>CVV:</strong> ***</p>
                <Button variant="outline" onClick={() => setIsEditingPayment(true)}>Change Payment Info</Button>
              </div>
            ) : (
              <form onSubmit={handleUpdateInfo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value, setPaymentInfo)}
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
                    onChange={(e) => handleInputChange('expiryDate', e.target.value, setPaymentInfo)}
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
                    onChange={(e) => handleInputChange('cvv', e.target.value, setPaymentInfo)}
                    placeholder="123"
                    required
                  />
                  {errors.cvv && <p className="text-sm text-red-500">{errors.cvv}</p>}
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setIsEditingPayment(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update</Button>
                </div>
              </form>
            )}
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