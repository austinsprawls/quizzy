var Quizzy = (function() {
	var $quizContainer;
	var quizData;
  var questionNum = 0;
  var model;
  var quizSize;
  var totalPlays = 0;

	var QuizController = {
    score: 0,
    questionCount: 0,
    userStorage: {},
    questionWins: {0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0},
    currentUser: "",
		checkAnswer: function(input, questionModel) {
      var me = this;
			if (input == questionModel.answer) {
				console.log('You got it!!! *cheering*');
        this.questionWins[this.questionCount]++;
        this.score++;
        this.questionCount++;
        console.log(this.score);
			} else {
        this.questionCount++;
				console.log('NOPE!! TRY AGAIN');
      }
      if(this.questionCount == 10){
        // $('#template-question').hide();
        totalPlays++;
        alert(this.currentUser + ", you got " + this.score + " questions correct!");
        $quizContainer.append('<button class="btn btn-default restart">Start New Game</button>');
        $quizContainer.append('<button class="btn btn-default leader">View Leaderboard</button>');
        $quizContainer.append('<button class="btn btn-default questions">View Question Wins</button>');
        $quizContainer.append('<div class="panel panel-default score"><h1>You got ' + this.score + ' out of '+ quizSize + ' questions correct!</h1></div>');
        this.updateUserScore();
        this.resetController();
        console.log(this.userStorage);
        $('.restart').on('click', function(){
          console.log('tried to restart game');
          $('.leaderboard').remove();
          $('.question-wins').remove();
          console.log("tried to remove leaderboard");
          $('.score').remove();
          $('.restart').remove();
          $('.leader').remove();
          $('.username').show();
          $('.name').show();
        });
        $('.leader').on('click', function(){
          $('.score').remove();
          $('.leader').remove();
          $('.question-wins').remove();
          console.log('userStorage', me.userStorage);
          var userPairs = _.pairs(me.userStorage);
          var sortedUserPairs = _.sortBy(userPairs, function(pair){return pair[1];});
          console.log('pairs', sortedUserPairs);
          for(var i=sortedUserPairs.length-1; i>=0; i--){
            $quizContainer.append('<h2 class="leaderboard">'+ sortedUserPairs[i][0] + ': ' + sortedUserPairs[i][1]/10*100 +'%</h2>');
          }
        });
        $('.questions').on('click',function(){
          $('.score').remove();
          $('.questions').remove();
          $('.leaderboard').remove();
          for(question in me.questionWins){
            $quizContainer.append('<h2 class="question-wins">Question #'+question+': ' + me.questionWins[question]/parseFloat(totalPlays)*100 + '% avg. correct</h2>' );
          }
        });
      }
		},
    addUsername: function(name){
      this.currentUser = name;
      this.userStorage[name] = 0;
      console.log(this.userStorage);
    },
    updateUserScore: function(){
      this.userStorage[this.currentUser] = this.score;
    },
    resetController: function(){
      this.score = 0;
      this.questionCount = 0;
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
      me.nextQuestion();
		});

    // $('.name').on('click', function(){
    //   var username = $('.username').val();
    //   QuizController.addUsername(username);
    //   $('.username').remove();
    //   $('.name').remove();
    // });

    this.nextQuestion = function(){
      $('#question').remove();
      if(questionNum != 9){
        questionNum++;
        model = new QuestionModel(quizData.questions[questionNum]);
      }
    }


		$quizContainer.append($view);
	}

	function startApplication(selector, quizInfo) {
    questionNum = 0;
    quizData = quizInfo;
    quizSize = quizData.questions.length;
		$quizContainer = $(selector);

		// $(".row").prepend('<h1>' + quizData.quizTitle + '</h1>');

    model = new QuestionModel(quizData.questions[questionNum]);



		// var questionModels = [];

		// for (var i in quizData.questions) {
		// 	var model = new QuestionModel(quizData.questions[i]);
		// 	questionModels.push(model);
		// }
	}

	return {
		start: startApplication,
    controller: QuizController
	}
})();
