import { useEffect, useState } from "react";

export default function ScrollToTopButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!showButton) return null;

  return (
    <button
      onClick={scrollToTop}
      className="btn btn-success scroll-to-top"
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        zIndex: 9999,
        borderRadius: "50%",
        padding: "12px 16px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      }}
    >
      <i className="bi bi-arrow-up"></i>
    </button>
  );
}
