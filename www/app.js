window.fn = {};

window.fn.openMenu = function() {
  var menu = document.getElementById('menu');
  menu.open();
};

window.fn.load = function(page, mytitle) {
  var content = document.getElementById('myNavigator');
  var menu = document.getElementById('menu');
  data = { data: { title: mytitle }, animation: 'slide' };
  content.pushPage(page, data).then(menu.close.bind(menu));
};

document.addEventListener('init', function(event) {
  var page = event.target;
  //-- scroll to top of home page --
  if (page.id === 'home.html') {
    page.querySelector('ons-toolbar .center').innerHTML = 'Han Chiang App';
  } else if (page.id === '1-news.html') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
    page.querySelector('#news-content').innerHTML = 'waiting...';
    loadNewsContent(page);
    console.log('1-news triggered...yay');
  } else if (page.id === '2-timetable.html') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
  } else if (page.id === '3-classroom.html') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
  } else if (page.id === '4-calendars.html') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
  } else {
    //-- impt sets the page title --
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
  }
});

function loadNewsContent(page) {
  setInterval(function() {
    var content = '<ons-card onclick=';
    content += '"loadNewsContent()">';
    content += '<div class="title">1. News</div>';
    content += '<div class="content">';
    content += 'Events and happenings in Han Chiang University College';
    content += '</div>';
    content += '</ons-card>';
    $('#news-content').html(content);
    $('.progress-circular').css('display', 'none');
  }, 3000);
}

//--- NO ADMOB---
window.onload = function() {
  document.addEventListener('deviceready', initApp);
};

function initApp() {
  //--- Admob in ads.js ----
  //initAds();
}
