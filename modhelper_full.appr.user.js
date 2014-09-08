// ==UserScript==
// @name          NoNaMe-Club ModHelper
// @namespace     NoNaMe-Club.Scripts
// @description   Замена стандартного варианта (корень Темпа), при переносе, на выбранные форумы. Версия с проверкой на «одобреность» темы
// @version       2.0.0.8
// @original author    Kaener
// @author        Team of co-authors NNM-Club
// @homepage      https://github.com/GhosT-OdessA/noname-club-modhelper
// @updateURL     https://github.com/GhosT-OdessA/noname-club-modhelper/raw/master/modhelper_full.appr.meta.js
// @downloadURL   https://github.com/GhosT-OdessA/noname-club-modhelper/raw/master/modhelper_full.appr.user.js
// @include       http://*.nnm-club.me/forum/modcp.php*
// @include       http://nnm-club.me/forum/modcp.php*
// @include       https://*.nnm-club.me/forum/modcp.php*
// @include       https://nnm-club.me/forum/modcp.php*
// @match         http://*.nnm-club.me/forum/modcp.php*
// @match         http://nnm-club.me/forum/modcp.php*
// @match         https://*.nnm-club.me/forum/modcp.php*
// @match         https://nnm-club.me/forum/modcp.php*
// ==/UserScript==
//

// Проверка наличия ранее сделаных настроек пользователя и при их отсутствии при первом запуске будет предложено заполнение значений переменных
// пользователем для индивидуальной настройки под себя.
	


function OpenDiv() {
    var div = document.createElement('div');
    div.innerHTML = "<div style='position:fixed;z-index:100;width:100%;height:100%;top:0px;left:0px;' id='moderator_menu'>"
            + "       <div style='position:relative;width:100%;height:100%'>"
            + "               <div style='position:absolute;top:0px;left:0px;background-color:gray;filter:alpha(opacity=70);-moz-opacity: 0.7;opacity: 0.7;z-index:200;width:100%;height:100%'></div>"
            + "               <div style='position:absolute;top:0px;margin:auto;z-index:300;width: 100%;height:500px;'>"
            + "                        <div style='box-shadow: 0 0 10px 2px black; margin:auto;width:400px;background-color: white;padding: 40px;margin-top:100px'>"
            + '<form>'
            + '<input id="leaveMsgOnMv" type="checkbox">Оставлять сообщение о переносе (делает активным поле ввода текста примечания)</input><br>'
            + '<input id="addMsgToOld" type="checkbox">Оставлять сообщение о разделении в старой теме</input><br>'
            + '<input id="addMsgToNew" type="checkbox">Добавлять сообщение о разделении в новую тему</input><br>'
            + '<input id="newTopicNameMode" type="checkbox">Название темы выводить цифровое значение <br>(Условие формирования названия новой темы при разделении темы <br>true - Выделено из темы + ID (цифровое значение) темы <br>false - Выделено из темы + Название темы текстом)></input><br>'
            + 'Текст причины переноса темы в Архив:<input  style=width:350px id="textToArchive" type="text"><br>'
            + 'Текст причины переноса темы в Темп:<input   style=width:350px id="textToTemp" type="text"><br>'
            + '<input type="button" value="Записать" onclick="SaveSettingAndDeleteDiv(true)"> <input type="button" style="aligh:right;" value="Закрыть" onclick="SaveSettingAndDeleteDiv(false)">'
            + '</form>'
            + "                        </div>"
            + "               </div>"
            + "       </div>"
            + "</div>";
    document.body.appendChild(div);
	
    
    if ( localStorage.testLocalStorage == undefined ){
        localStorage.leaveMsgOnMv = true;
        localStorage.addMsgToOld = false;
        localStorage.addMsgToNew = true;
        localStorage.newTopicNameMode = false;
        localStorage.textToArchive = "На трекере доступна новая версия";
        localStorage.textToTemp = "Нуждается в дооформлении";
        localStorage.testLocalStorage = 1;
    } 

    document.getElementById('leaveMsgOnMv').checked = (localStorage.leaveMsgOnMv === "true");
    document.getElementById('addMsgToOld').checked = (localStorage.addMsgToOld === "true");
    document.getElementById('addMsgToNew').checked = (localStorage.addMsgToNew === "true");
    document.getElementById('newTopicNameMode').checked = (localStorage.newTopicNameMode === "true");
    document.getElementById('textToArchive').value = localStorage.textToArchive;
    document.getElementById('textToTemp').value = localStorage.textToTemp;

    return null;
}

