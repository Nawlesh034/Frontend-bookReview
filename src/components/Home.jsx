import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

function Home(){
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        genre: '',
        author: '',
        page: 1,
        limit: 10
    });
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch books from API
    const fetchBooks = async () => {
        setLoading(true);
        setError('');

        try {
            const params = new URLSearchParams();
            if (filters.genre) params.append('genre', filters.genre);
            if (filters.author) params.append('author', filters.author);
            params.append('page', filters.page.toString());
            params.append('limit', filters.limit.toString());

            const response = await axios.get(`${API_BASE_URL}/?${params}`);
            setBooks(response.data.books);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError('Failed to fetch books');
            console.error('Error fetching books:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [filters]);

    // Filter books by search term
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,  // Spread the previous filters
            [key]: value,
            page: 1 // Reset to first page when filters change
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading books...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Book Collection</h1>
                    <p className="text-gray-600">Discover and review amazing books</p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Search by title or author..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Genre Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={filters.genre}
                                onChange={(e) => handleFilterChange('genre', e.target.value)}
                            >
                                <option value="">All Genres</option>
                                <option value="Fiction">Fiction</option>
                                <option value="Non-Fiction">Non-Fiction</option>
                                <option value="Mystery">Mystery</option>
                                <option value="Romance">Romance</option>
                                <option value="Science Fiction">Science Fiction</option>
                                <option value="Fantasy">Fantasy</option>
                                <option value="Biography">Biography</option>
                                <option value="History">History</option>
                                <option value="Self-Help">Self-Help</option>
                                <option value="Business">Business</option>
                                <option value="Technology">Technology</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Author Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                            <input
                                type="text"
                                placeholder="Filter by author..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={filters.author}
                                onChange={(e) => handleFilterChange('author', e.target.value)}
                            />
                        </div>

                        {/* Items per page */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Per Page</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={filters.limit}
                                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {/* Books Grid */}
                {filteredBooks.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No books found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                        {filteredBooks.map((book) => (
                            <div key={book._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {book.title}
                                    </h3>
                                    <p className="text-gray-600 mb-2">by {book.author}</p>
                                    <p className="text-sm text-indigo-600 mb-4">{book.genre}</p>

                                    <Link
                                        to={`/book/${book._id}`}
                                        className="inline-block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2">
                        <button
                            onClick={() => handlePageChange(filters.page - 1)}
                            disabled={filters.page === 1}
                            className="px-3 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>

                        {[...Array(totalPages)].map((_, index) => {
                            const page = index + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-2 border rounded-md ${
                                        filters.page === page
                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => handlePageChange(filters.page + 1)}
                            disabled={filters.page === totalPages}
                            className="px-3 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;