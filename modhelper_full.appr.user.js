// ==UserScript==
// @name          NoNaMe-Club ModHelper
// @namespace     NoNaMe-Club.Scripts
// @description   Замена стандартного варианта (корень Темпа), при переносе, на выбранные форумы. Версия с проверкой на «одобреность» темы
// @version       2.1.0.2
// @original author    Kaener
// @author        Team of co-authors NNM-Club
// @homepage      https://github.com/ElSwanko/noname-club-modhelper
// @updateURL     https://github.com/ElSwanko/noname-club-modhelper/raw/master/modhelper_full.appr.meta.js
// @downloadURL   https://github.com/ElSwanko/noname-club-modhelper/raw/master/modhelper_full.appr.user.js
// @include       http://*.nnmclub.to/forum/modcp.php*
// @include       http://nnmclub.to/forum/modcp.php*
// @include       https://*.nnmclub.to/forum/modcp.php*
// @include       https://nnmclub.to/forum/modcp.php*
// @match         http://*.nnmclub.to/forum/modcp.php*
// @match         http://nnmclub.to/forum/modcp.php*
// @match         https://*.nnmclub.to/forum/modcp.php*
// @match         https://nnmclub.to/forum/modcp.php*
// @include       http://*.nnm-club.me/forum/modcp.php*
// @include       http://nnm-club.me/forum/modcp.php*
// @include       https://*.nnm-club.me/forum/modcp.php*
// @include       https://nnm-club.me/forum/modcp.php*
// @match         http://*.nnm-club.me/forum/modcp.php*
// @match         http://nnm-club.me/forum/modcp.php*
// @match         https://*.nnm-club.me/forum/modcp.php*
// @match         https://nnm-club.me/forum/modcp.php*
// @include       http://nnm-club.i2p.onion/forum/modcp.php*
// @include       https://nnm-club.i2p.onion/forum/modcp.php*
// @match         http://nnm-club.i2p.onion/forum/modcp.php*
// @match         https://nnm-club.i2p.onion/forum/modcp.php*
// @include       http://nnmclub5toro7u65.onion/forum/modcp.php*
// @include       https://nnmclub5toro7u65.onion/forum/modcp.php*
// @match         http://nnmclub5toro7u65.onion/forum/modcp.php*
// @match         https://nnmclub5toro7u65.onion/forum/modcp.php*
// @grant         none
// ==/UserScript==
//

// Проверка наличия ранее сделаных настроек пользователя и при их отсутствии при первом запуске будет предложено заполнение значений переменных
// пользователем для индивидуальной настройки под себя.

/** проверять тему на "одобреность"? true - проверять, false - не проверять */
var checkApproved = true;

/** Настройка выпадающего списка форумов. 1 - рисуется обычный выпадающий список, 2 и более - рисуется прокручиваемая форма */
var selectSize = 1;

