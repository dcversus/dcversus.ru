window.removeClass = function(klass, btn) {
  let element = document.getElementsByClassName(klass)[0];
  element.classList.remove(klass);

  btn.remove();
};