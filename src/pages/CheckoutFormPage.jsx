import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateCartData } from "../redux/cartSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CheckoutFormPage() {

    const [cart, setCart] = useState([]);

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

    useEffect(() => {
            getCart();
        }, []);

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
                                                <p className="mb-0">NT${cartItem.final_total.toLocaleString()}</p>
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
                                        <td className="text-end border-0 px-0 pt-4">NT${cart.final_total?.toLocaleString()}</td>
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
                        <form>
                            <p>結帳資訊</p>
                            <div className="mb-0">
                                <label htmlFor="ContactMail" className="text-muted mb-0">
                                    信箱
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="ContactMail"
                                    aria-describedby="emailHelp"
                                    placeholder="example@gmail.com"
                                />
                            </div>
                            {/* <p className="mt-4">Shipping address</p> */}
                            <div className="mb-2">
                                <label htmlFor="ContactName" className="text-muted mb-0">
                                    名字
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="ContactName"
                                    placeholder="請輸入姓名"
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="ContactPhone" className="text-muted mb-0">
                                    電話
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="ContactPhone"
                                    placeholder="請輸入電話"
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="ContactMessage" className="text-muted mb-0">
                                    訊息
                                </label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    id="ContactMessage"
                                    placeholder="請輸入訊息 ... "
                                ></textarea>
                            </div>
                        </form>
                        <div className="d-flex flex-column-reverse flex-md-row mt-4 justify-content-between align-items-md-center align-items-end w-100">
                            <Link to="/cart" className="text-dark mt-md-0 mt-3">
                                <i className="fas fa-chevron-left me-2"></i> 回到購物車
                            </Link>
                            <Link to="/checkout-payment" className="btn btn-dark py-3 px-7">
                                下一步
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
