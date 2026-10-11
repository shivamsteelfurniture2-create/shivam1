/* =========================================================
   Shivam Furniture — Full Updated site.js
   Handles: Mobile Nav, Hero Slider (Fixed), Gallery Tabs, Lightbox, Popup
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================
    // 1. MOBILE NAVIGATION MENU TOGGLE
    // ==========================================
    const navToggle = document.getElementById("navToggle");
    const mainNav = document.getElementById("mainNav");

    if (navToggle && mainNav) {
        navToggle.addEventListener("click", function () {
            const isOpen = mainNav.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", isOpen);
        });

        const navLinks = mainNav.querySelectorAll("a");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    // ==========================================
    // 2. HERO IMAGE SLIDER (Fixed Auto-play & Touch)
    // ==========================================
    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    const sliderContainer = document.querySelector(".slider-container");
    
    let currentSlide = 0;
    let slideInterval = null;

    if (slides.length > 0) {

        // स्लाइड दिखाने का मुख्य फ़ंक्शन
        function showSlide(index) {
            slides.forEach((slide) => {
                slide.classList.remove("active");
            });
            currentSlide = (index + slides.length) % slides.length;
            slides[currentSlide].classList.add("active");
        }

        // ऑटो-स्लाइड शुरू करने का सुरक्षित फ़ंक्शन
        function startAutoSlide() {
            stopAutoSlide(); // पुराना टाइमर साफ़ करें
            slideInterval = setInterval(() => {
                showSlide(currentSlide + 1);
            }, 5000); // हर 5 सेकंड में स्लाइड बदलेगी
        }

        // ऑटो-स्लाइड रोकने का फ़ंक्शन
        function stopAutoSlide() {
            if (slideInterval) {
                clearInterval(slideInterval);
                slideInterval = null;
            }
        }

        // नेक्स्ट और प्रीवियस बटन कंट्रोल
        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                showSlide(currentSlide + 1);
                startAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                showSlide(currentSlide - 1);
                startAutoSlide();
            });
        }

        // डेस्कटॉप माउस ओवर होने पर पॉज़/रीज़्यूम
        if (sliderContainer) {
            sliderContainer.addEventListener("mouseenter", stopAutoSlide);
            sliderContainer.addEventListener("mouseleave", startAutoSlide);

            // मोबाइल टच स्वाइप (Touch Swipe Support)
            let touchStartX = 0;
            let touchEndX = 0;

            sliderContainer.addEventListener("touchstart", (e) => {
                touchStartX = e.changedTouches[0].screenX;
                stopAutoSlide();
            }, { passive: true });

            sliderContainer.addEventListener("touchend", (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                startAutoSlide(); // टच ख़त्म होने के बाद ऑटो-स्लाइडर वापस चालू करें
            }, { passive: true });

            function handleSwipe() {
                const swipeThreshold = 40; // न्यूनतम स्वाइप दूरी
                if (touchEndX < touchStartX - swipeThreshold) {
                    showSlide(currentSlide + 1); // बाएँ स्वाइप = अगला
                } else if (touchEndX > touchStartX + swipeThreshold) {
                    showSlide(currentSlide - 1); // दाएँ स्वाइप = पिछला
                }
            }
        }

        // स्लाइडर को पहली स्लाइड से शुरू करें
        showSlide(0);
        startAutoSlide();
    }

    // ==========================================
    // 3. GALLERY CARD IMAGE TITLES (Gallery Page)
    // ==========================================
    const gridItems = document.querySelectorAll(".grid-item");
    gridItems.forEach(item => {
        const img = item.querySelector("img");
        if (img && !item.querySelector(".grid-item-title")) {
            const titleText = img.getAttribute("alt") || "Shivam Furniture Project";
            const titleDiv = document.createElement("div");
            titleDiv.className = "grid-item-title";
            titleDiv.textContent = titleText;
            item.appendChild(titleDiv);
        }
    });

    // ==========================================
    // 4. GALLERY TAB FILTERING (Gallery Page)
    // ==========================================
    const filterBtns = document.querySelectorAll("#galleryFilter .filter-btn");
    const gallerySections = document.querySelectorAll(".gallery-grid");

    if (filterBtns.length > 0 && gallerySections.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener("click", function () {
                filterBtns.forEach(b => b.classList.remove("active"));
                this.classList.add("active");

                const filterValue = this.getAttribute("data-filter");

                gallerySections.forEach(section => {
                    if (filterValue === "all") {
                        section.style.display = "block";
                    } else {
                        if (section.id === filterValue) {
                            section.style.display = "block";
                        } else {
                            section.style.display = "none";
                        }
                    }
                });
            });
        });
    }

    // ==========================================
    // 5. GALLERY LIGHTBOX WITH CAPTION / NAME
    // ==========================================
    const galleryImages = document.querySelectorAll(".grid-item img");
    
    if (galleryImages.length > 0) {
        const lightbox = document.createElement("div");
        lightbox.id = "lightboxOverlay";
        lightbox.style.cssText = `
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.9);
            z-index: 3000;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            cursor: pointer;
        `;

        const lightboxImg = document.createElement("img");
        lightboxImg.style.cssText = `
            max-width: 90%;
            max-height: 75vh;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            object-fit: contain;
        `;

        const lightboxCaption = document.createElement("div");
        lightboxCaption.style.cssText = `
            color: #ffffff;
            margin-top: 15px;
            font-size: 16px;
            font-weight: 500;
            text-align: center;
            background: rgba(255,255,255,0.1);
            padding: 8px 18px;
            border-radius: 20px;
        `;

        lightbox.appendChild(lightboxImg);
        lightbox.appendChild(lightboxCaption);
        document.body.appendChild(lightbox);

        galleryImages.forEach((img) => {
            img.style.cursor = "pointer";
            img.addEventListener("click", () => {
                lightboxImg.src = img.src;
                lightboxCaption.textContent = img.alt || "Shivam Furniture Showcase";
                lightbox.style.display = "flex";
            });
        });

        lightbox.addEventListener("click", () => {
            lightbox.style.display = "none";
        });
    }

    // ==========================================
    // 6. POPUP OUTSIDE CLICK TO CLOSE
    // ==========================================
    const popupOverlay = document.getElementById("enquiryPopup");
    if (popupOverlay) {
        popupOverlay.addEventListener("click", function (e) {
            if (e.target === popupOverlay) {
                closePopup();
            }
        });
    }
});

// ==========================================
// GLOBAL FUNCTIONS FOR ENQUIRY POPUP & FORM
// ==========================================
function openPopup() {
    const popup = document.getElementById("enquiryPopup");
    const formContainer = document.getElementById("formContainer");
    const thankYouMsg = document.getElementById("thankYouMsg");

    if (popup) {
        if (formContainer) formContainer.style.display = "block";
        if (thankYouMsg) thankYouMsg.style.display = "none";
        popup.classList.add("active");
    }
}

function closePopup() {
    const popup = document.getElementById("enquiryPopup");
    if (popup) {
        popup.classList.remove("active");
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    const formContainer = document.getElementById("formContainer");
    const thankYouMsg = document.getElementById("thankYouMsg");

    if (formContainer && thankYouMsg) {
        formContainer.style.display = "none";
        thankYouMsg.style.display = "block";
    }
}
