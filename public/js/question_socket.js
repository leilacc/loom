var socket = io('104.131.251.143:3000'),
  results = $('#results'),
  input = $("#question"),
  search_btn = $("#search_btn");

socket.on("new answers", function (qa) {
  var question = qa['question'];
  var answers = qa['answers'];

  pushNewQuestion(question, answers);
  show_answers(question, answers);

  spin_div.hide();
});

socket.on("error", function(error) {
    console.log("AN ERROR OCCURRED: " + error);
});

var show_answers = function(question, answers) {
  if (typeof answers === 'undefined') {
    search();
    return;
  }

  var question_obj = str_to_obj_of_words(question);
  for(var i = 0; i < answers.length; i++) {
    results.append(gen_result(answers[i].evidence.title,
                              highlighted_answer(answers[i].text,
                                                 question_obj)));
  }
};

var str_to_obj_of_words = function(str) {
  obj = {};
  words = str.split(" ");
  for (var i = 0; i < words.length; i++) {
    obj[words[i].toLowerCase()] = 1;
  }
  return obj;
};

var search = function() {
  var question = input[0].value;
  if (question.length == 0) {
      return;
  }

  socket.emit("ask question", question);

  spin_div.show();
  input.blur();
  results.empty();
  return false;
};

var highlighted_answer = function(orig_answer, question) {
  var words = orig_answer.split(" "),
      new_answer = [];

  for (var i = 0; i < words.length; i++) {
    var word = words[i].toLowerCase();
    if ((word in question) && !(word in fwords)) {
      new_answer.push("<strong>"+word+"</strong>");
    } else {
      new_answer.push(word);
    }
  }

  return new_answer.join(" ");
}

var gen_result = function(title, answer) {
  return ('<div class="result">' + 
            '<span class="result-thumb-tack">' + 
              '<a href="">' + 
                '<i class="fa fa-thumb-tack fa-lg"></i>' +
              '</a>' + 
            '</span>' +
            '<div class="result-title">' +
              '<a href="">' +
                title + 
              '</a>' + 
            '</div>' +
            '<div class="result-answer">' +
              answer +
            '</div>' + 
          '</div>'
         );
};

// color animations
input.blur(function() {
    search_btn.animate({backgroundColor: "#bdc3c7"}, 100);
});
input.focus(function() {
    search_btn.animate({backgroundColor: "#1abc9c"}, 50);
});
