import { useEffect, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import PropTypes from 'prop-types';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function DeleteCouponModal({ tempCoupon, isDeleteCouponModalOpen, setIsDeleteCouponModalOpen, getCoupons }) {

    const delCouponModalRef = useRef(null);

    const handleDeleteCoupon = async () => {
        try {
            await deleteCoupon();
            getCoupons();
            handleCloseDelCouponModal();
        } catch (error) {
            console.log(error)
            alert('刪除產品失敗')
        }
    }

    const deleteCoupon = async () => {
        try {
            await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/coupon/${tempCoupon.id}`)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        new Modal(delCouponModalRef.current, { backdrop: 'static' });
        delCouponModalRef.current.addEventListener('hidden.bs.modal', () => {
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        });
    }, [])

    useEffect(() => {
        if (isDeleteCouponModalOpen) {
            const modalInstance = Modal.getInstance(delCouponModalRef.current);
            modalInstance.show();
        }
    }, [isDeleteCouponModalOpen])

    const handleCloseDelCouponModal = () => {
        const modalInstance = Modal.getInstance(delCouponModalRef.current);
        modalInstance.hide();
        setIsDeleteCouponModalOpen(false);
    }

    return (
        <div ref={delCouponModalRef} className="modal fade" id="delCouponModal" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">刪除優惠券</h1>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseDelCouponModal}></button>
                    </div>
                    <div className="modal-body">
                        你是否要刪除優惠券<span className="text-danger fw-bold">{tempCoupon.title}</span>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleCloseDelCouponModal}>取消</button>
                        <button type="button" className="btn btn-danger" onClick={handleDeleteCoupon}>刪除</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

DeleteCouponModal.propTypes = {
    tempCoupon: PropTypes.object.isRequired,
    isDeleteCouponModalOpen: PropTypes.bool.isRequired,
    setIsDeleteCouponModalOpen: PropTypes.func.isRequired,
    getCoupons: PropTypes.func.isRequired
}

export default DeleteCouponModal;