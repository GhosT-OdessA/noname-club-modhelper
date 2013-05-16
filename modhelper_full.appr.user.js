// ==UserScript==
// @name          NoNaMe-Club ModHelper
// @namespace     NoNaMe-Club.Scripts
// @description   Замена стандартного варианта (корень Темпа), при переносе, на выбранные форумы. Версия с проверкой на «одобреность» темы
// @version       2.0.0.2
// @original author	Kaener
// @author        Team of co-authors NNM-Club
// @homepage      https://github.com/GhosT-OdessA/noname-club-modhelper
// @updateURL     https://github.com/GhosT-OdessA/noname-club-modhelper/raw/master/modhelper_full.appr.meta.js
// @downloadURL   https://github.com/GhosT-OdessA/noname-club-modhelper/raw/master/modhelper_full.appr.user.js
// @include       http://*.nnm-club.ru/forum/modcp.php*
// @include       http://nnm-club.ru/forum/modcp.php*
// @include       https://*.nnm-club.ru/forum/modcp.php*
// @include       https://nnm-club.ru/forum/modcp.php*
// @match         http://*.nnm-club.ru/forum/modcp.php*
// @match         http://nnm-club.ru/forum/modcp.php*
// @match         https://*.nnm-club.ru/forum/modcp.php*
// @match         https://nnm-club.ru/forum/modcp.php*
// ==/UserScript==
// 

var checkApprove = true; //!- проверять тему на "одобреность"? true - проверять, false - не проверять

var isLoaded = false;

