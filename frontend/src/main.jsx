import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import BasePage from "./pages/BasePage.jsx";
import GameApp from "./pages/GameApp.jsx";
import AboutPage from "./pages/AboutPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BasePage>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GameApp />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </BrowserRouter>
    </BasePage>
  </StrictMode>
);
