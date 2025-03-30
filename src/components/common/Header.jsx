import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { updateCartData } from "../../redux/cartSlice";

const routes = [
	{ path: "/", name: "首頁" },
	{ path: "/products", name: "產品列表" },
	{ path: "/login", name: "登入頁面" },
	{ path: "/cart", name: "購物車" },
];

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function Header() {
	const carts = useSelector((state) => state.cart.carts);
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
	}, []);

	return (
		<nav className="navbar navbar-expand-lg navbar-light fixed-top bg-blur shadow-sm">
			<div className="container">
				<h1 className="logo">
					<NavLink to="/" className="logo-href" style={{ backgroundImage: 'url(./images/logo.png)' }}>
						home
					</NavLink>
				</h1>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNavAltMarkup"
					aria-controls="navbarNavAltMarkup"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon" />
				</button>
				<div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
					<div className="navbar-nav">
						{routes.map((route) => (
							<NavLink key={route.path} to={route.path} className="nav-item nav-link me-4">
								{route.name === "購物車" ? (
									<div className="position-relative">
										<i className="fas fa-shopping-cart"></i>
										<span
											className="position-absolute badge text-bg-danger rounded-circle"
											style={{
												bottom: "12px",
												left: "12px",
											}}
										>{carts?.length}</span>
									</div>

								) : (
									route.name
								)}
							</NavLink>
						))}
					</div>
				</div>
			</div>
		</nav>
	);
}
