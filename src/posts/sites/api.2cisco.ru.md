---
template: post
title: api.2cisco.ru
role: Разработчик
date: 2015-03-03
tags:
    - site
    - api 
    - php
---

Если вы разработчик, то вы можете использовать базу данных ответов и вопросов ресурса используя api, 
в этом случае ссылка на ресурс 2cisco.ru обязательна.

Аpi размещен по адресу: **api.2cisco.ru** и возвращает ответы в формате JSON. Интерфейс имеет несколько параметров 
(все они необязательные):

*   **q**, регистронезависимый поисковый запрос, ищет по тексту вопросов. Только точные совпадения по тексту.
*   **exm**, url экзамена, ответы которого нужно получить.
*   **rated**, если получен true, то возвращает только "проверенные" пользователями ответы. Т.е. те ответы, 
за которые положительно проголосовали.

Пример запроса: **api.2cisco.ru/?q=акой%20был&exm=cisco2_1&rated=true** Вернет все вопросы и ответы, которые: 
содержат в вопросе текст "акой был", которые относятся к экзамену cisco2_1 и за которые проголосовали пользователи