function SaveSettingAndDeleteDiv(save) {
    if (save) {
        localStorage.leaveMsgOnMv = document.getElementById('leaveMsgOnMv').checked;
        localStorage.addMsgToOld = document.getElementById('addMsgToOld').checked;
        localStorage.addMsgToNew = document.getElementById('addMsgToNew').checked;
        localStorage.newTopicNameMode = document.getElementById('newTopicNameMode').checked;
        localStorage.textToArchive = document.getElementById('textToArchive').value;
        localStorage.textToTemp = document.getElementById('textToTemp').value;
        localStorage.testLocalStorage = 1;
    }
    var div = document.getElementById('moderator_menu').parentNode;
    div.parentNode.removeChild(div);
}

var checkApprove = true; //!- проверять тему на "одобреность"? true - проверять, false - не проверять

var isLoaded = false;

function modHelp() {

    var done = false;
    var tid = document.getElementsByName('t')[0].value;

    var temp = {
        'anime': 146,
        'avto': 302,
        'books': 161,
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
        'video': 145
    };

    var archive = {
        'anime': 169,
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

    var map = {
        'anime': [23, 101, 102, 107, 615, 616, 617, 619, 620, 621, 622, 623, 624, 625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 635, 636, 637, 638, 639, 640, 642, 643, 644, 645, 646, 648, 695, 696],
        'avto': [299, 301, 300],
        'books': [299, 300, 301, 432, 433, 434, 435, 436, 437, 438, 439, 440, 441, 442, 443, 444, 445, 447, 449, 451, 452, 453, 455, 456, 457, 458, 459, 460, 461, 462, 463, 464, 465, 466, 467, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 557, 558, 657, 662, 663, 755, 767, 815, 816, 817, 818, 875, 886, 887, 893, 895, 896, 931, 933, 957, 958, 1063],
        'cartoon': [229, 230, 231, 232, 658, 659, 660, 661, 730, 732, 890],
        'classic': [318, 320, 677, 319, 678, 885, 908, 909, 910, 911, 912],
        'docum': [576, 577, 578, 579, 580, 581, 582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 593, 594, 595, 596, 597, 598, 599, 600, 603, 604, 605, 606, 607, 608, 609, 614, 652, 706, 713, 714, 750, 761, 806, 809, 812, 819, 823, 894, 924, 950, 951, 953, 956, 959, 974, 975, 1194, 1200],
        'games': [36, 37, 38, 129, 268, 316, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 410, 411, 412, 413, 414, 415, 416, 417, 418, 428, 728, 740, 741, 746, 822, 848, 968, 969, 970, 971, 972, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1034, 1035, 1036, 1037, 1038, 1039, 1041],
        'humor': [610, 611, 612, 613, 653, 654, 655, 656],
        'mediadisgraf': [166, 267, 534, 676, 808, 988, 1070, 1071, 1072, 1073, 1074, 1075, 1076, 1077, 1078, 1102, 1103, 1105, 1106, 1107, 1108, 1110, 1111, 1112, 1113, 1114, 1115, 1116, 1129, 1134, 1136, 1138, 1139, 1204],
        'mobile': [208, 209, 210, 825, 826, 827, 828, 829, 830, 831, 832, 833, 834, 835, 836, 837, 838, 839, 840, 841, 842, 843, 844],
        'music': [54, 55, 56, 118, 313, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 336, 337, 338, 339, 340, 341, 344, 345, 346, 347, 348, 349, 352, 353, 354, 357, 358, 359, 360, 361, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 398, 429, 671, 672, 673, 674, 680, 681, 711, 824, 876, 877, 878, 879, 917, 961, 962, 963, 965, 976, 977, 978, 979, 980, 981, 982, 983, 984, 1149, 1157, 1158, 1159, 1160, 1161, 1162, 1163, 1164, 1165, 1166, 1167, 1168, 1178, 1179, 1180, 1181, 1182, 1183, 1184, 1185, 1186, 1187, 1188, 1189, 1190],
        'music_video': [271, 257, 258, 883, 955, 1210],
        'serials': [768, 769, 770, 771, 772, 773, 774, 775, 776, 777, 778, 779, 780, 781, 782, 783, 784, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 803, 804, 922, 1140, 1141, 1142, 1144, 1195, 1196],
        'sndbx': [1042],
        'soft': [24, 503, 504, 506, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 529, 530, 532, 533, 535, 536, 545, 548, 549, 550, 552, 553, 554, 561, 562, 563, 564, 717, 763, 764, 765, 820, 916, 1023, 1025, 1026, 1031, 1032, 1137],
        'tech': [47, 948],
        'ts': [217],
        'video': [216, 218, 219, 220, 221, 222, 224, 225, 226, 227, 228, 254, 255, 256, 264, 265, 266, 270, 272, 321, 682, 693, 694, 882, 884, 888, 889, 891, 905, 906, 913, 954, 1150, 1211]

    };

    var moveNotApprovedTo = temp['trash'];          //!- в этот форум переносим, если мы не узнали исходный форум и не проверяли или тема не одобрена
    var moveApprovedTo = temp['trash'];          //!- в этот форум переносим, если мы не узнали исходный форум, но проверяли и тема одобрена
    var splitTo = temp['trash'];          //!- в этот форум выделяем
    var newTopicName = 'Выделено из темы ' + tid; //!- название темы при выделении, где tid -- id темы
//  var leaveMsgOnMv      = true;                     //!- оставлять сообщение о переносе, true -- да, false -- нет
//  var addMsgToOld       = false;                     //!- оставлять сообщение о разделении в старой теме, true -- да, false -- нет
//  var addMsgToNew       = true;                     //!- оставлять сообщение о разделении в новой теме, true -- да, false -- нет
//  var newTopicNameMode  = false;                    //!- Режим формирования названия новой темы при разделении, true -- Выделено из темы + ID темы, false -- Выделено из темы + <Название темы>
//  var text1 = 'На трекере доступна новая версия';
//  var text2 = 'Требуется доработка по замечаниям модератора';

    var leaveMsgOnMv = localStorage.leaveMsgOnMv;
    //console.log('leaveMsgOnMv = ' + leaveMsgOnMv);
    var addMsgToOld = (localStorage.addMsgToOld === 'true');
    //console.log('addMsgToOld = ' + addMsgToOld);
    var addMsgToNew = (localStorage.addMsgToNew === 'true');
    //console.log('leaveMsgOnMv = ' + leaveMsgOnMv);
    var newTopicNameMode = (localStorage.newTopicNameMode === 'true');
    //console.log('newTopicNameMode = ' + newTopicNameMode);
    var textToArchive = localStorage.textToArchive;
    //console.log('textToArchive = ' + textToArchive);
    var textToTemp = localStorage.textToTemp;
    //console.log('textToTemp = ' + textToTemp);
	var savedText;
	var msgMoveElem = document.getElementById('insert_msg');
	var msgElem = document.getElementById('move_bot');
	var msgSplitElemOld = document.getElementById('after_split_to_old');
	var msgSplitElemNew = document.getElementById('after_split_to_new');


    function setTextToArchive() {
        document.getElementsByClassName('post')[0].value = textToArchive;
    }

    function setTextToTemp() {
        document.getElementsByClassName('post')[0].value = textToTemp;
    }

    function setEmptyText() {
        document.getElementsByClassName('post')[0].value = '';
    }

    function uncheckText() {
		savedText=document.getElementsByClassName('post')[0].value;
		setEmptyText();
		msgMoveElem.onchange = function() {checkText();};
	}

    function checkText() {
		document.getElementsByClassName('post')[0].value=savedText;
		msgMoveElem.onchange = function() {uncheckText();};
	}

    function findGroup(old) {
        for (var key in map) {
            if (map[key].indexOf(old) > -1) {
                return key;
            }
        }
        return -1;
    }

    function moveApprovedToF(old) {
        var key = findGroup(old);
        if (key !== -1 && typeof(archive[key]) !== 'undefined') {
            return archive[key];
        } else {
            return moveApprovedTo;
        }
    }

    function moveNotApprovedToF(old) {
        var key = findGroup(old);
        if (key !== -1 && typeof(temp[key]) !== 'undefined') {
            return temp[key];
        } else {
            return moveNotApprovedTo;
        }
    }

    function setThemeName() {
        if (newTopicNameMode) {
            document.getElementsByName('subject')[0].value = newTopicName;
        }
        else {
            document.getElementsByName('subject')[0].value = 'Выделено из темы ' + document.getElementsByClassName('postdetails')[0].innerHTML.substr(32);
        }
        document.getElementsByName('subject')[0].onfocus = function() {
            if (!done)
                this.value = '';
            done = true;
        };
    }

    function setDest(id) {
        var selectElem = document.getElementsByTagName('select');
        if (selectElem.length > 0) {
            selectElem[0].value = id;
        }
    }

    function onSplit() {
        if (document.URL.indexOf('mode=split') > -1) {
            return true;
        } else {
            return false;
        }
    }

    function onMove() {
        if (document.URL.indexOf('mode=move') > -1) {
            return true;
        } else {
            return false;
        }
    }

    function themeIsApproved() {
        var approved = false;
        $.ajax({
            url: '/forum/viewtopic.php?t=' + tid,
            success: function(result) {
                if (result.isOk === false)
                    console.debug(result.message);
                else {
                    approved = $('tr.row1 > td.genmed', result);
                    if (typeof(approved) !== 'undefined' && approved.length > 11) {
                        approved = approved[11].innerHTML.indexOf("Оформление проверено ") > -1;
                    } else {
                        approved = false;
                    }
                }
            },
            async: false
        });
        return approved;
    }

    function isArchive(forum) {
        for (var i in archive) {
            if (archive.hasOwnProperty(i)) { // skip inherited properties
                if (archive[i] === forum) {
                    return true;
                }
            }
        }
        return false;
    }

    function isTemp(forum) {
        for (var i in temp) {
            if (temp.hasOwnProperty(i)) { // skip inherited properties
                if (temp[i] === forum) {
                    return true;
                }
            }
        }
        return false;
    }

    function fromArchive() {
        var formElem = Array.prototype.filter.apply(document.forms, [function(elem) {
                return (elem && elem.action && elem.action.indexOf('modcp.php') > -1);
            }])[0];
        formElem.addEventListener('submit', function(e) {
            if (!confirm('Действительно хотите перенести из Архива?')) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                e.returnValue = false;
            }
        }, false);
    }

    function formUpdate(action, options) {
        switch (action) {
            case 'onmove':
                if (isArchive(options.forum))
                    fromArchive();
                msgMoveElem.checked = leaveMsgOnMv;
                msgElem.style.display = leaveMsgOnMv ? 'block' : 'none';
                msgMoveElem.onchange = leaveMsgOnMv ? function() {uncheckText();} : function() {checkText();};
                break;
            case 'onsplit':
                msgSplitElemOld.checked = addMsgToOld;
                msgSplitElemNew.checked = addMsgToNew;
                break;
            default:
                break;
        }
    }

    var oldForumElems = document.getElementsByName('f');
    var old = parseInt(oldForumElems[oldForumElems.length - 1].value);


    if (onSplit()) {
        formUpdate('onsplit');
        setThemeName();
        setDest(splitTo);
    } else if (onMove()) {
        formUpdate('onmove', {'forum': old});
        if  (checkApprove && themeIsApproved() && isArchive(old)) {
            setEmptyText();
            setDest(old);
        }
        else if  (checkApprove && themeIsApproved() && isTemp(old)) {
            setEmptyText();
            setDest(old);
        }
        else if  (checkApprove && themeIsApproved() && !isArchive(old) && !isTemp(old)) {
            setTextToArchive();
            setDest(moveApprovedToF(old));
        }
        else {
            setTextToTemp();
            setDest(moveNotApprovedToF(old));
        }
    }
}




