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

  if (page.id === 'home.html') {
    page.querySelector('ons-toolbar .center').innerHTML = 'Han Chiang App';
  } else if (page.id === '1-news.html') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;

    loadNewsContent(page);
  } else if (page.id === '2-timetable.html') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
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
});

function loadNewsContent(page) {
  var newsContent = '';
  //const apiRoot = 'https://hjuapp.site/wp-json';
  const apiRoot = 'http://www.hanchiangnews.com/en/wp-json';
  //var imgUrl;
  var allPosts = [];

  var wp = new WPAPI({ endpoint: apiRoot });
  wp.posts()
    .perPage(5)
    .order('desc')
    .orderby('date')
    .then(function(posts) {
      posts.forEach(function(post) {
        allPosts.push(post);
      });
      //console.log(allPosts);
      getThumbnail2Text(allPosts);
    });
}

var newsListPage; // cache of the news page
var newsTopImageCollection = [];
var newsTitleCollection = [];
var newsDateCollection = [];
var newsContentCollection = [];

function getThumbnail2Text(allPosts) {
  for (var j = 0; j < allPosts.length; j++) {
    $.ajax({
      url:
        'http://www.hanchiangnews.com/en/wp-json/wp/v2/media/' +
        allPosts[j].featured_media,
      type: 'GET',
      success: function(res) {
        console.log('...ok...' + j);
        var newsContent = '<ons-list>';
        newsTopImageCollection[j] =
          '<img src= "' +
          res.media_details.sizes.medium_large.source_url +
          '">';
        newsTitleCollection[j] =
          '<ons-list-header>' +
          allPosts[j].title.rendered +
          '</ons-list-header>';
        newsDateCollection[j] = '<h4>' + extractDate(allPosts[j]) + '</h4>';

        newsContentCollection[j] =
          '<div class="news-content-rendered">' +
          allPosts[j].content.rendered +
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
          '<span class ="list-item__title">' +
          allPosts[j].title.rendered +
          '</span>';
        newsContent +=
          '<span class ="list-item__subtitle">' +
          extractDate(allPosts[j]) +
          '</span>';
        newsContent += '</div>';

        newsContent += '</ons-list-item>';
        newsContent += '</ons-list>';
        allPosts[j] = newsContent;
        console.log(j);
        if (j == length) {
          $('.ui-content').html(getNewsContentMarkup(allPosts));
          // console.log(newsContent);
          $('.progress-circular').css('display', 'none');
          newsListPage = newsContent;
        }
      }
    });
  }
}

function getNewsContentMarkup(allPosts) {
  var newsMarkup = '';
  for (var j = 0; j < allPosts.length; j++) {
    newsMarkup += allPosts[j];
  }
  return newsMarkup;
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
  // $('.ui-content').html(
  //   newsTopImageCollection[item] +
  //     newsTitleCollection[item] +
  //     newsDateCollection[item] +
  //     newsContentCollection[item]
  // );
  newsItem = item;
  var content = document.getElementById('myNavigator');
  var menu = document.getElementById('menu');
  data = { data: { title: 'News' }, animation: 'slide' };
  content.pushPage('tempnews.html', data);
}
