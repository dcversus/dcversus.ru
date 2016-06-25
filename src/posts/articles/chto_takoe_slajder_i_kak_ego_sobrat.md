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

<pre class="html4strict" style="font-family:monospace;"><span style="color: #009900;"><section <span style="color: #000066;">class</span><span style="color: #66cc66;">=</span><span style="color: #ff0000;">"slider"</span>></span>
  <span style="color: #009900;"><<span style="color: #000000; font-weight: bold;">button</span> <span style="color: #000066;">id</span><span style="color: #66cc66;">=</span><span style="color: #ff0000;">"sLeft"</span> <span style="color: #000066;">class</span><span style="color: #66cc66;">=</span><span style="color: #ff0000;">"control left"</span>><<<span style="color: #66cc66;">/</span><span style="color: #000000; font-weight: bold;">button</span>></span>
  <span style="color: #009900;"><<span style="color: #000000; font-weight: bold;">div</span> <span style="color: #000066;">class</span><span style="color: #66cc66;">=</span><span style="color: #ff0000;">"contwrap"</span>></span>
    <span style="color: #009900;"><<span style="color: #000000; font-weight: bold;">div</span> <span style="color: #000066;">id</span><span style="color: #66cc66;">=</span><span style="color: #ff0000;">"sCont"</span> <span style="color: #000066;">class</span><span style="color: #66cc66;">=</span><span style="color: #ff0000;">"container"</span> <span style="color: #000066;">style</span><span style="color: #66cc66;">=</span><span style="color: #ff0000;">"margin-left:-0px;"</span>></span>
      <span style="color: #009900;"><<span style="color: #000000; font-weight: bold;">div</span> <span style="color: #000066;">class</span><span style="color: #66cc66;">=</span><span style="color: #ff0000;">"slide"</span>></span>slider1<span style="color: #009900;"><<span style="color: #66cc66;">/</span><span style="color: #000000; font-weight: bold;">div</span>></span>
      <span style="color: #009900;"><<span style="color: #000000; font-weight: bold;">div</span> <span style="color: #000066;">class</span><span style="color: #66cc66;">=</span><span style="color: #ff0000;">"slide"</span>></span>slider2<span style="color: #009900;"><<span style="color: #66cc66;">/</span><span style="color: #000000; font-weight: bold;">div</span>></span>
      <span style="color: #009900;"><<span style="color: #000000; font-weight: bold;">div</span> <span style="color: #000066;">class</span><span style="color: #66cc66;">=</span><span style="color: #ff0000;">"slide"</span>></span>slider3<span style="color: #009900;"><<span style="color: #66cc66;">/</span><span style="color: #000000; font-weight: bold;">div</span>></span>
    <span style="color: #009900;"><<span style="color: #66cc66;">/</span><span style="color: #000000; font-weight: bold;">div</span>></span>
  <span style="color: #009900;"><<span style="color: #66cc66;">/</span><span style="color: #000000; font-weight: bold;">div</span>></span>
  <span style="color: #009900;"><<span style="color: #000000; font-weight: bold;">button</span> <span style="color: #000066;">id</span><span style="color: #66cc66;">=</span><span style="color: #ff0000;">"sRight"</span> <span style="color: #000066;">class</span><span style="color: #66cc66;">=</span><span style="color: #ff0000;">"control right"</span>></span>><span style="color: #009900;"><<span style="color: #66cc66;">/</span><span style="color: #000000; font-weight: bold;">button</span>></span>
<span style="color: #009900;"><<span style="color: #66cc66;">/</span>section></span></pre>

![result1](/files/chto_takoe_slajder_i_kak_ego_sobrat/slider1.jpg)

Все содержимое слайдера мы обарачиваем в блок с классом slider. Мы это будем использовать для стилей (чтобы избежать пересечения правил). Далее создаем элементы управления, control left и right. Назначив им id для взаимодействия с элементами через JS. Сами слайды хранятся в блоке container, которому мы назначили id и установили margin-left через inline стили, для того, чтобы в будущем не получить ошибки при расчетах. Сами слайды могут содержать что угодно, любую разметку, единственным требованием является одинаковая ширина всех слайдов, чтобы упростить логику. Приступаем к оформлению. Первое, с чего мы начнем, это запишем все возможные селекторы.

