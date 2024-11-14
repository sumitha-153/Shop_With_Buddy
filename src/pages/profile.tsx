
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SkeletonLoader from '../components/SkeletonLoader'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Phone, MapPin, Globe, Building, Home, CreditCard } from 'lucide-react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface shippingInfo {
  address: string
  city: string
  postalCode: string
  country: string
  state: string
}

interface UserData {
  name: string
  email: string
  phone: string
  shippingInfo: shippingInfo[]
  paymentInfo:{
    cardNumber:string
    expiryDate:string
    cvv:string
  }

}


const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'India', name: 'India' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
];

const states: { [key: string]: { code: string; name: string }[] } = {
  US: [
    { code: 'CA', name: 'California' },
    { code: 'NY', name: 'New York' },
    { code: 'TX', name: 'Texas' },
    { code: 'FL', name: 'Florida' },
    { code: 'IL', name: 'Illinois' },
  ],
  India: [
    { code: 'TN', name: 'Tamil Nadu' },
    { code: 'KA', name: 'Karnataka' },
    { code: 'MH', name: 'Maharashtra' },
  ],
};



export default function Profile() {
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [address, setAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    state: '',
  })
  const { userName } = useAuth()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [ShippingInfo, setShippingInfo] = useState<shippingInfo[]>([])
  const [defaultAddressIndex, setDefaultAddressIndex] = useState(0)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user?name=${encodeURIComponent(userName)}`)
        // if (!response.ok) {
        //   throw new Error('Failed to fetch user data')
        // }
        const data = await response.json()
        setUser(data)
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

    fetchUserData()
  }, [userName])


  const handleInputChange = (name: string, value: string) => {
    setAddress((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddAddress = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response =await fetch ('api/user', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          address: address.address,
          city: address.city,
          postalCode: address.postalCode,
          country: address.country,
          state: address.state,
        }),
    });
    const data = await response.json();
    setShippingInfo((prev)=>[...prev,data]);
    setIsAddingAddress(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
       
  };

  const handleDefaultAddressChange = (index: number) => {
    setDefaultAddressIndex(index);
  };
  console.log(user?.shippingInfo[0]?.address);
  

  if (loading) return <SkeletonLoader />
  if (error) return <p className="text-center text-red-500 mt-8">Error: {error}</p>

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="container flex-1 px-4 py-8 mx-auto">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center sm:flex-row sm:items-start">
                <Avatar className="w-24 h-24 mb-4 sm:mb-0 sm:mr-6">
                  <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.name}`} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0) || 'S'}</AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
                  <p className="text-gray-500 mb-4 flex items-center justify-center sm:justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    {user?.email}
                  </p>
                  {/* <Button>Edit Profile</Button> */}
                </div>
              </div>
            </CardContent>
          </Card>


          {isAddingAddress && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Add Address</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAddress} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={address.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Main St"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={address.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="New York"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={address.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  placeholder="10001"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={address.country}
                  onValueChange={(value) => handleInputChange('country', value)}
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
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State</Label>
                <Select
                  value={address.state}
                  onValueChange={(value) => handleInputChange('state', value)}
                  disabled={!address.country || !states[address.country]}
                >
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {address.country &&
                      states[address.country]?.map((state) => (
                        <SelectItem key={state.code} value={state.code}>
                          {state.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingAddress(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Address</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList>
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="shipping">Shipping Address</TabsTrigger>
              
            </TabsList>
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-3 text-gray-500" />
                    <span><strong>Name:</strong> {user?.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-3 text-gray-500" />
                    <span><strong>Email:</strong> {user?.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-gray-500" />
                    <span><strong>Phone:</strong> {user?.phone}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="shipping">
            {user?.shippingInfo?.length ?? 0 > 0 ? (
              <>
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold flex items-center gap-2 text-green-700">
                      <MapPin className="h-5 w-5" />
                      Default Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-600">
                    <p className="font-medium text-gray-800">{user?.shippingInfo[defaultAddressIndex]?.address}</p>
                    <p>{user?.shippingInfo[defaultAddressIndex]?.city}, {user?.shippingInfo[defaultAddressIndex]?.state} {user?.shippingInfo[defaultAddressIndex]?.postalCode}</p>
                    <p>{user?.shippingInfo[defaultAddressIndex]?.country}</p>
                  </CardContent>
                </Card>
                {user?.shippingInfo.map((info, index) => (
                  index !== defaultAddressIndex && (
                    <Card key={index} className="mb-4">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold flex items-center gap-2">
                          <input
                            type="radio"
                            name="defaultAddress"
                            checked={defaultAddressIndex === index}
                            onChange={() => handleDefaultAddressChange(index)}
                          />
                          Shipping Address {index + 1}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-gray-600">
                        <p className="font-medium text-gray-800">{info.address}</p>
                        <p>{info.city}, {info.state} {info.postalCode}</p>
                        <p>{info.country}</p>
                      </CardContent>
                    </Card>
                  )
                ))}
              </>
            ) : (
              <p>No shipping addresses found.</p>
            )}
 
              <Button onClick={() => setIsAddingAddress(true) }>Add Address</Button>
                          
              </TabsContent>
           </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}