import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from 'react'
import { Star, ShoppingCart, Truck, RotateCcw } from 'lucide-react'

const product={
  
}

export default function ProductDetail() {
  const discountedPrice = product.price * (1 - product.discountPercentage / 100)
  
  // State to manage new review input
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' })
  const [reviews, setReviews] = useState(product.reviews)

  // Handle review submission
  const handleReviewSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (newReview.rating > 0 && newReview.comment) {
      const newReviewData = {
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString(),
        reviewerName: "Anonymous", 
        reviewerEmail: "anonymous@example.com" 
      }
      setReviews([...reviews, newReviewData])
      setNewReview({ rating: 0, comment: '' }) // Reset the form
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img src={product.images[0]} alt={product.title} className="w-full h-auto rounded-lg shadow-md" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.brand}</p>
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
            <span className="ml-2 text-gray-600">({product.rating.toFixed(1)})</span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-2">${discountedPrice.toFixed(2)}</p>
          <p className="text-gray-500 line-through mb-4">${product.price.toFixed(2)}</p>
          <p className="text-green-600 font-semibold mb-4">You save ${(product.price - discountedPrice).toFixed(2)} ({product.discountPercentage.toFixed(0)}% off)</p>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <button className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center mb-4">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </button>
          <div className="border-t border-gray-200 pt-4">
            <p className="flex items-center text-gray-600 mb-2">
              <Truck className="w-5 h-5 mr-2" />
              {product.shippingInformation}
            </p>
            <p className="flex items-center text-gray-600 mb-2">
              <RotateCcw className="w-5 h-5 mr-2" />
              {product.returnPolicy}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Details</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p><strong>SKU:</strong> {product.sku}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Tags:</strong> {product.tags.join(', ')}</p>
            <p><strong>Weight:</strong> {product.weight} oz</p>
          </div>
          <div>
            <p><strong>Dimensions:</strong> {product.dimensions.width}" x {product.dimensions.height}" x {product.dimensions.depth}"</p>
            <p><strong>Warranty:</strong> {product.warrantyInformation}</p>
            <p><strong>Availability:</strong> {product.availabilityStatus}</p>
            <p><strong>Minimum Order:</strong> {product.minimumOrderQuantity} units</p>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
        {reviews.map((review: { rating: number; comment: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; reviewerName: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; date: string | number | Date }, index: Key | null | undefined) => (
          <div key={index} className="border-b border-gray-200 py-4">
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <p className="text-gray-700 mb-2">{review.comment}</p>
            <p className="text-gray-600 text-sm">
              {review.reviewerName} - {new Date(review.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add a Review</h2>
        <form onSubmit={handleReviewSubmit} className="mb-4">
          <div className="flex items-center mb-4">
            <label className="mr-2">Rating:</label>
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
              className="border rounded-md p-2"
            >
              <option value={0}>Select Rating</option>
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>{star}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Write your review here..."
              className="border rounded-md p-2 w-full"
              rows="4"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  )
} 