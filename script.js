document.addEventListener("DOMContentLoaded", () => {

    // ================================
    // SLIDER (solo si existe en la página)
    // ================================

    const sliderContainer = document.querySelector('.slider-container');

    if (sliderContainer) {

        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        let currentSlide = 0;
        let autoSlideInterval;
        let startX = 0;
        let isDragging = false;

        function showSlide(index) {
            currentSlide = (index + slides.length) % slides.length;
            const offset = currentSlide * -100;
            sliderContainer.style.transform = `translateX(${offset}vw)`;

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function prevSlide() {
            showSlide(currentSlide - 1);
        }

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                currentSlide = parseInt(dot.dataset.index);
                showSlide(currentSlide);
                resetAutoSlide();
            });
        });

        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });

        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });

        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5500);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        sliderContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        sliderContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const touchX = e.touches[0].clientX;
            const deltaX = touchX - startX;

            if (deltaX > 50) {
                prevSlide();
                isDragging = false;
                resetAutoSlide();
            } else if (deltaX < -50) {
                nextSlide();
                isDragging = false;
                resetAutoSlide();
            }
        });

        sliderContainer.addEventListener('touchend', () => {
            isDragging = false;
        });

        showSlide(currentSlide);
        startAutoSlide();
    }

    // ================================
    // CONTADORES (siempre funcionan)
    // ================================

    const counters = document.querySelectorAll('.number');

    const startCounting = (counter) => {
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const increment = target / 200;

        const updateCount = () => {
            count += increment;

            if (count < target) {
                counter.textContent = Math.floor(count);
                requestAnimationFrame(updateCount);
            } else {
                counter.textContent = target;
            }
        };

        updateCount();
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounting(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    counters.forEach(counter => observer.observe(counter));

});
const game = document.getElementById("game");

// 4 pares → 8 cartas
let images = [
    "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=300&q=80"
];

// duplicar
let cards = [...images, ...images];

// mezclar
cards.sort(() => Math.random() - 0.5);

let first = null;
let lock = false;

// crear tablero
cards.forEach(src => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = src;
    card.appendChild(img);

    card.addEventListener("click", () => {

        // evita clicks dobles o spam
        if (lock || card.classList.contains("open")) return;

        card.classList.add("open");

        // primera carta
        if (!first) {
            first = card;
            return;
        }

        // segunda carta
        let firstImg = first.querySelector("img").src;
        let secondImg = img.src;

        // si no coinciden → cerrar
        if (firstImg !== secondImg) {
            lock = true; // bloquear mientras se cierran

            setTimeout(() => {
                first.classList.remove("open");
                card.classList.remove("open");
                lock = false;  // 🔥 desbloquear SIEMPRE
                first = null;  // 🔥 resetear primera carta
            }, 600);

        } else {
            // si coinciden → ya están abiertas, continuar
            first = null;
        }

    });

    game.appendChild(card);
});


