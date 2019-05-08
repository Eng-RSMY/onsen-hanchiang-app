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
    console.log('1-news triggered...yay');
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
    $('img').css('width', '100%'); //  todo
  }
});

function loadNewsContent(page) {
  var newsContent = '';
  //const apiRoot = 'https://hjuapp.site/wp-json';
  const apiRoot = 'http://www.hanchiangnews.com/en/wp-json';
  var imgUrl;
  var allPosts = [];

  var wp = new WPAPI({ endpoint: apiRoot });
  wp.posts()
    .param('_embed')
    .perPage(6)
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

  var newsContent = '<ons-list>';
  allPosts.forEach(function(post) {
    $.ajax({
      url:
        'http://www.hanchiangnews.com/en/wp-json/wp/v2/media/' +
        post.featured_media,
      type: 'GET',
      success: function(res) {
        j++;

        newsTopImageCollection[j] =
          '<img src= "' +
          res.media_details.sizes.medium_large.source_url +
          '">';
        newsTitleCollection[j] =
          '<ons-list-header>' + post.title.rendered + '</ons-list-header>';
        newsDateCollection[j] = '<h4>' + extractDate(post) + '</h4>';
        newsContentCollection[j] = post.content.rendered;

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
        // newsContent += '</a>';
        newsContent += '</ons-list-item>';

        if (j == length) {
          newsContent += '</ons-list>';
          $('.ui-content').html(newsContent);

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
