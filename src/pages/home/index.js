//Modal
var modal = document.querySelector('.modal');
var overlay = document.querySelector('.overlay');
var btnCloseModal = document.querySelector('.btn--close-modal');
var btnsOpenModal = document.querySelectorAll('.btn--show-modal');
//Cookies Message
var message = document.createElement('section');
var header = document.querySelector('.header');
var closeCookie = document.querySelector('.btn---close-cookie');
//Navigation
var navLinks = document.querySelector('.nav__links');
var nav = document.querySelector('.nav');
var headerSection = document.querySelector('.header');
var hamMenu = document.querySelector('.hamburger');
//Tabbed components - Operations Section
var tabs = document.querySelectorAll('.operations__tab');
var tabsContainer = document.querySelector('.operations__tab-container');
var tabsContent = document.querySelectorAll('.operations__content');
var operationContent = document.querySelector('.operations__content');
var openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};
var closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};
btnsOpenModal.forEach(function (btn) { return btn.addEventListener('click', openModal); });
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});
message.classList.add('cookie-message');
message.innerHTML =
    "We use cookies for improved functionality and analytics. <button class='btn btn---close-cookie'>Got it! </button>";
header.append(message);
if (message.parentElement) {
    message.parentElement.removeChild(message);
}
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
//Smooth Scroll Event Delegation
navLinks.addEventListener('click', function (e) {
    e.preventDefault();
    var target = e.target;
    if (e.target &&
        target.classList.contains('nav__link') &&
        !target.classList.contains('btn--show-modal')) {
        var id = target.getAttribute('href');
        if (id) {
            var element = document.querySelector(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
});
tabsContainer.addEventListener('click', function (e) {
    var target = e.target;
    var clicked = target.closest('.operations__tab');
    if (!clicked)
        return;
    //Remove active classes
    tabs.forEach(function (tab) { return tab.classList.remove('operations__tab--active'); });
    tabsContent.forEach(function (tabContent) {
        return tabContent.classList.remove('operations__content--active');
    });
    clicked.classList.add('operations__tab--active');
    if (operationContent) {
        var clickedTab = clicked.dataset.tab;
        if (clickedTab) {
            var content = document.querySelector(".operations__content--".concat(clickedTab));
            if (content) {
                content.classList.add('operations__content--active');
            }
        }
    }
});
var handleMenuHover = function (opacity, e) {
    var target = e.target;
    if (target && target.classList.contains('nav__link')) {
        var link_1 = target.closest('.nav');
        var siblings = link_1.querySelectorAll('.nav__link');
        var logo = link_1.querySelector('img');
        siblings.forEach(function (sibling) {
            if (sibling && sibling !== link_1) {
                sibling.style.opacity = opacity;
            }
        });
        if (logo) {
            logo.style.opacity = opacity;
        }
        target.style.opacity = '1';
    }
};
nav.addEventListener('mouseover', function (e) { return handleMenuHover('0.5', e); });
nav.addEventListener('mouseout', function (e) { return handleMenuHover('1', e); });
var navHeight = nav.getBoundingClientRect().height;
var stickyNav = function (entries) {
    var entry = entries[0];
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
var headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: "-".concat(navHeight, "px"),
});
headerObserver.observe(headerSection);
//Reveal sections
var allSections = document.querySelectorAll('.section');
var revealSection = function (entries, observer) {
    var entry = entries[0];
    if (!entry.isIntersecting)
        return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
};
var sectionOberver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});
allSections.forEach(function (section) {
    sectionOberver.observe(section);
    section.classList.add('section--hidden');
});
//Lazy load images
var targetImages = document.querySelectorAll('img[data-src]');
var loadImg = function (entries, observer) {
    var entry = entries[0];
    if (!entry.isIntersecting)
        return;
    //replace src with data-src
    var imgElement = entry.target;
    imgElement.src = imgElement.dataset.src || '';
    imgElement.addEventListener('load', function () {
        entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
};
var imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: '-100px',
});
targetImages.forEach(function (img) { return imgObserver.observe(img); });
//Slider
var slider = function () {
    var currentSlide = 0;
    var slides = document.querySelectorAll('.slide');
    var maxSlide = slides.length;
    var btnLeft = document.querySelector('.slider__btn--left');
    var btnRight = document.querySelector('.slider__btn--right');
    var dotContainer = document.querySelector('.dots');
    var createDots = function () {
        slides.forEach(function (_, i) {
            dotContainer.insertAdjacentHTML('beforeend', "<button class=\"dots__dot\" data-slide=\"".concat(i, "\"></button>"));
        });
    };
    var dots = document
        .querySelectorAll('.dots__dot');
    var activeDot = function (slide) {
        dots.forEach(function (dot) { return dot.classList.remove('dots__dot--active'); });
        var dotSlide = document
            .querySelector(".dots__dot");
        if (dotSlide) {
            var slideData = "[data-slide=\"".concat(slide, "\"]");
            if (slideData) {
                var dataSlide = document.querySelector(".dots__dot[data-slide=\"".concat(slide, "\"]"));
                if (dataSlide) {
                    dataSlide.classList.add('dots__dot--active');
                }
            }
        }
    };
    var goToSlide = function (slide) {
        slides.forEach(function (s, index) {
            return (s.style.transform = "translateX(".concat(100 * (index - slide), "%)"));
        });
    };
    var nextSlide = function () {
        if (currentSlide === maxSlide - 1) {
            currentSlide = 0;
        }
        else
            currentSlide++;
        goToSlide(currentSlide);
        activeDot(currentSlide);
    };
    var prevSlide = function () {
        if (currentSlide === 0) {
            currentSlide = maxSlide - 1;
        }
        else {
            currentSlide--;
        }
        goToSlide(currentSlide);
        activeDot(currentSlide);
    };
    var init = function () {
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
        var target = e.target;
        if (target && target.classList.contains('dots__dot')) {
            var slide = target.dataset.slide;
            if (slide !== undefined) {
                var slideNumber = parseInt(slide, 10); // Parse the string as an integer
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
