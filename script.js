(function () {
    if (window.location.hostname !== "www.e-bebek.com" || window.location.pathname !== "/") {
      console.log("wrong page");
      return;
    }
  
    if (typeof window.jQuery === "undefined") {
      const script = document.createElement("script");
      script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
      script.onload = () => initCarousel();
      document.head.appendChild(script);
    } else {
      initCarousel();
    }
  
    function initCarousel() {
      const self = {
        init: async () => {
          await self.fetchProducts();
          self.buildHTML();
          self.buildCSS();
          self.renderProducts();
          self.setEvents();
        },
  
        fetchProducts: async () => {
          const localData = localStorage.getItem("products");
          if (localData) {
            //console.log("Veriler localStorage'dan alındı.");
            self.products = JSON.parse(localData);
          } else {
            try {
              const response = await fetch("https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json");
              const data = await response.json();
              localStorage.setItem("products", JSON.stringify(data));
              self.products = data;
              //console.log("API'den veri çekildi ve localStorage'a kaydedildi.");
            } catch (error) {
              //console.error("Ürünler alınırken hata oluştu:", error);
            }
          }
        },
  
        buildHTML: () => {
          const html = `
            <section class="sbk-carousel">
              <div class="sbk-container">
                <div class="sbk-carousel-title-bar">
                  <h2 class="sbk-carousel-title">Beğenebileceğinizi düşündüklerimiz</h2>
                </div>
                <div class="sbk-carousel-wrapper">
                  <button class="sbk-swiper-prev" aria-label="previous">❮</button>
                  <div class="sbk-carousel-container"></div>
                  <button class="sbk-swiper-next" aria-label="next">❯</button>
                </div>
              </div>
            </section>
          `;
          const target = document.querySelector("body > eb-root > cx-storefront > main > cx-page-layout > cx-page-slot.Section1.has-components");
          if (target) {
            target.insertAdjacentHTML("afterend", html);
          } else {
            //console.warn("Uygun hedef bulunamadı, body'e ekleniyor.");
            document.body.insertAdjacentHTML("afterbegin", html);
          }
        },
  
        buildCSS: () => {
            const fontLink = document.createElement("link");
            fontLink.href = "https://fonts.googleapis.com/css2?family=Quicksand:wght@700&display=swap";
            fontLink.rel = "stylesheet";
            document.head.appendChild(fontLink);
            const style = document.createElement("style");
            style.innerHTML = `
                .sbk-carousel {
                  margin-top: 25px;
                }
                .sbk-container {
                  max-width: 1270px; 
                  margin: 0 auto;
                  border-radius: 35px;
                  overflow: visible;
                  box-shadow: 20px 20px 40px -12px #0000000d;
                }

                .sbk-carousel-title-bar {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  background-color: #fef6eb;
                  padding: 25px 67px;
                  border-top-left-radius: 35px;
                  border-top-right-radius: 35px;
                  font-family: 'Quicksand', sans-serif;
                  font-weight: 700;
                }
                .sbk-carousel-title {
                  font-family: 'Quicksand-Bold', sans-serif;
                  font-size: 3rem;
                  font-weight: 700;
                  line-height: 1.11;
                  color: #f28e00;
                  margin: 0;
                }
                .sbk-carousel-container {
                  display: flex;
                  overflow-x: auto;
                  overflow-y: hidden;
                  scroll-behavior: smooth;
                  gap: 16px;
                  padding-bottom: 10px;
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                  padding: 0 8px 10px 8px; 
                   touch-action: pan-x;
                  -webkit-overflow-scrolling: touch;
                }
                .sbk-carousel-container::-webkit-scrollbar {
                  display: none;
                }

                
                @media (min-width: 1200px) {
                  .sbk-product-item {
                    flex: 0 0 calc((100% - 4 * 16px) / 5);
                  }
                }

                .sbk-product-item {
                  height: 546px;
                  padding: 5px;
                  margin: 20px 0 20px 3px;
                  border-radius: 8px;
                  background: #fff;
                  position: relative;
                  transition: all 0.2s ease;
                  border: 1px solid #f0f0f0;
                }
                .sbk-product-item::after {
                  content: "";
                  position: absolute;
                  top: -2px;
                  left: -2px;
                  right: -2px;
                  bottom: -2px;
                  border: 3px solid transparent;
                  border-radius: 10px;
                  pointer-events: none;
                  transition: border-color 0.1s ease;
                }
                .sbk-product-item:hover::after {
                  border-color: #f28e00;
                }
                .sbk-product-item__img {
                  height: 180px; /* Örn: daha küçük bir yükseklik */
                  margin-bottom: 30px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  overflow: hidden;
                }

                .sbk-product-item__img img {
                  height: 100%;
                  width: auto;
                  object-fit: contain;
                }

                .sbk-product-item-content {
                  z-index: 1;
                  display: block;
                  width: 100%;
                  font-family: Poppins, "cursive";
                  font-size: 12px;
                  padding: 5px;
                  color: #7d7d7d;
                  margin: 0 0 20px 3px;
                  border: none;
                  border-radius: 10px;
                  position: relative;
                  text-decoration: none;
                  background-color: #fff;
                }
                .sbk-product-item__brand {
                  font-size: 1.2rem;
                  color: #7d7d7d;
                  margin-bottom: 5px;
                }
                .sbk-star-rating {
                  position: absolute;
                  top: 58px;
                  left: 10px;
                  display: flex;
                  gap: 8px;
                  pointer-events: none;
                }
                .sbk-star {
                  font-size: 14px;
                  color: #e9e9e9;
                }
                .sbk-product-item__price {
                  position: absolute;
                  top: 95px;
                  left: 10px;
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  line-height: 1;
                }
                .sbk-price-top-row {
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  min-height: 22px;
                }
                .sbk-old-price {
                  text-decoration: line-through;
                  color: #7d7d7d;
                  font-size: 1.4rem;
                }
                .sbk-discount-percent {
                  color: #009640;
                  font-size: 18px;
                  font-weight: 700;
                  display: inline-flex;
                  align-items: center;
                  margin-left: 2px;
                }
                .sbk-discount-percent .icon {
                  display: inline-block;
                  height: 22px;
                  font-size: 22px;
                  margin-left: 4px;
                }
                .sbk-price-bottom-row {
                  margin-top: 4px;
                }
                .sbk-new-price {
                  font-weight: 600;
                  line-height: 1.2;
                  color: #7d7d7d !important;
                  font-size: 2.2rem;
                }
                .sbk-green-price {
                  color: #009640 !important;
                  font-size: 2.2rem;
                }
                .sbk-carousel-wrapper {
                  position: relative;
                  display: flex;
                  align-items: center;
                  overflow: visible;
                }
                .sbk-swiper-next,
                .sbk-swiper-prev {
                  width: 50px;
                  height: 50px;
                  border-radius: 50%;
                  position: absolute;
                  top: 50%;
                  transform: translateY(-50%);
                  background-color: #fef6eb;
                  border: 1px solid transparent;
                  cursor: pointer;
                  z-index: 10000;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 24px;
                  color: #f28e00;
                  transition: all 0.2s ease;
                }
                .sbk-swiper-next { right: -60px; }
                .sbk-swiper-prev { left: -60px; }
                .sbk-swiper-next:hover,
                .sbk-swiper-prev:hover {
                  background-color: #fff;
                  border: 1px solid #f28e00;
                }
                .sbk-add-to-cart {
                  position: absolute;
                  bottom: 19px;
                  left: 0;
                  right: 0;
                  margin: 0 20px;
                  width: auto;
                  padding: 15px 20px;
                  border-radius: 37.5px;
                  background-color: #fff7ec;
                  color: #f28e00;
                  font-family: 'Poppins', cursive;
                  font-size: 1.4rem;
                  font-weight: 700;
                  border: none;
                  text-align: center;
                  cursor: pointer;
                  transition: background-color 0.1s ease, color 0.1s ease;
                }
                .sbk-add-to-cart:hover {
                  background-color: #f28e00;
                  color: #fff;
                }

                .sbk-heart-icon-default {
                  opacity: 1;
                  transition: opacity 0.3s ease, transform 0.3s ease;
                }
                .sbk-heart-icon-hovered {
                  opacity: 0;
                  transform: scale(1.9);
                  transition: opacity 0.3s ease, transform 0.3s ease;
                }
                .sbk-heart-icon:hover .sbk-heart-icon-default {
                  opacity: 0;
                }
                .sbk-heart-icon:hover .sbk-heart-icon-hovered {
                  opacity: 1;
                }

                /* Kalp butonu özel stilleri */
                .sbk-heart-icon {
                  position: absolute;
                  top: 10px;
                  right: 15px;
                  width: 48px;
                  height: 48px;
                  border-radius: 50%;
                  background-color: #fff;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  cursor: pointer;
                  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                  transition: all 0.3s ease;
                  z-index: 1;
                }
                .sbk-heart-btn {
                  position: relative;
                  width: 28px;
                  height: 28px;
                }
                .sbk-heart-btn img {
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                  padding: 0;
                  margin: 0;
                  box-sizing: border-box;
                  transition: opacity 0.3s ease, transform 0.3s ease;
                }
                .sbk-heart-icon-default[src*="added-favorite"] {
                  transform: scale(1.9);
                }
                .sbk-heart-btn .toolbox {
                  position: absolute;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  height: 40px;
                  background: #fff;
                  bottom: -60px;
                  right: 20px;
                  border-radius: 8px;
                  visibility: hidden;
                  opacity: 0;
                  box-shadow: 0 1px 1px 0 #0000001c;
                  z-index: 990;
                  white-space: nowrap;
                  padding: 0 16px;
                  font-size: 13px;
                  font-weight: 400;
                  font-family: 'Poppins', sans-serif;
                  transition: opacity 0.3s ease;
                }
                .sbk-heart-btn .toolbox-triangle {
                  position: absolute;
                  top: -6px;
                  right: 12px;
                  width: 0;
                  height: 0;
                  border-left: 6px solid transparent;
                  border-right: 6px solid transparent;
                  border-bottom: 6px solid #fff;
                }
                .sbk-heart-btn:hover .toolbox {
                  visibility: visible;
                  opacity: 1;
                }
                /* 💻 1480px ve üzeri: 5 ürün */
                @media (min-width: 1480px) {
                  .sbk-product-item {
                    flex: 0 0 calc((100% - 4 * 16px) / 5);
                  }
                  .sbk-container {
                    max-width: 1270px;
                  }
                }

                /* 💻 1280px – 1479px: 4 ürün */
                @media (min-width: 1280px) and (max-width: 1479px) {
                  .sbk-product-item {
                    flex: 0 0 calc((100% - 3 * 16px) / 4);
                  }
                  .sbk-container {
                    max-width: 1150px;
                  }
                }

                /* 💻 990px – 1279px: 3 ürün */
                @media (min-width: 992px) and (max-width: 1279px) {
                  .sbk-product-item {
                    flex: 0 0 calc((100% - 2 * 16px) / 3);
                  }
                  .sbk-container {
                    max-width: 940px;
                  }
                }

                /* 📱 989px ve altı: 2 ürün */
                @media (max-width: 991px) {
                  .sbk-product-item {
                    flex: 0 0 calc((100% - 1 * 16px) / 2);
                  }
                  .sbk-container {
                    max-width: 700px;
                  }.sbk-heart-icon {
                    width: 40px;
                    height: 40px;
                    top: 8px;
                    right: 8px;
                  }

                  .sbk-heart-btn {
                    width: 20px;
                    height: 20px;
                  }

                  .sbk-heart-btn img {
                    width: 100%;
                    height: 100%;
                  }

                  
                  .sbk-heart-btn .toolbox {
                    display: none !important;
                  }
                }@media (max-width: 767px) {
                  .sbk-product-item {
                    flex: 0 0 calc((100% - 1 * 16px) / 2);
                  }.sbk-container {
                    max-width: 515px;
                  }
                }@media (max-width: 575px) {
                  .sbk-product-item {
                    flex: 0 0 calc((100% - 1 * 16px) / 2);
                  }

                  .sbk-container {
                    max-width: auto; 
                    padding: 0 17.5px;
                  }

                  
                  .sbk-swiper-prev,
                  .sbk-swiper-next {
                    display: none !important;
                  }
                }@media (max-width: 480px) {
                  .sbk-product-item {
                    flex: 0 0 calc((100% - 16px) / 2) !important;
                    height: auto !important;
                    margin: 10px 0 !important;
                    display: flex !important;
                    flex-direction: column !important;
                    justify-content: flex-start !important;
                    overflow: visible !important;
                  }

                  .sbk-product-item__img {
                    height: auto !important;
                    max-height: 120px !important;
                    margin-bottom: 8px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                  }

                  .sbk-product-item__img img {
                    max-height: 100% !important;
                    max-width: 100% !important;
                    object-fit: contain !important;
                  }

                  .sbk-product-item-content {
                    font-size: 10px !important;
                    padding: 4px !important;
                    flex-grow: 1 !important;
                  }

                  .sbk-product-item__brand {
                    font-size: 0.9rem !important;
                    line-height: 1.2 !important;
                    white-space: normal !important;
                    word-break: break-word !important;
                  }

                  .sbk-star-rating {
                    position: static !important;
                    display: flex !important;
                    flex-wrap: wrap !important;
                    gap: 4px !important;
                    margin-top: 6px !important;
                  }

                  .sbk-product-item__price {
                    position: static !important;
                    margin-top: 6px !important;
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: flex-start !important;
                  }

                  .sbk-price-top-row {
                    display: flex !important;
                    flex-wrap: wrap !important;
                    gap: 4px !important;
                  }

                  .sbk-new-price {
                    font-size: 1.4rem !important;
                    margin-top: 4px !important;
                  }

                  .sbk-add-to-cart {
                    padding: 8px !important;
                    font-size: 1.1rem !important;
                    margin-top: 8px !important;
                  }

                  .sbk-heart-icon {
                    width: 30px !important;
                    height: 30px !important;
                    top: 6px !important;
                    right: 6px !important;
                  }

                  .sbk-heart-btn {
                    width: 18px !important;
                    height: 18px !important;
                  }

                  .sbk-heart-btn img {
                    width: 100% !important;
                    height: 100% !important;
                  }

                  .sbk-heart-btn .toolbox {
                    display: none !important;
                  }
                }

            }`;
            document.head.appendChild(style);
        },

        renderProducts: () => {
            const container = document.querySelector('.sbk-carousel-container');
            if (!container || !self.products) return;
            const favorites = JSON.parse(localStorage.getItem("favoritedProducts") || "[]");
            self.products.forEach(product => {
            const { brand, name, img, price, original_price, id, url } = product;
            const hasDiscount = original_price && original_price !== price;
            const discountAmount = hasDiscount ? (original_price - price) : 0;
            const productIdStr = id.toString();
            const isFavorited = favorites.includes(productIdStr);
            const productHTML = `
                <div class="sbk-product-item" data-id="${productIdStr}">
                 <a class="sbk-product-link" href="${url}" target="_blank">
                     <figure class="sbk-product-item__img">
                         <img src="${img}" alt="${name}" />
                     </figure>
                         <div class="sbk-product-item-content">
                         <h2 class="sbk-product-item__brand">
                         <b>${brand} - </b><span>${name}</span>
                         </h2>
                         <cx-star-rating disabled="true" class="sbk-star-rating" style="--star-fill: 0;">
                           <cx-icon class="sbk-star fas fa-star"></cx-icon>
                           <cx-icon class="sbk-star fas fa-star"></cx-icon>
                           <cx-icon class="sbk-star fas fa-star"></cx-icon>
                           <cx-icon class="sbk-star fas fa-star"></cx-icon>
                           <cx-icon class="sbk-star fas fa-star"></cx-icon>
                         </cx-star-rating>
                         <div class="sbk-product-item__price">
                           <div class="sbk-price-top-row">
                             ${hasDiscount ? `
                          <span class="sbk-old-price">${original_price.toLocaleString()} TL</span>
                          <span class="sbk-discount-percent">
                            %${Math.round(100 * discountAmount / original_price)}
                            <i class="icon icon-decrease"></i>
                          </span>
                        ` : '&nbsp;'}
                         </div>
                             <div class="sbk-price-bottom-row">
                        <span class="sbk-new-price${hasDiscount ? ' sbk-green-price' : ''}">
                        ${price.toLocaleString()} TL
                      </span>
                    </div>
                  </div>
                </div>
              </a>
              <div class="sbk-heart-icon" data-id="${productIdStr}">
                     <div class="sbk-heart-btn">
                  <img 
                    src="assets/svg/${isFavorited ? 'added-favorite' : 'default-favorite'}.svg" 
                    alt="Kalp" 
                    class="sbk-heart-icon-default">
                  <img 
                    src="assets/svg/${isFavorited ? 'added-favorite-hover' : 'default-hover-favorite'}.svg" 
                    alt="Kalp Hover" 
                    class="sbk-heart-icon-hovered">
                  <div class="toolbox">
                    <div class="toolbox-triangle"></div>
                    <span>${isFavorited ? 'Listelerimi güncelle' : 'Listelerime ekle'}</span>
                  </div>
                </div>
                    </div>
                    <button class="sbk-add-to-cart">Sepete Ekle</button>
                  </div>
                `;

            container.insertAdjacentHTML('beforeend', productHTML);
          });
        },
  
        setEvents: () => {
            const prev = document.querySelector(".sbk-swiper-prev");
            const next = document.querySelector(".sbk-swiper-next");
            const container = document.querySelector(".sbk-carousel-container");
            function smoothScrollTo(element, distance, duration = 200) {
                const start = element.scrollLeft;
                const startTime = performance.now();
                function scroll(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = 0.5 * (1 - Math.cos(Math.PI * progress));
                element.scrollLeft = start + distance * ease;
                if (progress < 1) {
                    requestAnimationFrame(scroll);
                }
                }
                requestAnimationFrame(scroll);
            }
  
            function getCardScrollDistance() {
                const item = container.querySelector(".sbk-product-item");
                if (!item) return 0;
                const containerStyle = getComputedStyle(container);
                const gap = parseFloat(containerStyle.gap || "0");
                const itemWidth = item.offsetWidth;
                return itemWidth + gap;
            }
  
            if (prev && next && container) {
                prev.addEventListener("click", () => {
                const distance = getCardScrollDistance();
                smoothScrollTo(container, -distance, 200);
            });
  
            next.addEventListener("click", () => {
            const distance = getCardScrollDistance();
            const maxScrollLeft = container.scrollWidth - container.clientWidth;
            const remainingScroll = maxScrollLeft - container.scrollLeft;
  
            if (remainingScroll > 0) {
                smoothScrollTo(container, Math.min(distance, remainingScroll), 200);
            }
        });
    }
  
    function enableTouchSwipe(container) {
        let startX = 0;
        let startY = 0;
        let isSwiping = false;
        
        const getScrollDistance = () => {
          const item = container.querySelector(".sbk-product-item");
          if (!item) return 0;
        
          const style = getComputedStyle(container);
          const gap = parseFloat(style.gap || "0");
          return item.offsetWidth + gap;
    };
  
    container.addEventListener("touchstart", (e) => {
      // Linklere tıklamayı engellemek için default davranışı durdur
      e.preventDefault(); 
      if (e.touches.length !== 1) return;
  
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isSwiping = true;
    }, { passive: false });
  
    container.addEventListener("touchend", (e) => {
      e.preventDefault(); 
      if (!isSwiping || e.changedTouches.length !== 1) return;
  
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
  
      isSwiping = false;
  
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        const threshold = 40;
        const distance = getScrollDistance();
  
        if (Math.abs(deltaX) > threshold) {
          if (deltaX < 0) {
            smoothScrollTo(container, distance, 200);
          } else {
            smoothScrollTo(container, -distance, 200);
          }
        }
      }
    }, { passive: false });
  }
  
  
  
    if (container) {
      enableTouchSwipe(container);
    }
  
    document.querySelectorAll('.sbk-heart-icon').forEach(heart => {
      heart.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
  
        const id = heart.getAttribute('data-id');
        let favorites = JSON.parse(localStorage.getItem("favoritedProducts") || "[]");
  
        const isFavorited = favorites.includes(id);
  
        if (isFavorited) {
          favorites = favorites.filter(favId => favId !== id);
        } else {
          favorites.push(id);
        }
  
        localStorage.setItem("favoritedProducts", JSON.stringify(favorites));
  
        const nowFavorited = favorites.includes(id);
        const defaultImg = heart.querySelector('.sbk-heart-icon-default');
        const hoverImg = heart.querySelector('.sbk-heart-icon-hovered');
        const toolboxSpan = heart.querySelector('.toolbox span');
  
        if (defaultImg) {
          defaultImg.src = `assets/svg/${nowFavorited ? 'added-favorite' : 'default-favorite'}.svg`;
        }
        if (hoverImg) {
          hoverImg.src = `assets/svg/${nowFavorited ? 'added-favorite-hover' : 'default-hover-favorite'}.svg`;
        }
        if (toolboxSpan) {
          toolboxSpan.textContent = nowFavorited ? 'Listelerimi güncelle' : 'Listelerime ekle';
        }
      });
    });
     }
     };
  
      self.init();
    }
  })();
  
  