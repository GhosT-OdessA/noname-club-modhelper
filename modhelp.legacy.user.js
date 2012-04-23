// ==UserScript==
// @name          NoNaMe-Club ModHelp
// @namespace     http://userscripts.org
// @description   Замена стандартного варианта (корень Темпа), при переносе, на выбранные форумы
// @author        Kaener
// @version       1.00
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

var done = false; 
var f = { 'Мусорник (temp)': 670, 'Авто (temp)': 302, 'Видео (temp)': 145, 'Аниме (temp)': 146, 'Музыка (temp)': 147, 'Игры (temp)': 148, 'Книги (temp)': 161, 'Разное (temp)': 171, 'Программы (temp)': 149, 'КПК и Мобильные устройства (temp)': 183, 'Юмор (temp)': 399 };

function setThemeName() {
	var themeId = document.URL.match(/t=\d+/)[0].substr(2);
	document.getElementsByName('subject')[0].value = 'Выделено из темы ' + themeId;
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

function modHelp() {
	if (onSplit()) {
		setThemeName();


		setDest( f['Мусорник (temp)'] ); //чаще всего выделяю сюда	


	} else if (onMove()) {


		setDest( f['Мусорник (temp)'] ); //а переношу сюда


	}
}

window.addEventListener('DOMContentLoaded', modHelp, false);