function modHelp() {

  var done = false; 
  var tid = document.getElementsByName('t')[0].value;

  var temp = { 
    'anime':    146,
    'avto':     302,
    'books':    161,
    'games':    148,
    'humor':    399,
    'mediadisgraf':     171,
    'mobile':   183,
    'music':    147,
    'sndbx':    149,
    'soft':     149,
    'tech':     932,
    'serials':  145,
    'video':    145,
    'Мусорник': 670,
  };

  var archive = {
    'anime':    169,
    'avto':     303,
    'books':    94,
    'cartoons': 892,
    'classic':  668,
    'docum':    669,
    'games':    93,
    'humor':    400,
    'mediadisgraf':    180,
    'mobile':   184,
    'music':    92,
    'serials':  802,
    'sndbx':    1068,
    'soft':     95,
    'tech':     182,
    'ts':       150,
    'video':    91,
  };

  var map = {
    'anime':  [101, 102, 105, 106, 107, 23, 615, 616, 617, 618, 619, 620, 621, 622, 623, 624, 625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 635, 636, 637, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 650, 651, 695, 696],
    'avto':   [299, 301, 300],
    'books':  [432, 433, 434, 482, 436, 437, 438, 439, 486, 299, 435, 492, 755, 481, 557, 442, 441, 875, 444, 443, 440, 558, 447, 445, 817, 818, 456, 931, 957, 455, 453, 452, 449, 1063, 451, 484, 483, 460, 459, 458, 457, 462, 467, 466, 958, 465, 464, 463, 469, 485, 473, 472, 471, 895, 470, 896, 480, 477, 476, 475, 474, 886, 478, 490, 657, 489, 488, 487, 887, 893, 491, 767, 301, 300, 662, 663, 461, 815, 933, 816],
    'cartoon':[229, 730, 732, 230, 659, 658, 231, 660, 661, 890, 232],
    'classic':[318, 320, 677, 319, 678, 885, 908, 909, 910, 911, 912],
    'docum':  [713, 706, 577, 894, 578, 580, 579, 953, 581, 806, 714, 761, 809, 924, 812, 576, 590, 591, 588, 823, 589, 598, 652, 596, 600, 819, 599, 956, 959, 597, 594, 593, 595, 582, 587, 583, 584, 586, 585, 614, 603, 974, 609, 951, 975, 608, 607, 606, 750, 605, 604, 950],
    'games':  [1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1034, 1035, 1036, 1037, 1038, 1039, 1041, 129, 268, 316, 317, 36, 37, 38, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 428, 746, 822, 848, 968, 969, 970, 971, 972, 728, 740, 741],
    'humor':  [610, 613, 612, 655, 653, 654, 611, 656],
    'mobile': [825, 208, 210, 209, 826, 830, 831, 832, 829, 828, 833, 834, 835, 836, 837, 839, 838, 840, 841, 827, 844, 842, 843],
    'music':  [118, 313, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 398, 429, 54, 55, 56, 671, 672, 673, 674, 680, 681, 710, 711, 712, 824, 876, 877, 878, 879, 917, 961, 962, 963, 965, 976, 977, 978, 979, 980, 981, 982, 983, 984],
    'serials':[768, 769, 770, 771, 772, 773, 774, 775, 776, 777, 778, 779, 780, 781, 782, 783, 784, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 803, 804, 922, 1141, 1142, 1144],
    'sndbx':  [1042],
    'soft' :  [24, 503, 506, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 529, 530, 532, 533, 535, 536, 545, 548, 549, 550, 552, 553, 554, 561, 562, 563, 564, 717, 763, 764, 765, 820, 916, 1023, 1025, 1026, 1031, 1032, 1137],
    'tech':   [948, 47],
    'ts':     [217],
    'video':  [216, 218, 219, 220, 221, 222, 224, 225, 226, 227, 228, 254, 255, 256, 257, 258, 264, 265, 266, 270, 271, 272, 321, 682, 693, 694, 882, 883, 884, 888, 889, 891, 905, 906, 913, 954, 955, 1128, 1150],
  'mediadisgraf': [1070, 534, 1077, 267, 1071, 1134, 1108, 1107, 1075, 1106, 1105, 676, 1074, 1078, 166, 1114, 1112, 1129, 1113, 1110, 1111, 1115, 1116, 808, 1138, 1136, 1139, 988, 1073, 1072, 1076, 1103, 1102]
  };

  var moveNotApprovedTo = temp['Мусорник'];          //!- в этот форум переносим, если мы не узнали исходный форум и не проверяли или тема не одобрена
  var moveApprovedTo    = temp['Мусорник'];          //!- в этот форум переносим, если мы не узнали исходный форум, но проверяли и тема одобрена
  var splitTo           = temp['Мусорник'];          //!- в этот форум выделяем
  var newTopicName      = 'Выделено из темы ' + tid; //!- название темы при выделении, где tid -- id темы
  var leaveMsgOnMv      = true;                     //!- оставлять сообщение о переносе, true -- да, false -- нет
  var addMsgToOld       = false;                     //!- оставлять сообщение о разделении в старой теме, true -- да, false -- нет
  var addMsgToNew       = true;                     //!- оставлять сообщение о разделении в новой теме, true -- да, false -- нет
  var newTopicNameMode  = false;                    //!- Режим формирования названия новой темы при разделении, true -- Выделено из темы + ID темы, false -- Выделено из темы + <Название темы>
  var text1 = 'На трекере доступна новая версия';
  var text2 = 'Требуется доработка по замечаниям модератора';
  
  function SetText1() {
    document.getElementsByClassName('post')[0].value = text1;
  }
  
  function SetText2() {
    document.getElementsByClassName('post')[0].value = text2;
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
    document.getElementsByName('subject')[0].onfocus = function() { if(!done) this.value = ''; done = true; }
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
              if(result.isOk === false)
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
          async:   false
      });
      return approved;
  }

  function isArchive(forum) {
    for (var i in archive) {
      if (archive.hasOwnProperty(i)){ // skip inherited properties
        if (archive[i] === forum) {
          return true;
        }
      }
    }
    return false;
  }

  function fromArchive() {
    var formElem = Array.prototype.filter.apply(document.forms, [function (elem) {
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
    switch(action) {
      case 'onmove':
        if (isArchive(options.forum)) fromArchive();
        var msgMoveElem = document.getElementById('insert_msg');
        msgMoveElem.checked = leaveMsgOnMv;
        var msgElem = document.getElementById('move_bot');
        msgElem.style.display = leaveMsgOnMv?'block':'none';
        break;
      case 'onsplit':
        var msgSplitElemOld = document.getElementById('after_split_to_old');
        var msgSplitElemNew = document.getElementById('after_split_to_new');
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
    if (checkApprove && themeIsApproved()) {
		SetText1();
	    setDest(moveApprovedToF(old));
    } else {
      SetText2();
	  setDest(moveNotApprovedToF(old));
    }
  }
}




function checkJquery() {
  if(!checkApprove) { //if we don't need jQuery
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
