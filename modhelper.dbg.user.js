// ==UserScript==
// @name          NoNaMe-Club ModHelper (Debug)
// @namespace     NoNaMe-Club.Scripts
// @description   Замена стандартного варианта (корень Темпа), при переносе, на выбранные форумы. Debug-версия
// @version       1.94
// @author        Kaener
// @homepage      https://github.com/kaener/noname-club-modhelper
// @updateURL     https://raw.github.com/kaener/noname-club-modhelper/master/modhelper.dbg.meta.js
// @include       http://*.nnm-club.ru/forum/modcp.php*
// @include       http://nnm-club.ru/forum/modcp.php*
// @include       https://*.nnm-club.ru/forum/modcp.php*
// @include       https://nnm-club.ru/forum/modcp.php*
// @match         http://*.nnm-club.ru/forum/modcp.php*
// @match         http://nnm-club.ru/forum/modcp.php*
// @match         https://*.nnm-club.ru/forum/modcp.php*
// @match         https://nnm-club.ru/forum/modcp.php*
// @run-at        document-start
// ==/UserScript==
// 

var checkApprove = true; //!- проверять тему на "одобреность"? true - проверять, false - не проверять

console.log('checkApprove = ' + checkApprove);

var isLoaded = false;

function modHelp() {
  console.log('modhelp start');

  var done = false; 
  var tid = document.getElementsByName('t')[0].value;
  console.log('tid: '+tid);

  var temp = { 
    'anime':    146,
    'avto':     302,
    'books':    161,
    'games':    148,
    'humor':    399,
    'misc':     171,
    'mobile':   183,
    'music':    147,
    'sndbx':    149,
    'soft':     149,
    'tech':     932,
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
    'misc':     180,
    'mobile':   184,
    'music':    92,
    'serials':  802,
    'sndbx':    670,
    'soft':     95,
    'tech':     182,
    'ts':       150,
    'video':    91,
  };

  var map = {
    'anime':  [101, 102, 105, 106, 107, 23, 615, 616, 617, 618, 619, 620, 621, 622, 623, 624, 625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 635, 636, 637, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 650, 651, 695, 696],
    'avto':   [299, 301, 300],
    'books':  [123, 124, 125, 43, 432, 433, 434, 435, 436, 437, 438, 439, 440, 441, 442, 443, 444, 445, 447, 449, 451, 452, 453, 455, 456, 457, 458, 459, 460, 461, 462, 463, 464, 465, 466, 467, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 557, 558, 657, 662, 663, 755, 767, 815, 816, 817, 818, 875, 886, 887, 893, 895, 896, 931, 933, 957, 958],
    'cartoon':[229, 730, 732, 230, 659, 658, 231, 660, 661, 890, 232],
    'classic':[318, 320, 677, 319, 678, 885, 908, 909, 910, 911, 912],
    'docum':  [713, 706, 577, 894, 578, 580, 579, 953, 581, 806, 714, 761, 809, 924, 812, 576, 590, 591, 588, 823, 589, 598, 652, 596, 600, 819, 599, 956, 959, 597, 594, 593, 595, 582, 587, 583, 584, 586, 585, 614, 603, 974, 609, 951, 975, 608, 607, 606, 750, 605, 604, 950],
    'games':  [1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1034, 1035, 1036, 1037, 1038, 1039, 1041, 129, 268, 316, 317, 36, 37, 38, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 428, 746, 822, 848, 968, 969, 970, 971, 972],
    'humor':  [610, 613, 612, 655, 653, 654, 611, 656],
    'misc':   [52, 267, 166, 808, 676, 988],
    'mobile': [825, 208, 210, 209, 826, 830, 831, 832, 829, 828, 833, 834, 835, 836, 837, 839, 838, 840, 841, 827, 844, 842, 843],
    'music':  [118, 313, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 398, 429, 54, 55, 56, 671, 672, 673, 674, 680, 681, 710, 711, 712, 824, 876, 877, 878, 879, 917, 961, 962, 963, 965, 976, 977, 978, 979, 980, 981, 982, 983, 984],
    'serials':[768, 779, 778, 788, 787, 777, 786, 803, 776, 785, 775, 774, 773, 784, 772, 771, 783, 804, 782, 781, 780, 922, 770, 769, 799, 800, 801, 791, 798, 797, 790, 793, 794, 789, 796, 792, 795],
    'sndbx':  [1042],
    'soft' :  [1024, 1025, 1026, 1028, 1029, 1030, 1031, 1032, 503, 504, 506, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 529, 530, 532, 533, 534, 535, 536, 537, 538, 539, 545, 548, 549, 550, 552, 553, 554, 561, 562, 563, 564, 717, 763, 764, 765, 820, 916],
    'tech':   [948, 47],
    'ts':     [217],
    'video':  [216, 270, 218, 219, 954, 888, 220, 221, 222, 882, 889, 224, 225, 226, 227, 891, 682, 694, 884, 693, 913, 228, 254, 321, 255, 906, 256, 257, 258, 883, 955, 905, 271, 264, 265, 272, 266],
  };

  var moveNotApprovedTo = temp['Мусорник'];          //!- в этот форум переносим, если мы не узнали исходный форум и не проверяли или тема не одобрена
  var moveApprovedTo    = temp['Мусорник'];          //!- в этот форум переносим, если мы не узнали исходный форум, но проверяли и тема одобрена
  var splitTo           = temp['Мусорник'];          //!- в этот форум выделяем
  var newTopicName      = 'Выделено из темы ' + tid; //!- название темы при выделении, где tid -- id темы
  var leaveMsgOnMv      = true;                     //!- оставлять сообщение о переносе, true -- да, false -- нет
  var addMsgToOld       = false;                     //!- оставлять сообщение о разделении в старой теме, true -- да, false -- нет
  var addMsgToNew       = true;                      //!- оставлять сообщение о разделении в новой теме, true -- да, false -- нет

  function findGroup(old) {
    console.log('find group by old f: ' + old);
    for (var key in map) {
      console.log('trying key: ' + key);
      if (map[key].indexOf(old) > -1) {
        console.log('key ' + key + ' finded!');
        return key;
      }
    }
    console.log('no group for this forum');
    return -1;
  }

  function moveApprovedToF(old) {
    console.log('move approved from: ' + old);
    var key = findGroup(old);
    console.log('finded group for this: ' + key);
    if (key !== -1 && typeof(archive[key]) !== 'undefined') {
      console.log('return archive f:' + archive[key]);
      return archive[key];
    } else {
      console.log('return default archive f:' +  moveApprovedTo);
      return moveApprovedTo;
    }
  }

  function moveNotApprovedToF(old) {
    console.log('Move not approved from: ' + old);
    var key = findGroup(old);
    console.log('finded group for this: ' + key);
    if (key !== -1 && typeof(temp[key]) !== 'undefined') {
      console.log('return temp f:' + temp[key]);
      return temp[key];
    } else {
      console.log('return default archive f:' +  moveNotApprovedTo);
      return moveNotApprovedTo;
    }
  }

  function setThemeName() {
    console.log('set theme name func');
    document.getElementsByName('subject')[0].value =  newTopicName;
    document.getElementsByName('subject')[0].onfocus = function() { if(!done) this.value = ''; done = true; }
    console.log('set theme name func done here');
  }

  function setDest(id) {
    console.log('Sed dest: ' + id);
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
                  console.log(result.message);
              else {
                  approved = $('tr.row1 > td.genmed', result);
                  if (typeof(approved) !== 'undefined' && approved.length > 11) {
                    console.log(approved[11].innerHTML);
                    approved = approved[11].innerHTML.indexOf("Оформление проверено ") > -1;
                    console.log('so approved: ' + approved);
                  } else {
                    approved = false;
                  }
                }
          },
          async:   false
      });
      console.log('retrun approved: ' + approved);
      return approved;
  }

  function isArchive(forum) {
    for (var i in archive) {
      if (archive.hasOwnProperty(i)){ // skip inherited properties
        if (archive[i] === forum) {
          console.log('Is an archive!');
          return true;
        }
      }
    }
    console.log('Not an archive!');
    return false;
  }

  function fromArchive() {
    var formElem = Array.prototype.filter.apply(document.forms, [function (elem) {
      return (elem && elem.action && && elem.action.indexOf('modcp.php') > -1);
    }])[0];
    formElem.addEventListener('submit', function(e) {
      if (!confirm('Действительно хотите перенести из Архива?')) {
        console.log('stop from submitting!');
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
        console.log('on move form update');
        if (isArchive(options.forum)) fromArchive();
        var msgMoveElem = document.getElementById('insert_msg');
        console.log('set ' + leaveMsgOnMv + ' to elem ' + msgMoveElem);
        msgMoveElem.checked = leaveMsgOnMv;
        var msgElem = document.getElementById('move_bot');
        msgElem.style.display = leaveMsgOnMv?'block':'none';
        break;
      case 'onsplit':
        console.log('on split form update');
        var msgSplitElemOld = document.getElementById('after_split_to_old');
        var msgSplitElemNew = document.getElementById('after_split_to_new');
        console.log('set ' + addMsgToOld + ' to elem ' + msgSplitElemOld);
        console.log('set ' + addMsgToNew + ' to elem ' + msgSplitElemNew);
        msgSplitElemOld.checked = addMsgToOld;
        msgSplitElemNew.checked = addMsgToNew;
        break;
      default:
        break;
    }
    console.log('done form update');
  }

  var oldForumElems = document.getElementsByName('f');
  var old = parseInt(oldForumElems[oldForumElems.length - 1].value);
  console.log('old forum: ' + old);

  if (onSplit()) {
    console.log('split!')
    formUpdate('onsplit');
    console.log('setThemeName');
    setThemeName();
    console.log('setDest');
    setDest(splitTo);
  } else if (onMove()) {
    console.log('move!');
    formUpdate('onmove', {'forum': old});
    if (checkApprove && themeIsApproved()) {
      console.log('approved!');
      setDest(moveApprovedToF(old));
    } else {
      console.log('not approved!');
      setDest(moveNotApprovedToF(old));
    }
  }
}

function checkJquery() {
  if(!checkApprove) { //if we don't need jQuery
    console.log('we don\'t need jQuery');
    modHelp();
  } else if (typeof(window.jQuery) !== 'undefined') {// Opera!
    console.log('Opera!');
    $ = window.jQuery;
    modHelp();
  } else if (typeof(unsafeWindow.jQuery) !== 'undefined') {  // Firefox!
    console.log('Firefox!');
    $ = unsafeWindow.jQuery;
    modHelp();
  } else { // Chrome and others
    console.log('Chrome!');
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