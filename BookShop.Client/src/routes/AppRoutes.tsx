import { Route, Routes } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import Account from "@/auth/Account";
import About from "@/pages/About";
import TermsOfService from "@/pages/TermsOfService";
import ContactUs from "@/pages/ContactUs";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Careers from "@/pages/Careers";
import Signup from "@/pages/Signup";
import Books from "@/books/Books";
import Login from "@/auth/Login";
import Cart from "@/cart/Cart";
import NotFound from "@/pages/NotFound";
import Layout from "@/shared/ui/Layout";
import Addresses from "@/addresses/Addresses";
import ChangePassword from "@/auth/ChangePassword";
import Orders from "@/orders/Orders";

export default function AppRoutes() {
    return (<Routes>
        <Route element={<Layout />}>
            <Route index element={<Books />} />
            <Route path="catalog" element={<Books />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="careers" element={<Careers />} />
            <Route path="terms" element={<TermsOfService />} />
            <Route path="about" element={<About />} />
            <Route element={<RequireAuth />}>
                <Route path="account" element={<Account />} />
                <Route path="account/addresses" element={<Addresses />} />
                <Route path="account/change-password" element={<ChangePassword />} />
                <Route path="account/orders" element={<Orders />} />
                <Route path="cart" element={<Cart />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Route>
    </Routes>);
}