<pre class="css" style="font-family:monospace;"><span style="color: #6666ff;">.slider</span> <span style="color: #00AA00;">{</span><span style="color: #00AA00;">}</span>
<span style="color: #6666ff;">.slider</span> <span style="color: #6666ff;">.control</span> <span style="color: #00AA00;">{</span><span style="color: #00AA00;">}</span>
<span style="color: #6666ff;">.slider</span> <span style="color: #6666ff;">.control</span> <span style="color: #6666ff;">.left</span> <span style="color: #00AA00;">{</span><span style="color: #00AA00;">}</span>
<span style="color: #6666ff;">.slider</span> <span style="color: #6666ff;">.control</span> <span style="color: #6666ff;">.right</span> <span style="color: #00AA00;">{</span><span style="color: #00AA00;">}</span>
<span style="color: #6666ff;">.slider</span> <span style="color: #6666ff;">.contwrap</span> <span style="color: #00AA00;">{</span><span style="color: #00AA00;">}</span>
<span style="color: #6666ff;">.slider</span> <span style="color: #6666ff;">.container</span> <span style="color: #00AA00;">{</span><span style="color: #00AA00;">}</span>
<span style="color: #6666ff;">.slider</span> <span style="color: #6666ff;">.container</span> <span style="color: #6666ff;">.slide</span> <span style="color: #00AA00;">{</span><span style="color: #00AA00;">}</span></pre>

Теперь зададим стили для этих селекторов, позиционирование, оформление и правило transition для container. Css transition задает эффект перехода между двумя состояниями элемента, в нашем случае перед прокруткой и после (эффект плавной прокрутки).

<pre class="css" style="font-family:monospace;"><span style="color: #6666ff;">.slider</span> <span style="color: #00AA00;">{</span>
  <span style="color: #000000; font-weight: bold;">display</span><span style="color: #00AA00;">:</span> flex<span style="color: #00AA00;">;</span>
<span style="color: #00AA00;">}</span>
<span style="color: #6666ff;">.slider</span> <span style="color: #6666ff;">.control</span> <span style="color: #00AA00;">{</span><span style="color: #00AA00;">}</span>
<span style="color: #6666ff;">.slider</span> <span style="color: #6666ff;">.control</span> <span style="color: #6666ff;">.left</span> <span style="color: #00AA00;">{</span><span style="color: #00AA00;">}</span>
<span style="color: #6666ff;">.slider</span> <span style="color: #6666ff;">.control</span> <span style="color: #6666ff;">.right</span> <span style="color: #00AA00;">{</span><span style="color: #00AA00;">}</span>
<span style="color: #6666ff;">.slider</span> <span style="color: #6666ff;">.contwrap</span> <span style="color: #00AA00;">{</span>
  <span style="color: #000000; font-weight: bold;">overflow</span><span style="color: #00AA00;">:</span> <span style="color: #993333;">hidden</span><span style="color: #00AA00;">;</span>
  <span style="color: #000000; font-weight: bold;">width</span><span style="color: #00AA00;">:</span> <span style="color: #933;">400px</span><span style="color: #00AA00;">;</span>
<span style="color: #00AA00;">}</span>
<span style="color: #6666ff;">.slider</span> <span style="color: #6666ff;">.container</span> <span style="color: #00AA00;">{</span>
  <span style="color: #000000; font-weight: bold;">white-space</span><span style="color: #00AA00;">:</span> <span style="color: #993333;">nowrap</span><span style="color: #00AA00;">;</span>
  <span style="color: #000000; font-weight: bold;">font-size</span><span style="color: #00AA00;">:</span> <span style="color: #cc66cc;">0</span><span style="color: #00AA00;">;</span>
  transition<span style="color: #00AA00;">:</span> .3s cubic-bezier<span style="color: #00AA00;">(</span><span style="color: #cc66cc;">0</span><span style="color: #00AA00;">,</span> <span style="color: #cc66cc;">0.74</span><span style="color: #00AA00;">,</span> <span style="color: #cc66cc;">0.36</span><span style="color: #00AA00;">,</span> <span style="color: #cc66cc;">1.09</span><span style="color: #00AA00;">)</span><span style="color: #00AA00;">;</span>
<span style="color: #00AA00;">}</span>
<span style="color: #6666ff;">.slider</span> <span style="color: #6666ff;">.container</span> <span style="color: #6666ff;">.slide</span> <span style="color: #00AA00;">{</span>
  <span style="color: #000000; font-weight: bold;">width</span><span style="color: #00AA00;">:</span> <span style="color: #933;">200px</span><span style="color: #00AA00;">;</span>
  <span style="color: #000000; font-weight: bold;">display</span><span style="color: #00AA00;">:</span> inline-block<span style="color: #00AA00;">;</span>
  <span style="color: #000000; font-weight: bold;">height</span><span style="color: #00AA00;">:</span> <span style="color: #933;">200px</span><span style="color: #00AA00;">;</span>
  <span style="color: #000000; font-weight: bold;">padding</span><span style="color: #00AA00;">:</span> <span style="color: #933;">25px</span><span style="color: #00AA00;">;</span>
  <span style="color: #000000; font-weight: bold;">background-color</span><span style="color: #00AA00;">:</span> <span style="color: #cc00cc;">#C5291D</span><span style="color: #00AA00;">;</span>
  <span style="color: #000000; font-weight: bold;">color</span><span style="color: #00AA00;">:</span> <span style="color: #cc00cc;">#fff</span><span style="color: #00AA00;">;</span>
  <span style="color: #000000; font-weight: bold;">font-size</span><span style="color: #00AA00;">:</span> initial<span style="color: #00AA00;">;</span>
  box-sizing<span style="color: #00AA00;">:</span> border-box<span style="color: #00AA00;">;</span>
  <span style="color: #000000; font-weight: bold;">outline</span><span style="color: #00AA00;">:</span> <span style="color: #933;">1px</span> <span style="color: #993333;">solid</span> <span style="color: #cc00cc;">#fff</span><span style="color: #00AA00;">;</span>
<span style="color: #00AA00;">}</span></pre>

