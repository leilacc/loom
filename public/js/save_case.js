var save_case = function(case_id, folder_name) {
  console.log('saving');
  $('#thumbtack' + case_id).attr('class', 'thumbtack-saved');
  $('#result' + case_id).append('<span class="pin-name">' + folder_name + '</span>');
};
