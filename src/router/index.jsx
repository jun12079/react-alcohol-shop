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
// import NotFound from "../pages/NotFound";

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
    // {
    //     path: '/admin',
    //     element: <AdminPage />,
    // },
    // {
    //     path: '*',
    //     element: <NotFound />,
    // }
]);

export default router;