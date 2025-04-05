import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import { useDispatch } from "react-redux";
import { pushMessage } from '../redux/toastSlice';
import Toast from '../components/Toast';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductsPage() {

  const [pageInfo, setPageInfo] = useState({});
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [wishList, setWishList] = useState(() => {
    const initWishList = localStorage.getItem("wishList") ? JSON.parse(localStorage.getItem("wishList")) : {};
    return initWishList;
  });
  const dispatch = useDispatch();

  const toggleWishListItem = (productId) => {
    const newWishList = {
      ...wishList,
      [productId]: !wishList[productId],
    };
    localStorage.setItem("wishList", JSON.stringify(newWishList));
    setWishList(newWishList);
  };

  useEffect(() => {
    const getAllProducts = async () => {
      setIsScreenLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products/all`);
        setAllProducts(res.data.products);
      } catch {
        dispatch(pushMessage({ text: "取得產品失敗", status: 'failed' }))
      } finally {
        setIsScreenLoading(false);
      }
    };
    getAllProducts();
  }, [dispatch]);

  const getProducts =useCallback( async (page = 1) => {
    setIsScreenLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products?page=${page}&category=${selectedCategory === "全部" ? "" : selectedCategory}`);
      setProducts(res.data.products);
      setPageInfo(res.data.pagination)
    } catch {
      dispatch(pushMessage({ text: "取得產品失敗", status: 'failed' }))
    } finally {
      setIsScreenLoading(false);
    }
  }, [selectedCategory, dispatch]);
  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handlePageChange = (page) => {
    getProducts(page);
  }

  const categories = ['全部', ...new Set(allProducts.map((product) => product.category))];

  return (
    <>
      <div className="container-fluid">
        <div
          className="position-relative d-flex align-items-center justify-content-center"
          style={{ minHeight: "400px" }}
        >
          <div
            className="position-absolute"
            style={{
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundImage:
                                "url(https://images.unsplash.com/photo-1436076863939-06870fe779c2?q=80&w=1950&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
              backgroundPosition: "center center",
              opacity: 0.1,
            }}
          ></div>
          <h2 className="fw-bold">產品列表</h2>
        </div>
        <div className="container mt-md-5 mt-3 mb-7">
          <div className="row">
            <div className="col-md-4">
              <div
                className="accordion border border-bottom border-top-0 border-start-0 border-end-0 mb-3"
                id="accordionExample"
              >
                <div className="card border-0">
                  <div
                    className="card-header px-0 py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0 rounded-0"
                    id="headingOne"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                  >
                    <div className="d-flex justify-content-between align-items-center pe-1">
                      <h4 className="mb-0">分類</h4>
                      <i className="fas fa-chevron-down"></i>
                    </div>
                  </div>
                  <div
                    id="collapseOne"
                    className="collapse show"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="card-body py-0">
                      <ul className="list-unstyled">
                        {categories.map((category) => {
                          return (
                            <li key={category}>
                              <button
                                onClick={() => {
                                  setSelectedCategory(category);
                                }}
                                type="button"
                                className="btn border-none py-2 d-block text-muted"
                              >
                                {category}
                              </button>
                            </li>
                          );
                        }
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="row">
                {products.map((product) => {
                  return (
                    <div className="col-md-6" key={product.id}>
                      <div className="card border-0 mb-4 position-relative position-relative">
                        <img
                          src={product.imageUrl}
                          className="card-img-top rounded-0 product-img"
                          alt={product.title}
                        />
                        <button
                          onClick={() => {
                            toggleWishListItem(product.id);
                          }}
                          type="button"
                          className="btn border-none text-dark"
                        >
                          <i
                            className={`${wishList[product.id] ? 'fas' : 'far'} fa-heart position-absolute`}
                            style={{
                              right: "16px",
                              top: "16px",
                              color: wishList[product.id] ? "red" : "gray"
                            }}
                          ></i>
                        </button>
                        <div className="card-body p-0">
                          <h4 className="mb-0 mt-3">
                            <Link to={`/products/${product.id}`}>{product.title}</Link>
                          </h4>
                          <p className="card-text mb-0">
                                                        NT${product.price}
                            <span className="text-muted ">
                              <del>NT${product.origin_price}</del>
                            </span>
                          </p>
                          <p className="text-muted mt-3">{product.content}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
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
      <Toast />
    </>
  );
}