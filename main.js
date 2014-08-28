var Quizzy = (function() {
	var $quizContainer;
	var quizData;
  var questionNum = 0
  var model;

	var QuizController = {
    score: 0,
    questionCount: 0,
		checkAnswer: function(input, questionModel) {
			if (input == questionModel.answer) {
				alert('You got it!!! *cheering*');
        this.score++;
        this.questionCount++;
        console.log(this.score);
        if(this.questionCount == 10){
          alert("You got " + this.score + " questions correct!");
        }
			} else {
        this.questionCount++;
				alert('NOPE!! TRY AGAIN');
        if(this.questionCount == 10){
          alert("You got " + this.score + " questions correct!");
        }
			}
		}
	};

	function QuestionModel(questionData) {
		this.question = questionData.question;
		this.answer   = questionData.answer;
    this.choices = questionData.choices;
    this.name = questionData.name;
		this.view = new QuestionView(this);
	}

	function QuestionView(questionModel) {
		var me     = this;
		this.model = questionModel;
		this.template = $('#template-question').html();

		var preppedTemplate = _.template(this.template);
		var compiledHtml = preppedTemplate({
			question: this.model.question,
      choices: this.model.choices,
      name: this.model.name
		});
		var $view = $(compiledHtml);
		$view.find('input[type="submit"]').on('click', function() {
			QuizController.checkAnswer(
				$view.find('input[type="radio"]:checked').val(),
				me.model
			);
      nextQuestion();
		});



		$quizContainer.append($view);
	}

  function nextQuestion(){
    $('#question').remove();
    questionNum++;
    model = new QuestionModel(quizData.questions[questionNum]);
  }

	function startApplication(selector, quizInfo) {
    quizData = quizInfo;
		$quizContainer = $(selector);

		$(".row").prepend('<h1>' + quizData.quizTitle + '</h1>');

    model = new QuestionModel(quizData.questions[questionNum]);



		// var questionModels = [];

		// for (var i in quizData.questions) {
		// 	var model = new QuestionModel(quizData.questions[i]);
		// 	questionModels.push(model);
		// }
	}

	return {
		start: startApplication
	}
})();
