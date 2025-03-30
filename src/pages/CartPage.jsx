import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import { Link, useNavigate } from "react-router-dom";
import Swiper from "swiper";
import Swal from "sweetalert2";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useDispatch } from "react-redux";
import { updateCartData } from "../redux/cartSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

export default function CartPage() {

    const [cart, setCart] = useState({});
    const [couponCode, setCouponCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isScreenLoading, setIsScreenLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const swiperRef = useRef(null);

    new Swiper(swiperRef.current, {
        modules: [Autoplay],
        loop: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        slidesPerView: 2,
        spaceBetween: 10,
        breakpoints: {
            767: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
        },
    });

    const dispatch = useDispatch();
    const getCart = useCallback(async () => {
        try {
            const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
            setCart(res.data.data);
            dispatch(updateCartData(res.data.data));
        } catch (error) {
            void error;
            alert("取得購物車失敗");
        }
    }, [dispatch]);

    const getProducts = useCallback(async () => {
        setIsScreenLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
            setProducts(res.data.products);
        } catch (error) {
            void error;
            alert("取得產品失敗");
        } finally {
            setIsScreenLoading(false);
        }
    }, []);

    const updateCartItem = async (cartItem_id, product_id, qty) => {
        setIsScreenLoading(true);
        try {
            await axios.put(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItem_id}`, {
                data: {
                    product_id,
                    qty: Number(qty),
                },
            });
            getCart();
        } catch (error) {
            void error;
            alert("更新購物車商品失敗");
        } finally {
            setIsScreenLoading(false);
        }
    }

    // const removeCart = async () => {
    //     setIsScreenLoading(true);
    //     try {
    //         await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
    //         getCart();
    //     } catch (error) {
    //         void error;
    //         alert("刪除購物車失敗");
    //     } finally {
    //         setIsScreenLoading(false);
    //     }
    // }

    const removeCartItem = async (id) => {
        setIsScreenLoading(true);
        try {
            await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${id}`);
            getCart();
        } catch (error) {
            void error;
            alert("刪除購物車項目失敗");
        } finally {
            setIsScreenLoading(false);
        }
    }

    const handleCoupon = async (couponCode) => {
        setIsLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}/api/${API_PATH}/coupon`, {
                data: {
                    code: couponCode,
                }
            });
            if (res.data.success === false) {
                Swal.fire({
                    icon: "error",
                    title: "錯誤",
                    text: res.data.message
                });
                setCouponCode("");
                return;
            } else {
                Toast.fire({
                    icon: "success",
                    title: res.data.message
                });
            }
            getCart();
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "錯誤",
                text: "使用優惠券失敗"
            });
            setCouponCode("");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckout = () => {
        if (!cart.carts || cart.carts.length === 0) {
            Swal.fire({
                icon: "error",
                title: "錯誤",
                text: "購物車內沒有商品"
            });
        } else {
            navigate("/checkout-form");
        }
    };

    useEffect(() => {
        getCart();
        getProducts();
    }, [getCart, getProducts]);

    return (
        <>
            <div className="container-fluid" style={{ paddingTop: "64px" }}>
                <div className="container">
                    <div className="mt-3">
                        <h3 className="mt-3 mb-4">購物車</h3>
                        <div className="row">
                            <div className="col-md-8">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="border-0 ps-0">
                                                商品名稱
                                            </th>
                                            <th scope="col" className="border-0">
                                                商品數量
                                            </th>
                                            <th scope="col" className="border-0">
                                                價格總計
                                            </th>
                                            <th scope="col" className="border-0"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.carts?.map((cartItem) => (
                                            <tr className="border-bottom border-top" key={cartItem.id}>
                                                <th
                                                    scope="row"
                                                    className="border-0 px-0 font-weight-normal py-4"
                                                >
                                                    <img
                                                        src={cartItem.product.imageUrl}
                                                        alt={cartItem.product.title}
                                                        style={{
                                                            width: "72px",
                                                            height: "72px",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                    <p className="mb-0 fw-bold ms-3 d-inline-block">
                                                        {cartItem.product.title}
                                                    </p>
                                                </th>
                                                <td
                                                    className="border-0 align-middle"
                                                    style={{ maxWidth: "160px" }}
                                                >
                                                    <div className="input-group pe-5">
                                                        <div className="input-group-prepend">
                                                            <button
                                                                onClick={() => {
                                                                    updateCartItem(cartItem.id, cartItem.product.id, cartItem.qty - 1);
                                                                }}
                                                                disabled={cartItem.qty === 1}
                                                                className="btn btn-outline-dark border-0 py-2"
                                                                type="button"
                                                                id="button-addon1"
                                                            >
                                                                <i className="fas fa-minus"></i>
                                                            </button>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className="form-control border-0 text-center my-auto shadow-none"
                                                            placeholder=""
                                                            aria-label="Example text with button addon"
                                                            aria-describedby="button-addon1"
                                                            value={cartItem.qty}
                                                        />
                                                        <div className="input-group-append">
                                                            <button
                                                                onClick={() => {
                                                                    updateCartItem(cartItem.id, cartItem.product.id, cartItem.qty + 1);
                                                                }}
                                                                className="btn btn-outline-dark border-0 py-2"
                                                                type="button"
                                                                id="button-addon2"
                                                            >
                                                                <i className="fas fa-plus"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="border-0 align-middle">
                                                    <p className="mb-0 ms-auto">NT${cartItem.total.toLocaleString()}</p>
                                                </td>
                                                <td className="border-0 align-middle">
                                                    <button
                                                        onClick={() => {
                                                            removeCartItem(cartItem.id);
                                                        }}
                                                        className="btn btn-outline-dark border-0 py-2"
                                                        type="button"
                                                        id="button-addon2"
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </td>
                                            </tr>

                                        ))}
                                    </tbody>
                                </table>
                                <div className="input-group w-50 mb-3">
                                    <input
                                        type="text"
                                        className="form-control rounded-0 border-bottom border-top-0 border-start-0 border-end-0 shadow-none"
                                        placeholder="折扣碼"
                                        aria-label="Recipient's username"
                                        aria-describedby="button-addon2"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                    />
                                    <div className="input-group-append">
                                        <button
                                            className="btn btn-outline-dark border-bottom border-top-0 border-start-0 border-end-0 rounded-0"
                                            type="button"
                                            id="button-addon2"
                                            onClick={() => { handleCoupon(couponCode); }}
                                            disabled={isLoading}
                                        >
                                            <i className="fas fa-paper-plane"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="border p-4 mb-4">
                                    <h4 className="fw-bold mb-4">訂單資訊</h4>
                                    <table className="table text-muted border-bottom">
                                        <tbody>
                                            <tr>
                                                <th
                                                    scope="row"
                                                    className="border-0 px-0 pt-4 font-weight-normal"
                                                >
                                                    小計
                                                </th>
                                                <td className="text-end border-0 px-0 pt-4">NT${cart.total?.toLocaleString()}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="d-flex justify-content-between mt-4">
                                        <p className="mb-0 h4 fw-bold">總計</p>
                                        <p className="mb-0 h4 fw-bold">NT${cart.final_total?.toLocaleString()}</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-dark w-100 mt-4"
                                        onClick={handleCheckout}
                                    >
                                        前往結帳
                                    </button>
                                    {/* <Link to="/checkout-form" className="btn btn-dark w-100 mt-4">
                                        前往結帳
                                    </Link> */}
                                </div>
                            </div>
                        </div>
                        <div className="my-5">
                            <h3 className="fw-bold">猜你喜歡</h3>
                            <div ref={swiperRef} className="swiper mt-4 mb-5">
                                <div className="swiper-wrapper">
                                    {products.map((product) => (
                                        <div key={product.id} className="swiper-slide">
                                            <div className="card border-0 mb-4 position-relative position-relative">
                                                <img
                                                    src={product.imageUrl}
                                                    className="card-img-top rounded-0 product-img"
                                                    alt="..."
                                                />
                                                <a href="#" className="text-dark"></a>
                                                <div className="card-body p-0">
                                                    <h4 className="mb-0 mt-3">
                                                        <Link to={`/products/${product.id}`}>{product.title}</Link>
                                                    </h4>
                                                    <p className="card-text mb-0">
                                                        NT${product.price.toLocaleString()}
                                                        <span className="text-muted ">
                                                            <del>NT${product.origin_price.toLocaleString()}</del>
                                                        </span>
                                                    </p>
                                                    <p className="text-muted mt-3"></p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                isScreenLoading && (
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{
                            position: "fixed",
                            inset: 0,
                            backgroundColor: "rgba(255,255,255,0.3)",
                            zIndex: 999,
                        }}
                    >
                        <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
                    </div>
                )
            }
        </>
    );
}