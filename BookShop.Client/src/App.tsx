import { Route, Routes } from "react-router-dom";
import Books from "./books/Books";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Careers from "./pages/Careers";
import TermsOfService from "./pages/TermsOfService";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import Layout from "./shared/ui/Layout";
import Cart from "./cart/Cart";

export function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Books />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="careers" element={<Careers />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="about" element={<About />} />
          <Route path="cart" element={<Cart />} />
          <Route path="*" element={<NotFound />} />
        </Route>

      </Routes>


    </>
  )
}

export default App
