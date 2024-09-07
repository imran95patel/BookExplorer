import React from "react";

const BookCard = ({ book }) => {
  const imageUrl = book.formats["image/jpeg"] || book.formats["image/png"];

  const handleClick = () => {
    const formats = book.formats;
    if (formats["text/html"]) {
      window.open(formats["text/html"], "_blank");
    } else if (formats["application/pdf"]) {
      window.open(formats["application/pdf"], "_blank");
    } else if (formats["text/plain"]) {
      window.open(formats["text/plain"], "_blank");
    } else {
      alert("No viewable version available");
    }
  };

  return (
    <div
      className="tight w-36 h-[162px] rounded-lg cursor-pointer grid mb-44 ml-10 mt-8"
      onClick={handleClick}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={book.title}
          className="w-full h-full hover:shadow-custom-red mb-4 rounded-lg object-fill"
        />
      ) : (
        <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No Image Available</span>
        </div>
      )}
      <div className="text-gray-600">
        <h3 className="text-[12px] font-bold mt-2">{book.title}</h3>
        <p className="text-[12px]">
          {book.authors[0]?.name || "Unknown Author"}
        </p>
      </div>
    </div>
  );
};

export default BookCard;
