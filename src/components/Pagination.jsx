import PropTypes from 'prop-types';

function Pagination({ pageInfo, handlePageChange }) {

  return (
    <div className="d-flex justify-content-center">
      <nav>
        <ul className="pagination">
          <li className={`page-item ${!pageInfo.has_pre && "disabled"}`}>
            <button
              type="button"
              onClick={() => handlePageChange(pageInfo.current_page - 1)}
              className="page-link"
            >
              上一頁
            </button>
          </li>
          {Array.from({ length: pageInfo.total_pages }).map((_, index) => (
            <li key={index} className="page-item">
              <a
                onClick={
                  (event) => {
                    event.preventDefault();
                    handlePageChange(index + 1)
                  }
                }
                className={`page-link ${pageInfo.current_page === index + 1 && "active"}`}
                href="#"
              >
                {index + 1}
              </a>
            </li>
          ))}
          <li className={`page-item ${!pageInfo.has_next && "disabled"}`}>
            <button
              type="button"
              onClick={() => handlePageChange(pageInfo.current_page + 1)}
              className="page-link"
            >
              下一頁
            </button>
          </li>
        </ul>
      </nav>
    </div >
  );
}

Pagination.propTypes = {
  pageInfo: PropTypes.object.isRequired,
  handlePageChange: PropTypes.func.isRequired,
};

export default Pagination;