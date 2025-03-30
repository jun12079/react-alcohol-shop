import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactLoading from "react-loading";
import Pagination from '../../components/Pagination';
import OrderModal from "../../components/OrderModal";
import DeleteOrderModal from '../../components/DeleteOrderModal';
import Toast from '../../components/Toast';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalState = {
    create_at: "",
    id: "",
    is_paid: false,
    message: "",
    num: "",
    products: {},
    total: "",
    user: {}
};

function OrderPage() {

    const [orders, setOrders] = useState([])
    const [isScreenLoading, setIsScreenLoading] = useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isDeleteOrderModalOpen, setIsDeleteOrderModalOpen] = useState(false);

    const [tempOrder, setTempOrder] = useState(defaultModalState)
    const [deleteMode, setDeleteMode] = useState("delete");

    const getOrders = async (page = 1) => {
        setIsScreenLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/orders?page=${page}`)
            setOrders(res.data.orders)
            setPageInfo(res.data.pagination)
        } catch (error) {
            console.log(error)
        } finally {
            setIsScreenLoading(false);
        }
    }

    useEffect(() => {
        getOrders();
    }, [])

    const handleOpenDelOrderModal = (deleteMode, order) => {
        setDeleteMode(deleteMode);
        switch (deleteMode) {
            case "delete":
                setTempOrder(order);
                break;
            case "deleteAll":
                break;
            default:
                break;
        }
        setIsDeleteOrderModalOpen(true);
    }

    const handleOpenProductModal = (order) => {
        setTempOrder(order);
        setIsOrderModalOpen(true);
    }

    const [pageInfo, setPageInfo] = useState({});

    const handlePageChange = (page) => {
        getOrders(page);
    }

    return (
        <>
            <div className="container mt-4">
                <div className="row mb-3">
                    <div className="col">
                        <h2>訂單列表</h2>
                    </div>
                    <div className="col text-end">
                        <button className="btn btn-danger" onClick={() => { handleOpenDelOrderModal("deleteAll") }}>
                            <i className="far fa-trash-alt"></i> 刪除全部訂單
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>訂單編號</th>
                                    <th>客戶名稱</th>
                                    <th>訂單金額</th>
                                    <th>訂單時間</th>
                                    <th>付款狀態</th>
                                    <th>訂單操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.user.name}</td>
                                        <td>${order.total}</td>
                                        <td>{order.create_at}</td>
                                        <td>
                                            <span className={`badge ${order.is_paid ? 'bg-success' : 'bg-secondary'}`}>
                                                {order.is_paid ? '已付款' : '未付款'}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-warning me-1" onClick={() => { handleOpenProductModal(order) }}>
                                                <i className="bi bi-pencil"></i> 編輯
                                            </button>
                                            <button className="btn btn-sm btn-danger" onClick={() => { handleOpenDelOrderModal("delete", order) }}>
                                                <i className="bi bi-trash"></i> 刪除
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
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
            <OrderModal tempOrder={tempOrder} isOrderModalOpen={isOrderModalOpen} setIsOrderModalOpen={setIsOrderModalOpen} getOrders={getOrders} />
            <DeleteOrderModal deleteMode={deleteMode} tempOrder={tempOrder} isDeleteOrderModalOpen={isDeleteOrderModalOpen} setIsDeleteOrderModalOpen={setIsDeleteOrderModalOpen} getOrders={getOrders} />
            <Toast />
        </>
    );
}

export default OrderPage;