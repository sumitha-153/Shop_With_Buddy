import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Star, Truck, RotateCcw, Minus,Plus,ChevronLeft,ChevronRight} from 'lucide-react';
import SkeletonLoader from '../../components/SkeletonLoader';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { userName } = useAuth();
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
    reviews?: { rating: number, comment: string, date: string, reviewerName: string }[]
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [reviews, setReviews] = useState<{ rating: number, comment: string, date: string, reviewerName: string }[]>([]);

 
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  const [quantity, setQuantity] = useState(1); 
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api/products/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch product');
          }
          const data = await response.json();
          setProduct(data);
          setReviews(data.reviews || []);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unknown error occurred');
          }
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newReview.rating > 0 && newReview.comment) {
      try {
        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: parseInt(id as string, 10),
            rating: newReview.rating,
            comment: newReview.comment,
            reviewerName: userName,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit review');
        }

        const updatedProduct = await response.json();
        console.log(updatedProduct);
        
        setReviews([...reviews, { ...newReview, date: new Date().toISOString(), reviewerName: userName }]);
        setNewReview({ rating: 0, comment: '' });
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please fill in all fields');
    }
  };

  const handlePlaceOrder = async () => {
    router.push(`/checkout?productId=${id}&totalCost=${totalCost}&quantity=${quantity}`);
  };

  const handleIncreaseQuantity = () => {
  
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };
  

   const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % (product?.images?.length ?? 1));
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + (product?.images?.length ?? 1)) % (product?.images?.length ?? 1));
  };

  const totalCost = product ? (product.discountedPrice ?? product.price) * quantity : 0;

  if (loading) return <SkeletonLoader />;
  if (error) return <p className="text-center text-red-500 mt-8">Error: {error}</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="container flex-1 px-4 py-8 mx-auto max-w-7xl">
      <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            {product && (
              <div className="relative">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.title}
                  width={300}
                  height={300}
                  className="object-cover w-full rounded-lg shadow-lg aspect-square"
                />
                {product.images.length > 1 && (
                  <>
                    <Button onClick={handlePreviousImage} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md">
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button onClick={handleNextImage} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md">
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </>
                )}
              </div>
            )}
            <div className="grid grid-cols-4 gap-2">
              {product?.images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`object-cover w-full rounded-lg shadow-lg aspect-square cursor-pointer ${index === currentImageIndex ? 'border-2 border-blue-500' : ''}`}
                >
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            {product && (
              <>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                  <p className="text-lg text-gray-600">{product.brand}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                  <span className="text-sm text-gray-600">({product.rating.toFixed(1)})</span>
                </div>
                <div>
                  {product?.discountedPrice !== undefined && product?.price !== undefined && product?.discountPercentage !== undefined ? (
                    <>
                      <p className="text-3xl font-bold text-gray-900">${product.discountedPrice.toFixed(2)}</p>
                      <p className="text-lg text-gray-500 line-through">${product.price.toFixed(2)}</p>
                      <p className="text-sm font-semibold text-green-600">
                        You save ${(product.price - product.discountedPrice).toFixed(2)} ({product.discountPercentage.toFixed(0)}% off)
                      </p>
                    </>
                  ) : (
                    <p className="text-3xl font-bold text-gray-900">${product?.price?.toFixed(2)}</p>
                  )}
                </div>
                <p className="text-gray-700">{product?.description}</p>
                <div className="flex items-center space-x-4">
                <Button onClick={handleDecreaseQuantity} className="bg-orange-200 hover:bg-orange-500 hover:text-none">
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-lg">{quantity}</span>
                <Button onClick={handleIncreaseQuantity} className="bg-blue-600 hover:bg-blue-800 hover:text-none">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-4">
                <Button onClick={handlePlaceOrder} className="bg-green-800 text-white px-4 py-2 rounded-md">
                  Buy now
                </Button>
                <span className="text-xl font-semibold text-gray-900">Total: ${totalCost.toFixed(2)}</span>
              </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Truck className="w-5 h-5" />
                    <p>{product?.shippingInformation}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <RotateCcw className="w-5 h-5" />
                    <p>{product?.returnPolicy}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <Separator className="my-12" />
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </CardTitle>
                  <CardDescription>{review.reviewerName} - {new Date(review.date).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Write a Review</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Rating</label>
                  <Select
                    value={newReview.rating.toString()}
                    onValueChange={(value) => setNewReview({ ...newReview, rating: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <SelectItem key={star} value={star.toString()}>{star} Star{star !== 1 ? 's' : ''}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="comment" className="text-sm font-medium text-gray-700">Your Review</label>
                  <Textarea
                    id="comment"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Write your review here..."
                    rows={4}
                  />
                </div>
                <Button type="submit">Submit Review</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
