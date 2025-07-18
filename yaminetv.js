// yaminetv.js

function getOptimizedCloudinaryUrl(url, transformations = 'f_auto,q_auto,w_auto') {
    if (!url || !url.includes('res.cloudinary.com')) {
        return url;
    }
    const parts = url.split('/upload/');
    if (parts.length === 2) {
        return `${parts[0]}/upload/${transformations}/${parts[1]}`;
    }
    return url;
}

function handleLogoError(imgElement) {
    imgElement.onerror = null;
    const fallbackSpan = document.createElement('span');
    fallbackSpan.className = 'logo-fallback';
    fallbackSpan.textContent = 'SportsPro';
    imgElement.parentNode.replaceChild(fallbackSpan, imgElement);
}

function handleNewsImageError(imgElement) {
    imgElement.onerror = null;
    const fallbackDiv = document.createElement('div');
    fallbackDiv.className = 'news-image-placeholder';
    fallbackDiv.innerHTML = '<i class="fas fa-newspaper"></i>';
    imgElement.parentNode.replaceChild(fallbackDiv, imgElement);
}

const newsArticlesData = [
    {
        category: "Cricket",
        title: "India Dominates Australia in T20 Series Opener",
        excerpt: "A spectacular batting performance led India to a commanding victory in the first T20 match against Australia...",
        author: "Sports Desk",
        time: "2 hours ago",
        img: "https://res.cloudinary.com/dv8uywtbo/image/upload/f_auto,q_auto/v1752855845/t20-wc_mhj2k5.jpg",
        redirectUrl: "news-detail.html?article=india-dominates-aus-t20"
    },
    {
        category: "Cricket",
        title: "Manchester Derby Ends in Thrilling 3-2 Victory",
        excerpt: "An action-packed Manchester derby saw City edge past United in a nail-biting encounter at Old Trafford...",
        author: "Football Reporter",
        time: "4 hours ago",
        img: "https://res.cloudinary.com/dv8uywtbo/image/upload/f_auto,q_auto/v1752855954/odi-wc_p91zs9.jpg",
        redirectUrl: "news-detail.html?article=manchester-derby-thriller"
    },
    {
        category: "Cricket",
        title: "Olympic Preparations Underway for Paris 2024",
        excerpt: "Athletes from around the world are making final preparations as the countdown to Paris 2024 Olympics continues...",
        author: "Olympic Correspondent",
        time: "6 hours ago",
        img: "https://res.cloudinary.com/dv8uywtbo/image/upload/f_auto,q_auto/v1752855978/nepal-fan_idjkbp.jpg",
        redirectUrl: "news-detail.html?article=olympic-preparations"
    },
    {
        category: "Football",
        title: "Wimbledon Quarter-Finals Set for Epic Showdowns",
        excerpt: "The Wimbledon Quarter-Finals promise exciting matches as top seeds face challenging opponents on the grass courts...",
        author: "Tennis Analyst",
        time: "8 hours ago",
        img: "https://res.cloudinary.com/dv8uywtbo/image/upload/f_auto,q_auto/v1752855916/fifa-2022-arg_hkxz5n.jpg",
        redirectUrl: "news-detail.html?article=wimbledon-quarter-finals"
    },
    {
        category: "Football",
        title: "NBA Finals: Lakers vs Warriors Preview",
        excerpt: "Two powerhouse teams prepare for what promises to be an unforgettable NBA Finals series with championship glory at stake...",
        author: "",
        time: "12 hours ago",
        img: "https://res.cloudinary.com/dv8uywtbo/image/upload/f_auto,q_auto/v1752855893/cr7-real_x1mndw.jpg",
        redirectUrl: "news-detail.html?article=nba-finals-preview"
    },
    {
        category: "Football",
        title: "World Records Broken at Diamond League Meet",
        excerpt: "An extraordinary day of athletics saw multiple world records fall at the latest Diamond League meeting in Eugene...",
        author: "Athletics Writer",
        time: "1 day ago",
        img: "https://res.cloudinary.com/dv8uywtbo/image/upload/f_auto,q_auto/v1752855950/james-cl_jszzeh.jpg",
        redirectUrl: "news-detail.html?article=world-records-broken"
    }
];

let newsLoadedCount = 0;
const LOAD_LIMIT = 5; // **OPTIMIZED: Changed from 1 to 5**

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle i');

    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        themeToggle.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeToggle.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.querySelector('.theme-toggle i');

    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.className = 'fas fa-sun';
    } else {
        themeToggle.className = 'fas fa-moon';
    }
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileToggleIcon = mobileToggle.querySelector('i');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');

    navMenu.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');

    if (navMenu.classList.contains('active')) {
        mobileToggleIcon.className = 'fas fa-times';
        document.body.style.overflow = 'hidden'; // Prevent scrolling body when sidebar is open
        navMenu.setAttribute('aria-expanded', 'true');
        // Focus on the first focusable element in the menu for accessibility
        const firstFocusable = navMenu.querySelector('a, button');
        if (firstFocusable) firstFocusable.focus();
    } else {
        mobileToggleIcon.className = 'fas fa-bars';
        document.body.style.overflow = ''; // Restore body scrolling
        navMenu.setAttribute('aria-expanded', 'false');
        mobileToggle.focus();
    }
}

