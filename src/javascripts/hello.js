(() => {
  let mainText = 'Вася Версус';
  let mainFormat = 'color: #f9690e; font-size: 3em';
  let additionalText = 'https://dcversus.ru/about';

  console.clear();
  console.log(`%c${mainText}`, mainFormat);
  console.log(additionalText);
})();