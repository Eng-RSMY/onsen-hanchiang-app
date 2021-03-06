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
    loadClassrmBkContent();
  } else if (page.id === '4-calendars.html') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
    loadCalendarContent();
  } else if (page.id === '5-enrolled.html') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
    // loadEnrolledCoursesform();
  } else if (page.id === 'tempclassroom.html') {
    page.querySelector(
      'ons-toolbar .center'
    ).innerHTML = page.data.title.substr(19);
  } else if (page.id === 'tempcalendar.html') {
    page.querySelector(
      'ons-toolbar .center'
    ).innerHTML = page.data.title.substr(9);
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
    $('#div-timetablecontent img').css('width', '200%');
  }

  if (page.id === 'tempclassroom.html') {
    var newContent = '';
    newContent += classroomContents[classroomItem].content;

    $('#div-classroomcontent').html(newContent);
    $('#div-classroomcontent img').css('width', '500%');
  }

  if (page.id === 'tempcalendar.html') {
    var newContent = '';
    newContent += calendarContents[calendarItem].content;

    $('#div-calendarcontent').html(newContent);
    $('#div-calendarcontent img').css('width', '200%');
  }

  if (page.id === 'tempschool.html') {
    var newContent = '';
    newContent += schoolContents[schoolItem].content;

    //$('#div-schoolcontent').html(newContent);
    $('#div-schoolcontent').html('Click button to download and view pdf file:');
  }

  if (page.id === 'tempcoursecontent.html') {
    $('#div-coursecontent').html(courseContents);
  }

  if (page.id === 'tempregistersubjects.html') {
    $('#div-registersubject').html(regSubContents);
    document.getElementById('totalunits').innerHTML =
      'Total Units Selected: ' + page.data.tUnits;
  }
  if (page.id === 'tempschoolposts.html') {
    $('#div-schoolposts').html(schoolPostContents);
  }
  if (page.id === 'tempregistryposts.html') {
    $('#div-registryposts').html(registryPostContents);
  }
  if (page.id === 'tempserviceposts.html') {
    $('#div-serviceposts').html(servicePostContents);
  }
  if (page.id === 'tempfinanceposts.html') {
    $('#div-financeposts').html(financePostContents);
  }
  if (
    page.id === '7-schoolposts.html' ||
    page.id === '8-registryposts.html' ||
    page.id === '9-serviceposts.html' ||
    page.id === '10-financeposts.html'
  ) {
    document.getElementById('username').value = userName;
    document.getElementById('password').value = password;
  }
});

//--------- NEWS ------------
function loadNewsContent() {
  var newsContent = '';
  const apiRoot = 'https://hjuapp.site/wp-json';
  //const apiRoot = 'http://www.hanchiangnews.com/en/wp-json';
  //var imgUrl;
  var allPosts = [];

  var wp = new WPAPI({ endpoint: apiRoot });
  wp.posts()
    .categories(5) // 5 = news, 6 = calendar, 8 = timetables, 9 = classroom booking
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
      url: 'https://hjuapp.site/wp-json/wp/v2/media/' + post.featured_media,
      type: 'GET',
      success: function(res) {
        j++;
        newsContent += '<ons-list>';
        newsTopImageCollection[j] =
          '<img src= "' + res.media_details.sizes.medium.source_url + '">';
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
    }); // --ajax end
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
    .categories(8) // 5 = news, 6 = calendar, 8 = timetables, 9 = classroom booking
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

//-------- CLASSROOM ---------
var classroomContents = [];
var r = 0;