function renderNewsArticles(startIndex, count) {
    const newsGrid = document.getElementById('news-articles-grid');
    if (!newsGrid) {
        return;
    }

    const articles = newsArticlesData;
    if (!articles || articles.length === 0) {
        if (startIndex === 0) {
            const noNewsDiv = document.createElement('div');
            noNewsDiv.className = 'no-content-message';
            noNewsDiv.innerHTML = `<h3>No news articles available</h3>`;
            newsGrid.appendChild(noNewsDiv);
        }
        const sentinel = document.getElementById('news-sentinel');
        if (sentinel) {
            sentinel.style.display = 'none';
            mainObserver.unobserve(sentinel);
        }
        return;
    }

    const endIndex = Math.min(startIndex + count, articles.length);
    const fragment = document.createDocumentFragment();

    for (let i = startIndex; i < endIndex; i++) {
        const articleData = articles[i];
        const newsCard = document.createElement('article');
        newsCard.className = 'news-card';

        const newsImageContainer = document.createElement('div');
        newsImageContainer.className = 'news-image-container';
        const newsImg = new Image();
        newsImg.src = getOptimizedCloudinaryUrl(articleData.img);
        newsImg.alt = articleData.title;
        newsImg.loading = 'lazy';
        newsImg.onerror = function() { handleNewsImageError(this); };
        newsImageContainer.appendChild(newsImg);
        newsCard.appendChild(newsImageContainer);

        const newsContentDiv = document.createElement('div');
        newsContentDiv.className = 'news-content';

        const newsCategorySpan = document.createElement('span');
        newsCategorySpan.className = 'news-category';
        newsCategorySpan.textContent = articleData.category;
        newsContentDiv.appendChild(newsCategorySpan);

        const newsTitleH3 = document.createElement('h3');
        newsTitleH3.className = 'news-title';
        newsTitleH3.textContent = articleData.title;
        newsContentDiv.appendChild(newsTitleH3);

        const newsExcerptP = document.createElement('p');
        newsExcerptP.className = 'news-excerpt';
        newsExcerptP.textContent = articleData.excerpt;
        newsContentDiv.appendChild(newsExcerptP);

        const newsMetaDiv = document.createElement('div');
        newsMetaDiv.className = 'news-meta';
        const sourceSpan = document.createElement('span');
        sourceSpan.textContent = 'Yaminetv';
        const typeSpan = document.createElement('span');
        typeSpan.textContent = 'News';
        newsMetaDiv.appendChild(sourceSpan);
        newsMetaDiv.appendChild(typeSpan);
        newsContentDiv.appendChild(newsMetaDiv);

        newsCard.appendChild(newsContentDiv);

        newsCard.addEventListener('click', () => {
            if (articleData.redirectUrl) {
                window.location.href = articleData.redirectUrl;
            } else {
                window.location.href = `${window.location.origin}/news-detail.html?title=${encodeURIComponent(articleData.title)}`;
            }
        });
        fragment.appendChild(newsCard);
    }
    newsGrid.appendChild(fragment); // **OPTIMIZED: Append fragment once**

    // Observe newly added cards for animation
    fragment.querySelectorAll('.news-card').forEach(card => {
        animationObserver.observe(card);
    });

    const sentinel = document.getElementById('news-sentinel');
    if (sentinel) {
        if (endIndex < articles.length) {
            sentinel.style.display = 'block';
            mainObserver.observe(sentinel);
        } else {
            sentinel.style.display = 'none';
            mainObserver.unobserve(sentinel);
        }
    }
}

function loadNextNews() {
    if (newsLoadedCount >= newsArticlesData.length) {
        const sentinel = document.getElementById('news-sentinel');
        if (sentinel) {
            sentinel.style.display = 'none';
            mainObserver.unobserve(sentinel);
        }
        return;
    }
    renderNewsArticles(newsLoadedCount, LOAD_LIMIT);
    newsLoadedCount += LOAD_LIMIT;
}

