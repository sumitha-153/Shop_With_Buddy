// import { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import SkeletonLoader from '../components/SkeletonLoader';

// interface User {
//   name: string;
//   email: string;
//   phone: string;
//   shippingInfo: {
//     address: string;
//     city: string;
//     postalCode: string;
//     country: string;
//     state: string;
//   };
// }

// export default function Profile() {
//   const { userName } = useAuth();
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch(`/api/user?name=${encodeURIComponent(userName)}`);
//         console.log("Profile response");
//         console.log(response);
        
//         //  if (!response.ok) {
//         //   throw new Error('Failed to fetch user data');
//         // }
//         const data = await response.json();
//         setUser(data);
//       } catch (err) {
//         if (err instanceof Error) {
//           setError(err.message);
//         } else {
//           setError('An unknown error occurred');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [userName]);

//   console.log("Profile user");
//   console.log(user);
//   console.log("________________________________________________________________");
  
//   console.log(user?.name);
//   console.log(user?.shippingInfo?.address);

//   if (loading) return <SkeletonLoader />;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div className="flex flex-col min-h-screen">
//       <main className="container flex-1 px-4 py-8 mx-auto">
//         <h1 className="text-3xl font-bold mb-6">Profile</h1>
//         {user && (
//           <div className="space-y-4">
//             <div>
//               <h2 className="text-xl font-semibold">Personal Information</h2>
//               <p><strong>Name:</strong> {user.name}</p>
//               <p><strong>Email:</strong> {user.email}</p>
//               <p><strong>Phone:</strong> {user.phone}</p>
//             </div>
//             <div>
//               <h2 className="text-xl font-semibold">Shipping Address</h2>
//               <p><strong>Address:</strong> {user.shippingInfo?.address}</p>
//               <p><strong>City:</strong> {user.shippingInfo?.city}</p>
//               <p><strong>Postal Code:</strong> {user.shippingInfo?.postalCode}</p>
//               <p><strong>Country:</strong> {user.shippingInfo?.country}</p>
//               <p><strong>State:</strong> {user.shippingInfo?.state}</p>
//             </div>
//           </div>
//         )}
//       </main>
//       <Footer />
//     </div>
//   );
// }



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

interface UserData {
  name: string
  email: string
  phone: string
  shippingInfo: {
    address: string
    city: string
    postalCode: string
    country: string
    state: string
  }
  paymentInfo:{
    cardNumber:string
    expiryDate:string
    cvv:string
  }

}

const maskCardNumber = (cardNumber: string) => {
    if (!cardNumber) return '';
    const lastThreeDigits = cardNumber.slice(-3);
    return `**** **** **** ${lastThreeDigits}`;
  };

export default function Profile() {
  const { userName } = useAuth()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList>
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="shipping">Shipping Address</TabsTrigger>
              <TabsTrigger value="payment">Payment Information</TabsTrigger>
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
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Home className="w-5 h-5 mr-3 text-gray-500" />
                    <span><strong>Address:</strong> {user?.shippingInfo?.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="w-5 h-5 mr-3 text-gray-500" />
                    <span><strong>City:</strong> {user?.shippingInfo?.city}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                    <span><strong>Postal Code:</strong> {user?.shippingInfo?.postalCode}</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 mr-3 text-gray-500" />
                    <span><strong>Country:</strong> {user?.shippingInfo?.country}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                    <span><strong>State:</strong> {user?.shippingInfo?.state}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-3 text-gray-500" />
                    <span><strong>Card Number:</strong> {maskCardNumber(user?.paymentInfo?.cardNumber || '')}</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-3 text-gray-500" />
                    <span><strong>Expiry Date:</strong> {user?.paymentInfo?.expiryDate}</span>
                  </div>
                  {/* <div className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-3 text-gray-500" />
                    <span><strong>CVV:</strong> {user?.paymentInfo?.cvv}</span>
                  </div> */}
                </CardContent>
              </Card>
              </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}