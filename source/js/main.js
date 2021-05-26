'use strict';

function scrollModule() {
  const regex = '#.+';
  const linksAllList = document.querySelectorAll('a[href]');

  // Получить список элементов для скроллинга
  function getScrollLinksList(linksList) {
    const scrollList = [];
    linksList.forEach(function (value) {
      if (value.hash.match(regex)) {
        if (document.querySelector(value.hash) !== null) {
          scrollList.push(value);
        }
      }
    });
    return scrollList;
  }

  function onScrollLinkClick(evt) {
    evt.preventDefault();
    const hash = evt.currentTarget.hash; // url hash
    const currentPos = window.pageYOffset;  // текущее положение окна
    const elementPos = document.querySelector(evt.currentTarget.hash).getBoundingClientRect().top; // конечная позиция

    const speed = 0.2; // скорость анимации, чем меньше - тем быстрее
    let start = null;

    function step(time) {
      if (start === null) {
        start = time;
      }

      let progress = time - start;
      let r; // расстояние

      if (elementPos < 0) {
        r = Math.max(currentPos - progress / speed, currentPos + elementPos);
      } else {
        r = Math.min(currentPos + progress / speed, currentPos + elementPos);
      }

      window.scrollTo(0, r);

      if (r !== currentPos + elementPos) {
        requestAnimationFrame(step);
      } else {
        location.hash = hash;
      }
    }

    requestAnimationFrame(step); // анимация
  }

  // обработчики на элементы скроллинга
  getScrollLinksList(linksAllList).forEach(function (value) {
    value.addEventListener('click', onScrollLinkClick);
  });
}

function accordeonModule() {
  const accordeon = document.querySelector('.accordeon');
  const accordeonList = accordeon.querySelectorAll('.accordeon__item');

  const accordeonClassNojs = 'accordeon__item--nojs';
  const accordeonClassSelected = 'accordeon__item--selected';
  const accordeonButtonTextOpen = '.accordeon__button-text--open';
  const accordeonButtonTextClose = '.accordeon__button-text--close';
  const accordeonButtonTextSelectedClass = 'accordeon__button-text--selected';

  function onAccordeonItemClick(evt) {
    const currentElem = evt.currentTarget.parentNode;

    if (currentElem.classList.contains(accordeonClassSelected)) {
      currentElem.classList.remove(accordeonClassSelected);
      currentElem.querySelector(accordeonButtonTextClose).classList.add(accordeonButtonTextSelectedClass);
      currentElem.querySelector(accordeonButtonTextOpen).classList.remove(accordeonButtonTextSelectedClass);
    }
    else {
      currentElem.classList.add(accordeonClassSelected);
      currentElem.querySelector(accordeonButtonTextClose).classList.remove(accordeonButtonTextSelectedClass);
      currentElem.querySelector(accordeonButtonTextOpen).classList.add(accordeonButtonTextSelectedClass);
    }
    accordeonList.forEach(function (value) {
      if (value.classList.contains(accordeonClassSelected) && value !== currentElem) {
        value.classList.remove(accordeonClassSelected);
        value.querySelector(accordeonButtonTextClose).classList.add(accordeonButtonTextSelectedClass);
        value.querySelector(accordeonButtonTextOpen).classList.remove(accordeonButtonTextSelectedClass);
      }
    });
  }

  function accordeonInitializing() {
    if (accordeonList !== null) {
      accordeonList.forEach(function (value) {
        value.classList.remove(accordeonClassNojs);
        value.querySelector('.accordeon__header').addEventListener('click', onAccordeonItemClick);
        value.querySelector(accordeonButtonTextOpen).classList.add(accordeonButtonTextSelectedClass);
      });
    }
  }

  accordeonInitializing();
}

