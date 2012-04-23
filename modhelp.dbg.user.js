// ==UserScript==
// @name          NoNaMe-Club ModHelp
// @namespace     http://userscripts.org
// @description   Замена стандартного варианта (корень Темпа), при переносе, на выбранные форумы
// @author        Kaener
// @version       1.91
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
    'Мусорник': 670,
    'avto':     302,
    'video':    145,
    'anime':    146,
    'music':    147,
    'games':    148,
    'books':    161,
    'misc':     171,
    'soft':     149,
    'mobile':   183,
    'humor':    399,
    'tech':     932
  };

  var archive = {
    'anime':    169,
    'cartoons': 892,
    'video':    91,
    'classic':  668,
    'serials':  802,
    'docum':    669,
    'humor':    400,
    'music':    92,
    'games':    93,
    'books':    94,
    'soft':     95,
    'avto':     303,
    'misc':     180,
    'mobile':   184,
    'ts':       150,
    'tech':     182
  };

  var map = {
    'tech':   [948, 47],
    'ts':     [217],
    'misc':   [52, 267, 166, 808, 676],
    'humor':  [610, 613, 612, 655, 653, 654, 611, 656],
    'cartoon':[229, 730, 732, 230, 659, 658, 231, 660, 661, 890, 232],
    'classic':[318, 320, 677, 319, 678, 885, 908, 909, 910, 911, 912],
    'mobile': [825, 208, 210, 209, 826, 830, 831, 832, 829, 828, 833, 834, 835, 836, 837, 839, 838, 840, 841, 827, 844, 842, 843],
    'games':  [36, 37, 129, 38, 410, 411, 412, 415, 413, 428, 746, 414, 416, 268, 419, 417, 316, 317, 822, 382, 390, 387, 388, 385, 386, 848, 383, 384, 389, 391, 418, 972, 971, 970, 969, 968],
    'serials':[768, 779, 778, 788, 787, 777, 786, 803, 776, 785, 775, 774, 773, 784, 772, 771, 783, 804, 782, 781, 780, 922, 770, 769, 799, 800, 801, 791, 798, 797, 790, 793, 794, 789, 796, 792, 795],
    'video':  [216, 270, 218, 219, 954, 888, 220, 221, 222, 882, 889, 224, 225, 226, 227, 891, 682, 694, 884, 693, 913, 228, 254, 321, 255, 906, 256, 257, 258, 883, 955, 905, 271, 264, 265, 272, 266],
    'anime':  [23, 101, 102, 106, 107, 105, 615, 619, 618, 617, 616, 620, 623, 622, 621, 635, 632, 624, 627, 626, 625, 636, 633, 628, 631, 630, 629, 637, 634, 638, 640, 639, 641, 644, 643, 642, 645, 651, 649, 648, 646, 647, 650, 695, 696],
    'soft' :  [503, 504, 506, 763, 508, 509, 717, 510, 511, 916, 512, 561, 562, 513, 514, 515, 516, 517, 518, 519, 520, 521, 522, 523, 524, 532, 533, 535, 534, 530, 529, 525, 526, 527, 545, 820, 764, 552, 553, 554, 548, 765, 549, 550, 536, 563, 564, 537, 538, 539],
    'docum':  [713, 706, 577, 894, 578, 580, 579, 953, 581, 806, 714, 761, 809, 924, 812, 576, 590, 591, 588, 823, 589, 598, 652, 596, 600, 819, 599, 956, 959, 597, 594, 593, 595, 582, 587, 583, 584, 586, 585, 614, 603, 974, 609, 951, 975, 608, 607, 606, 750, 605, 604, 950],
    'books':  [123, 124, 125, 43, 432, 755, 481, 557, 442, 441, 875, 444, 443, 440, 558, 433, 447, 445, 817, 818, 434, 456, 931, 957, 455, 453, 452, 449, 451, 482, 484, 483, 436, 460, 459, 458, 457, 462, 437, 467, 466, 958, 465, 464, 463, 469, 438, 485, 473, 472, 471, 895, 470, 896, 480, 439, 477, 476, 475, 474, 886, 478, 486, 490, 657, 489, 488, 487, 887, 893, 491, 767, 299, 301, 300, 435, 662, 663, 461, 492, 815, 933, 816],
    'music':  [54, 878, 55, 118, 56, 710, 322, 962, 333, 965, 336, 337, 338, 963, 334, 961, 332, 323, 343, 342, 341, 340, 339, 324, 351, 350, 346, 345, 347, 349, 671, 672, 673, 344, 348, 674, 877, 325, 356, 355, 354, 353, 352, 712, 326, 359, 358, 357, 328, 364, 362, 363, 879, 824, 329, 369, 368, 367, 366, 365, 330, 398, 370, 371, 375, 374, 373, 372, 376, 377, 313, 680, 429, 681, 331, 380, 711, 379, 378, 876, 917, 327, 361, 360]
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

  function formUpdate(action) {
    switch(action) {
      case 'onmove':
        console.log('on move form update');
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
    formUpdate('onmove');
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