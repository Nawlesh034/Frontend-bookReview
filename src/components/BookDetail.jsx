import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";

function BookDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Review form state
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewData, setReviewData] = useState({
        rating: 5,
        review: ''
    });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');

    // Fetch book details and reviews
    useEffect(() => {
        const fetchBookData = async () => {
            setLoading(true);
            setError('');

            try {
                // Since there's no single book endpoint, we'll get all books and find the one we need
                const booksResponse = await axios.get(`${API_BASE_URL}/`);
                const foundBook = booksResponse.data.books.find(b => b._id === id);

                if (!foundBook) {
                    setError('Book not found');
                    return;
                }

                setBook(foundBook);

                // Fetch reviews for this book
                const reviewsResponse = await axios.get(`${API_BASE_URL}/book/${id}/reviews`);
                setReviews(reviewsResponse.data);

            } catch (err) {
                setError('Failed to fetch book details');
                console.error('Error fetching book data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBookData();
        }
    }, [id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        setReviewError('');
        setReviewSuccess('');

        try {
            await axios.post(`${API_BASE_URL}/review`, {
                bookId: id,
                rating: reviewData.rating,
                review: reviewData.review
            }, {
                withCredentials: true
            });

            setReviewSuccess('Review added successfully!');
            setReviewData({ rating: 5, review: '' });
            setShowReviewForm(false);

            // Refresh reviews
            const reviewsResponse = await axios.get(`${API_BASE_URL}/book/${id}/reviews`);
            setReviews(reviewsResponse.data);

        } catch (err) {
            setReviewError(err.response?.data?.message || 'Failed to add review');
        } finally {
            setSubmittingReview(false);
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <span
                key={index}
                className={`text-lg ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            >
                ★
            </span>
        ));
    };

    const renderRatingInput = () => {
        return [...Array(5)].map((_, index) => (
            <button
                key={index}
                type="button"
                onClick={() => setReviewData(prev => ({ ...prev, rating: index + 1 }))}
                className={`text-2xl ${index < reviewData.rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
            >
                ★
            </button>
        ));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading book details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg mb-4">{error}</p>
                    <Link to="/" className="text-indigo-600 hover:text-indigo-500">
                        Back to Books
                    </Link>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 text-lg mb-4">Book not found</p>
                    <Link to="/" className="text-indigo-600 hover:text-indigo-500">
                        Back to Books
                    </Link>
                </div>
            </div>
        );
    }

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back button */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/')}
                        className="text-indigo-600 hover:text-indigo-500 flex items-center"
                    >
                        ← Back to Books
                    </button>
                </div>

                {/* Book Details */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{book.title}</h1>
                            <p className="text-xl text-gray-600 mb-2">by {book.author}</p>
                            <p className="text-lg text-indigo-600 mb-4">{book.genre}</p>

                            {reviews.length > 0 && (
                                <div className="flex items-center mb-4">
                                    <div className="flex mr-2">
                                        {renderStars(Math.round(averageRating))}
                                    </div>
                                    <span className="text-gray-600">
                                        {averageRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col justify-center">
                            {isAuthenticated && (
                                <button
                                    onClick={() => setShowReviewForm(!showReviewForm)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                                >
                                    {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Review Form */}
                {showReviewForm && isAuthenticated && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Write a Review</h3>

                        {reviewError && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {reviewError}
                            </div>
                        )}

                        {reviewSuccess && (
                            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                                {reviewSuccess}
                            </div>
                        )}

                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                <div className="flex">
                                    {renderRatingInput()}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Share your thoughts about this book..."
                                    value={reviewData.review}
                                    onChange={(e) => setReviewData(prev => ({ ...prev, review: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={submittingReview}
                                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2 px-4 rounded transition-colors"
                                >
                                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowReviewForm(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Reviews Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                        Reviews ({reviews.length})
                    </h3>

                    {reviews.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            No reviews yet. {isAuthenticated ? 'Be the first to write one!' : 'Login to write a review.'}
                        </p>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <span className="font-medium text-gray-900 mr-3">
                                                {review.user?.name || 'Anonymous'}
                                            </span>
                                            <div className="flex">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-700">{review.review_text}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BookDetail;