function OpenDiv() {
    /** Выставляем настройки по-умолчанию */
    if (localStorage.testLocalStorage === undefined){
        /** Оставлять сообщение о переносе:                 true -- да, false -- нет */
        localStorage.leaveMsgOnMv = true;
        /** Оставлять сообщение о разделении в старой теме: true -- да, false -- нет */
        localStorage.addMsgToOld = false;
        /** Оставлять сообщение о разделении в новой теме:  true -- да, false -- нет */
        localStorage.addMsgToNew = true;
        /** Режим формирования названия новой темы при разделении:
         * true -- Выделено из темы + <ID темы>, false -- Выделено из темы + <Название темы> */
        localStorage.newTopicNameMode = false;
        /** Текст сообщения об отправке в архив */
        localStorage.textToArchive = "На трекере доступна новая версия: ";
        /** Текст сообщения об отправке в темп */
        localStorage.textToTemp = "Нуждается в дооформлении согласно требования модератора.";
        localStorage.testLocalStorage = 1;
    }

    var div = document.createElement('div');
    div.innerHTML = "<div style='position:fixed;z-index:100;width:100%;height:100%;top:0px;left:0px;' id='moderator_menu'>" +
              "       <div style='position:relative;width:100%;height:100%'>" +
              "               <div style='position:absolute;top:0px;left:0px;background-color:gray;filter:alpha(opacity=70);-moz-opacity: 0.7;opacity: 0.7;z-index:200;width:100%;height:100%'></div>" +
              "               <div style='position:absolute;top:0px;margin:auto;z-index:300;width: 100%;height:500px;'>" +
              "                        <div style='box-shadow: 0 0 10px 2px black; margin:auto;min-width:400px;width:60%;background-color: white;padding: 40px;margin-top:100px'>" +
              '<form>' +
              '<input id="leaveMsgOnMv" type="checkbox">Оставлять сообщение о переносе (делает активным поле ввода текста примечания)</input><br>' +
              '<input id="addMsgToOld" type="checkbox">Оставлять сообщение о разделении в старой теме</input><br>' +
              '<input id="addMsgToNew" type="checkbox">Добавлять сообщение о разделении в новую тему</input><br><br>' +
              '<input id="newTopicNameMode" type="checkbox">Выводить в название темы цифровое значение <br>Условие формирования названия новой темы при разделении темы: <br>true - Выделено из темы + ID (цифровое значение) темы <br>false - Выделено из темы + Название темы текстом</input><br>' +
              '<br><br><table width=100%><tr><td width="40%" align="left"><font size="3px">Текст причины переноса темы в Архив:</font></td><td><input style="width: 80%; margin-top: 15px;" id="textToArchive" type="text"><br><br></td></tr>' +
              '<tr><td width="40%" align="left"><font size="3px">Текст причины переноса темы в Темп:</font></td><td><input style=width:80% id="textToTemp" type="text"></td></tr></table><br><br>' +
              '<table width=100%><tr><td align="left"><input type="button" value="Сохранить изменения" onclick="SaveSettingAndDeleteDiv(1)" style="background-color: #7FFF00;"></td><td align="center"><input type="button" value="Сброс настроек" onclick="SaveSettingAndDeleteDiv(2)"></td><td align="right"><input type="button" value="Закрыть без изменения" onclick="SaveSettingAndDeleteDiv(false)" style="background-color: #FF6347;"></td></tr></table>' +
              '</form>' +
              "                        </div>"+
              "               </div>" +
              "       </div>" +
              "</div>";
    document.body.appendChild(div);

    document.getElementById('leaveMsgOnMv').checked = (localStorage.leaveMsgOnMv === "true");
    document.getElementById('addMsgToOld').checked = (localStorage.addMsgToOld === "true");
    document.getElementById('addMsgToNew').checked = (localStorage.addMsgToNew === "true");
    document.getElementById('newTopicNameMode').checked = (localStorage.newTopicNameMode === "true");
    document.getElementById('textToArchive').value = localStorage.textToArchive;
    document.getElementById('textToTemp').value = localStorage.textToTemp;
}

function SaveSettingAndDeleteDiv(i) {
    if (i == 1) {
        localStorage.leaveMsgOnMv = document.getElementById('leaveMsgOnMv').checked;
        localStorage.addMsgToOld = document.getElementById('addMsgToOld').checked;
        localStorage.addMsgToNew = document.getElementById('addMsgToNew').checked;
        localStorage.newTopicNameMode = document.getElementById('newTopicNameMode').checked;
        localStorage.textToArchive = document.getElementById('textToArchive').value;
        localStorage.textToTemp = document.getElementById('textToTemp').value;
        localStorage.testLocalStorage = 1;
        location.reload();
    } else if (i == 2) {
        localStorage.removeItem("leaveMsgOnMv");
        localStorage.removeItem("addMsgToOld");
        localStorage.removeItem("addMsgToNew");
        localStorage.removeItem("newTopicNameMode");
        localStorage.removeItem("textToArchive");
        localStorage.removeItem("textToTemp");
        localStorage.removeItem("testLocalStorage");
        location.reload();
    }
    var div = document.getElementById('moderator_menu').parentNode;
    div.parentNode.removeChild(div);
}