function popupModule() {
  const popup = document.querySelector('.popup');
  const popupForm = popup.querySelector('.popup__wrapper');
  const openPopupButton = document.querySelector('.page-header__call-button');
  const popupButtonClose = document.querySelector('.popup__button-close');
  const popupOpenClass = 'popup--open';
  const popupNameInput = document.querySelector('#popup-name');
  const bodyScrollHiddenClass = 'page-body--scroll-hidden';
  const focusSelectors = [
    'a[href]',
    'area[href]',
    'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
    'select:not([disabled]):not([aria-hidden])',
    'textarea:not([disabled]):not([aria-hidden])',
    'button:not([disabled]):not([aria-hidden])',
    'iframe',
    'object',
    'embed',
    '[contenteditable]',
    '[tabindex]:not([tabindex^="-"])',
  ]; // Селекторы элементов, способных фокусироваться
  const popupFocusElementsList = popupForm.querySelectorAll(focusSelectors);
  const popupFocusStartElem = popupFocusElementsList[0];
  const popupFocusEndElem = popupFocusElementsList[popupFocusElementsList.length - 1];
  let mousePressed = false;
  let shiftPressed = false;

  function setFocusControl(evt) { // Установить фокус с клавиатуры только на элементах формы
    if (evt.key === 'Shift') {
      shiftPressed = true;
    }
    if ((!shiftPressed && evt.key === 'Tab') && (document.querySelector(':focus') === popupFocusEndElem)) {
      evt.preventDefault();
      popupFocusStartElem.focus();
    }
    else if ((shiftPressed && evt.key === 'Tab') && (document.querySelector(':focus') === popupFocusStartElem)) {
      evt.preventDefault();
      popupFocusEndElem.focus();
    }
  }

  function onPopupShiftUp(evt) { // отслеживание отпускания shift
    if (evt.key === 'Shift') {
      shiftPressed = false;
    }
  }

  function onPopupEscapeKeyDown(evt) {
    if (evt.key === ('Escape' || 'Esc')) {
      evt.preventDefault();
      setClosePopup();
    }
  }

  function setOpenPopup() { // При открытии окна
    popup.classList.add(popupOpenClass);
    popupNameInput.focus();
    document.body.classList.add(bodyScrollHiddenClass);
    window.addEventListener('keydown', onPopupEscapeKeyDown);
    window.addEventListener('keydown', setFocusControl);
    window.addEventListener('keyup', onPopupShiftUp);
  }

  function onPopupMouseDown(evt) {
    if (evt.target === evt.currentTarget) {
      mousePressed = true;
    }
  }

  function onPopupMouseUp(evt) {
    if (evt.target === evt.currentTarget && mousePressed === true) {
      setClosePopup(evt);
      mousePressed = false;
    }
  }

  function setClosePopup() { // При закрытии окна
    popup.classList.remove(popupOpenClass);
    document.body.classList.remove(bodyScrollHiddenClass);
    openPopupButton.focus();
    window.removeEventListener('keydown', onPopupEscapeKeyDown);
    window.removeEventListener('keydown', setFocusControl);
    window.removeEventListener('keyup', onPopupShiftUp);
  }

  function popupInitializing() {
    if (popup !== null && openPopupButton !== null) {
      openPopupButton.addEventListener('click', setOpenPopup);
      popupButtonClose.addEventListener('click', setClosePopup);
      popup.addEventListener('mousedown', onPopupMouseDown);
      popup.addEventListener('mouseup', onPopupMouseUp);
    }
  }

  popupInitializing();
}

function ValidationModule() {

  const writeUsPhone = document.querySelector('#write-us-phone');
  const popupPhone = document.querySelector('#popup-phone');
  let maskValue = '+{7}(000)-000-00-00';
  let feedbackMaskOptions = {
    mask: maskValue,
  };

  /* global IMask*/
  IMask(popupPhone, feedbackMaskOptions);
  IMask(writeUsPhone, feedbackMaskOptions);

  function onPhoneInputFocus(evt) {
    if (evt.target.value === '') {
      evt.target.value = '+7(';
    }
  }

  function onPhoneInputBlur(evt) {
    if (evt.target.value === '+7(') {
      evt.target.value = '';
    }
  }

  popupPhone.addEventListener('focus', onPhoneInputFocus);
  popupPhone.addEventListener('blur', onPhoneInputBlur);
  writeUsPhone.addEventListener('focus', onPhoneInputFocus);
  writeUsPhone.addEventListener('blur', onPhoneInputBlur);
}

function saveLocalStorageModule() {
  const popupSubmit = document.querySelector('#popup-submit');
  const popupNameInput = document.querySelector('#popup-name');
  const popupPhoneInput = document.querySelector('#popup-phone');
  const popupTextInput = document.querySelector('#popup-text');

  const writeUsSubmit = document.querySelector('#write-us-submit');
  const writeUsNameInput = document.querySelector('#write-us-name');
  const writeUsPhoneInput = document.querySelector('#write-us-phone');
  const writeUsTextInput = document.querySelector('#write-us-text');


  popupSubmit.addEventListener('click', () => {
    localStorage.setItem('name', popupNameInput.value);
    localStorage.setItem('phone', popupPhoneInput.value);
    localStorage.setItem('textQuestion', popupTextInput.value);
  });

  writeUsSubmit.addEventListener('click', () => {
    localStorage.setItem('name', writeUsNameInput.value);
    localStorage.setItem('phone', writeUsPhoneInput.value);
    localStorage.setItem('textQuestion', writeUsTextInput.value);
  });
}


scrollModule();
accordeonModule();
popupModule();
ValidationModule();
saveLocalStorageModule();