function checkJquery() {
    if (!checkApprove) { //if we don't need jQuery
        modHelp();
    } else if (typeof(window.jQuery) !== 'undefined') {// Opera!
        $ = window.jQuery;
        modHelp();
    } else if (typeof(unsafeWindow.jQuery) !== 'undefined') {  // Firefox!
        $ = unsafeWindow.jQuery;
        modHelp();
    } else { // Chrome and others
        var script = document.createElement("script");
        script.textContent = "var checkApprove = " + checkApprove + ";\nvar $ = window.jQuery;\n" + "(" + modHelp.toString() + ")();";
        document.body.appendChild(script);
    }
    var div = document.createElement('div');
    div.innerHTML = "<div style='position:absolute;z-index:100;top:14px;left:14px; id='moderator_setting'><img title='Изменить настройки скрипта модератора' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABS0lEQVRIx2NgGETABYg7oNiFFhY0APF/KG6g1DAdIGYi0QJ9Yg13AuKvQDwXyRJ+IF6MZAGILYCkpwqI/wJxPCHDtaCGwwwCWTIJiH8gicHwTyCeDMS1SGIgSzzwWcAIxFOxGEYs3gjEbIR8AQqWJVg0HwTiLig+hEV+DxBzEhsP05E0fsCRLN2A+COSumnEGi4IxL+RNHrjUeuPFicCxGSiFUiajhHhoFNI6pfjyowNOCKthwgL+nHobaCWBX3EWGADxOVQPJeCIJqDZI4NLg380AgjNZJ/4YtkdDANSeNHqEHoIBCIP5GTTEGgEUuYnoAWDZOhbHR5UOZkJsbwDgqKitVAzEKomP6DpGEXEM9Ey3gw/B2IJ6Iliv84ghMFxEAt2Y1UtoiglU+LoYkBVnbNIbUicsdScOGrcJiIcTldq0xswIaYTER3AADyDbmZw/+N1gAAAABJRU5ErkJggg==' id = 'moderator_settings_img' onclick='OpenDiv()'></img></div>";
    document.body.appendChild(div);

    var scriptOpenDiv = document.createElement("script");
    scriptOpenDiv.textContent = OpenDiv.toString();
    document.body.appendChild(scriptOpenDiv);

    var scriptSaveSettingAndDeleteDiv = document.createElement("script");
    scriptSaveSettingAndDeleteDiv.textContent = SaveSettingAndDeleteDiv.toString();
    document.body.appendChild(scriptSaveSettingAndDeleteDiv);


    if (localStorage.testLocalStorage == undefined ) {
        OpenDiv();
    }
}

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
