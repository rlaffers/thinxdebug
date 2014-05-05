/*jshint moz:true */
var config = {
    ideKey: 'php-xdebug',
    startLabel: 'Start',
    stopLabel: 'Stop'
};

const {Cc,Ci} = require("chrome");
var buttons = require('sdk/ui/button/action');
var notifications = require('sdk/notifications');
var tabutils = require('sdk/tabs/utils');
var tabs = require('sdk/tabs');


var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
var cookieSvc = Cc["@mozilla.org/cookieService;1"].getService(Ci.nsICookieService);
var cookieMgr = Cc["@mozilla.org/cookiemanager;1"].getService(Ci.nsICookieManager);

// create the session button
var btnSession = buttons.ActionButton({
  id: "xdebug-session-btn",
  label: config.startLabel + " debugging",
  icon: {
    "16": "./bug-bw.png"
  },
  onClick: toggleDebugging,
  disabled: true
});

// create the profiling button
var btnProfile = buttons.ActionButton({
  id: "xdebug-profile-btn",
  label: config.startLabel + " xdebug profiling",
  icon: {
    "16": "./profile-bw.png"
  },
  onClick: toggleProfiling,
  disabled: true
});

/**
 * onPageShow
 *
 * Activates the xdebug buttons
 */
tabs.on('pageshow', function onPageShow(tab) {
    btnSession.state('tab', {disabled: false});
    btnProfile.state('tab', {disabled: false});
});


/**
 * toggleDebugging 
 *
 * Toggles the start xdebug session button
 * 
 * @param {Object} state 
 * @return void
 */
function toggleDebugging(state) {
    if (state.label.match(new RegExp('^' + config.startLabel))) {
        btnSession.state('tab', {
            icon: './bug.png',
            label: config.stopLabel + ' debugging',
            disabled: false
        });
        startSession();
        console.log('Started xdebug session');
        notifications.notify({
            title: 'Firefox',
            text: 'Started xdebug session'
        });
    } else {
        btnSession.state('tab', {
            icon: './bug-bw.png',
            label: config.startLabel + ' debugging',
            disabled: false
        });
        stopSession();
        console.log('Stopped xdebug session');
        notifications.notify({
            title: 'Firefox',
            text: 'Stopped xdebug session'
        });
    }

}

/**
 * toggleProfiling 
 *
 * Toggles the xdebug profiling button
 * 
 * @param {Object} state 
 * @return void
 */
function toggleProfiling(state) {
    if (state.label.match(new RegExp('^' + config.startLabel))) {
        btnProfile.state('tab', {
            icon: './profile.png',
            label: config.stopLabel + ' profiling',
            disabled: false
        });
        startProfile();
        console.log('Started xdebug profiling');
        notifications.notify({
            title: 'Firefox',
            text: 'Started xdebug profiling'
        });
    } else {
        btnProfile.state('tab', {
            icon: './profile-bw.png',
            label: config.startLabel + ' profiling',
            disabled: false
        });
        stopProfile();
        console.log('Stopped xdebug profiling');
        notifications.notify({
            title: 'Firefox',
            text: 'Stopped xdebug profiling'
        });
    }
}



/**
 * createCookie 
 *
 * Writes a cookie
 * 
 * @param {string} name 
 * @param {string} value 
 * @param {int} days 
 * @return void
 */
function createCookie(name, value, days) {
    var expires, date;
    if (days) {
	    date = new Date();
	    date.setTime(date.getTime()+(days*24*60*60*1000));
	    expires = "; expires=" + date.toGMTString();
    } else {
	    expires = "";
    }

            console.log('creating ' + name + ' for ' + tabs.activeTab.url);

    var cookieUri = ios.newURI(tabs.activeTab.url, null, null);
    cookieSvc.setCookieString(cookieUri, null,  name + '=' + value + expires + '; path=/', null);
}

/**
 * eraseCookie 
 *
 * Removes a cookie
 * 
 * @param {string} name 
 * @return void
 */
function eraseCookie(name) {
    var currentUri = ios.newURI(tabs.activeTab.url, null, null);
    for (var e = cookieMgr.enumerator; e.hasMoreElements();) {
        var cookie = e.getNext().QueryInterface(Ci.nsICookie);
        if (cookie.name === name && cookie.host === currentUri.host) {
            console.log('deleting ' + cookie.name + ' for ' + cookie.host);
            cookieMgr.remove(cookie.host, cookie.name, cookie.path, false);
            break;
        }
    }
}

function startSession() {
    createCookie('XDEBUG_SESSION', config.ideKey);
}

function stopSession() {
    eraseCookie('XDEBUG_SESSION');
}

function startProfile() {
    createCookie('XDEBUG_PROFILE', 1);
}

function stopProfile() {
    eraseCookie('XDEBUG_PROFILE');
}

//function startTrace() {
    //createCookie('XDEBUG_TRACE', 1);
//}

//function stopTrace() {
    //eraseCookie('XDEBUG_TRACE');
//}
