import React, { useState, useEffect } from 'react';
import { restaurants } from './data';
import './index.css';

const App = () => {
  const [selectedRes, setSelectedRes] = useState(null);

  useEffect(() => {
    if (selectedRes) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [selectedRes]);

  return (
    <>
      <div className="bg-glow"></div>
      <div className="bg-glow-2"></div>
      
      <div className="container">
        <header>
          <h1>Daerim <span className="accent">Authentic</span></h1>
          <p>한국화 0%. 대림동 차이나타운 현지인들이 열광하는 진짜 중국 로컬 맛집 10선</p>
        </header>

        <div className="grid">
          {restaurants.map((res) => (
            <div 
              key={res.id} 
              className="card"
              onClick={() => setSelectedRes(res)}
            >
              <div className="card-image-wrapper">
                <img src={res.imgUrl} alt={res.name} className="card-image" loading="lazy" />
                <div className="img-overlay"></div>
              </div>
              <div className="card-content">
                <h2 className="card-title">{res.name}</h2>
                <div className="card-subtitle">{res.subtitle}</div>
                <div className="tags">
                  {res.tags.map((tag, idx) => (
                    <span key={idx} className="tag">{tag}</span>
                  ))}
                </div>
                <p className="card-desc">{res.history}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal View */}
      <div className={`modal-overlay ${selectedRes ? 'active' : ''}`} onClick={() => setSelectedRes(null)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {selectedRes && (
            <>
              <button className="close-btn" onClick={() => setSelectedRes(null)}>×</button>
              <img src={selectedRes.imgUrl} alt={selectedRes.name} className="modal-header-img" />
              <div className="modal-body">
                <h2 className="modal-title">{selectedRes.name}</h2>
                <div className="modal-subtitle">{selectedRes.subtitle}</div>
                
                <div className="info-section">
                  <div className="info-item">
                    <h3>📌 식당 특징 및 역사</h3>
                    <p>{selectedRes.history}</p>
                  </div>
                  
                  <div className="info-item">
                    <h3>🍖 주력 시그니처 메뉴</h3>
                    <p style={{ color: '#fff', fontWeight: 600 }}>{selectedRes.signature}</p>
                  </div>
                  
                  <div className="info-item">
                    <h3>📜 전체 메뉴 요약</h3>
                    <p>{selectedRes.menu}</p>
                  </div>

                  <div className="info-item">
                    <h3>⏳ 영업시간</h3>
                    <p>{selectedRes.hours}</p>
                  </div>

                  <div className="info-item">
                    <h3>💡 맛있게 즐기는 꿀팁</h3>
                    <p>{selectedRes.tips}</p>
                  </div>
                </div>

                <a 
                  href={selectedRes.mapUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="action-btn"
                >
                  📍 구글 지도에서 위치 보기
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
