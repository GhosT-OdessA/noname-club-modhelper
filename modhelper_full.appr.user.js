
Tampermonkey
v4.1.5240 by Jan Biniok
Редактировать - NoNaMe-Club ModHelper
×
?
Установленные скрипты
Настройки
Утилиты
Помощь
NoNaMe-Club ModHelper
by Team of co-authors NNM-Club
Редактор
Настройки
Обновить URL:

// ==UserScript==

// @name          NoNaMe-Club ModHelper

// @namespace     NoNaMe-Club.Scripts

// @description   Замена стандартного варианта (корень Темпа), при переносе, на выбранные форумы. Версия с проверкой на «одобреность» темы

// @version       2.0.0.13.1

// @original author    Kaener

// @author        Team of co-authors NNM-Club

// @homepage      https://github.com/GhosT-OdessA/noname-club-modhelper

// @updateURL     https://github.com/GhosT-OdessA/noname-club-modhelper/raw/test/modhelper_full.appr.meta.js

// @downloadURL   https://github.com/GhosT-OdessA/noname-club-modhelper/raw/test/modhelper_full.appr.user.js

// @include       http://*.nnmclub.to/forum/modcp.php*

// @include       http://nnmclub.to/forum/modcp.php*

// @include       https://*.nnmclub.to/forum/modcp.php*

// @include       https://nnmclub.to/forum/modcp.php*

// @match         http://*.nnmclub.to/forum/modcp.php*

// @match         http://nnmclub.to/forum/modcp.php*

// @match         https://*.nnmclub.to/forum/modcp.php*

// @match         https://nnmclub.to/forum/modcp.php*

// ==/UserScript==

//

​

// Проверка наличия ранее сделаных настроек пользователя и при их отсутствии при первом запуске будет предложено заполнение значений переменных

// пользователем для индивидуальной настройки под себя.

​

​

function OpenDiv() {

    var div = document.createElement('div');

    div.innerHTML = "<div style='position:fixed;z-index:100;width:100%;height:100%;top:0px;left:0px;' id='moderator_menu'>" +

              "       <div style='position:relative;width:100%;height:100%'>" +

              "               <div style='position:absolute;top:0px;left:0px;background-color:gray;filter:alpha(opacity=70);-moz-opacity: 0.7;opacity: 0.7;z-index:200;width:100%;height:100%'></div>" +

              "               <div style='position:absolute;top:0px;margin:auto;z-index:300;width: 100%;height:500px;'>" +

              "                        <div style='box-shadow: 0 0 10px 2px black; margin:auto;min-width:400px;width:60%;background-color: white;padding: 40px;margin-top:100px'>" +

              '<form>' +

              '<input id="leaveMsgOnMv" type="checkbox">Оставлять сообщение о переносе (делает активным поле ввода текста примечания)</input><br>' +

              '<input id="addMsgToOld" type="checkbox">Оставлять сообщение о разделении в старой теме</input><br>' +

              '<input id="addMsgToNew" type="checkbox">Добавлять сообщение о разделении в новую тему</input><br>' +

              '<input id="newTopicNameMode" type="checkbox">Название темы выводить цифровое значение <br>(Условие формирования названия новой темы при разделении темы <br>true - Выделено из темы + ID (цифровое значение) темы <br>false - Выделено из темы + Название темы текстом)</input><br>' +

              '<br><br><table width=100%><tr><td width="40%" align="left"><font size="3px">Текст причины переноса темы в Архив:</font></td><td><input style="width: 80%; margin-top: 15px;" id="textToArchive" type="text"><br><br></td></tr>' +

              '<tr><td width="40%" align="left"><font size="3px">Текст причины переноса темы в Темп:</font></td><td><input style=width:80% id="textToTemp" type="text"></td></tr></table><br><br>' +

              '<table width=100%><tr><td align="left"><input type="button" value="Сохранить изменения" onclick="SaveSettingAndDeleteDiv(true)" style="background-color: #7FFF00;"></td><td align="right"><input type="button" value="Закрыть без изменения" onclick="SaveSettingAndDeleteDiv(false)" style="background-color: #FF6347;"></td></tr></table>' +

              '</form>' +

              "                        </div>"+

              "               </div>" +

              "       </div>" +

              "</div>";

    document.body.appendChild(div);
    

    if ( localStorage.testLocalStorage === undefined ){

        localStorage.leaveMsgOnMv = true;

        localStorage.addMsgToOld = false;

        localStorage.addMsgToNew = true;

        localStorage.newTopicNameMode = false;

