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

//-- called from window.fn.load() --
document.addEventListener('init', function(event) {
  var page = event.target;

  if (page.id === 'home.html') {
    page.querySelector('ons-toolbar .center').innerHTML = 'Han Chiang App';
  } else if (page.id === '1-news.html') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
    loadNewsContent();
  } else if (page.id === '2-timetable.html') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
    loadTimetableContent();
  } else if (page.id === '3-classroom.html') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
  } else if (page.id === '4-calendars.html') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
  } else {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
  }

  if (page.id === 'tempnews.html') {
    var newContent = '';
    newContent +=
      newsTopImageCollection[newsItem] +
      newsTitleCollection[newsItem] +
      newsDateCollection[newsItem] +
      newsContentCollection[newsItem];
    $('#div-newscontent').html(newContent);
  }

  if (page.id === 'temptimetable.html') {
    var newContent = '';
    newContent += timeTableContents[timeTableItem].content;

    $('#div-timetablecontent').html(newContent);
    $('#menu').removeAttr('swipeable');
  } else {
    $('#menu').attr('swipeable');
  }
});

document.addEventListener('show', function(event) {
  var page = event.target;
  if (page.id === 'tempnews.html') {
    // $('a').css('display', 'inline-block');
    // $('img').css({
    //   width: '100%',
    //   height: 'auto'
    // });
  }
});

document.addEventListener('hide', function(event) {
  var page = event.target;
  if (page.id === 'temptimetable.html') {
    // $('img').width('100%');
  }
});

//--------- NEWS ------------
function loadNewsContent() {
  var newsContent = '';
  //const apiRoot = 'https://hjuapp.site/wp-json';
  const apiRoot = 'http://www.hanchiangnews.com/en/wp-json';
  //var imgUrl;
  var allPosts = [];

  var wp = new WPAPI({ endpoint: apiRoot });
  wp.posts()
    .perPage(30)
    .order('desc')
    .orderby('date')
    .then(function(posts) {
      posts.forEach(function(post) {
        allPosts.push(post);
      });

      getThumbnail2Text(allPosts);
    });
}

var newsListPage; // cache of the news page
var newsTopImageCollection = [];
var newsTitleCollection = [];
var newsDateCollection = [];
var newsContentCollection = [];

function getThumbnail2Text(allPosts) {
  var j = 0;
  const length = allPosts.length;

  var newsContent = '';
  allPosts.forEach(function(post) {
    $.ajax({
      url:
        'http://www.hanchiangnews.com/en/wp-json/wp/v2/media/' +
        post.featured_media,
      type: 'GET',
      success: function(res) {
        j++;
        newsContent += '<ons-list>';
        newsTopImageCollection[j] =
          '<img src= "' +
          res.media_details.sizes.medium_large.source_url +
          '">';
        newsTitleCollection[j] =
          '<ons-list-header>' + post.title.rendered + '</ons-list-header>';
        newsDateCollection[j] =
          '<h4 style="margin-left: 20px">' + extractDate(post) + '</h4>';

        newsContentCollection[j] =
          '<div class="news-content-rendered">' +
          post.content.rendered +
          '</div>';

        newsContent += '<ons-list-item tappable';
        newsContent += ' onclick="getNewsContent(';
        newsContent += j;
        newsContent += ')"';
        newsContent += '>';
        newsContent += '<div class="left">';
        newsContent += '<img src= "';
        newsContent += res.media_details.sizes.thumbnail.source_url;
        newsContent += '" class="list-item__thumbnail">';
        newsContent += '</div>';
        newsContent += '<div class="center">';
        newsContent +=
          '<span class ="list-item__title">' + post.title.rendered + '</span>';
        newsContent +=
          '<span class ="list-item__subtitle">' + extractDate(post) + '</span>';
        newsContent += '</div>';

        newsContent += '</ons-list-item>';
        newsContent += '</ons-list>';

        if (j == length) {
          $('.ui-content').html(newsContent);

          $('.progress-circular').css('display', 'none');
          newsListPage = newsContent;
        }
      }
    });
  });
}

function extractDate(post) {
  var today = new Date(post.date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return today;
}

var newsItem;
//-- called from embedded markup inserted in getThumbnail2Text() --
function getNewsContent(item) {
  newsItem = item;
  var content = document.getElementById('myNavigator');

  data = { data: { title: 'News' }, animation: 'slide' };
  content.pushPage('tempnews.html', data);
}

//--------- TIMETABLE ----------------
var timeTableContents = [];
var k = 0;

function loadTimetableContent() {
  var content = '';
  const apiRoot = 'https://hjuapp.site/wp-json';

  var wp = new WPAPI({ endpoint: apiRoot });

  wp.posts()
    .categories(8) // 7 = home 8 = timetables
    .orderby('slug')
    .order('asc')
    .then(function(posts) {
      content += '<ons-list>';
      posts.forEach(function(post) {
        k++;
        content += '<ons-list-item modifier="chevron" tappable';
        content += ' onclick="getTimeTableContent(';
        content += k;
        content += ')">';
        content += '<ons-list-header>';
        content += post.title.rendered;
        content += '</ons-list-header>';
        content += '</ons-list-item>';
        timeTableContents[k] = {
          title: post.title.rendered,
          content: post.content.rendered
        };
      });
      content += '</ons-list>';

      $('.ui-content').html(content);
      $('.progress-circular').css('display', 'none');
      console.log(timeTableContents);
      makeEmDraggable();
    });
}

var timetableItem;
function getTimeTableContent(t) {
  timeTableItem = t;

  //ons.notification.toast('you clicked: ' + j, { timeout: 1000 });
  var objData = timeTableContents[t];

  var content = document.getElementById('myNavigator');

  data = { data: { title: objData.title }, animation: 'slide' };
  content.pushPage('temptimetable.html', data);
}

//---- zoomIn image ------
function zoomIn() {
  var imagesize = $('img').width();
  imagesize = imagesize + 200;
  $('img').width(imagesize);
}

//---- zoomOut image ------
function zoomOut() {
  var imagesize = $('img').width();
  imagesize = imagesize - 200;
  $('img').width(imagesize);
}

function fitWidth() {
  //$('img').width($(document).width());
  $('img').width('100%');
  draggable.draggabilly('setPosition', 0, 0);
}

var draggable;
function makeEmDraggable() {
  draggable = $('img').draggabilly({
    // options...
  });
}
