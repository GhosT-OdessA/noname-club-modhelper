// ==UserScript==
// @run-at          document-start
// @name            NoNaMe-Club ModHelper
// @namespace       NoNaMe-Club.Scripts
// @description     Замена стандартного варианта (корень Темпа) при переносе на профильные форумы. Версия с проверкой на «одобреность» темы.
// @version         2.1.0.11
// @original author Kaener
// @author          Team of co-authors NNM-Club
// @homepage        https://github.com/GhosT-OdessA/noname-club-modhelper
// @updateURL       https://github.com/GhosT-OdessA/noname-club-modhelper/raw/master/modhelper_full.appr.meta.js
// @downloadURL     https://github.com/GhosT-OdessA/noname-club-modhelper/raw/master/modhelper_full.appr.user.js
// @match        *://*.nnmclub.to/forum/modcp.php*
// @match        *://*.nnmclub.tv/forum/modcp.php*
// @match        *://*.nnm-club.lib/forum/modcp.php*
// @match        *://*.nnm-club.name/forum/modcp.php*
// @match        *://*.nnm-club.me/forum/modcp.php*
// @match        *://*.nnm-club.i2p.onion/forum/modcp.php*
// @match        *://*.nnmclub5toro7u65.onion/forum/modcp.php*
// @grant           none
// ==/UserScript==
//

// Проверка наличия ранее сделаных настроек пользователя и при их отсутствии при первом запуске будет предложено
// заполненить значения переменных пользователем для индивидуальной настройки под свои нужды.

/** Таймаут ожидания загрузки страницы, для проверки темы на одобренность (в секундах) */
var checkTimeout = 5;

/** Настройка выпадающего списка форумов. 1 - рисуется обычный выпадающий список, 2 и более - рисуется прокручиваемая форма */
var selectSize = 1;