function loadClassrmBkContent() {
  var content = '';
  const apiRoot = 'https://hjuapp.site/wp-json';

  var wp = new WPAPI({ endpoint: apiRoot });

  wp.posts()
    .categories(9) // 6 = calendar, 8 = timetables, 9 = classroom booking
    .orderby('slug')
    .order('asc')
    .then(function(posts) {
      content += '<ons-list>';
      posts.forEach(function(post) {
        r++;
        content += '<ons-list-item modifier="chevron" tappable';
        content += ' onclick="getClassroomContent(';
        content += r;
        content += ')">';
        content += '<ons-list-header>';
        content += post.title.rendered;
        content += '</ons-list-header>';
        content += '</ons-list-item>';
        classroomContents[r] = {
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

var classroomItem;
function getClassroomContent(p) {
  classroomItem = p;

  //ons.notification.toast('you clicked: ' + j, { timeout: 1000 });
  var objData = classroomContents[p];

  var content = document.getElementById('myNavigator');

  data = { data: { title: objData.title }, animation: 'slide' };
  content.pushPage('tempclassroom.html', data);
}

//-------- CALENDAR ---------
var calendarContents = [];
var n = 0;

function loadCalendarContent() {
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

//---- zoomIn image ------
function zoomIn() {
  var imagesize = $('.enlargeable img').width();
  imagesize = imagesize + 200;
  $('.enlargeable img').width(imagesize);
}

//---- zoomOut image ------
function zoomOut() {
  var imagesize = $('.enlargeable img').width();
  imagesize = imagesize - 200;
  $('.enlargeable img').width(imagesize);
}

function fitWidth() {
  //$('img').width($(document).width());
  $('.enlargeable img').width('100%');
  draggable.draggabilly('setPosition', 0, 0);
}

var draggable;
function makeEmDraggable() {
  draggable = $('.enlargeable img').draggabilly({
    // options...
  });
}

//--- default zoom -----
function zoomDefault(zoomLevel) {
  var imagesize = $('.enlargeable img').width();
  imagesize = imagesize + zoomLevel;
  $('.enlargeable img').width(imagesize);
}

//-------- CHECK ENROLLED COURSES --------

function getEnrolledCourses() {
  $('.progress-circular').css('visibility', 'visible');
  var studentName = document.getElementById('studentname').value;

  $.ajax({
    url:
      'http://www.hanchianguniversitycollege.com/system/hcuc-api/student_course_stud_name.php?app_id=hanchiangapp2019&name=' +
      studentName,

    type: 'GET',
    success: function(res) {
      formatCourseContents(res);
    }
  }).fail(function(xhr, status, error) {
    // console.log('---error: ', error.message);
    // console.log('---status: ', status);
    // console.log('---xhr.status: ', xhr.status);

    // ons.notification.toast('Error ' + xhr.status, {
    //   timeout: 2000
    // });
    $('.progress-circular').css('visibility', 'hidden');
    ons.notification.toast('Student not found ', {
      timeout: 2000
    });
  });
}

var courseContents;
function formatCourseContents(res) {
  courseContents = '';
  console.log(res);
  var obj = JSON.parse(res);
  console.log('---res.message---:', obj.message);
  var subOfferArray = obj.data.subject_rec.subject_details;
  courseContents += '<p>';
  courseContents += '<br><strong>Session:</strong></br>';
  courseContents += '<br>' + obj.data.subject_rec.session_name + '</br>';
  // courseContents += '<br><strong>Start Date:</strong></br>';
  courseContents += '<br>' + obj.data.subject_rec.start_date + ' to ';
  //courseContents += '<br><strong>End Date:</strong></br>';
  courseContents += obj.data.subject_rec.end_date + '</br>';
  courseContents += '<br><strong>Subject Details:</strong></br>';
  subOfferArray.forEach(function(subj) {
    courseContents += '<br><em>' + subj.subject_code + '</em></br>';
    courseContents += '<br>' + subj.subject_name + '</br>';
  });
  courseContents += '</p>';
  showCourseContent();
}

function showCourseContent() {
  var content = document.getElementById('myNavigator');

  data = { data: { title: 'Enrolled courses' }, animation: 'slide' };
  content.pushPage('tempcoursecontent.html', data);
  $('.progress-circular').css('visibility', 'hidden');
}

function clearNameInput() {
  document.getElementById('studentname').value = '';
}

//-------6 register subjects-------
var userID;
function userLogin() {
  userID = '';
  $('.progress-circular').css('visibility', 'visible');
  var userName = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  $.ajax({
    url:
      'http://www.hanchianguniversitycollege.com/system/hcuc-api/login.php?app_id=hanchiangapp2019&username=' +
      userName +
      '&password=' +
      password,

    type: 'GET',
    success: function(res) {
      getOfferedSubjects(res);
      $('.progress-circular').css('visibility', 'hidden');
    }
  }).fail(function(xhr, status, error) {
    $('.progress-circular').css('visibility', 'hidden');
    ons.notification.toast('Error Login: ' + error, {
      timeout: 2000
    });
  });
}

function getOfferedSubjects(res) {
  var obj = JSON.parse(res);
  userID = obj.data.user_id;

  $.ajax({
    url:
      //simulation, obj.data.user_id is ignored, connecting to xampp
      //fake student_subject-reg.php which returns simulated json
      //for production substitute 'localhost/hanchiang' with
      //www.hanchianguniversitycollege.com/system/hcuc-api
      // 'http://localhost/hanchiang/student_subject_reg.php?' +
      // 'app_id=hanchiangapp2019&user_id=' +
      // obj.data.user_id,

      'http://www.hanchianguniversitycollege.com/system/hcuc-api/student_subject_reg.php?' +
      'app_id=hanchiangapp2019&user_id=' +
      userID,

    type: 'GET',
    success: function(res2) {
      var objRes = JSON.parse(res2);
      formatOfferedSubjectContents(res2);
      $('.progress-circular').css('visibility', 'hidden');
    }
  }).fail(function(xhr, status, error) {
    $('.progress-circular').css('visibility', 'hidden');
    ons.notification.toast('Error getting offerred subjects', {
      timeout: 2000
    });
  });
}

function getOfferedSubjectsDebug(res) {
  var obj = JSON.parse(res);
  userID = obj.data.user_id;

  $.ajax({
    url:
      //simulation, obj.data.user_id is ignored, connecting to xampp
      //fake student_subject-reg.php which returns simulated json
      //for production substitute 'localhost/hanchiang' with
      //www.hanchianguniversitycollege.com/system/hcuc-api
      // 'http://localhost/hanchiang/student_subject_reg.php?' +
      // 'app_id=hanchiangapp2019&user_id=' +
      // obj.data.user_id,

      'http://www.hanchianguniversitycollege.com/system/hcuc-api/student_subject_reg.php?' +
      'app_id=hanchiangapp2019&user_id=' +
      userID,

    type: 'GET',
    success: function(res2) {
      var objRes = JSON.parse(res2);
      console.log(res2);
      $('.progress-circular').css('visibility', 'hidden');
    }
  }).fail(function(xhr, status, error) {
    $('.progress-circular').css('visibility', 'hidden');
    ons.notification.toast('Error getting offerred subjects', {
      timeout: 2000
    });
  });
}

var regSubContents;
var subOfferArray;
var subOfferArray_test;
var stuOfferObj = {}; //stores student details + subjects offerred
function formatOfferedSubjectContents(res) {
  stuOfferObj = {};
  stuOfferObj = JSON.parse(res);

  subOfferArray = [];
  subOfferArray = stuOfferObj.data[0].subject_rec;
  subOfferArray_test = stuOfferObj.data[0].subject_rec.subject_details;

  //console.log(subOfferArray_test);

  regSubContents = '';
  regSubContents = '<div class="subject-list">';
  regSubContents += '<p>';
  regSubContents += '<br>User ID: <em>' + userID + '</em>';
  regSubContents +=
    '<br>Student ID: <strong>' + subOfferArray.student_id + '</strong>';
  regSubContents +=
    '<br>Name: <strong>' + subOfferArray.student_name + '</strong>';
  regSubContents +=
    '<br>Program Name: <strong>' + subOfferArray.programme_name + '</strong>';
  regSubContents +=
    '<br>Session: <strong>' + subOfferArray.session_name + '</strong>';
  regSubContents +=
    '<br>Start Date: <strong>' + subOfferArray.start_date + '</strong>';
  regSubContents +=
    '<br>End Date: <strong>' + subOfferArray.end_date + '</strong>';
  regSubContents +=
    '<br>Session ID: <strong>' + subOfferArray.session_id + '</strong>';
  regSubContents += '<p id="totalunits">';
  regSubContents += 'Total Units Selected: <strong>' + totalUnits + '</strong>';
  regSubContents += '</p>';

  if (subOfferArray_test.length != 0) {
    regSubContents +=
      '<p><strong>Select your subjects, then click Register: </strong></p>';
  } else {
    regSubContents +=
      '<p><strong>Currently No Subjecs to Register </strong></p>';
  }
  regSubContents += '<ons-list>';
  for (var i = 0; i < subOfferArray_test.length; i++) {
    var strIndex = i.toString();
    regSubContents += '<ons-list-item tappable>';
    regSubContents += ' <label class="left">';
    if (subOfferArray_test[i].selected === 'checked') {
      regSubContents +=
        '<ons-checkbox onclick="recalcTotalUnits(this)" checked';
      regSubContents += ' id="' + strIndex + '"';
      regSubContents += '></ons-checkbox>';
    } else {
      regSubContents += '<ons-checkbox onclick="recalcTotalUnits(this)"';
      regSubContents += ' id="' + strIndex + '"';
      regSubContents += '></ons-checkbox>';
    }

    regSubContents += '</label>';
    regSubContents += '<label class="center">';
    regSubContents +=
      '<em>' + subOfferArray_test[i].student_code + '</em>&nbsp;';
    regSubContents += subOfferArray_test[i].subject_name;
    regSubContents += ' (' + subOfferArray_test[i].unit + ' units)';
    regSubContents += '</label>';
    regSubContents += '</ons-list-item>';
  }

  regSubContents += '</ons-list>';
  if (subOfferArray_test.length != 0) {
    regSubContents +=
      '<p style="text-align: center" onclick="registerSubjects()"><ons-button>Register</ons-button></p>';
  }

  regSubContents += '</p>';
  regSubContents += '</div>';
  showOfferedSubjectsContent();
}

function showOfferedSubjectsContent() {
  var content = document.getElementById('myNavigator');
  calcTotalUnits();
  data = {
    data: { title: 'Register subjects', tUnits: totalUnits },
    animation: 'slide'
  };
  content.pushPage('tempregistersubjects.html', data);
  $('.progress-circular').css('visibility', 'hidden');
}

function clearLoginInput() {
  userID = '';
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}

var totalUnits = 0;
function calcTotalUnits() {
  totalUnits = 0;
  subOfferArray_test.forEach(function(subj) {
    if (subj.selected === 'checked') {
      totalUnits += Number(subj.unit);
    }
  });
}

function recalcTotalUnits(cb) {
  totalUnits = 0;
  var cbid = Number(cb.id);
  if (cb.checked === true) {
    subOfferArray_test[cbid].selected = 'checked';
  } else if (cb.checked === false) {
    subOfferArray_test[cbid].selected = '';
  }
  calcTotalUnits();
  document.getElementById('totalunits').innerHTML =
    'Total Units Selected: ' + totalUnits;
}

function registerSubjects() {
  var soid = ''; //subject offering id = '7236,7312,7315,7321,7427';

  for (var j = 0; j < subOfferArray_test.length; j++) {
    if (subOfferArray_test[j].selected === 'checked') {
      soid += subOfferArray_test[j].subject_offering_id;
      if (j < subOfferArray_test.length - 1) {
        soid += ',';
      }
    }
  }

  soid = soid.replace(/,\s*$/, '');
  console.log(soid);

  //subOfferArray = [];
  //subOfferArray = stuOfferObj.data[0].subject_rec;

  var regUrl =
    'http://www.hanchianguniversitycollege.com/system/hcuc-api/update_stud_subject_reg.php?app_id=hanchiangapp2019' +
    '&user_id=' +
    userID +
    '&session_no=' +
    subOfferArray.session_id +
    '&unit=' +
    totalUnits +
    '&subject_offering_id=' +
    soid;

  console.log('...regUrl: ' + regUrl);
  $.ajax({
    url: regUrl,
    type: 'GET',
    success: function(res) {
      var obj = JSON.parse(res);
      //console.log('..obj.message: ' + obj.message);
      ons.notification.toast('Successfully registered subjects', {
        timeout: 2000
      });
      $('.progress-circular').css('visibility', 'hidden');
    }
  }).fail(function(xhr, status, error) {
    $('.progress-circular').css('visibility', 'hidden');
    ons.notification.toast('Error: ' + error, {
      timeout: 2000
    });
  });
}

var userName = '';
var password = '';
//-------7 School Posts -------
function userLoginSchoolPosts() {
  schoolUserID = '';
  $('.progress-circular').css('visibility', 'visible');
  userName = document.getElementById('username').value;
  password = document.getElementById('password').value;

  //--debug--
  //userName = 'h1811416006@hcu.edu.my';
  //password = '980121075452';

  $.ajax({
    url:
      'http://www.hanchianguniversitycollege.com/system/hcuc-api/login.php?app_id=hanchiangapp2019&username=' +
      userName +
      '&password=' +
      password,

    type: 'GET',
    success: function(res) {
      var obj = JSON.parse(res);
      schoolUserID = obj.data.user_id;
      loadSchoolPostsContent(schoolUserID);
      $('.progress-circular').css('visibility', 'hidden');
    }
  }).fail(function(xhr, status, error) {
    $('.progress-circular').css('visibility', 'hidden');
    ons.notification.toast('Error Login: ' + error, {
      timeout: 2000
    });
  });
}

function loadSchoolPostsContent(schoolUserID) {
  var regUrl =
    'http://www.hanchianguniversitycollege.com/system/hcuc-api/student_admin_post.php?app_id=hanchiangapp2019&user_id=' +
    schoolUserID;
  //kung sin yee: userID 918
  $.ajax({
    url: regUrl,
    type: 'GET',
    success: function(res) {
      formatSchoolPostsContent(res);
      var content = document.getElementById('myNavigator');
      data = {
        data: { title: 'School Posts' },
        animation: 'slide'
      };
      content.pushPage('tempschoolposts.html', data);
      $('.progress-circular').css('display', 'none');
    }
  }).fail(function(xhr, status, error) {
    $('.progress-circular').css('visibility', 'hidden');
    ons.notification.toast('Error: ' + error, {
      timeout: 2000
    });
  });
}

var schoolContents = [];
var schoolPostContents = '';
function formatSchoolPostsContent(res) {
  n = 0;
  var obj = JSON.parse(res);
  //console.log(obj.data[0].post_rec.category_name);

  schoolPostContents += '<div class="school-posts">';
  for (var r = 0; r < obj.data.length; r++) {
    schoolPostContents +=
      '<br><b>' + obj.data[r].post_rec.category_name + '</b>' + '<br><br>';
    for (var s = 0; s < obj.data[r].post_rec.post_details.length; s++) {
      n++;
      schoolPostContents += '<ons-list-item modifier="chevron" tappable';
      schoolPostContents += ' onclick="getSchoolContent(';
      schoolPostContents += n;
      schoolPostContents += ')">';
      schoolPostContents += '<ons-list-header>';
      schoolPostContents +=
        obj.data[r].post_rec.post_details[s].post_description;
      schoolPostContents += '</ons-list-header>';
      schoolPostContents += '</ons-list-item>';
      schoolContents[n] = {
        title: obj.data[r].post_rec.post_details[s].post_description,
        content: obj.data[r].post_rec.post_details[s].post_url
      };
    }
  }
  schoolPostContents += '</div>';
}

var schoolItem;
var currentUrl = '';
function getSchoolContent(n) {
  schoolItem = n;
  currentUrl = schoolContents[n].content;

  var objData = schoolContents[n];

  var content = document.getElementById('myNavigator');

  data = { data: { title: objData.title }, animation: 'slide' };
  content.pushPage('tempschool.html', data);
}

function loadPdf() {
  var url = '';
  handleDocumentWithURL(
    function() {
      ons.notification.toast('pdf load ok', { timeout: 2000 });
    },
    function(error) {
      console.log('failure');
      ons.notification.toast('pdf failed: ' + error, { timeout: 2000 });
    },
    currentUrl
  );
}

//-------8 Registry Posts -------
function userLoginRegistryPosts() {
  schoolUserID = '';
  $('.progress-circular').css('visibility', 'visible');
  userName = document.getElementById('username').value;
  password = document.getElementById('password').value;

  //--debug--
  //userName = 'h1811416006@hcu.edu.my';
  //password = '980121075452';

  $.ajax({
    url:
      'http://www.hanchianguniversitycollege.com/system/hcuc-api/login.php?app_id=hanchiangapp2019&username=' +
      userName +
      '&password=' +
      password,

    type: 'GET',
    success: function(res) {
      var obj = JSON.parse(res);
      schoolUserID = obj.data.user_id;
      loadRegistryPostsContent(schoolUserID);
      $('.progress-circular').css('visibility', 'hidden');
    }
  }).fail(function(xhr, status, error) {
    $('.progress-circular').css('visibility', 'hidden');
    ons.notification.toast('Error Login: ' + error, {
      timeout: 2000
    });
  });
}

function loadRegistryPostsContent(schoolUserID) {
  var regUrl =
    'http://www.hanchianguniversitycollege.com/system/hcuc-api/student_registry_post.php?app_id=hanchiangapp2019&&user_id=' +
    schoolUserID;
  //kung sin yee: userID 918
  $.ajax({
    url: regUrl,
    type: 'GET',
    success: function(res) {
      formatRegistryPostsContent(res);
      var content = document.getElementById('myNavigator');
      data = {
        data: { title: 'Registry Posts' },
        animation: 'slide'
      };
      content.pushPage('tempregistryposts.html', data);
      $('.progress-circular').css('display', 'none');
    }
  }).fail(function(xhr, status, error) {
    $('.progress-circular').css('visibility', 'hidden');
    ons.notification.toast('Error: ' + error, {
      timeout: 2000
    });
  });
}

var registryContents = [];
var registryPostContents = '';
function formatRegistryPostsContent(res) {
  n = 0;
  var obj = JSON.parse(res);

  registryPostContents += '<div class="registry-posts">';
  for (var r = 0; r < obj.data.length; r++) {
    registryPostContents +=
      '<br><b>' + obj.data[r].post_rec.category_name + '</b>' + '<br><br>';
    for (var s = 0; s < obj.data[r].post_rec.post_details.length; s++) {
      n++;
      registryPostContents += '<ons-list-item modifier="chevron" tappable';
      registryPostContents += ' onclick="getRegistryContent(';
      registryPostContents += n;
      registryPostContents += ')">';
      registryPostContents += '<ons-list-header>';
      registryPostContents +=
        obj.data[r].post_rec.post_details[s].post_description;
      registryPostContents += '</ons-list-header>';
      registryPostContents += '</ons-list-item>';
      registryContents[n] = {
        title: obj.data[r].post_rec.post_details[s].post_description,
        content: obj.data[r].post_rec.post_details[s].post_url
      };
    }
  }
  registryPostContents += '</div>';
}

function getRegistryContent(n) {
  schoolItem = n;
  currentUrl = registryContents[n].content;

  var objData = registryContents[n];

  var content = document.getElementById('myNavigator');

  data = { data: { title: objData.title }, animation: 'slide' };
  content.pushPage('tempregistry.html', data);
}

//-------9 Service Post -------
function userLoginServicePosts() {
  schoolUserID = '';
  $('.progress-circular').css('visibility', 'visible');
  userName = document.getElementById('username').value;
  password = document.getElementById('password').value;

  //--debug--
  //userName = 'h1811416006@hcu.edu.my';
  //password = '980121075452';

  $.ajax({
    url:
      'http://www.hanchianguniversitycollege.com/system/hcuc-api/login.php?app_id=hanchiangapp2019&username=' +
      userName +
      '&password=' +
      password,

    type: 'GET',
    success: function(res) {
      var obj = JSON.parse(res);
      schoolUserID = obj.data.user_id;
      loadServicePostsContent(schoolUserID);
      $('.progress-circular').css('visibility', 'hidden');
    }
  }).fail(function(xhr, status, error) {
    $('.progress-circular').css('visibility', 'hidden');
    ons.notification.toast('Error Login: ' + error, {
      timeout: 2000
    });
  });
}

function loadServicePostsContent(schoolUserID) {
  var regUrl =
    'http://www.hanchianguniversitycollege.com/system/hcuc-api/student_service_post.php?app_id=hanchiangapp2019&user_id=' +
    schoolUserID;
  //kung sin yee: userID 918
  $.ajax({
    url: regUrl,
    type: 'GET',
    success: function(res) {
      formatServicePostsContent(res);
      var content = document.getElementById('myNavigator');
      data = {
        data: { title: 'Student Service Posts' },
        animation: 'slide'
      };
      content.pushPage('tempserviceposts.html', data);
      $('.progress-circular').css('display', 'none');
    }
  }).fail(function(xhr, status, error) {
    $('.progress-circular').css('visibility', 'hidden');
    ons.notification.toast('Error: ' + error, {
      timeout: 2000
    });
  });
}

var serviceContents = [];
var servicePostContents = '';
function formatServicePostsContent(res) {
  n = 0;
  var obj = JSON.parse(res);
  //console.log(obj.data[0].post_rec.category_name);

  servicePostContents += '<div class="service-posts">';
  for (var r = 0; r < obj.data.length; r++) {
    servicePostContents +=
      '<br><b>' + obj.data[r].post_rec.category_name + '</b>' + '<br><br>';
    for (var s = 0; s < obj.data[r].post_rec.post_details.length; s++) {
      n++;
      servicePostContents += '<ons-list-item modifier="chevron" tappable';
      servicePostContents += ' onclick="getServiceContent(';
      servicePostContents += n;
      servicePostContents += ')">';
      servicePostContents += '<ons-list-header>';
      servicePostContents +=
        obj.data[r].post_rec.post_details[s].post_description;
      servicePostContents += '</ons-list-header>';
      schoolPostContents += '</ons-list-item>';
      serviceContents[n] = {
        title: obj.data[r].post_rec.post_details[s].post_description,
        content: obj.data[r].post_rec.post_details[s].post_url
      };
    }
  }
  servicePostContents += '</div>';
}

var schoolItem;
var currentUrl = '';
function getServiceContent(n) {
  schoolItem = n;
  currentUrl = serviceContents[n].content;

  var objData = serviceContents[n];

  var content = document.getElementById('myNavigator');

  data = { data: { title: objData.title }, animation: 'slide' };
  content.pushPage('tempservice.html', data);
}

//-------10 Finance Post -------
function userLoginFinancePosts() {
  schoolUserID = '';
  $('.progress-circular').css('visibility', 'visible');
  userName = document.getElementById('username').value;
  password = document.getElementById('password').value;

  //--debug--
  //userName = 'h1811416006@hcu.edu.my';
  //password = '980121075452';

  $.ajax({
    url:
      'http://www.hanchianguniversitycollege.com/system/hcuc-api/login.php?app_id=hanchiangapp2019&username=' +
      userName +
      '&password=' +
      password,

    type: 'GET',
    success: function(res) {
      var obj = JSON.parse(res);
      schoolUserID = obj.data.user_id;
      loadFinancePostsContent(schoolUserID);
      $('.progress-circular').css('visibility', 'hidden');
    }
  }).fail(function(xhr, status, error) {
    $('.progress-circular').css('visibility', 'hidden');
    ons.notification.toast('Error Login: ' + error, {
      timeout: 2000
    });
  });
}

function loadFinancePostsContent(schoolUserID) {
  var regUrl =
    'http://www.hanchianguniversitycollege.com/system/hcuc-api/student_finance_post.php?app_id=hanchiangapp2019&user_id=' +
    schoolUserID;
  //kung sin yee: userID 918
  $.ajax({
    url: regUrl,
    type: 'GET',
    success: function(res) {
      formatFinancePostsContent(res);
      var content = document.getElementById('myNavigator');
      data = {
        data: { title: 'Finance Posts' },
        animation: 'slide'
      };
      content.pushPage('tempfinanceposts.html', data);
      $('.progress-circular').css('display', 'none');
    }
  }).fail(function(xhr, status, error) {
    $('.progress-circular').css('visibility', 'hidden');
    ons.notification.toast('Error: ' + error, {
      timeout: 2000
    });
  });
}

var financeContents = [];
var financePostContents = '';
function formatFinancePostsContent(res) {
  n = 0;
  var obj = JSON.parse(res);
  //console.log(obj.data[0].post_rec.category_name);

  financePostContents += '<div class="finance-posts">';
  for (var r = 0; r < obj.data.length; r++) {
    financePostContents +=
      '<br><b>' + obj.data[r].post_rec.category_name + '</b>' + '<br><br>';
    for (var s = 0; s < obj.data[r].post_rec.post_details.length; s++) {
      n++;
      financePostContents += '<ons-list-item modifier="chevron" tappable';
      financePostContents += ' onclick="getFinanceContent(';
      financePostContents += n;
      financePostContents += ')">';
      financePostContents += '<ons-list-header>';
      financePostContents +=
        obj.data[r].post_rec.post_details[s].post_description;
      financePostContents += '</ons-list-header>';
      financePostContents += '</ons-list-item>';
      financeContents[n] = {
        title: obj.data[r].post_rec.post_details[s].post_description,
        content: obj.data[r].post_rec.post_details[s].post_url
      };
    }
  }
  servicePostContents += '</div>';
}

var schoolItem;
var currentUrl = '';
function getFinanceContent(n) {
  schoolItem = n;
  currentUrl = serviceContents[n].content;

  var objData = serviceContents[n];

  var content = document.getElementById('myNavigator');

  data = { data: { title: objData.title }, animation: 'slide' };
  content.pushPage('tempfinance.html', data);
}