![result2](/files/chto_takoe_slajder_i_kak_ego_sobrat/slider2.jpg)

Пару важных моментов. Элементы управления и обертку container мы выстраиваем с использованием flexbox у slider. Сами слайды мы выстраиваем в ряд с использованием свойства display-inline. У обертки container установлено white-space: nowrap чтобы наши слайды не переносились на следующую строку, так же устанавливаем font-size: 0 для того, чтобы убрать пробелы между слайдами, а самим слайдам устанавливаем font-size: initial т.к. свойство font-size наследуется. Чтобы точно задать ширину слайда (избегая расчетов border и padding) мы устанавливаем свойство box-sizing: border-box

Теперь приступим к JS

<pre class="javascript" style="font-family:monospace;"><span style="color: #009900;">(</span><span style="color: #000066; font-weight: bold;">function</span><span style="color: #009900;">(</span><span style="color: #009900;">)</span> <span style="color: #009900;">{</span>
<span style="color: #000066; font-weight: bold;">var</span> sCont <span style="color: #339933;">=</span> document.<span style="color: #660066;">getElementById</span><span style="color: #009900;">(</span><span style="color: #3366CC;">'sCont'</span><span style="color: #009900;">)</span><span style="color: #339933;">;</span>
<span style="color: #000066; font-weight: bold;">if</span><span style="color: #009900;">(</span>sCont<span style="color: #009900;">)</span> <span style="color: #009900;">{</span> <span style="color: #006600; font-style: italic;">//проверям, есть ли слайдер</span>
  <span style="color: #000066; font-weight: bold;">var</span> sLeft <span style="color: #339933;">=</span> document.<span style="color: #660066;">getElementById</span><span style="color: #009900;">(</span><span style="color: #3366CC;">'sLeft'</span><span style="color: #009900;">)</span><span style="color: #339933;">;</span>
  <span style="color: #000066; font-weight: bold;">var</span> sRight <span style="color: #339933;">=</span> document.<span style="color: #660066;">getElementById</span><span style="color: #009900;">(</span><span style="color: #3366CC;">'sRight'</span><span style="color: #009900;">)</span><span style="color: #339933;">;</span>

  <span style="color: #000066; font-weight: bold;">var</span> viewWidth <span style="color: #339933;">=</span> sCont.<span style="color: #660066;">parentElement</span>.<span style="color: #660066;">clientWidth</span><span style="color: #339933;">;</span> <span style="color: #006600; font-style: italic;">//получаем ширину contwrap, видимой части</span>
  <span style="color: #000066; font-weight: bold;">var</span> slideWidth <span style="color: #339933;">=</span> sCont.<span style="color: #660066;">firstElementChild</span>.<span style="color: #660066;">clientWidth</span><span style="color: #339933;">;</span> <span style="color: #006600; font-style: italic;">//ширина одного элемента</span>
  <span style="color: #000066; font-weight: bold;">var</span> slideCount <span style="color: #339933;">=</span> sCont.<span style="color: #660066;">children</span>.<span style="color: #660066;">length</span><span style="color: #339933;">;</span> <span style="color: #006600; font-style: italic;">//количество всех слайдов</span>

  <span style="color: #000066; font-weight: bold;">var</span> min <span style="color: #339933;">=</span> <span style="color: #CC0000;">0</span><span style="color: #339933;">;</span>
  <span style="color: #000066; font-weight: bold;">var</span> max <span style="color: #339933;">=</span> <span style="color: #339933;">-</span>slideCount <span style="color: #339933;">+</span> <span style="color: #009900;">(</span>viewWidth <span style="color: #339933;">/</span> slideWidth<span style="color: #009900;">)</span><span style="color: #339933;">;</span> <span style="color: #006600; font-style: italic;">//максимальное количество переходов вправо</span>

  sLeft.<span style="color: #660066;">onclick</span> <span style="color: #339933;">=</span> <span style="color: #000066; font-weight: bold;">function</span><span style="color: #009900;">(</span><span style="color: #009900;">)</span> <span style="color: #009900;">{</span>
    moveSlider<span style="color: #009900;">(</span><span style="color: #CC0000;">1</span><span style="color: #009900;">)</span><span style="color: #339933;">;</span>
  <span style="color: #009900;">}</span>

  sRight.<span style="color: #660066;">onclick</span> <span style="color: #339933;">=</span> <span style="color: #000066; font-weight: bold;">function</span><span style="color: #009900;">(</span><span style="color: #009900;">)</span> <span style="color: #009900;">{</span>
    moveSlider<span style="color: #009900;">(</span><span style="color: #339933;">-</span><span style="color: #CC0000;">1</span><span style="color: #009900;">)</span><span style="color: #339933;">;</span>
  <span style="color: #009900;">}</span>

  <span style="color: #000066; font-weight: bold;">function</span> moveSlider<span style="color: #009900;">(</span>direction<span style="color: #009900;">)</span> <span style="color: #009900;">{</span>
    <span style="color: #000066; font-weight: bold;">var</span> margin <span style="color: #339933;">=</span> parseInt<span style="color: #009900;">(</span>sCont.<span style="color: #660066;">style</span>.<span style="color: #660066;">marginLeft</span><span style="color: #339933;">,</span> <span style="color: #CC0000;">10</span><span style="color: #009900;">)</span><span style="color: #339933;">;</span> <span style="color: #006600; font-style: italic;">//получаем текущий margin</span>
    <span style="color: #000066; font-weight: bold;">var</span> active <span style="color: #339933;">=</span> margin <span style="color: #339933;">/</span> slideWidth<span style="color: #339933;">;</span> <span style="color: #006600; font-style: italic;">//узнаем какой сейчас слайд</span>

    active <span style="color: #339933;">+=</span> direction<span style="color: #339933;">;</span>
    active <span style="color: #339933;">=</span> <span style="color: #009900;">(</span>active<span style="color: #339933;">></span>min<span style="color: #009900;">)</span><span style="color: #339933;">?</span>min<span style="color: #339933;">:</span>active<span style="color: #339933;">;</span> <span style="color: #006600; font-style: italic;">//устанавливаем нижнюю границу</span>
    active <span style="color: #339933;">=</span> <span style="color: #009900;">(</span>active<span style="color: #339933;"><</span>max<span style="color: #009900;">)</span><span style="color: #339933;">?</span>max<span style="color: #339933;">:</span>active<span style="color: #339933;">;</span> <span style="color: #006600; font-style: italic;">//устанавливаем верхнюю границу</span>

    sCont.<span style="color: #660066;">style</span>.<span style="color: #660066;">marginLeft</span> <span style="color: #339933;">=</span> active <span style="color: #339933;">*</span> slideWidth <span style="color: #339933;">+</span> <span style="color: #3366CC;">'px'</span><span style="color: #339933;">;</span> <span style="color: #006600; font-style: italic;">//прокручиваем</span>
  <span style="color: #009900;">}</span>
<span style="color: #009900;">}</span>
<span style="color: #009900;">}</span><span style="color: #009900;">)</span><span style="color: #009900;">(</span><span style="color: #009900;">)</span><span style="color: #339933;">;</span></pre>

![result3](/files/chto_takoe_slajder_i_kak_ego_sobrat/slider3.gif)

Самым первым делом, мы пытаемся получить элемент container и если он есть, начинаем работать. Получаем элементы кнопок и получаем ширину контейнера, узнаем ширину одного элемента и получаем количество прямых потомков container. Важно, чтобы внутри небыло лишних элементов, только слайды. Когда внутри слайда может быть любая html структура. Максимальное количество переходов влево равна 0, а вправо -количеству слайдов+количеству слайдов которые видны. На кнопки управления вешается событие onclick с анонимной функцией, которая содержит вызов функции прокрутки с индексом направления. Сама функция прокрутки получает текущий margin и расчитывает какой слайд сейчас слева видимой части контейнера. Прибавляем к полученому значению индекс направления, выполняем проверку и применяем новый margin.

Собственно на этом все, слайдер на чистом JavaScript работает, в самом базовом виде. Благодарю за прочтение.