function modHelp() {

    var done = false;

    /** Индекс категорий форума, необходим для заполнения карты форумов и списка категорий */
    var category_index = [
        'vip',
        'nnm',
        'forum',
        'talent',
        'exclusive',
        'children',
        'video',
        'serials',
        'docum',
        'anime',
        'books',
        'music',
        'games',
        'soft',
        'mobile',
        'apple',
        'mediadisgraf',
        'temp'
    ];

    /** Список категорий форума вместе со списком форумов */
    var categories = {
        'all': category('Выберите категорию'),
        'vip': category(),
        'nnm': category(),
        'forum': category(),
        'talent': category(),
        'exclusive': category(),
        'children': category(),
        'video': category(),
        'serials': category(),
        'docum': category(),
        'anime': category(),
        'books': category(),
        'music': category(),
        'games': category(),
        'soft': category(),
        'mobile': category(),
        'apple': category(),
        'mediadisgraf': category(),
        'temp': category()
    };

    /** Номера темп-форумов для соответствующих категорий */
    var temp = {
        'anime': 146,
        'apple': 1145,
        'avto': 302,
        'books': 161,
        'cartoons': 145,
        'classic': 145,
        'docum': 145,
        'games': 148,
        'humor': 399,
        'mediadisgraf': 171,
        'mobile': 183,
        'music': 147,
        'music_video': 145,
        'serials': 145,
        'sndbx': 149,
        'soft': 149,
        'tech': 932,
        'trash': 670,
        'ts': 145,
        'video': 145
    };

    /* Номера архивов для соответствующих категорий */
    var archive = {
        'anime': 169,
        'apple': 1080,
        'avto': 303,
        'books': 94,
        'cartoons': 892,
        'classic': 668,
        'docum': 669,
        'games': 93,
        'humor': 400,
        'mediadisgraf': 180,
        'mobile': 184,
        'music': 92,
        'music_video': 1143,
        'serials': 802,
        'sndbx': 95,
        'soft': 95,
        'tech': 182,
        'ts': 150,
        'video': 91
    };

    /**
     * Карта форумов для определения категории по номеру форума
     * Ввиду некоторой запутанности форума выделяется ещё несколько дополнительных категорий,
     * для которых заведены свои архивы и темп-форуму. При этом они находятся внутри основных категорий.
     * Для этого оставил их номера с ручным заполнением и поставил вперёд.
     * Т.о. при поиске категории по номеру форума, сначала проверяются они, а потом уже основные категории.
     */
    var map = {
        'avto': [299, 301, 300],
        'cartoons': [229, 230, 231, 232, 658, 659, 660, 661, 730, 732, 890],
        'classic': [318, 320, 677, 1177, 319, 678, 885, 908, 909, 910, 911, 912],
        'humor': [610, 611, 612, 613, 653, 654, 655, 656],
        'music_video': [256, 257, 258, 271, 883, 905, 955, 1210],
        'sndbx': [1042],
        'tech': [47],
        'ts': [217],
        'anime': [],
        'apple': [],
        'books': [],
        'docum': [],
        'games': [],
        'mediadisgraf': [],
        'mobile': [],
        'music': [],
        'serials': [],
        'soft': [],
        'video': []
    };

    /** Текущий номер темы */
    var tid = document.getElementsByName('t')[0];
    if (tid) tid = tid.value;

    /** В этот форум переносим, если мы не узнали исходный форум и не проверяли или тема не одобрена */
    var moveNotApprovedTo = temp.trash;
    /** В этот форум переносим, если мы не узнали исходный форум, но проверяли и тема одобрена */
    var moveApprovedTo = temp.trash;
    /** В этот форум выделяем */
    var splitTo = temp.trash;
    /** Название темы при выделении */
    var newTopicName = 'Выделено из темы ';

    var savedText;
    var msgMoveElem = document.getElementById('insert_msg');

    /**
     * Описание категории
     * @param label название категории
     * @returns {{label: (*|string), forums: Array, getForum: Function}}
     */
    function category(label) {
        return {
            label: label || '', forums: [],
            getForum: function(id) {
                for (var i = 0; i < this.forums.length; i++) {
                    if (this.forums[i].id == id) {
                        return this.forums[i];
                    }
                }
            }
        }
    }

    /**
     * Описание форума
     * @param id номер форума
     * @param label название форума
     * @param selected форум выбран в списке
     * @param disbled выбор форума в списке заблокирован (переносим из этого форума)
     * @returns {{id: *, label: *, selected: *, disabled: *}}
     */
    function forumObj(id, label, selected, disbled) {
        return { id: id,  label: label, selected: selected, disabled: disbled }
    }

    /**
     * Разбираем список форумов, разбитый по категориям, и заполняем список категорий и карту форумов
     */
    function parseCategories() {
        var select = document.getElementById("optlist");
        for (var i = 0; i < select.children.length; i++) {
            var optgroup = select.children[i];
            var category = categories[category_index[i]];
            category.label = optgroup.label;
          console.log('' + category.label);
            var forums = map[category_index[i]];
            for (var j = 0; j < optgroup.children.length; j++) {
                var option = optgroup.children[j];
              console.log('' + option.text);
                var forum = forumObj(parseInt(option.value), option.text, option.selected, option.disabled);
                category.forums.push(forum);
                if (forums) {
                    forums.push(forum.id);
                }
            }
        }
    }

    /**
     * Строим дополнительный список только с категориями форума.
     * При выборе категории в этом списке перестраиваем основной спискок с сокращённым набором форумов,
     * соответствующей категории. Также добавляются архив и темп (как наиболее востребованные цели).
     * Сразу же перестраиваем основной список с выбором всех категорий.
     */
    function buildCategorySelect(onMove) {
        var categorySelect = document.createElement('select');
        categorySelect.style.width = '300px';
        categorySelect.id = 'categories';

        for (var key in categories) {
            if (categories.hasOwnProperty(key)) {
                var option = document.createElement('option');
                option.value = key;
                option.text = categories[key].label;
                categorySelect.appendChild(option);
            }
        }
        categorySelect.selectedIndex = 0;
        categorySelect.onchange = function () {
            rebuildOptlist(this.selectedOptions[0].value);
        };

        var parent = document.getElementById('optlist').parentNode;
        parent.insertBefore(categorySelect, parent.children[onMove ? 1 : 0]);

        rebuildOptlist('all');

        function rebuildOptlist(selectedKey) {
            var select = document.getElementById('optlist');
            while (select.children.length > 0) {
                select.removeChild(select.children[0]);
            }

            if (selectedKey === 'all') {
                for (var key in categories) {
                    if (categories.hasOwnProperty(key) && key !== selectedKey) {
                        select.appendChild(buildOptgroup(key));
                    }
                }
            } else {
                var forum;
                if (temp[selectedKey]) {
                    forum = categories.temp.getForum(temp[selectedKey]);
                    if (forum) {
                        select.appendChild(buildOption(forum));
                    }
                }
                if (archive[selectedKey]) {
                    forum = categories.temp.getForum(archive[selectedKey]);
                    if (forum) {
                        select.appendChild(buildOption(forum));
                    }
                }
                select.appendChild(buildOptgroup(selectedKey));
            }

            select.style.width = '400px';
            select.size = selectSize;

            function buildOptgroup(categoryKey) {
                var optgroup = document.createElement('optgroup');
                var category = categories[categoryKey];
                optgroup.label = category.label;
                for (var i = 0; i < category.forums.length; i++) {
                    var forum = category.forums[i];
                    optgroup.appendChild(buildOption(forum));
                }
                return optgroup;
            }

            function buildOption(forum) {
                var option = document.createElement('option');
                option.value = forum.id;
                option.textContent = forum.label;
                option.selected = forum.selected;
                option.disabled = forum.disabled;
                return option;
            }
        }
    }

    function setTextToArchive() {
        document.getElementsByClassName('post')[0].value = localStorage.textToArchive;
    }

    function setTextToTemp() {
        document.getElementsByClassName('post')[0].value = localStorage.textToTemp;
    }

    function setEmptyText() {
        document.getElementsByClassName('post')[0].value = '';
    }

    function uncheckText() {
        savedText = document.getElementsByClassName('post')[0].value;
        setEmptyText();
        msgMoveElem.onchange = function() {checkText();};
    }

    function checkText() {
        document.getElementsByClassName('post')[0].value = savedText;
        msgMoveElem.onchange = function() {uncheckText();};
    }

    function findGroup(old) {
        for (var key in map) {
            if (map.hasOwnProperty(key) && map[key].indexOf(old) > -1) {
                return key;
            }
        }
        return -1;
    }

    function moveApprovedToF(old) {
        var key = findGroup(old);
        return (key !== -1 && typeof(archive[key]) !== 'undefined') ? archive[key] : moveApprovedTo;
    }

    function moveNotApprovedToF(old) {
        var key = findGroup(old);
        return (key !== -1 && typeof(temp[key]) !== 'undefined') ? temp[key] : moveNotApprovedTo;
    }

    function setThemeName() {
        if (localStorage.newTopicNameMode === 'true') {
            document.getElementsByName('subject')[0].value = newTopicName + tid;
        } else {
            document.getElementsByName('subject')[0].value = newTopicName +
                document.getElementsByClassName('postdetails')[0].innerHTML.substr(32);
        }
        document.getElementsByName('subject')[0].onfocus = function() {
            if (!done) this.value = '';
            done = true;
        };
    }

    function setDest(id) {
        var selectElem = document.getElementById('optlist');
        if (selectElem) {
            selectElem.value = id;
        }
    }

    function onSplit() {
        return document.URL.indexOf('mode=split') > -1;
    }

    function onMove() {
        return document.URL.indexOf('mode=move') > -1;
    }

    function isArchive(forum) {
        for (var i in archive) {
            if (archive.hasOwnProperty(i) && archive[i] === forum) {
                return true;
            }
        }
        return false;
    }

    function isTemp(forum) {
        for (var i in temp) {
            if (temp.hasOwnProperty(i) && temp[i] === forum) {
                return true;
            }
        }
        return false;
    }

    function fromArchive() {
        var formElem = document.getElementsByName('confirm')[0];
        formElem.addEventListener('click', function(e) {
            if (!confirm('Действительно хотите перенести из Архива?')) {
                if (e.preventDefault) e.preventDefault();
                e.returnValue = false;
            }
        }, false);
    }

    function formUpdate(action, options) {
        switch (action) {
            case 'onmove':
                if (isArchive(options.forum)) fromArchive();
                document.getElementById('move_bot').style.display = localStorage.leaveMsgOnMv ? 'block' : 'none';
                msgMoveElem.onchange = localStorage.leaveMsgOnMv ? function() {uncheckText();} : function() {checkText();};
                msgMoveElem.checked = localStorage.leaveMsgOnMv;
                break;
            case 'onsplit':
                document.getElementById('after_split_to_old').checked = localStorage.addMsgToOld === 'true';
                document.getElementById('after_split_to_new').checked = localStorage.addMsgToNew === 'true';
                break;
            default:
                break;
        }
    }

    var oldForumElems = document.getElementsByName('f');
    var old = parseInt(oldForumElems[oldForumElems.length - 1].value);

    parseCategories();

    if (onSplit()) {
        buildCategorySelect(false);
        formUpdate('onsplit');
        setThemeName();
        setDest(splitTo);
    } else if (onMove()) {
        buildCategorySelect(true);
        formUpdate('onmove', {'forum': old});
        if (checkApproved) {
            /**
             * Оптимизация отзывчивости скрита. Не ждём завершения запроса, чтобы заполнить темы и выбрать форум.
             * т.к. при проблемах с доступом к форуму может отрабатывать достаточно долго.
             * В таком случае быстрее будет вручную выбрать нужный форум и набить сообщение. */
            $.ajax({
                url: '/forum/viewtopic.php?t=' + tid,
                success: function (result) {
                    var approved = $('tr.row1 > td.genmed', result);
                    if (typeof(approved) !== 'undefined' && approved.length > 11 &&
                        (approved[11].innerHTML.indexOf("Оформление проверено ") > -1)) {
                        if (isArchive(old) || isTemp(old)) {
                            setEmptyText();
                            setDest(old);
                        } else {
                            setTextToArchive();
                            setDest(moveApprovedToF(old));
                        }
                    } else {
                        setTextToTemp();
                        setDest(moveNotApprovedToF(old));
                    }
                },
                error: function (result) {
                    console.error("AJAX error: " + result);
                },
                async: true
            });
        } else {
            setTextToTemp();
            setDest(moveNotApprovedToF(old));
        }
    } else {
        /** Массовый перенос тем из раздела */
        buildCategorySelect(true);
        formUpdate('onmove', {'forum': old});
        setTextToArchive();
        setDest(moveApprovedToF(old));      
    }
}

