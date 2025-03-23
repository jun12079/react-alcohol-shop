import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import ReactLoading from "react-loading";
import { Link } from "react-router-dom";
import Swiper from "swiper";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useDispatch } from "react-redux";
import { updateCartData } from "../redux/cartSlice";

// import Swal from "sweetalert2";

// const Toast = Swal.mixin({
//     toast: true,
//     position: "top-end",
//     showConfirmButton: false,
//     timer: 3000,
//     timerProgressBar: true,
//     didOpen: (toast) => {
//         toast.onmouseenter = Swal.stopTimer;
//         toast.onmouseleave = Swal.resumeTimer;
//     }
// });

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CartPage() {

    const [cart, setCart] = useState({});
    const [isScreenLoading, setIsScreenLoading] = useState(false);
    const [products, setProducts] = useState([]);
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
    const getCart = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
            setCart(res.data.data);
            dispatch(updateCartData(res.data.data));
        } catch (error) {
            void error;
            alert("取得購物車失敗");
        }
    };

    const getProducts = async () => {
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
    };

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

    const removeCart = async () => {
        setIsScreenLoading(true);
        try {
            await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
            getCart();
        } catch (error) {
            void error;
            alert("刪除購物車失敗");
        } finally {
            setIsScreenLoading(false);
        }
    }

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

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = handleSubmit((data) => {
        // console.log(data);
        const { message, ...user } = data;
        const userInfo = {
            data: {
                user: user,
                message,
            },
        }
        checkOut(userInfo);
    });

    const checkOut = async (data) => {
        setIsScreenLoading(true);
        try {
            await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, data);
            // Toast.fire({
            //     icon: "success",
            //     title: "送出訂單成功"
            // });
            reset();
            getCart();
        } catch (error) {
            void error;
            alert("結帳失敗");
        } finally {
            setIsScreenLoading(false);
        }
    };

    useEffect(() => {
        getCart();
        getProducts();
    }, []);

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
                                                    <p className="mb-0 ms-auto">NT${cartItem.final_total.toLocaleString()}</p>
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
                                        placeholder="Coupon Code"
                                        aria-label="Recipient's username"
                                        aria-describedby="button-addon2"
                                    />
                                    <div className="input-group-append">
                                        <button
                                            className="btn btn-outline-dark border-bottom border-top-0 border-start-0 border-end-0 rounded-0"
                                            type="button"
                                            id="button-addon2"
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
                                                <td className="text-end border-0 px-0 pt-4">NT${cart.final_total?.toLocaleString()}</td>
                                            </tr>
                                            <tr>
                                                <th
                                                    scope="row"
                                                    className="border-0 px-0 pt-0 pb-4 font-weight-normal"
                                                >
                                                    付款方式
                                                </th>
                                                <td className="text-end border-0 px-0 pt-0 pb-4">
                                                    ApplePay
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="d-flex justify-content-between mt-4">
                                        <p className="mb-0 h4 fw-bold">總計</p>
                                        <p className="mb-0 h4 fw-bold">NT${cart.final_total?.toLocaleString()}</p>
                                    </div>
                                    <Link to="/checkout-form" className="btn btn-dark w-100 mt-4">
                                        前往結帳
                                    </Link>
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

    // return (
    //     <div className="container">
    //         <div>
    //             {
    //                 cart.carts?.length > 0 && (
    //                     <div>
    //                         <div className="d-flex justify-content-between align-items-center mb-3">
    //                             <h3>購物車</h3>
    //                             <button
    //                                 onClick={removeCart}
    //                                 className="btn btn-outline-danger">清空購物車
    //                             </button>
    //                         </div>
    //                         <table className="table align-middle">
    //                             <thead>
    //                                 <tr>
    //                                     <th></th>
    //                                     <th>品名</th>
    //                                     <th style={{ width: "150px" }}>數量/單位</th>
    //                                     <th className="text-end">單價</th>
    //                                 </tr>
    //                             </thead>

    //                             <tbody>
    //                                 {cart.carts?.map((cartItem) => {
    //                                     return (
    //                                         <tr key={cartItem.id}>
    //                                             <td>
    //                                                 <button
    //                                                     onClick={() => {
    //                                                         removeCartItem(cartItem.id);
    //                                                     }}
    //                                                     type="button"
    //                                                     className="btn btn-outline-danger btn-sm"
    //                                                 >
    //                                                     x
    //                                                 </button>
    //                                             </td>
    //                                             <td>{cartItem.product.title}</td>
    //                                             <td style={{ width: "150px" }}>
    //                                                 <div className="d-flex align-items-center">
    //                                                     <div className="btn-group me-2" role="group">
    //                                                         <button
    //                                                             onClick={() => {
    //                                                                 updateCartItem(cartItem.id, cartItem.product.id, cartItem.qty - 1);
    //                                                             }}
    //                                                             type="button"
    //                                                             className="btn btn-outline-dark btn-sm" disabled={cartItem.qty === 1}
    //                                                         >
    //                                                             -
    //                                                         </button>
    //                                                         <span
    //                                                             className="btn border border-dark"
    //                                                             style={{ width: "50px", cursor: "auto" }}
    //                                                         >{cartItem.qty}</span>
    //                                                         <button
    //                                                             onClick={() => {
    //                                                                 updateCartItem(cartItem.id, cartItem.product.id, cartItem.qty + 1);
    //                                                             }}
    //                                                             type="button"
    //                                                             className="btn btn-outline-dark btn-sm"
    //                                                         >
    //                                                             +
    //                                                         </button>
    //                                                     </div>
    //                                                     <span className="input-group-text bg-transparent border-0">
    //                                                         {cartItem.product.unit}
    //                                                     </span>
    //                                                 </div>
    //                                             </td>
    //                                             <td className="text-end">{cartItem.total}</td>
    //                                         </tr>
    //                                     );
    //                                 })}
    //                             </tbody>
    //                             <tfoot>
    //                                 <tr>
    //                                     <td colSpan="3" className="text-end">
    //                                         總計：
    //                                     </td>
    //                                     <td className="text-end" style={{ width: "130px" }}>{cart.final_total}</td>
    //                                 </tr>
    //                             </tfoot>
    //                         </table>
    //                     </div>
    //                 )
    //             }
    //         </div>
    //         < h3 className="mb-4" > 填寫訂單資料</h3 >
    //         <div className="row justify-content-center">
    //             <form
    //                 onSubmit={onSubmit}
    //                 className="col-md-6"
    //             >
    //                 <div className="mb-3">
    //                     <label htmlFor="email" className="form-label">Email</label>
    //                     <input
    //                         {...register("email", {
    //                             required: "Email欄位必填",
    //                             pattern: {
    //                                 value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    //                                 message: "Email格式不正確",
    //                             }
    //                         })}
    //                         id="email"
    //                         type="email"
    //                         className={`form-control ${errors.email ? "is-invalid" : ""}`}
    //                         placeholder="請輸入Email"
    //                     />
    //                     {errors.email && <p className="text-danger my-2">{errors.email.message}</p>}
    //                 </div>
    //                 <div className="mb-3">
    //                     <label htmlFor="name" className="form-label">收件人姓名</label>
    //                     <input
    //                         {...register("name", {
    //                             required: "姓名欄位必填",
    //                         })}
    //                         id="name"
    //                         type="text"
    //                         className={`form-control ${errors.name ? "is-invalid" : ""}`}
    //                         placeholder="請輸入姓名"
    //                     />
    //                     {errors.name && <p className="text-danger my-2">{errors.name.message}</p>}
    //                 </div>
    //                 <div className="mb-3">
    //                     <label htmlFor="tel" className="form-label">收件人電話</label>
    //                     <input
    //                         {...register("tel", {
    //                             required: "電話欄位必填",
    //                             pattern: {
    //                                 value: /^(0[2-8]\d{7}|09\d{8})$/,
    //                                 message: "電話格式不正確",
    //                             }
    //                         })}
    //                         id="tel"
    //                         type="tel"
    //                         className={`form-control ${errors.tel ? "is-invalid" : ""}`}
    //                         placeholder="請輸入電話"
    //                     />
    //                     {errors.tel && <p className="text-danger my-2">{errors.tel.message}</p>}
    //                 </div>
    //                 <div className="mb-3">
    //                     <label htmlFor="address" className="form-label">收件人地址</label>
    //                     <input
    //                         {...register("address", {
    //                             required: "地址欄位必填",
    //                         })}
    //                         id="address"
    //                         type="text"
    //                         className={`form-control ${errors.address ? "is-invalid" : ""}`}
    //                         placeholder="請輸入地址"
    //                     />
    //                     {errors.address && <p className="text-danger my-2">{errors.address.message}</p>}
    //                 </div>
    //                 <div className="mb-3">
    //                     <label htmlFor="message" className="form-label">留言</label>
    //                     <textarea
    //                         {...register("message")}
    //                         id="message"
    //                         className="form-control"
    //                         cols="30"
    //                         rows="10">
    //                     </textarea>
    //                 </div>
    //                 <button type="submit" className="btn btn-primary" disabled={cart.carts?.length === 0}>送出訂單</button>
    //             </form>
    //         </div>
    //         {
    //             isScreenLoading && (
    //                 <div
    //                     className="d-flex justify-content-center align-items-center"
    //                     style={{
    //                         position: "fixed",
    //                         inset: 0,
    //                         backgroundColor: "rgba(255,255,255,0.3)",
    //                         zIndex: 999,
    //                     }}
    //                 >
    //                     <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
    //                 </div>
    //             )
    //         }
    //     </div>
    // );
}