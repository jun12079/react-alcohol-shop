import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateCartData } from "../redux/cartSlice";
import { useForm } from "react-hook-form";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CheckoutFormPage() {

    const [cart, setCart] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const {
        register,
        handleSubmit,
        formState: { errors },
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
        localStorage.setItem('orderData', JSON.stringify(userInfo));
        navigate('/checkout-payment');
    });

    useEffect(() => {
        getCart();
    }, [getCart]);

    return (
        <>
            <div className="container" style={{ paddingTop: "64px" }}>
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <nav className="navbar navbar-expand-lg navbar-light px-0">
                            <ul className="list-unstyled mb-0 ms-md-auto d-flex align-items-center justify-content-between justify-content-md-end w-100 mt-md-0 mt-4">
                                <li className="me-md-6 me-3 position-relative custom-step-line">
                                    <i className="fas fa-check-circle d-md-inline d-block text-center"></i>
                                    <span className="text-nowrap">結帳表單</span>
                                </li>
                                <li className="me-md-6 me-3 position-relative custom-step-line">
                                    <i className="fas fa-dot-circle d-md-inline d-block text-center"></i>
                                    <span className="text-nowrap">付款方式</span>
                                </li>
                                <li>
                                    <i className="fas fa-dot-circle d-md-inline d-block text-center"></i>
                                    <span className="text-nowrap">結帳成功</span>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <h3 className="fw-bold mb-4 pt-3">填寫結帳資訊</h3>
                    </div>
                </div>
                <div className="row flex-row-reverse justify-content-center pb-5">
                    <div className="col-md-4">
                        <div className="border p-4 mb-4">
                            {
                                cart.carts?.map((cartItem) => (
                                    <div className="d-flex mt-2" key={cartItem.id}>
                                        <img
                                            src={cartItem.product.imageUrl}
                                            alt={cartItem.product.title}
                                            className="me-2"
                                            style={{ width: "48px", height: "48px", objectFit: "cover" }}
                                        />
                                        <div className="w-100">
                                            <div className="d-flex justify-content-between">
                                                <p className="mb-0 fw-bold">{cartItem.product.title}</p>
                                                <p className="mb-0">NT${cartItem.total.toLocaleString()}</p>
                                            </div>
                                            <p className="mb-0 fw-bold">x1</p>
                                        </div>
                                    </div>
                                ))
                            }
                            <table className="table mt-4 border-top border-bottom text-muted">
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
                        </div>
                    </div>
                    <div className="col-md-6">
                        <form
                            onSubmit={onSubmit}
                        >
                            <p>結帳資訊</p>
                            <div className="mb-0">
                                <label htmlFor="email" className="text-muted mb-0">信箱</label>
                                <input
                                    {...register("email", {
                                        required: "Email欄位必填",
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: "Email格式不正確",
                                        }
                                    })}
                                    id="email"
                                    type="email"
                                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                    aria-describedby="emailHelp"
                                    placeholder="請輸入Email"
                                />
                                {errors.email && <p className="text-danger my-2">{errors.email.message}</p>}
                            </div>
                            <div className="mb-2">
                                <label htmlFor="name" className="text-muted mb-0">
                                    名字
                                </label>
                                <input
                                    {...register("name", {
                                        required: "姓名欄位必填",
                                    })}
                                    id="name"
                                    type="text"
                                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                    placeholder="請輸入姓名"
                                />
                                {errors.name && <p className="text-danger my-2">{errors.name.message}</p>}
                            </div>
                            <div className="mb-2">
                                <label htmlFor="tel" className="text-muted mb-0">
                                    電話
                                </label>
                                <input
                                    {...register("tel", {
                                        required: "電話欄位必填",
                                        pattern: {
                                            value: /^(0[2-8]\d{7}|09\d{8})$/,
                                            message: "電話格式不正確",
                                        }
                                    })}
                                    id="tel"
                                    type="text"
                                    className={`form-control ${errors.tel ? "is-invalid" : ""}`}
                                    placeholder="請輸入電話"
                                />
                                {errors.tel && <p className="text-danger my-2">{errors.tel.message}</p>}
                            </div>
                            <div className="mb-2">
                                <label htmlFor="address" className="form-label">地址</label>
                                <input
                                    {...register("address", {
                                        required: "地址欄位必填",
                                    })}
                                    id="address"
                                    type="text"
                                    className={`form-control ${errors.address ? "is-invalid" : ""}`}
                                    placeholder="請輸入地址"
                                />
                                {errors.address && <p className="text-danger my-2">{errors.address.message}</p>}
                            </div>
                            <div className="mb-2">
                                <label htmlFor="message" className="text-muted mb-0">留言</label>
                                <textarea
                                    {...register("message")}
                                    id="message"
                                    className="form-control"
                                    cols="30"
                                    rows="5"
                                    placeholder="請輸入留言 ... "
                                ></textarea>
                            </div>
                            <div className="d-flex flex-column-reverse flex-md-row mt-4 justify-content-between align-items-md-center align-items-end w-100">
                                <Link to="/cart" className="text-dark mt-md-0 mt-3">
                                    <i className="fas fa-chevron-left me-2"></i> 回到購物車
                                </Link>
                                <button type="submit" className="btn btn-dark py-3 px-7">
                                    填寫結帳資訊 <i className="fas fa-chevron-right ms-2"></i>
                                </button>
                                {/* <Link to="/checkout-payment" className="btn btn-dark py-3 px-7">
                                下一步
                            </Link> */}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
