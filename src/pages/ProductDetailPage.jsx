import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import { Link, useParams } from "react-router-dom";
import Swiper from "swiper";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useDispatch } from "react-redux";
import { updateCartData } from "../redux/cartSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductDetailPage() {

    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState({});
    const [qtySelect, setQtySelect] = useState(1);
    const [isScreenLoading, setIsScreenLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { id: product_id } = useParams();
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
            dispatch(updateCartData(res.data.data));
        } catch (error) {
            void error;
            alert("取得購物車失敗");
        }
    };

    useEffect(() => {
            getCart();
            getProducts();
        }, []);

    useEffect(() => {
        const getProduct = async () => {
            setIsScreenLoading(true);
            try {
                const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/product/${product_id}`);
                setProduct(res.data.product);
            } catch (error) {
                void error;
                alert("取得產品失敗");
            } finally {
                setIsScreenLoading(false);
            }
        };
        getProduct();
        getProducts();
    }, []);

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

    const addCartItem = async (product_id, qty) => {
        setIsLoading(true);
        try {
            await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
                data: {
                    product_id,
                    qty: Number(qty),
                },
            });
            getCart();
        } catch (error) {
            void error;
            alert("加入購物車失敗");
        } finally {
            setIsLoading(false);
            setQtySelect(1);
        }
    };

    return (
        <>
            <div className="container-fluid" style={{ paddingTop: "64px" }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-7">
                            <div
                                id="carouselExampleControls"
                                className="carousel slide"
                                data-ride="carousel"
                            >
                                <div className="carousel-inner">
                                    <div className="carousel-item active">
                                        <img
                                            src={product.imageUrl}
                                            className="d-block w-100"
                                            alt={product.title}
                                        />
                                    </div>
                                    <div className="carousel-item">
                                        <img
                                            src="https://images.unsplash.com/photo-1502743780242-f10d2ce370f3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1916&q=80"
                                            className="d-block w-100"
                                            alt="..."
                                        />
                                    </div>
                                    <div className="carousel-item">
                                        <img
                                            src="https://images.unsplash.com/photo-1502743780242-f10d2ce370f3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1916&q=80"
                                            className="d-block w-100"
                                            alt="..."
                                        />
                                    </div>
                                </div>
                                <a
                                    className="carousel-control-prev"
                                    href="#carouselExampleControls"
                                    role="button"
                                    data-slide="prev"
                                >
                                    <span
                                        className="carousel-control-prev-icon"
                                        aria-hidden="true"
                                    ></span>
                                    <span className="sr-only">Previous</span>
                                </a>
                                <a
                                    className="carousel-control-next"
                                    href="#carouselExampleControls"
                                    role="button"
                                    data-slide="next"
                                >
                                    <span
                                        className="carousel-control-next-icon"
                                        aria-hidden="true"
                                    ></span>
                                    <span className="sr-only">Next</span>
                                </a>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb bg-white px-0 mb-0 py-3">
                                    <li className="breadcrumb-item">
                                        <Link className="text-muted" to="/">
                                            首頁
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link className="text-muted" to="/products">
                                            產品列表
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        產品資訊
                                    </li>
                                </ol>
                            </nav>
                            <h2 className="fw-bold h1 mb-1">
                                {product.title}
                            </h2>
                            <p className="mb-0 text-muted text-end">
                                <del>NT${product.origin_price?.toLocaleString()}</del>
                            </p>
                            <p className="h4 fw-bold text-end">NT${product.price?.toLocaleString()}</p>
                            <div className="row align-items-center">
                                <div className="col-6">
                                    <div className="input-group my-3 bg-light rounded">
                                        <div className="input-group-prepend">
                                            <button
                                                onClick={() => setQtySelect(qtySelect - 1)}
                                                disabled={qtySelect === 1}
                                                className="btn btn-outline-dark border-0 py-2"
                                                type="button"
                                                id="button-addon1"
                                            >
                                                <i className="fas fa-minus"></i>
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control border-0 text-center my-auto shadow-none bg-light"
                                            placeholder=""
                                            aria-label="Example text with button addon"
                                            aria-describedby="button-addon1"
                                            value={qtySelect}
                                        />
                                        <div className="input-group-append">
                                            <button
                                                onClick={() => setQtySelect(qtySelect + 1)}
                                                className="btn btn-outline-dark border-0 py-2"
                                                type="button"
                                                id="button-addon2"
                                            >
                                                <i className="fas fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <button
                                        onClick={() => addCartItem(product_id, qtySelect)}
                                        type="button"
                                        className="text-nowrap btn btn-dark w-100 py-2"
                                    >
                                        加入購物車
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row my-5">
                        <div className="col-md-4">
                            <p>
                                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                                nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
                                erat, sed diam voluptua. At vero eos et accusam et
                            </p>
                        </div>
                        <div className="col-md-3">
                            <p className="text-muted">
                                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                                nonumy eirmod tempor
                            </p>
                        </div>
                    </div>
                    <h3 className="fw-bold">Lorem ipsum dolor sit amet</h3>
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
            {isScreenLoading && (
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
            )}
        </>
    );
}

