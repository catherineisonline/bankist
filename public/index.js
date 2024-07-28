"use strict";
//Cookies Message
const message = document.createElement('section');
const header = document.querySelector('.header');
const closeCookie = document.querySelector('.btn---close-cookie');
//Navigation
const navLinks = document.querySelector('.nav__links');
const navItems = document.querySelector('.nav__item');
const nav = document.querySelector('.nav');
const headerSection = document.querySelector('.header');
const hamMenu = document.querySelector('.hamburger');
//Tabbed components - Operations Section
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const operationContent = document.querySelector('.operations__content');
const test = [];
message.classList.add('cookie-message');
message.innerHTML =
    "We use cookies for improved functionality and analytics. <button class='btn btn---close-cookie'>Got it! </button>";
header.append(message);
if (message.parentElement) {
    message.parentElement.removeChild(message);
}
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
navLinks.addEventListener('click', function (e) {
    e.preventDefault();
    const target = e.target;
    if (e.target &&
        target.classList.contains('nav__link')) {
        const id = target.getAttribute('href');
        const ignoreHref = "./login/login.html";
        if (id === ignoreHref) {
            window.location.href = ignoreHref;
        }
        else if (id) {
            const element = document.querySelector(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
});
tabsContainer.addEventListener('click', function (e) {
    const target = e.target;
    const clicked = target.closest('.operations__tab');
    if (!clicked)
        return;
    //Remove active classes
    tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
    tabsContent.forEach(tabContent => tabContent.classList.remove('operations__content--active'));
    clicked.classList.add('operations__tab--active');
    if (operationContent) {
        const clickedTab = clicked.dataset.tab;
        if (clickedTab) {
            const content = document.querySelector(`.operations__content--${clickedTab}`);
            if (content) {
                content.classList.add('operations__content--active');
            }
        }
    }
});
const handleMenuHover = function (opacity, e) {
    const target = e.target;
    if (target && target.classList.contains('nav__link')) {
        const link = target.closest('.nav');
        const siblings = link.querySelectorAll('.nav__link');
        const logo = link.querySelector('img');
        siblings.forEach(sibling => {
            if (sibling && sibling !== link) {
                sibling.style.opacity = opacity;
            }
        });
        if (logo) {
            logo.style.opacity = opacity;
        }
        target.style.opacity = '1';
    }
};
nav.addEventListener('mouseover', (e) => handleMenuHover('0.5', e));
nav.addEventListener('mouseout', (e) => handleMenuHover('1', e));
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) {
        nav.classList.add('sticky');
        if (nav.classList.contains('active')) {
            navLinks.classList.remove('active');
            navLinks.classList.add('active-sticky');
        }
    }
    else {
        nav.classList.remove('sticky');
        navLinks.classList.remove('active');
        navLinks.classList.remove('active-sticky');
    }
};
const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
});
headerObserver.observe(headerSection);
//Reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting)
        return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
};
const sectionOberver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});
allSections.forEach(function (section) {
    sectionOberver.observe(section);
    section.classList.add('section--hidden');
});
//Lazy load images
const targetImages = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting)
        return;
    //replace src with data-src
    const imgElement = entry.target;
    imgElement.src = imgElement.dataset.src || '';
    imgElement.addEventListener('load', function () {
        entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: '-100px',
});
targetImages.forEach(img => imgObserver.observe(img));
//Slider
const slider = function () {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const maxSlide = slides.length;
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const dotContainer = document.querySelector('.dots');
    const createDots = function () {
        slides.forEach(function (_, i) {
            dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"><span class="hidden-text">hidden text</span></button>`);
        });
    };
    const dots = document
        .querySelectorAll('.dots__dot');
    const activeDot = function (slide) {
        dots.forEach(dot => dot.classList.remove('dots__dot--active'));
        const dotSlide = document
            .querySelector(`.dots__dot`);
        if (dotSlide) {
            const slideData = `[data-slide="${slide}"]`;
            if (slideData) {
                const dataSlide = document.querySelector(`.dots__dot[data-slide="${slide}"]`);
                if (dataSlide) {
                    dataSlide.classList.add('dots__dot--active');
                }
            }
        }
    };
    const goToSlide = function (slide) {
        slides.forEach((s, index) => (s.style.transform = `translateX(${100 * (index - slide)}%)`));
    };
    const nextSlide = function () {
        if (currentSlide === maxSlide - 1) {
            currentSlide = 0;
        }
        else
            currentSlide++;
        goToSlide(currentSlide);
        activeDot(currentSlide);
    };
    const prevSlide = function () {
        if (currentSlide === 0) {
            currentSlide = maxSlide - 1;
        }
        else {
            currentSlide--;
        }
        goToSlide(currentSlide);
        activeDot(currentSlide);
    };
    const init = function () {
        goToSlide(0);
        createDots();
        activeDot(0);
    };
    init();
    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight')
            nextSlide();
        if (e.key === 'ArrowLeft')
            prevSlide();
    });
    dotContainer.addEventListener('click', function (e) {
        const target = e.target;
        if (target && target.classList.contains('dots__dot')) {
            const slide = target.dataset.slide;
            if (slide !== undefined) {
                const slideNumber = parseInt(slide, 10); // Parse the string as an integer
                if (!isNaN(slideNumber)) { // Check if parsing was successful
                    goToSlide(slideNumber);
                    activeDot(slideNumber);
                }
            }
        }
    });
};
slider();
hamMenu.addEventListener('click', function () {
    if (nav.classList.contains('sticky')) {
        navLinks.classList.toggle('active-sticky');
    }
    else {
        navLinks.classList.toggle('active');
    }
});
