import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactLoading from "react-loading";
import Pagination from '../../components/Pagination';
import CouponModal from "../../components/CouponModal";
import DeleteCouponModal from '../../components/DeleteCouponModal';
import Toast from '../../components/Toast';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalState = {
  due_date: 0,
  is_enabled: 0,
  percent: 0,
  code: "",
  title: ""
};

function CouponPage() {

  const [coupons, setCoupons] = useState([])
  const [modalMode, setModalMode] = useState(null);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isDeleteCouponModalOpen, setIsDeleteCouponModalOpen] = useState(false);

  const [tempCoupon, setTempCoupon] = useState(defaultModalState)

  const getCoupons = async (page = 1) => {
    setIsScreenLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/coupons?page=${page}`)
      setCoupons(res.data.coupons)
      setPageInfo(res.data.pagination)
    } catch {
      // console.log(error)
    } finally {
      setIsScreenLoading(false);
    }
  }

  useEffect(() => {
    getCoupons();
  }, [])

  const handleOpenDelCouponModal = (coupon) => {
    setTempCoupon(coupon);
    setIsDeleteCouponModalOpen(true);
  }

  const handleOpenCouponModal = (mode, coupon) => {
    setModalMode(mode);
    switch (mode) {
      case 'create':
        setTempCoupon({ ...defaultModalState });
        break;
      case 'edit':
        setTempCoupon(coupon);
        break;
      default:
        break;
    }
    setIsCouponModalOpen(true);
  }

  const [pageInfo, setPageInfo] = useState({});

  const handlePageChange = (page) => {
    getCoupons(page);
  }

  return (
    <>
      <div className="container mt-4">
        <div className="row mb-3">
          <div className="col">
            <h2>優惠券列表</h2>
          </div>
          <div className="col text-end">
            <button className="btn btn-primary" onClick={() => { handleOpenCouponModal('create') }}>
              <i className="bi bi-plus"></i>新增產品
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>優惠券名稱</th>
                  <th>優惠券代碼</th>
                  <th>折扣百分比</th>
                  <th>是否啟用</th>
                  <th>編輯</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td>{coupon.title}</td>
                    <td>{coupon.code}</td>
                    <td>{coupon.percent}%</td>
                    <td>
                      <span className={`badge ${coupon.is_enabled ? 'bg-success' : 'bg-secondary'}`}>
                        {coupon.is_enabled ? '啟用' : '停用'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-warning me-1" onClick={() => { handleOpenCouponModal('edit', coupon) }}>
                        <i className="bi bi-pencil"></i> 編輯
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => { handleOpenDelCouponModal(coupon) }}>
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
      <CouponModal modalMode={modalMode} tempCoupon={tempCoupon} isCouponModalOpen={isCouponModalOpen} setIsCouponModalOpen={setIsCouponModalOpen} getCoupons={getCoupons} />
      <DeleteCouponModal tempCoupon={tempCoupon} isDeleteCouponModalOpen={isDeleteCouponModalOpen} setIsDeleteCouponModalOpen={setIsDeleteCouponModalOpen} getCoupons={getCoupons} />
      <Toast />
    </>
  );
}

export default CouponPage;