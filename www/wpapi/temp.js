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
