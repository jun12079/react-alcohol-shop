import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import PropTypes from 'prop-types';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;


function CouponModal({ modalMode, tempCoupon, isCouponModalOpen, setIsCouponModalOpen, getCoupons }) {

    const [modalData, setModalData] = useState(tempCoupon);
    const couponModalRef = useRef(null);

    const handleCloseCouponModal = () => {
        const modalInstance = Modal.getInstance(couponModalRef.current);
        modalInstance.hide();
        setIsCouponModalOpen(false);
    }

    const handleModalInputChange = (e) => {
        const { name, value, checked, type } = e.target;
        if (name === 'due_date') {
            // 將datetime-local轉換為timestamp
            const dateTimestamp = Math.floor(new Date(value).getTime() / 1000);
            setModalData({
                ...modalData,
                [name]: dateTimestamp // 儲存為timestamp
            });
        } else {
            setModalData({
                ...modalData,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    }

    const createCoupon = async () => {
        try {
            await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/coupon`, {
                data: {
                    ...modalData,
                    percent: Number(modalData.percent),
                    is_enabled: modalData.is_enabled ? 1 : 0
                }
            })
        } catch (error) {
            console.log(error)
            alert('新增優惠券失敗')
        }
    }

    const updateCoupon = async () => {
        try {
            await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/coupon/${modalData.id}`, {
                data: {
                    ...modalData,
                    percent: Number(modalData.percent),
                    is_enabled: modalData.is_enabled ? 1 : 0
                }
            })
        } catch (error) {
            console.log(error)
            alert('更新優惠券失敗')
        }
    }

    const handleUpadteCoupon = async () => {
        const apiCall = modalMode === 'create' ? createCoupon : updateCoupon;

        try {
            await apiCall();
            getCoupons();
            handleCloseCouponModal();
        } catch (error) {
            console.log(error)
            alert('更新優惠券失敗')
        }
    }

    const formatDatetimeLocal = (timestamp) => {
        if (!timestamp) return '';

        // 將秒轉換為毫秒並新建Date對象
        const date = new Date(timestamp * 1000);

        // 取得年、月、日、時、分並補零
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份從0開始
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        // 轉換成datetime-local的格式: YYYY-MM-DDThh:mm
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    useEffect(() => {
        new Modal(couponModalRef.current, { backdrop: 'static' });
        couponModalRef.current.addEventListener('hidden.bs.modal', () => {
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        });
    }, [])

    useEffect(() => {
        if (isCouponModalOpen) {
            const modalInstance = Modal.getInstance(couponModalRef.current);
            modalInstance.show();
        }
    }, [isCouponModalOpen])

    useEffect(() => {
        setModalData({
            ...tempCoupon
        })
    }, [tempCoupon])

    return (
        <div ref={couponModalRef} className="modal fade" id="couponModal">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="couponModalLabel">{modalMode === 'create' ? '新增產品' : '編輯產品'}</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseCouponModal}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="row mb-3">
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">優惠券名稱</label>
                                    <input type="text" className="form-control" id="title" name="title" placeholder="請輸入優惠券名稱" value={modalData.title} onChange={handleModalInputChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="code" className="form-label">優惠券代碼</label>
                                    <input type="text" className="form-control" id="code" name="code" placeholder="請輸入優惠券名稱" value={modalData.code} onChange={handleModalInputChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="percent" className="form-label">折扣百分比</label>
                                    <input type="number" className="form-control" id="percent" name="percent" placeholder="請輸入折扣" min="0" max="100" value={modalData.percent} onChange={handleModalInputChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="due_date" className="form-label">到期日</label>
                                    <input type="datetime-local" className="form-control" id="due_date" name="due_date" value={formatDatetimeLocal(modalData.due_date)} onChange={handleModalInputChange} />
                                </div>
                                <div className="mb-3">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" id="is_enabled" name="is_enabled" checked={modalData.is_enabled} onChange={handleModalInputChange} />
                                        <label className="form-check-label" htmlFor="is_enabled">是否啟用</label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleCloseCouponModal}>取消</button>
                        <button type="button" className="btn btn-primary" onClick={handleUpadteCoupon}>確認</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

CouponModal.propTypes = {
    modalMode: PropTypes.string,
    tempCoupon: PropTypes.object,
    isCouponModalOpen: PropTypes.bool,
    setIsCouponModalOpen: PropTypes.func,
    getCoupons: PropTypes.func
}

export default CouponModal;