function checkJquery() {
    if (!checkApproved) { //if we don't need jQuery
        modHelp();
    } else if (typeof(window.jQuery) !== 'undefined') {// Opera!
        $ = window.jQuery;
        modHelp();
    } else if (typeof(unsafeWindow.jQuery) !== 'undefined') {  // Firefox!
        $ = unsafeWindow.jQuery;
        modHelp();
    } else { // Chrome and others
        var script = document.createElement("script");
        script.textContent = "var checkApproved = " + checkApproved + ";\nvar $ = window.jQuery;\n" + "(" + modHelp.toString() + ")();";
        document.body.appendChild(script);
    }
    var div = document.createElement('div');
    div.innerHTML = "<div style='position:absolute;z-index:100;top:14px;left:14px; id='moderator_setting'>" +
        "<img title='Изменить настройки скрипта модератора' onclick='OpenDiv()' id='moderator_settings_img' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABS0lEQVRIx2NgGETABYg7oNiFFhY0APF/KG6g1DAdIGYi0QJ9Yg13AuKvQDwXyRJ+IF6MZAGILYCkpwqI/wJxPCHDtaCGwwwCWTIJiH8gicHwTyCeDMS1SGIgSzzwWcAIxFOxGEYs3gjEbIR8AQqWJVg0HwTiLig+hEV+DxBzEhsP05E0fsCRLN2A+COSumnEGi4IxL+RNHrjUeuPFicCxGSiFUiajhHhoFNI6pfjyowNOCKthwgL+nHobaCWBX3EWGADxOVQPJeCIJqDZI4NLg380AgjNZJ/4YtkdDANSeNHqEHoIBCIP5GTTEGgEUuYnoAWDZOhbHR5UOZkJsbwDgqKitVAzEKomP6DpGEXEM9Ey3gw/B2IJ6Iliv84ghMFxEAt2Y1UtoiglU+LoYkBVnbNIbUicsdScOGrcJiIcTldq0xswIaYTER3AADyDbmZw/+N1gAAAABJRU5ErkJggg=='>" +
        "</div>";
    document.body.appendChild(div);

    var scriptOpenDiv = document.createElement("script");
    scriptOpenDiv.textContent = OpenDiv.toString();
    document.body.appendChild(scriptOpenDiv);

    var scriptSaveSettingAndDeleteDiv = document.createElement("script");
    scriptSaveSettingAndDeleteDiv.textContent = SaveSettingAndDeleteDiv.toString();
    document.body.appendChild(scriptSaveSettingAndDeleteDiv);

    if (localStorage.testLocalStorage === undefined ) {
        OpenDiv();
    }
}

var isLoaded = false;

function loadingHelper() {
    if (!isLoaded) {
        isLoaded = true;
        window.removeEventListener("load", loadingHelper, false);
        window.removeEventListener("DOMContentLoaded", loadingHelper, false);
        checkJquery();
    }
}

window.addEventListener('DOMContentLoaded', loadingHelper, false);
window.addEventListener('load', loadingHelper, false);

window.onerror = function(msg, url, line, col, error) {
    // Note that col & error are new to the HTML 5 spec and may not be
    // supported in every browser.  It worked for me in Chrome.
    var extra = !col ? '' : '\ncolumn: ' + col;
    extra += !error ? '' : '\nerror: ' + error;

    // You can view the information in an alert to see things working like this:
    console.error("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);

    // If you return true, then error alerts (like in older versions of Internet Explorer) will be suppressed.
    return true;
};
