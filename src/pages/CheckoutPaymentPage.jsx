import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CheckoutPaymentPage() {

    const [cart, setCart] = useState([]);
    const [orderData, setOrderData] = useState(null);
    const navigate = useNavigate();

    const getCart = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
            setCart(res.data.data);
        } catch (error) {
            void error;
            alert("取得購物車失敗");
        }
    };

    const checkOut = async () => {
        // setIsScreenLoading(true);
        try {
            await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, orderData);
            // Toast.fire({
            //     icon: "success",
            //     title: "送出訂單成功"
            // });
            localStorage.removeItem('orderData');
            navigate(`/checkout-success`);
        } catch (error) {
            void error;
            alert("結帳失敗");
        } finally {
            // setIsScreenLoading(false);
        }
    };

    useEffect(() => {
        const savedData = localStorage.getItem('orderData');
        if (savedData) {
            setOrderData(JSON.parse(savedData));
        } else {
            // 如果沒有訂單資訊，退回訂單頁
            navigate('/checkout-form');
        }
    }, []);

    useEffect(() => {
        getCart();
    }, []);

    return (
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
                                <i className="fas fa-check-circle d-md-inline d-block text-center"></i>
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
                    <h3 className="fw-bold mb-4 pt-3">選擇付款方式</h3>
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
                                    <td className="text-end border-0 px-0 pt-4">NT${cart.total?.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <th
                                        scope="row"
                                        className="border-0 px-0 pt-0 pb-4 font-weight-normal"
                                    >
                                        付款方式
                                    </th>
                                    <td className="text-end border-0 px-0 pt-0 pb-4">ApplePay</td>
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
                    <div className="accordion" id="accordionExample">
                        <div className="card rounded-0">
                            <div
                                className="card-header bg-white border-0 py-3"
                                id="headingOne"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseOne"
                                aria-expanded="true"
                                aria-controls="collapseOne"
                            >
                                <p className="mb-0 position-relative custom-checkout-label">
                                    現金支付
                                </p>
                            </div>
                            <div id="collapseOne" className="collapse show" aria-labelledby="headingOne"
                                data-bs-parent="#accordionExample">
                                <div className="card-body bg-light ps-5 py-4">
                                    <div className="mb-2">
                                        <p>使用現金付款</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card rounded-0">
                            <div
                                className="card-header bg-white border-0 py-3 collapsed"
                                id="headingTwo"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseTwo"
                                aria-expanded="true"
                                aria-controls="collapseTwo"
                            >
                                <p className="mb-0 position-relative custom-checkout-label">
                                    信用卡付款
                                </p>
                            </div>
                            <div
                                id="collapseTwo"
                                className="collapse"
                                aria-labelledby="headingTwo"
                                data-bs-parent="#accordionExample"
                            >
                                <div className="card-body bg-light ps-5 py-4">
                                    <div className="mb-2">
                                        <label htmlFor="Lorem ipsum1" className="text-muted mb-0">
                                            信用卡卡號
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="Lorem ipsum1"
                                            placeholder="請輸入信用卡卡號"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card rounded-0">
                            <div
                                className="card-header bg-white border-0 py-3 collapsed"
                                id="headingThree"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseThree"
                                aria-expanded="true"
                                aria-controls="collapseThree"
                            >
                                <p className="mb-0 position-relative custom-checkout-label">
                                    Line Pay
                                </p>
                            </div>
                            <div id="collapseThree" className="collapse" aria-labelledby="headingThree"
                                data-bs-parent="#accordionExample">
                                <div className="card-body bg-light ps-5 py-4">
                                    <div className="mb-2">
                                        <p>使用Line Pay行動支付</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column-reverse flex-md-row mt-4 justify-content-between align-items-md-center align-items-end w-100">
                        <Link to="/checkout-form" className="text-dark mt-md-0 mt-3">
                            <i className="fas fa-chevron-left me-2"></i> 上一步
                        </Link>
                        <button
                            type="button"
                            className="btn btn-dark py-3 px-7"
                            onClick={checkOut}
                        >
                            付款
                        </button>
                        {/* <Link to="/checkout-success" className="btn btn-dark py-3 px-7">
                            付款
                        </Link> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
