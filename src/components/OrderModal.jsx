import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { pushMessage } from '../redux/toastSlice';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;


function OrderModal({ tempOrder, isOrderModalOpen, setIsOrderModalOpen, getOrders }) {

    const [modalData, setModalData] = useState(tempOrder);
    const [isLoading, setIsLoading] = useState(false);
    const orderModalRef = useRef(null);
    const dispatch = useDispatch();

    const handleCloseOrderModal = () => {
        const modalInstance = Modal.getInstance(orderModalRef.current);
        modalInstance.hide();
        setIsOrderModalOpen(false);
    }

    const handleModalInputChange = (e) => {
        const { name, value, checked, type } = e.target;
        setModalData({
            ...modalData,
            ...(
                name === "is_paid" ?
                    {
                        [name]: type === "checkbox" ? checked : value
                    } :
                    {
                        user: { ...modalData.user, [name]: value }
                    }
            )
        })
    }

    const updateOrder = async () => {
        setIsLoading(true);
        try {
            await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/order/${modalData.id}`, {
                data: {
                    ...modalData,
                    is_paid: modalData.is_paid ? true : false
                }
            })
            dispatch(pushMessage({ text: "訂單更新成功", status: 'success' }))
        } catch (error) {
            // console.log(error)
            // alert('更新產品失敗')
            const { message } = error.response.data;
            dispatch(pushMessage({ text: message.join("、"), status: 'failed' }));
        } finally {
            setIsLoading(false);
        }
    }

    const handleUpadteOrder = async () => {
        try {
            await updateOrder();
            getOrders();
            handleCloseOrderModal();
        } catch (error) {
            console.log(error)
            alert('更新訂單失敗')
        }
    }

    const updateOrderItemQty = (productItem_id, price, qty) => {
        const obj = {
            ...modalData.products,
        };

        obj[productItem_id].qty = qty;
        obj[productItem_id].total = qty * price;
        obj[productItem_id].final_total = qty * price;

        setModalData({
            ...modalData,
            products: obj,
        });
    }

    const removeOrderItemProduct = (productItem_id) => {
        const obj = {
            ...modalData.products,
        };

        delete obj[productItem_id];

        setModalData({
            ...modalData,
            products: obj,
        });
    }

    useEffect(() => {
        new Modal(orderModalRef.current, { backdrop: 'static' });
        orderModalRef.current.addEventListener('hidden.bs.modal', () => {
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        });
    }, [])

    useEffect(() => {
        if (isOrderModalOpen) {
            const modalInstance = Modal.getInstance(orderModalRef.current);
            modalInstance.show();
        }
    }, [isOrderModalOpen])

    useEffect(() => {
        setModalData({
            ...tempOrder
        })
    }, [tempOrder])

    return (
        <div ref={orderModalRef} className="modal fade" id="productModal">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="productModalLabel">編輯訂單</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseOrderModal}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">客戶名稱</label>
                                        <input type="text" className="form-control" id="name" name="name" placeholder="請輸入客戶名稱" value={modalData.user.name} onChange={handleModalInputChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">客戶信箱</label>
                                        <input type="text" className="form-control" id="email" name="email" placeholder="請輸入客戶信箱" value={modalData.user.email} onChange={handleModalInputChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="tel" className="form-label">客戶電話</label>
                                        <input type="text" className="form-control" id="tel" name="tel" placeholder="請輸入客戶電話" value={modalData.user.tel} onChange={handleModalInputChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="address" className="form-label">客戶地址</label>
                                        <input type="text" className="form-control" id="address" name="address" placeholder="請輸入客戶地址" value={modalData.user.address} onChange={handleModalInputChange} />
                                    </div>
                                    <div className="mb-3">
                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" id="is_paid" name="is_paid" checked={modalData.is_paid} onChange={handleModalInputChange} />
                                            <label className="form-check-label" htmlFor="is_paid">是否付款</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <table className="table align-middle">
                                        <thead>
                                            <tr>
                                                <th>品名</th>
                                                <th style={{ width: "150px" }}>數量/單位</th>
                                                <th className="text-end">單價</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.values(modalData.products).map((productItem) => {
                                                return (
                                                    <tr key={productItem.id}>
                                                        <td>{productItem.product.title}</td>
                                                        <td style={{ width: "150px" }}>
                                                            <div className="d-flex align-items-center">
                                                                <div className="btn-group me-2" role="group">
                                                                    <button
                                                                        onClick={() => {
                                                                            updateOrderItemQty(productItem.id, productItem.product.price, productItem.qty - 1);
                                                                        }}
                                                                        type="button"
                                                                        className="btn btn-outline-dark btn-sm" disabled={productItem.qty === 1}
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span
                                                                        className="btn border border-dark"
                                                                        style={{ width: "50px", cursor: "auto" }}
                                                                    >{productItem.qty}</span>
                                                                    <button
                                                                        onClick={() => {
                                                                            updateOrderItemQty(productItem.id, productItem.product.price, productItem.qty + 1);
                                                                        }}
                                                                        type="button"
                                                                        className="btn btn-outline-dark btn-sm"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                                <span className="input-group-text bg-transparent border-0">
                                                                    {productItem.product.unit}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="text-end">{productItem.total}</td>
                                                        <td>
                                                            <button
                                                                onClick={() => {
                                                                    removeOrderItemProduct(productItem.id);
                                                                }}
                                                                type="button"
                                                                className="btn btn-outline-danger btn-sm"
                                                            >
                                                                刪除
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleCloseOrderModal}>取消</button>
                        <button type="button" className="btn btn-primary" onClick={handleUpadteOrder} disabled={isLoading}>確認</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

OrderModal.propTypes = {
    tempOrder: PropTypes.object,
    isOrderModalOpen: PropTypes.bool,
    setIsOrderModalOpen: PropTypes.func,
    getOrders: PropTypes.func
}

export default OrderModal;