function OpenDiv() {
    /** Выставляем настройки по-умолчанию */
    if (localStorage.testLocalStorage === undefined){
        /**
         * Проверять при переносе тему на одобреность или нет.
         * Если проверять, то тема выполняется дополнительный запрос, что может занять некоторое время,
         * особенно при затруднениях с доступом к клубу. При этом, если тема одобрена, то для переноса выбирается
         * профильный архив, иначе - профильный темп.
         * Если не проверять, то всегда выбирается профильный темп.
         */
        localStorage.checkApproved = true;
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
    div.innerHTML = "" +
        "<div style='position:fixed;z-index:10000;width:100%;height:100%;top:0;left:0;' id='moderator_menu'>" +
        "    <div style='position:relative;width:100%;height:100%'>" +
        "        <div style='position:absolute;top:0;left:0;background-color:gray;filter:alpha(opacity=70);" +
        "                    -moz-opacity:0.7;opacity:0.7;z-index:10000;width:100%;height:100%'></div>" +
        "        <div style='position:absolute;top:0;margin:auto;z-index:10000;width: 100%;height:500px;'>" +
        "            <div style='box-shadow: 0 0 10px 2px black; min-width:400px;width:60%;background-color:white;padding:40px;margin:100px auto auto;'>" +
        '<form>' +
        '<input id="newTopicNameMode" type="checkbox">Выводить в название темы цифровое значение.</input><br>' +
        '<div style="padding: 10px 0 0 25px">Условие формирования названия новой темы при разделении темы: <br>' +
        '<strong>true</strong> - Выделено из темы + ID (цифровое значение) темы;<br>' +
        '<strong>false</strong> - Выделено из темы + Название темы текстом.</div><br>' +
        '<input id="checkApproved" type="checkbox">Проверять при переносе тему на одобренность.</input><br>' +
        '<div style="padding: 10px 0 0 25px"><strong>false</strong> - не проверять, тема всегда переносится в профильный темп;<br>' +
        '<strong>true</strong> - проверять, одобренная тема переносится в профильный архив, неодобренная - в профильный темп.<br><br>' +
        '<strong>Важно!</strong> Для проверки на одобренность выполняется дополнительный запрос, ' +
        'который занимает некоторое время. Выбор целевого форума произойдёт после выполнения запроса.<br>' +
        'По-умолчанию на запрос выделяется ' + localStorage.checkTimeout + ' секунд, после чего запрос отменяется.<br>' +
        'В условиях затруднённого доступа к клубу рекомендуется отключать проверку.<br></div><br>' +
        '<br>' +
        '<table width=100%>' +
        '<tr>' +
        '    <td width="41%" height="30px" align="left" style="font-size: medium">Текст причины переноса темы в Архив</td>' +
        '    <td><input style="width: 90%; font-size: medium" id="textToArchive" type="text"></td>' +
        '</tr>' +
        '<tr>' +
        '    <td width="41%" height="30px" align="left" style="font-size: medium">Текст причины переноса темы в Темп</td>' +
        '    <td><input style="width: 90%; font-size: medium" id="textToTemp" type="text"></td>' +
        '</tr>' +
        '</table><br>' +
        '<br>' +
        '<table width=100%><tr>' +
        '    <td align="left"><input type="button" value="Сохранить изменения" onclick="SaveSettingAndDeleteDiv(1)" style="background-color: #7FFF00;"></td>' +
        '    <td align="center"><input type="button" value="Сброс настроек" onclick="SaveSettingAndDeleteDiv(2)"></td>' +
        '    <td align="right"><input type="button" value="Закрыть без изменения" onclick="SaveSettingAndDeleteDiv(false)" style="background-color: #FF6347;"></td>' +
        '</tr></table>' +
        '</form>' +
        "            </div>"+
        "        </div>" +
        "    </div>" +
        "</div>";
    document.body.appendChild(div);

    document.getElementById('checkApproved').checked = (localStorage.checkApproved === "true");
    document.getElementById('newTopicNameMode').checked = (localStorage.newTopicNameMode === "true");
    document.getElementById('textToArchive').value = localStorage.textToArchive;
    document.getElementById('textToTemp').value = localStorage.textToTemp;
}

function SaveSettingAndDeleteDiv(i) {
    if (i == 1) {
        localStorage.checkApproved = document.getElementById('checkApproved').checked;
        localStorage.newTopicNameMode = document.getElementById('newTopicNameMode').checked;
        localStorage.textToArchive = document.getElementById('textToArchive').value;
        localStorage.textToTemp = document.getElementById('textToTemp').value;
        localStorage.testLocalStorage = 1;
        location.reload();
    } else if (i == 2) {
        localStorage.removeItem('checkApproved');
        localStorage.removeItem('newTopicNameMode');
        localStorage.removeItem('textToArchive');
        localStorage.removeItem('textToTemp');
        localStorage.removeItem('testLocalStorage');
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
        'soft',
        'video',
        'serials',
        'docum',
        'anime',
        'books',
        'music',
        'games',
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
        'soft': category(),
        'video': category(),
        'serials': category(),
        'docum': category(),
        'anime': category(),
        'books': category(),
        'music': category(),
        'games': category(),
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

    /** Номера архивов для соответствующих категорий */
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
        'sndbx': 1068,
        'soft': 95,
        'tech': 182,
        'ts': 150,
        'video': 91
    };

    /**
     * Карта форумов для определения категории по номеру форума.
     * Ввиду некоторой запутанности форума выделяется ещё несколько дополнительных категорий,
     * для которых заведены свои архивы и темп-форумы. При этом они находятся внутри основных категорий.
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
        'games': [728, 740, 741],
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

    /** Пользователь */
    var menuItems = document.querySelectorAll('a.mainmenu');
    var user = menuItems[menuItems.length - 1].text.split(' ')[2];
    /** Название темы при выделении */
    var newTopicName = 'Выделено ' + user + ' из темы ';

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
        };
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
        return { id: id,  label: label, selected: selected, disabled: disbled };
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
            var forums = map[category_index[i]];
            for (var j = 0; j < optgroup.children.length; j++) {
                var option = optgroup.children[j];
                var forum = forumObj(parseInt(option.value), option.text, option.selected, option.disabled);
                category.forums.push(forum);
                if (forums) {
                    forums.push(forum.id);
                }
            }
        }
    }

    parseCategories();

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


    /*
     * Раздел с избранными форумами by NIK220V.
     */

    // Просто выдает список избранных
    function getFavs(){
        var favs = JSON.parse(localStorage.getItem('NNMModHelperFavs'));
        if (!favs) favs = [];
        return favs;
    }

    // Добавляет форум в список избранных
    function appendFavourite(key){
        var favs = getFavs();
        if (favs.indexOf(key) < 0){
            favs.push(key);
            localStorage.setItem('NNMModHelperFavs', JSON.stringify(favs));
            var prefix = 'nnmmodhelperfav', hold = document.querySelector('#'+prefix+'holder');
            if (hold) {
                var btn = document.createElement('button');
                btn.id = prefix+'opt'+key;
                btn.style.border = '1px lightblue solid';
                btn.style.background = 'white';
                btn.innerText =  '🌟 '+$('#optlist').find('option[value="'+key+'"]').text() + ' [ID'+key+']';
                btn.fav = key;
                btn.onclick = function(e){
                    e.preventDefault();
                    $('#optlist').val(this.fav);
                };
                btn.oncontextmenu = function(e){
                    e.preventDefault();
                    descendFavourite(this.fav);
                };
                hold.insertBefore(btn, document.querySelector('#'+prefix+'add'));
            }
        }
    }

    // Удаляет форум из списка избранных
    function descendFavourite(key){
        var favs = getFavs();
        if (favs.indexOf(key) >= 0){
            favs.splice(favs.indexOf(key), 1);
            localStorage.setItem('NNMModHelperFavs', JSON.stringify(favs));
            var hold = document.querySelector('#nnmmodhelperfavopt'+key);
            if (hold) hold.remove();
        }
    }

    // Создает элемент списка избранных
    function showFavourites(){
        var div = document.createElement('div'), prefix = 'nnmmodhelperfav';
        div.style.padding = '15px';
        div.style.border = '1px lightblue solid';
        div.style.width = '50%';
        div.id = prefix+'holder';
        div.innerHTML = '<div style="  right: 25%;  position: absolute;  border-radius: 50%;  width: 22px;  height: 22px;  border: 1px lightblue solid;  text-align: center;  vertical-align: middle;  font-size: 17px;  background: lightblue;  cursor: wait;" title="Чтобы использовать избранный форум, просто нажмите на его кнопку.\r\nЧтобы удалить избранный форум, нажмите по нему правой кнопкой мыши.">?</div>';
        var favs = getFavs();
        var $ = window.$;
        for (var fave in favs){
            var fav = favs[fave];
            var btn = document.createElement('button');
            btn.id = prefix+'opt'+fav;
            btn.style.border = '1px lightblue solid';
            btn.style.background = 'white';
            btn.innerText =  '🌟 '+$('#optlist').find('option[value="'+fav+'"]').text() + ' [ID'+fav+']';
            btn.fav = fav;
            btn.onclick = function(e){
                e.preventDefault();
                $('#optlist').val(this.fav);
            };
            btn.oncontextmenu = function(e){
                e.preventDefault();
                descendFavourite(fav);
            };
            div.appendChild(btn);
        }
        div.appendChild(document.createElement('br'));
        var btn = document.createElement('button');
        btn.id = prefix+'add';
        btn.style.border = '1px lightblue solid';
        btn.style.background = 'white';
        btn.innerText =  '🌟 [-] Нажмите на эту кнопку, а потом выберите форум [-] 🌟';
        btn.onclick = function(e){
            e.preventDefault();
            this.style.background = 'lightgreen';
            waitForFavourite();
        };
        div.appendChild(btn);
        var opt = document.querySelector('#optlist');
        opt.parentNode.insertBefore(div, opt.nextSibling);
    }

    // Две функции, для добавления новых избранных форумов по клику на кнопку
    function waitForFavourite(){
        document.querySelector('#optlist').addEventListener('change', acceptChange);
    }
    function acceptChange(event){
        document.querySelector('#optlist').removeEventListener('change', acceptChange);
        document.querySelector('#nnmmodhelperfavadd').style.background = 'white';
        var opt = parseInt(document.querySelector('#optlist').value);
        appendFavourite(opt);
    }

    /* Конец раздела с закладками */

    var msgElem = document.getElementsByClassName('post')[0];

    function setTextToArchive() {
        msgElem.value = localStorage.textToArchive;
    }

    function setTextToTemp() {
        msgElem.value = localStorage.textToTemp;
    }

    function findGroup(old) {
        for (var key in map) {
            if (map.hasOwnProperty(key) && map[key].indexOf(old) > -1) {
                return key;
            }
        }
        return -1;
    }

    function moveApproved(old) {
        var key = findGroup(old);
        setDest((key !== -1 && typeof(archive[key]) !== 'undefined') ? archive[key] : moveApprovedTo);
        setTextToArchive();
    }

    function moveNotApproved(old) {
        var key = findGroup(old);
        setDest((key !== -1 && typeof(temp[key]) !== 'undefined') ? temp[key] : moveNotApprovedTo);
        setTextToTemp();
    }

    function setThemeName() {
        var subjectElem = document.getElementsByName('subject')[0];
        if (localStorage.newTopicNameMode === 'true') {
            subjectElem.value = newTopicName + tid;
        } else {
            subjectElem.value = newTopicName + document.getElementsByClassName('postdetails')[0].innerHTML.substr(32);
        }
        subjectElem.onfocus = function() {
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

    function loadPage(url, onload) {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4) return;
                clearTimeout(timeout);
                if (xhr.status == 200) {
                    /**
                     * Выкусываем только тело страницы, без всяких заголовков и вычищаем все ссылки, чтобы ускорить её подгрузку.
                     * Самому писать регулярку было лениво, нагуглил первое подходящее решение, но оно зачищает URL вместе
                     * с закрывающими кавычками, поэтому вот такой обходной манёвр сделал.
                     */
                    var response = /<body[^>]*>([\s\S]+)<\/body>/i.exec(xhr.responseText + '</body></html>')[1].
                        replace(/'(http|https):\/\/(\w+:?\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@\-\/]))?/g, '\'https://localhost/\'').
                        replace(/"(http|https):\/\/(\w+:?\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@\-\/]))?/g, '\"https://localhost/\"');
                    var page = document.body.appendChild(document.createElement("div"));
                    page.style.display = 'none';
                    page.innerHTML = response;
                    onload(page);
                    document.removeChild(page);
                } else {
                    console.log('Failed to load page ' + url + ': ' + xhr.response + ', ' + xhr.responseText);
                }
            };
            var timeout = setTimeout(function () {
                console.log('Check for approved failed due to timeout');
                xhr.abort();
            }, localStorage.checkTimeout * 1000);
            xhr.send('');
        } catch (e) {
            console.warn('Failed to load page ' + url + ': ' + e.message);
        }
    }

    var oldForumElems = document.getElementsByName('f');
    var old = parseInt(oldForumElems[oldForumElems.length - 1].value);

    if (onSplit()) {
        buildCategorySelect(false);
        setThemeName();
        setDest(splitTo);
    } else if (onMove()) {
        buildCategorySelect(true);
        if (isArchive(old)) fromArchive();
        if (localStorage.checkApproved === 'true') {
            /**
             * Оптимизация отзывчивости скрита. Не ждём завершения запроса, чтобы заполнить темы и выбрать форум.
             * т.к. при проблемах с доступом к форуму может отрабатывать достаточно долго.
             * В таком случае быстрее будет вручную выбрать нужный форум и набить сообщение.
             */
            loadPage('/forum/viewtopic.php?t=' + tid, function (page) {
                var approved = page.querySelectorAll('tr.row1 > td.genmed');
                if (approved && approved.length > 11 && approved[11].innerHTML.indexOf('Оформление проверено ') > -1) {
                    if (isArchive(old) || isTemp(old)) {
                        setDest(old);
                    } else {
                        moveApproved(old);
                    }
                } else {
                    moveNotApproved(old);
                }
            });
        } else {
            moveNotApproved(old);
        }
    } else {
        /** Массовый перенос тем из раздела */
        buildCategorySelect(true);
        moveApproved(old);
    }

    // Добавление эелементов закладкохелпера.
    showFavourites();
}

