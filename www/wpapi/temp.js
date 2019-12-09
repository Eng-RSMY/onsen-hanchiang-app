loadCalendarContent() {
  var content = '';
  const apiRoot = 'https://hjuapp.site/wp-json';

  var wp = new WPAPI({ endpoint: apiRoot });

  wp.posts()
    .categories(6) //6 = calendars
    .orderby('slug')
    .order('asc')
    .then(function(posts) {
      content += '<ons-list>';
      posts.forEach(function(post) {
        n++;
        content += '<ons-list-item modifier="chevron" tappable';
        content += ' onclick="getCalendarContent(';
        content += n;
        content += ')">';
        content += '<ons-list-header>';
        content += post.title.rendered;
        content += '</ons-list-header>';
        content += '</ons-list-item>';
        calendarContents[n] = {
          title: post.title.rendered,
          content: post.content.rendered
        };
      });
      content += '</ons-list>';
      $('.ui-content').html(content);
      $('.progress-circular').css('display', 'none');

      makeEmDraggable();
    });
}

var calendarItem;
function getCalendarContent(n) {
  calendarItem = n;

  //ons.notification.toast('you clicked: ' + j, { timeout: 1000 });
  var objData = calendarContents[n];

  var content = document.getElementById('myNavigator');

  data = { data: { title: objData.title }, animation: 'slide' };
  content.pushPage('tempcalendar.html', data);
}


//--- old ---
function formatSchoolPostsContent(res) {
  var obj = JSON.parse(res);
  //console.log(obj.data[0].post_rec.category_name);
  var pic =
    'https://images.all-free-download.com/images/graphiclarge/an_apple_clip_art_12887.jpg';

  schoolPostContents += '<div class="school-posts">';
  for (var r = 0; r < obj.data.length; r++) {
    schoolPostContents +=
      '<br><b>' + obj.data[r].post_rec.category_name + '</b>' + '<br><br>';
    for (var s = 0; s < obj.data[r].post_rec.post_details.length; s++) {
      schoolPostContents +=
        obj.data[r].post_rec.post_details[s].post_description + '<br>';
      schoolPostContents +=
        '<a href="' +
        obj.data[r].post_rec.post_details[s].post_url +
        '" target="_blank">Visit W3Schools.com' +
        '</a><br>';
    }
  }
  schoolPostContents += '</div>';
}