import { Link } from "react-router-dom";

export default function Homepage() {
  return (
    <>
      <div
        className="position-absolute"
        style={{
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundImage:
						"url(https://images.unsplash.com/photo-1436076863939-06870fe779c2?q=80&w=1950&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          backgroundPosition: "center center",
          opacity: "0.4"
        }}
      />
      <div className="container d-flex flex-column position-relative" style={{ minHeight: "100vh", zIndex: 1 }}>
        <div className="row justify-content-center my-auto">
          <div className="col-md-4 text-center">
            <h2>品味醇香，細酌人生</h2>
            <p className="text-muted mb-0">
							在這裡，每一滴酒都是時光的沉澱，蘊含匠心與故事。我們精選來自世界各地的佳釀，無論是醇厚的威士忌、甘美的葡萄酒，還是獨特的手工調酒，都等待與懂得品味的你相遇。舉杯之間，不只是感受酒香，更是體驗生活的美好。
            </p>
            <Link to="/products" className="btn btn-dark rounded-0 mt-6">
							查看商品
            </Link>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row mt-5">
          <div className="col-md-4 mt-md-4 d-flex">
            <div className="card border-0 mb-4 shadow">
              <img
                src="https://images.unsplash.com/photo-1628551000691-06a7d4e00824?q=80&w=1916&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="card-img-top rounded-top"
                alt="微醺晚宴"
              />
              <div className="card-body text-center">
                <h4>微醺晚宴</h4>
                <div className="d-flex justify-content-between">
                  <p className="card-text text-muted mb-0">
										紅酒與美食的搭配，讓每場聚會都充滿儀式感。
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 mt-md-4 d-flex">
            <div className="card border-0 mb-4 shadow">
              <img
                src="https://images.unsplash.com/flagged/photo-1575451538043-06ae93bd7674?q=80&w=1916&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="card-img-top rounded-top"
                alt="獨處時刻"
              />
              <div className="card-body text-center">
                <h4>獨處時刻</h4>
                <div className="d-flex justify-content-between">
                  <p className="card-text text-muted mb-0">
										倒上一杯威士忌，讓醇厚餘韻陪你放慢步調，享受片刻寧靜。
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 mt-md-4 d-flex">
            <div className="card border-0 mb-4 shadow">
              <img
                src="https://images.unsplash.com/photo-1441985969846-3e7c90531139?q=80&w=1916&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="card-img-top rounded-top"
                alt="歡聚瞬間"
              />
              <div className="card-body text-center">
                <h4>歡聚瞬間</h4>
                <div className="d-flex justify-content-between">
                  <p className="card-text text-muted mb-0">
										好友相聚，笑聲與冰涼的啤酒交織，盡情享受這一刻。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-light mt-7">
        <div className="container">
          <div
            id="carouselExampleControls"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className="row justify-content-center py-7">
                  <div className="col-md-6 text-center">
                    <h3>隨一杯美酒，細讀智慧之語</h3>
                    <p className="my-5">「酒是裝滿靈魂的瓶中詩。」</p>
                    <p>
                      <small>— 羅伯特·路易斯·史蒂文生</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="row justify-content-center py-7">
                  <div className="col-md-6 text-center">
                    <h3>微醺時光，品味人生</h3>
                    <p className="my-5">「品酒如品人生，每一滴都有它的故事。」</p>
                    <p>
                      <small>— 薩爾瓦多·達利</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="row justify-content-center py-7">
                  <div className="col-md-6 text-center">
                    <h3>與酒共舞，享受每一刻</h3>
                    <p className="my-5">「一瓶好酒，能讓平凡的夜晚變得不凡。」</p>
                    <p>
                      <small>— 村上春樹</small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <a
              className="carousel-control-prev"
              href="#carouselExampleControls"
              role="button"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="sr-only">Previous</span>
            </a>
            <a
              className="carousel-control-next"
              href="#carouselExampleControls"
              role="button"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="sr-only">Next</span>
            </a>
          </div>
        </div>
      </div>
      <div className="container my-7">
        <div className="row">
          <div className="col-md-6">
            <img
              src="https://images.unsplash.com/photo-1611575189074-9dfbbceb258a?q=80&w=1950&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="探索每一滴醇香"
              className="img-fluid rounded shadow"
            />
          </div>
          <div className="col-md-4 m-auto text-center">
            <h4 className="mt-4">探索每一滴醇香</h4>
            <p className="text-muted">
							從選酒到品酒，我們追求的不只是風味，更是一種生活態度。每一瓶佳釀，都來自我們對品質的承諾，為你帶來最純粹的味覺體驗。
            </p>
          </div>
        </div>
        <div className="row flex-row-reverse justify-content-between mt-4">
          <div className="col-md-6">
            <img
              src="https://images.unsplash.com/photo-1541972184324-d7e22e823db4?q=80&w=1950&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="嚴選世界好酒，呈現最佳風味"
              className="img-fluid rounded shadow"
            />
          </div>
          <div className="col-md-4 m-auto text-center">
            <h4 className="mt-4">嚴選世界好酒，呈現最佳風味</h4>
            <p className="text-muted">
							我們精心挑選來自世界各地的美酒，無論是歷久彌新的經典，還是充滿個性的獨立酒莊之作，都能在這裡找到專屬於你的品味。
            </p>
          </div>
        </div>
      </div>
    </>

  );
}