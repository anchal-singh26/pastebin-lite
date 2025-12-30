import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Paste from "./pages/Paste";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/paste/:id" element={<Paste />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