function renderTrendingNewsCards() {
    const carousel = document.getElementById('trendingNewsCarousel');
    if (!carousel) return;

    carousel.innerHTML = ''; // Clear existing content

    const fragment = document.createDocumentFragment(); // **OPTIMIZED: Use DocumentFragment for performance**

    newsArticlesData.forEach(articleData => {
        const newsCard = document.createElement('a');
        newsCard.className = 'news-card';
        newsCard.href = articleData.redirectUrl || `${window.location.origin}/news-detail.html?title=${encodeURIComponent(articleData.title)}`;

        const newsImageContainer = document.createElement('div');
        newsImageContainer.className = 'news-image-container';
        const newsImg = new Image();
        newsImg.src = getOptimizedCloudinaryUrl(articleData.img);
        newsImg.alt = articleData.title;
        newsImg.loading = 'lazy';
        newsImg.onerror = function() { handleNewsImageError(this); };
        newsImageContainer.appendChild(newsImg);
        newsCard.appendChild(newsImageContainer);

        const newsContentDiv = document.createElement('div');
        newsContentDiv.className = 'news-content';

        const newsCategorySpan = document.createElement('span');
        newsCategorySpan.className = 'news-category';
        newsCategorySpan.textContent = articleData.category;
        newsContentDiv.appendChild(newsCategorySpan);

        const newsTitleH3 = document.createElement('h3');
        newsTitleH3.className = 'news-title';
        newsTitleH3.textContent = articleData.title;
        newsContentDiv.appendChild(newsTitleH3);

        const newsExcerptP = document.createElement('p');
        newsExcerptP.className = 'news-excerpt';
        newsExcerptP.textContent = articleData.excerpt;
        newsContentDiv.appendChild(newsExcerptP);

        const newsMetaDiv = document.createElement('div');
        newsMetaDiv.className = 'news-meta';
        const sourceSpan = document.createElement('span');
        sourceSpan.textContent = 'Yaminetv';
        const typeSpan = document.createElement('span');
        typeSpan.textContent = 'News';
        newsMetaDiv.appendChild(sourceSpan);
        newsMetaDiv.appendChild(typeSpan);
        newsContentDiv.appendChild(newsMetaDiv);

        newsCard.appendChild(newsContentDiv);
        fragment.appendChild(newsCard); // **OPTIMIZED: Append to fragment**
    });
    carousel.appendChild(fragment); // **OPTIMIZED: Append fragment once to the carousel**
}

// Replaced setInterval with requestAnimationFrame for smoother scrolling
let animationFrameId = null;
let lastScrollTime = 0;
const scrollSpeed = 3000; // Time in ms between scrolls

function autoScrollCarouselRAF(timestamp) {
    if (!lastScrollTime) {
        lastScrollTime = timestamp;
    }

    const elapsed = timestamp - lastScrollTime;

    if (elapsed > scrollSpeed) {
        const carouselWrapper = document.getElementById('newsCarouselWrapper');
        if (carouselWrapper) {
            const carousel = document.getElementById('trendingNewsCarousel');
            if (carousel) { // Ensure carousel element exists
                const computedStyle = window.getComputedStyle(carousel);
                const gap = parseFloat(computedStyle.gap) || 0;

                const wrapperPaddingLeft = parseFloat(window.getComputedStyle(carouselWrapper).paddingLeft || 0);
                const wrapperPaddingRight = parseFloat(window.getComputedStyle(carouselWrapper).paddingRight || 0);
                const scrollUnit = carouselWrapper.clientWidth - wrapperPaddingLeft - wrapperPaddingRight + gap;

                let nextScrollLeft = carouselWrapper.scrollLeft + scrollUnit;

                // Reset to start if near the end, with a small tolerance
                // The tolerance of 5px helps with potential floating point inaccuracies
                if (carouselWrapper.scrollLeft + carouselWrapper.clientWidth >= carouselWrapper.scrollWidth - 5) {
                    nextScrollLeft = 0;
                }

                carouselWrapper.scrollTo({
                    left: nextScrollLeft,
                    behavior: 'smooth'
                });
                lastScrollTime = timestamp; // Reset the timer
            }
        }
    }
    animationFrameId = requestAnimationFrame(autoScrollCarouselRAF);
}

function startAutoScroll() {
    stopAutoScroll(); // Clear any existing animation frames
    if (newsArticlesData.length > 0) { // Only start if there's content to scroll
        lastScrollTime = 0; // Reset last scroll time for immediate next scroll
        animationFrameId = requestAnimationFrame(autoScrollCarouselRAF);
    }
}

function stopAutoScroll() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

document.querySelectorAll('#main-nav-menu .nav-item a').forEach(link => {
    link.addEventListener('click', () => {
        const navMenu = document.querySelector('.nav-menu');
        const mobileToggle = document.querySelector('.mobile-toggle');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');

        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.querySelector('.mobile-toggle i').className = 'fas fa-bars';
            document.body.style.overflow = '';
            navMenu.setAttribute('aria-expanded', 'false');
            mobileToggle.focus();
        }
    });
});

