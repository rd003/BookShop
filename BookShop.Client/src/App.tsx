import BookCatalog from "./books/BookCatalog";
import Footer from "./shared/ui/Footer";
import Navbar from "./shared/ui/Navbar";

export function App() {
  const MOCK_BOOKS: any[] = [
    { id: 1, title: "The Midnight Library", authors: ["Matt Haig"], genres: ["Fiction", "Fantasy"], price: 399, cover: "https://placehold.co/300x440?text=Book" },
    { id: 2, title: "Sapiens", authors: ["Yuval Noah Harari"], genres: ["Non-Fiction", "History"], price: 549, cover: "https://placehold.co/300x440?text=Book" },
    { id: 3, title: "Project Hail Mary", authors: ["Andy Weir"], genres: ["Sci-Fi", "Fiction"], price: 449, cover: "https://placehold.co/300x440?text=Book" },
    { id: 4, title: "Good Omens", authors: ["Terry Pratchett", "Neil Gaiman"], genres: ["Fantasy", "Comedy"], price: 375, cover: "https://placehold.co/300x440?text=Book" },
    { id: 5, title: "Atomic Habits", authors: ["James Clear"], genres: ["Non-Fiction", "Self-Help"], price: 425, cover: "https://placehold.co/300x440?text=Book" },
    { id: 6, title: "Dune", authors: ["Frank Herbert"], genres: ["Sci-Fi"], price: 499, cover: "https://placehold.co/300x440?text=Book" },
  ];

  return (
    <>
      <Navbar />
      <BookCatalog books={MOCK_BOOKS} />
      <Footer />
    </>
  )
}

export default App
