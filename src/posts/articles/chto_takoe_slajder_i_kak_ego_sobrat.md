---
template: post
title: Что такое слайдер и как его собрать
date: 2015-06-17
tags:
    - article
---

Слайдер - это типовой элемент веб-сайта, в котором размещаются блоки (т.н. слайды), при этом некоторая часть таких блоков скрыта и с использованием специальных элементов управления, мы имеем возможность их прокрутки. Чаще всего единовременно показывается только один слайд.

Итак, в большинстве случаев слайдеры устроены однотипно и используют свойство overflow для сокрытия слайдов и отрицательный margin для осуществления прокрутки слайдов.

В качестве примера будем делать слайдер на чистом JavaScript и анимировать все это будем с использованием css transitions. То что мы получим в конце можно найти <a onclick="o('http://dcvs.ru/other/slider.htm')">здесь</a>. При этом сразу отмечу, что вся логика будет строго в JS, все что касается представления будет в css, а html будет содержать только разметку. Итак с этой самой разметки и начинаем.

```html
<section class="slider">
  <button id="sLeft" class="control left"><</button>
  <div class="contwrap">
    <div id="sCont" class="container" style="margin-left:-0px;">
      <div class="slide">slider1</div>
      <div class="slide">slider2</div>
      <div class="slide">slider3</div>
    </div>
  </div>
  <button id="sRight" class="control right">></button>
</section>
```

![result1](/files/chto_takoe_slajder_i_kak_ego_sobrat/slider1.jpg)

Все содержимое слайдера мы обарачиваем в блок с классом slider. Мы это будем использовать для стилей (чтобы избежать пересечения правил). Далее создаем элементы управления, control left и right. Назначив им id для взаимодействия с элементами через JS. Сами слайды хранятся в блоке container, которому мы назначили id и установили margin-left через inline стили, для того, чтобы в будущем не получить ошибки при расчетах. Сами слайды могут содержать что угодно, любую разметку, единственным требованием является одинаковая ширина всех слайдов, чтобы упростить логику. Приступаем к оформлению. Первое, с чего мы начнем, это запишем все возможные селекторы.

```css
.slider {}
.slider .control {}
.slider .control .left {}
.slider .control .right {}
.slider .contwrap {}
.slider .container {}
.slider .container .slide {}
```

Теперь зададим стили для этих селекторов, позиционирование, оформление и правило transition для container. Css transition задает эффект перехода между двумя состояниями элемента, в нашем случае перед прокруткой и после (эффект плавной прокрутки).

```
.slider {
  display: flex;
}
.slider .control {}
.slider .control .left {}
.slider .control .right {}
.slider .contwrap {
  overflow: hidden;
  width: 400px;
}
.slider .container {
  white-space: nowrap;
  font-size: 0;
  transition: .3s cubic-bezier(0, 0.74, 0.36, 1.09);
}
.slider .container .slide {
  width: 200px;
  display: inline-block;
  height: 200px;
  padding: 25px;
  background-color: #C5291D;
  color: #fff;
  font-size: initial;
  box-sizing: border-box;
  outline: 1px solid #fff;
}
```

![result2](/files/chto_takoe_slajder_i_kak_ego_sobrat/slider2.jpg)

Пару важных моментов. Элементы управления и обертку container мы выстраиваем с использованием flexbox у slider. Сами слайды мы выстраиваем в ряд с использованием свойства display-inline. У обертки container установлено white-space: nowrap чтобы наши слайды не переносились на следующую строку, так же устанавливаем font-size: 0 для того, чтобы убрать пробелы между слайдами, а самим слайдам устанавливаем font-size: initial т.к. свойство font-size наследуется. Чтобы точно задать ширину слайда (избегая расчетов border и padding) мы устанавливаем свойство box-sizing: border-box

Теперь приступим к JS

```
(function() {
  var sCont = document.getElementById('sCont');
  if(sCont) { //проверям, есть ли слайдер
    var sLeft = document.getElementById('sLeft');
    var sRight = document.getElementById('sRight');

    var viewWidth = sCont.parentElement.clientWidth; //получаем ширину contwrap, видимой части
    var slideWidth = sCont.firstElementChild.clientWidth; //ширина одного элемента
    var slideCount = sCont.children.length; //количество всех слайдов

    var min = 0;
    var max = -slideCount + (viewWidth / slideWidth); //максимальное количество переходов вправо

    sLeft.onclick = function() {
      moveSlider(1);
    }

    sRight.onclick = function() {
      moveSlider(-1);
    }

    function moveSlider(direction) {
      var margin = parseInt(sCont.style.marginLeft, 10); //получаем текущий margin
      var active = margin / slideWidth; //узнаем какой сейчас слайд

      active += direction;
      active = (active>min)?min:active; //устанавливаем нижнюю границу
      active = (active<max)?max:active; //устанавливаем верхнюю границу

      sCont.style.marginLeft = active * slideWidth + 'px'; //прокручиваем
    }
  }
})();
```

![result3](/files/chto_takoe_slajder_i_kak_ego_sobrat/slider3.gif)

Самым первым делом, мы пытаемся получить элемент container и если он есть, начинаем работать. Получаем элементы кнопок и получаем ширину контейнера, узнаем ширину одного элемента и получаем количество прямых потомков container. Важно, чтобы внутри небыло лишних элементов, только слайды. Когда внутри слайда может быть любая html структура. Максимальное количество переходов влево равна 0, а вправо -количеству слайдов+количеству слайдов которые видны. На кнопки управления вешается событие onclick с анонимной функцией, которая содержит вызов функции прокрутки с индексом направления. Сама функция прокрутки получает текущий margin и расчитывает какой слайд сейчас слева видимой части контейнера. Прибавляем к полученому значению индекс направления, выполняем проверку и применяем новый margin.

Собственно на этом все, слайдер на чистом JavaScript работает, в самом базовом виде. Благодарю за прочтение.