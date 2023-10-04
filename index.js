'use strict';
//Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Cookies Message
const message = document.createElement('section');
const header = document.querySelector('.header');

message.classList.add('cookie-message');
message.innerHTML =
  "We use cookies for improved functionality and analytics. <button class='btn btn---close-cookie'>Got it! </button>";
header.append(message);
document
  .querySelector('.btn---close-cookie')
  .addEventListener('click', function () {
    message.parentElement.removeChild(message);
  });
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
//Smooth Scroll Event Delegation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('btn--show-modal')
  ) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabbed components - Operations Section
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  //Remove active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(tabContent =>
    tabContent.classList.remove('operations__content--active')
  );
  clicked.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Fade menu elements
const nav = document.querySelector('.nav');

const handleMenuHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(sibling => {
      if (sibling !== link) {
        sibling.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handleMenuHover.bind(0.5));

nav.addEventListener('mouseout', handleMenuHover.bind(1));

//Sticky navigation
const headerSection = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
    if (hiddenMenu.classList.contains('active')) {
      hiddenMenu.classList.remove('active');
      hiddenMenu.classList.add('active-sticky');
    }
  } else {
    nav.classList.remove('sticky');
    hiddenMenu.classList.remove('active');
    hiddenMenu.classList.remove('active-sticky');
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
  if (!entry.isIntersecting) return;
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
  if (!entry.isIntersecting) return;
  //replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
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
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activeDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, index) =>
        (s.style.transform = `translateX(${100 * (index - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else currentSlide++;

    goToSlide(currentSlide);
    activeDot(currentSlide);
  };

  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
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
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activeDot(slide);
    }
  });
};

slider();

//toggle hamburger

const hamMenu = document.querySelector('.hamburger');
const hiddenMenu = document.querySelector('.nav__links');

hamMenu.addEventListener('click', function () {
  if (document.querySelector('.nav').classList.contains('sticky')) {
    hiddenMenu.classList.toggle('active-sticky');
  } else {
    hiddenMenu.classList.toggle('active');
  }
});
