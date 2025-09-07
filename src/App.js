// src/App.js
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Use deployed Render backend
  const API_BASE = "https://book-finder-backend-i5jx.onrender.com";

  // Search books
  const searchBooks = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/search?query=${query}`);
      setBooks(response.data.books || []);
    } catch (error) {
      console.error("Search error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch book details
  const fetchBookDetails = async (workId) => {
    try {
      const response = await axios.get(`${API_BASE}/api/book/${workId}`);
      setSelectedBook(response.data);
    } catch (error) {
      console.error("Details error:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-6 text-indigo-800">
        📚 Book Finder
      </h1>

      {/* Search bar */}
      <form
        onSubmit={searchBooks}
        className="flex justify-center gap-3 mb-8 max-w-xl mx-auto"
      >
        <input
          type="text"
          placeholder="Search for a book..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <button
          type="submit"
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Search
        </button>
      </form>

      {/* Book list */}
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {books.map((book, idx) => (
            <div
              key={idx}
              onClick={() => fetchBookDetails(book.workId)}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer p-4 flex flex-col items-center"
            >
              <img
                src={book.cover}
                alt={book.title}
                className="w-32 h-44 object-cover rounded-md mb-3"
              />
              <h2 className="font-semibold text-lg text-center text-gray-800">
                {book.title}
              </h2>
              <p className="text-sm text-gray-600">{book.author}</p>
              <p className="text-xs text-gray-500">{book.year}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No books found</p>
      )}

      {/* Modal for book details */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">
              {selectedBook.title}
            </h2>
            {selectedBook.covers?.length > 0 && (
              <img
                src={selectedBook.covers[0]}
                alt={selectedBook.title}
                className="w-40 h-56 object-cover rounded mb-4 mx-auto"
              />
            )}
            <p className="text-gray-700 mb-3">
              {selectedBook.description || "No description available"}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              <strong>Subjects:</strong>{" "}
              {selectedBook.subjects?.slice(0, 5).join(", ") || "N/A"}
            </p>
            <p className="text-sm text-gray-400">
              <strong>Created:</strong>{" "}
              {selectedBook.created
                ? new Date(selectedBook.created).toDateString()
                : "Unknown"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
