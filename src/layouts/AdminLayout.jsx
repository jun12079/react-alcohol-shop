import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AdminHeader from "../components/common/AdminHeader";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function AdminLayout() {
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState(false);

    const checkUserLogin = useCallback(async () => {
        try {
            await axios.post(`${BASE_URL}/v2/api/user/check`);
            navigate('/admin');
            setIsAuth(true);
        } catch (error) {
            console.log(error);
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            checkUserLogin();
        }
    }, [checkUserLogin]);

    // **等登入檢查完成後再渲染畫面，避免閃爍**
    if (!isAuth) {
        return null; // 不渲染畫面，等確認登入狀態後才渲染
    }

    return (
        <>
            <AdminHeader />
            <Outlet />
        </>
    );
}