function drawInterface() {
    var div = document.createElement('div');
    div.innerHTML = "<div style='position:absolute;z-index:10000;top:14px;left:14px;' id='moderator_setting'>" +
        "<img title='Изменить настройки скрипта модератора' onclick='OpenDiv()' id='moderator_settings_img' " +
        "src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABS0lEQV" +
        "RIx2NgGETABYg7oNiFFhY0APF/KG6g1DAdIGYi0QJ9Yg13AuKvQDwXyRJ+IF6MZAGILYCkpwqI/wJxPCHDtaCGwwwCWTIJiH8gicHwTyC" +
        "eDMS1SGIgSzzwWcAIxFOxGEYs3gjEbIR8AQqWJVg0HwTiLig+hEV+DxBzEhsP05E0fsCRLN2A+COSumnEGi4IxL+RNHrjUeuPFicCxGSi" +
        "FUiajhHhoFNI6pfjyowNOCKthwgL+nHobaCWBX3EWGADxOVQPJeCIJqDZI4NLg380AgjNZJ/4YtkdDANSeNHqEHoIBCIP5GTTEGgEUuYn" +
        "oAWDZOhbHR5UOZkJsbwDgqKitVAzEKomP6DpGEXEM9Ey3gw/B2IJ6Iliv84ghMFxEAt2Y1UtoiglU+LoYkBVnbNIbUicsdScOGrcJiIcT" +
        "ldq0xswIaYTER3AADyDbmZw/+N1gAAAABJRU5ErkJggg=='>" +
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
        localStorage.checkTimeout = checkTimeout;
        drawInterface();
        modHelp();
    }
}

window.addEventListener('DOMContentLoaded', loadingHelper, false);
window.addEventListener('load', loadingHelper, false);

window.onerror = function(msg, url, line, col, error) {
    // Note that col & error are new to the HTML 5 spec and may not be supported in every browser. It worked for me in Chrome.
    var extra = !col ? '' : '\ncolumn: ' + col;
    extra += !error ? '' : '\nerror: ' + error;

    // You can view the information in an alert to see things working like this:
    console.error("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);

    // If you return true, then error alerts (like in older versions of Internet Explorer) will be suppressed.
    return true;
};
