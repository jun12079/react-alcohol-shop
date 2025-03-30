import { createHashRouter } from "react-router-dom";

import FrontLayout from "../layouts/FrontLayout";
import Homepage from "../pages/HomePage";
import ProductsPage from "../pages/ProductsPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import CheckoutFormPage from "../pages/CheckoutFormPage";
import CheckoutPaymentPage from "../pages/CheckoutPaymentPage";
import CheckoutSuccessPage from "../pages/CheckoutSuccessPage";

// import AdminPage from "../pages/admin/AdminPage";
import NotFound from "../pages/NotFound";

import LoginPage from "../pages/admin/LoginPage";
import AdminLayout from "../layouts/AdminLayout";

import AdminHomePage from "../pages/admin/AdminHomePage";
import ProductPage from "../pages/admin/ProductPage";
import OrderPage from "../pages/admin/OrderPage";
import CouponPage from "../pages/admin/CouponPage";

const router = createHashRouter([
    {
        path: '/',
        element: <FrontLayout />,
        children: [
            {
                path: '',
                element: <Homepage />,
            },
            {
                path: 'products',
                element: <ProductsPage />,
            },
            {
                path: 'products/:id',
                element: <ProductDetailPage />,
            },
            {
                path: 'cart',
                element: <CartPage />,
            },
            {
                path: 'checkout-form',
                element: <CheckoutFormPage />,
            },
            {
                path: 'checkout-payment',
                element: <CheckoutPaymentPage />,
            },
            {
                path: 'checkout-success',
                element: <CheckoutSuccessPage />,
            }
        ]
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                path: '',
                element: <AdminHomePage />,
            },
            {
                path: 'products',
                element: <ProductPage />,
            },
            {
                path: 'orders',
                element: <OrderPage />,
            },
            {
                path: 'coupons',
                element: <CouponPage />,
            }
        ]
    },
    {
        path: '*',
        element: <NotFound />,
    }
]);

export default router;