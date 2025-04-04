import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { pushMessage } from '../redux/toastSlice';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function DeleteOrderModal({ deleteMode, tempOrder, isDeleteOrderModalOpen, setIsDeleteOrderModalOpen, getOrders }) {

  const [isLoading, setIsLoading] = useState(false);
  const delProductModalRef = useRef(null);
  const dispatch = useDispatch();

  const handleDeleteOrder = async () => {
    setIsLoading(true);
    try {
      await deleteOrder();
      getOrders();
      handleCloseDelOrderModal();
    } catch (error) {
      const { message } = error.response.data;
      dispatch(pushMessage({ text: message.join("、"), status: 'failed' }));
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteAllOrder = async () => {
    try {
      await deleteAllOrder();
      getOrders();
      handleCloseDelOrderModal();
    } catch (error) {
      const { message } = error.response.data;
      dispatch(pushMessage({ text: message.join("、"), status: 'failed' }));
    }
  }

  const deleteOrder = async () => {
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/order/${tempOrder.id}`)
      dispatch(pushMessage({ text: "訂單刪除成功", status: 'success' }))
    } catch (error) {
      const { message } = error.response.data;
      dispatch(pushMessage({ text: message.join("、"), status: 'failed' }));
      throw new Error(error);
    }
  }

  const deleteAllOrder = async () => {
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/orders/all`)
      dispatch(pushMessage({ text: "訂單全部刪除成功", status: 'success' }))
    } catch (error) {
      const { message } = error.response.data;
      dispatch(pushMessage({ text: message.join("、"), status: 'failed' }));
      throw new Error(error);
    }
  }

  useEffect(() => {
    new Modal(delProductModalRef.current, { backdrop: 'static' });
    delProductModalRef.current.addEventListener('hidden.bs.modal', () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
  }, [])

  useEffect(() => {
    if (isDeleteOrderModalOpen) {
      const modalInstance = Modal.getInstance(delProductModalRef.current);
      modalInstance.show();
    }
  }, [isDeleteOrderModalOpen])

  const handleCloseDelOrderModal = () => {
    const modalInstance = Modal.getInstance(delProductModalRef.current);
    modalInstance.hide();
    setIsDeleteOrderModalOpen(false);
  }

  return (
    deleteMode === "delete" ?
      <div ref={delProductModalRef} className="modal fade" id="delProductModal" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">刪除訂單</h1>
              <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseDelOrderModal}></button>
            </div>
            <div className="modal-body">
                            你是否要刪除訂單編號：<span className="text-danger fw-bold">{tempOrder.id}</span>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseDelOrderModal}>取消</button>
              <button type="button" className="btn btn-danger" onClick={handleDeleteOrder}>刪除</button>
            </div>
          </div>
        </div>
      </div>
      :
      <div ref={delProductModalRef} className="modal fade" id="delProductModal" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">刪除全部訂單</h1>
              <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseDelOrderModal}></button>
            </div>
            <div className="modal-body">
                            你是否要刪除全部訂單
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseDelOrderModal}>取消</button>
              <button type="button" className="btn btn-danger" onClick={handleDeleteAllOrder} disabled={isLoading}>刪除</button>
            </div>
          </div>
        </div>
      </div>
  )
}

DeleteOrderModal.propTypes = {
  deleteMode: PropTypes.string.isRequired,
  tempOrder: PropTypes.object.isRequired,
  isDeleteOrderModalOpen: PropTypes.bool.isRequired,
  setIsDeleteOrderModalOpen: PropTypes.func.isRequired,
  getOrders: PropTypes.func.isRequired
}

export default DeleteOrderModal;