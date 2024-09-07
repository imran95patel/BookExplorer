import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";

const BookPage = () => {
  const { category } = useParams();
  const [books, setBooks] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const observer = useRef();
  const navigate = useNavigate();
  const goToHomepage = () => navigate("/");

  const fetchBooks = useCallback(async (url) => {
    try {
      setLoading(true);
      const response = await axios.get(url);
      setBooks((prevBooks) => [...prevBooks, ...response.data.results]);
      setNextUrl(response.data.next);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setBooks([]);
    setInitialLoading(true);
    fetchBooks(`http://skunkworks.ignitesol.com:8000/books?topic=${category}`)
      .then(() => setInitialLoading(false))
      .catch((err) => console.log("Error", err));
  }, [category, fetchBooks]);

  const lastBookRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && nextUrl && !loading) {
          fetchBooks(nextUrl);
        }
      });
      if (node) observer.current.observe(node);
    },
    [nextUrl, fetchBooks, loading]
  );

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto xs:pr-28">
      <div
        className="flex items-center mb-8 cursor-pointer"
        onClick={goToHomepage}
      >
        <svg
          className="w-6 h-6 mr-2 text-purple-600"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
        </svg>
        <h1 className="text-2xl font-semibold text-purple-600 capitalize">
          {category}
        </h1>
      </div>

      <div className="relative mb-8 xs:w-[360px] sm:w-[550px] md:w-[700px] lg:w-[950px] xl:w-full">
        <input
          type="text"
          className="w-full p-3 pl-10 rounded-md bg-gray-100 text-gray-700 focus:outline-[#5E56E7]"
          placeholder="Search books by title..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <svg
          className="absolute left-3 top-3 text-gray-500"
          width="24"
          height="24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M10 2a8 8 0 015.887 13.484l5.707 5.707-1.414 1.414-5.707-5.707A8 8 0 1110 2zm0 2a6 6 0 100 12 6 6 0 000-12z"></path>
        </svg>
      </div>

      {initialLoading && (
        <div className="flex justify-center items-center mb-8">
          <svg
            className="animate-spin h-10 w-10 text-purple-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}

      {!initialLoading && filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-14 md:gap-6">
          {filteredBooks.map((book, index) => (
            <div
              key={`${book.id}-${index}`}
              ref={filteredBooks.length === index + 1 ? lastBookRef : null}
            >
              <BookCard book={book} />
              <p className="text-xs text-gray-500">{book.author}</p>
            </div>
          ))}
        </div>
      ) : (
        !initialLoading && (
          <p className="text-center text-gray-500 mt-8">No books found.</p>
        )
      )}
    </div>
  );
};

export default BookPage;
