import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;

function LoginPage() {
    const navigate = useNavigate();

    const [account, setAccount] = useState({
        "username": "",
        "password": ""
    });

    const handleLoginInputChange = (e) => {
        const { name, value } = e.target;
        setAccount({
            ...account,
            [name]: value
        })
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${BASE_URL}/v2/admin/signin`, account)
            const { token, expired } = res.data;
            document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
            axios.defaults.headers.common['Authorization'] = token;
            navigate('/admin');
        } catch (error) {
            console.log(error)
        }
    }


    const checkUserLogin = useCallback(async () => {
        try {
            await axios.post(`${BASE_URL}/v2/api/user/check`);
            navigate('/admin');
        }
        catch (error) {
            console.log(error)
        }
    }, [navigate]);

    useEffect(() => {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            checkUserLogin();
        }
    }, [checkUserLogin]);

    return (
        <>
            <div className="login-page container-fluid p-0">
                <div className="row g-0 h-100">
                    <div className="col-lg-6 d-none d-lg-block">
                        <div
                            className="bg-image h-100"
                            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1567696911980-2eed69a46042?q=60&w=1500&auto=format&fit=crop")' }}
                        />
                    </div>
                    <div className="col-lg-6 col-md-12 d-flex align-items-center justify-content-center">
                        <div className="px-4 py-5 w-100" style={{ maxWidth: 400 }}>
                            <div className="text-center mb-4">
                                <h1 className="logo">
                                    <NavLink to="/" className="logo-href" style={{
                                        backgroundImage: 'url(./images/logo.png)',
                                        margin: '0 auto',
                                    }}>
                                        home
                                    </NavLink>
                                </h1>
                                <h2>歡迎回來</h2>
                                <p className="text-muted">請輸入您的帳號密碼以登入</p>
                            </div>
                            <form onSubmit={handleLogin}>
                                <div className="form-floating mb-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="username"
                                        name="username"
                                        value={account.username}
                                        onChange={handleLoginInputChange}
                                    />
                                    <label htmlFor="username">電子郵件</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={account.password}
                                        onChange={handleLoginInputChange}
                                    />
                                    <label htmlFor="password">密碼</label>
                                </div>
                                <div className="d-grid gap-2 mt-4">
                                    <button id="login" className="btn btn-primary py-3" type="submit">登入</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

LoginPage.propTypes = {
    setIsAuth: PropTypes.func
};

export default LoginPage;