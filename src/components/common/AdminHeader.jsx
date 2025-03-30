import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

const routes = [
	{ path: "/admin", name: "首頁" },
	{ path: "/admin/products", name: "產品列表" },
	{ path: "/admin/orders", name: "訂單列表" },
	{ path: "/admin/coupons", name: "優惠券列表" },
];

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function AdminHeader() {
	const navigate = useNavigate();

	const logout = async () => {
		try {
			const res = await axios.post(`${BASE_URL}/v2/logout`);
			if (res.status === 200) {
				navigate("/login");
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-blur shadow-sm">
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
								{route.name}
							</NavLink>
						))}
						<button className="btn btn-outline-danger" onClick={logout}>
							<i className="fas fa-sign-out-alt"></i> 登出
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
}