document.addEventListener('click', (e) => {
    const navMenu = document.querySelector('.nav-menu');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navbar = document.querySelector('.navbar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');

    // Only close if click is outside navbar and menu is active
    // Ensure the click isn't on the mobile toggle itself
    if (!navbar.contains(e.target) && navMenu.classList.contains('active') && !mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.querySelector('.mobile-toggle i').className = 'fas fa-bars';
        document.body.style.overflow = '';
        navMenu.setAttribute('aria-expanded', 'false');
        mobileToggle.focus();
    }
});

let scrollTimer;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 100);
});

const mainObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sentinel = entry.target;
            const type = sentinel.dataset.type;

            observer.unobserve(sentinel); // Unobserve once it's intersected to avoid multiple triggers

            if (type === 'news') {
                loadNextNews();
            }
        }
    });
}, {
    root: null,
    rootMargin: '0px 0px 100px 0px', // Load content when sentinel is 100px from viewport bottom
    threshold: 0.1
});

document.addEventListener('DOMContentLoaded', () => {
    const mainLogo = document.getElementById('main-logo');
    if (mainLogo) {
        mainLogo.onerror = function() { handleLogoError(this); };
    }

    try {
        loadTheme();
    } catch (e) {
        console.error("Error loading theme:", e);
    }

    // Initial load for main news grid
    try {
        newsLoadedCount = 0;
        loadNextNews(); // Call loadNextNews which uses renderNewsArticles
    } catch (e) {
        console.error("Error rendering news articles:", e);
    }

    // Trending news carousel setup
    try {
        renderTrendingNewsCards();
        // Start auto-scroll for carousel with requestAnimationFrame
        setTimeout(() => { // Small delay to ensure layout is stable
            startAutoScroll();
        }, 100);

        const newsCarouselWrapper = document.getElementById('newsCarouselWrapper');
        if (newsCarouselWrapper) {
            newsCarouselWrapper.addEventListener('mouseenter', stopAutoScroll);
            newsCarouselWrapper.addEventListener('mouseleave', startAutoScroll);
            // Also stop/start on touch for mobile
            newsCarouselWrapper.addEventListener('touchstart', stopAutoScroll, { passive: true });
            newsCarouselWrapper.addEventListener('touchend', startAutoScroll, { passive: true });
        }
    } catch (e) {
        console.error("Error rendering trending news carousel or starting auto-scroll:", e);
    }

    // Attach animation observer to existing news cards initially
    // New cards are observed within renderNewsArticles
    document.querySelectorAll('.news-section .news-card').forEach(card => {
        animationObserver.observe(card);
    });

    // Observe sentinels for infinite scrolling
    document.querySelectorAll('.load-more-sentinel').forEach(sentinel => {
        const type = sentinel.dataset.type;
        let dataArray;
        if (type === 'news') {
            dataArray = newsArticlesData;
        }

        let currentCount;
        if (type === 'news') currentCount = newsLoadedCount;

        if (dataArray && currentCount < dataArray.length) {
            mainObserver.observe(sentinel);
        } else {
            sentinel.style.display = 'none';
        }
    });
});

const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (!entry.target.classList.contains('animated-once')) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                entry.target.classList.add('animated-once');
            }
            observer.unobserve(entry.target); // Stop observing once animated
        }
    });
}, {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Reduce this to trigger animation a bit sooner
});

// **OPTIMIZED: REMOVED animationMutationObserver** as it was likely causing excessive recalculations.
// The existing `animationObserver` should handle animations for newly added elements
// when they enter the viewport.

function showCustomAlert(message) {
    let alertModal = document.getElementById('customAlertModal');
    if (!alertModal) {
        alertModal = document.createElement('div');
        alertModal.id = 'customAlertModal';
        alertModal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: var(--bg-card);
            padding: 25px;
            border-radius: 10px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            max-width: 90%;
            text-align: center;
            border: 1px solid var(--border-color);
            color: var(--text-primary);
        `;
        document.body.appendChild(alertModal);

        const alertText = document.createElement('p');
        alertText.id = 'customAlertText';
        alertText.style.cssText = `
            margin-bottom: 20px;
            font-size: 1.1em;
            font-weight: 500;
        `;
        alertModal.appendChild(alertText);

        const closeButton = document.createElement('button');
        closeButton.textContent = 'OK';
        closeButton.style.cssText = `
            background-color: var(--primary-color);
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-size: 1em;
            transition: background-color 0.3s ease;
        `;
        closeButton.onmouseover = () => closeButton.style.backgroundColor = 'var(--secondary-color)';
        closeButton.onmouseout = () => closeButton.style.backgroundColor = 'var(--primary-color)';
        closeButton.onclick = () => alertModal.style.display = 'none';
        alertModal.appendChild(closeButton);
    }

    document.getElementById('customAlertText').textContent = message;
    alertModal.style.display = 'flex';
}
