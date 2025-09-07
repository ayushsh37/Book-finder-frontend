import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  // ✅ Search books
  const searchBooks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/search?query=${encodeURIComponent(query)}`
      );
      console.log("Books fetched:", response.data);
      setBooks(response.data);
      setSelectedBook(null);
    } catch (error) {
      console.error("Search error:", error.message);
    }
  };

  // ✅ Fetch book details
  const fetchBookDetails = async (key) => {
    try {
      const workId = key.replace("/works/", "");
      console.log("Fetching details for workId:", workId);

      const response = await axios.get(
        `http://localhost:5000/api/book/${workId}`
      );
      console.log("Book details received:", response.data);

      setSelectedBook(response.data);
    } catch (error) {
      console.error("Details error:", error.message);
    }
  };

  return (
    <div className="App">
      <h1>📚 Book Finder</h1>

      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by title, author, or keyword..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={searchBooks}>Search</button>
      </div>

      {/* Book List */}
      <div className="book-list">
        {books.map((book) => (
          <div
            key={book.key}
            className="book-card"
            onClick={() => fetchBookDetails(book.key)}
          >
            {book.cover_i ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={book.title}
              />
            ) : (
              <div className="no-image">No Image</div>
            )}
            <h3>{book.title}</h3>
            <p>{book.author_name?.join(", ")}</p>
            <p>{book.first_publish_year}</p>
          </div>
        ))}
      </div>

      {/* ✅ Modal Popup for Book Details */}
      {selectedBook && (
        <div className="modal-overlay" onClick={() => setSelectedBook(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <button className="close-btn" onClick={() => setSelectedBook(null)}>
              ×
            </button>
            <h2>{selectedBook.title}</h2>

            {selectedBook.covers?.length > 0 && (
              <img
                src={selectedBook.covers[0]}
                alt={selectedBook.title}
                className="modal-img"
              />
            )}

            <p>
              <strong>Description:</strong>{" "}
              {selectedBook.description || "No description available"}
            </p>

            {selectedBook.subjects?.length > 0 && (
              <p>
                <strong>Subjects:</strong>{" "}
                {selectedBook.subjects.slice(0, 10).join(", ")}
              </p>
            )}

            {selectedBook.created && (
              <p>
                <strong>Created:</strong>{" "}
                {new Date(selectedBook.created).toDateString()}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
