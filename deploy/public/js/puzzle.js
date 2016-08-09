
var counter = 0;
var timer = 0;
var timerId = setInterval(myTimer, 1000);
var timeCount = '';
var user =$('#user-name').val();
var $draggedCard = null;
var bestUsersCounter = 0;
var draggedCardChanged = true;
var $oldDraggedCard = null;

function myTimer() {
    timer++;
    updateTimerDisplay();
}

function updateTimerDisplay(){
	var hour = Math.floor(timer/3600);
	var min = Math.floor((timer%3600)/60);
	var sec = timer%3600-min*60;
	timeCount = hour+'h:'+min+'m:'+sec+'s';
    $('#timer').text(timeCount);
}

function myStopFunction() {
    clearInterval(timerId);
}


// function allowDrop(ev) {
//     ev.preventDefault();
// }

// function drag(ev) {
//     ev.dataTransfer.setData("text", ev.target.id);
// }


function checkIfComplete() {
	var result = true;

	$('.puzzle-card').each(function() {
		var cardId = getNumberFromId(this.id);
		var boxId = getNumberFromId(this.parentNode.id);

		if (cardId !== boxId) {
			result = false;
		}

	});

	return result;
}

function getNumberFromId(id) {
	var newId = id.split('_')[1];
	return newId;
}

$(document).ready(function() {

	var usersScores = [];

	var gameConfig = {
		levels: [
			{level: 'easy', tiles: 12}, 
			{level: 'medium', tiles: 20}, 
			{level: 'hard', tiles: 30}, 
			{level: 'extreme', tiles: 40}
		]
	};

	var currentLevel = 0;

    var sliderInt = 1;
	var count = $('.slides li').length;

	$('.slides #1').fadeIn(300);
	$('#prev').click(function () {
 		sliderInt--;
		showSlide(sliderInt);
 	});

	$('#next').click(function () {
	 	sliderInt++;
		showSlide(sliderInt);
	});

	function showSlide(id) {
		if (id >= count) {
			id = 0;
		}
		else if (id < 0) {
			id = count-1;
		}

		$('.slides li').fadeOut(100);
		$('.slides #' + id).fadeIn(300);

		sliderInt = id;
		id++;	
	}

	function randomizeCards() {
		$('.puzzle-card').each(function() {
			var randomPic = $('.puzzle-card').get(Math.floor(Math.random()*10));
			var parentBuffer = this.parentNode;
			randomPic.parentNode.appendChild(this);
			parentBuffer.appendChild(randomPic);
		});
	}

	function initGame() {
		myStopFunction();
		timer = 0;
		updateTimerDisplay();
		timerId = setInterval(myTimer, 1000);
		counter = 0;
		$('#countMoves').text(counter);
		//gets the url parameters into an array
		$.urlParam = function(name){
			var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);

			return results != null ? results[1] : '-1';
		}

		// example.com?param1=name&param2=&id=6
		var folderName = gameConfig.levels[currentLevel].level;
		var imageId = $.urlParam('image');
		$('#slider').show();
		$('#header').hide();
		$('#gameField').hide();
		$('#counter').hide();
		$('#statistics').hide();

		//check if there is actually a valid imageId
		if ( imageId !== '-1' ) {
			$('#gameField').show();
			$('#slider').hide();
			$('#header').show();
			$('#counter').show();
			$('#statistics').hide();

			var gameFieldHtml = '';
			for (var i = 0; i < gameConfig.levels[currentLevel].tiles; i++) {
				gameFieldHtml +=
					'<div id="drop_'+i+'">'+
				        '<img class="puzzle-card js-draggable js-droppable" src="images/tiles/'+folderName+'/tile'+imageId+'_'+i+'.jpg" id="drag_'+i+'"/>'+
				    '</div>';

					// '<div id="drop_'+i+'" ondrop="drop(event)" ondragover="allowDrop(event)">'+
				 //        '<img class="puzzle-card draggable" src="images/tiles/'+folderName+'/tile'+imageId+'_'+i+'.jpg" id="drag_'+i+'" draggable="true" ondragstart="drag(event)"/>'+
				 //    '</div>';
			}
			$('#gameField').html(gameFieldHtml);

			
			//make cards move back if they don't hit another card
			$('.js-draggable').draggable({
				revert: 'invalid',
				start: function(){
					draggedCardChanged = $draggedCard == null || !$draggedCard.is($(this));
					$oldDraggedCard = $draggedCard;
					$draggedCard = $(this);
					$draggedCard.addClass('dragging');
				},
				stop: function(){
					$(this).removeClass('dragging');
				}
			});
			$('.js-droppable').droppable({
				drop: drop
			});

			randomizeCards();
		}
	}


function drop(ev) {

    /*ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var drag1 = ev.target;
    var drop1 = document.getElementById(data).parentNode;
    var drop2 = drag1.parentNode;
    drop2.appendChild(document.getElementById(data));
    drop1.appendChild(drag1);
    */

    //---- scenario: card A was dropped on card B -----

    var cardA = $draggedCard;
    var cardB = $(ev.target);

	var dropOfA = cardA[0].parentNode;
	var dropOfB = cardB[0].parentNode;
	dropOfB.appendChild(cardA[0]);
	dropOfA.appendChild(cardB[0]);

	//reset styles set by jquery ui during dragging
		cardA.css('position', '');
		cardA.css('top', '');
		cardA.css('left', '');
	

    //-------------------------------------------------

    counter++;
    $('#countMoves').text(counter);

    if (checkIfComplete()) {
    	myStopFunction();

    	$('#dialog_confirm_map').modal();
    	$('.modal-backdrop').appendTo('.game-field');
        $('body').removeClass();

    	$('#countMovesModal').text(counter); 	
    	$('#timerModal').text(timer);		
    	//alert('You completed the puzzle with '+counter+' moves in '+timer+'s');
    }
    
}
	function listOfTheBest(){
		$.get('/scores', function(scoresFromServer, status){
			//alert("Data: " + data + "\nStatus: " + status);
			usersScores = scoresFromServer.userScores;	
			
			var statisticsFieldHtml = '';

				usersScores.forEach(function(score){
					bestUsersCounter++;
					statisticsFieldHtml += '<tr><td data-th="#">'+bestUsersCounter+'</td><td data-th="User">'+score.username+'</td><td data-th="Level">'+gameConfig.levels[currentLevel].level+'</td><td data-th="Steps">'+score.steps+'</td><td data-th="Time">'+score.time+'</td></tr>'
				});
				/*statisticsFieldHtml += '</tr>';

			/*var statisticsFieldHtml = '<ul>';

				usersScores.forEach(function(score){
					bestUsersCounter++;
					statisticsFieldHtml += '<li class="squareStat">'+bestUsersCounter+'   '+score.username+'  Level: '+gameConfig.levels[currentLevel].level+'  Score: '+score.steps+'  Time: '+score.time+' </li>'
				});
				statisticsFieldHtml += '</ul>';*/

			// <div class="container">
			// <div class="row">
			// <table>
			// 	<thead>
			// 		<tr class="">
			// 			<td class=""></td>
			// 			<td class="">User</td>
			// 			<td class="">Level</td>
			// 			<td class="">Steps</td>
			// 			<td class="">Time</td>
			// 		</tr>
			// 	</thead>

			// 	<tbody>
			// 		<tr class="">
			// 			<td class="">bestUsersCounter</td>
			// 			<td class="">score.username</td>
			// 			<td class="">gameConfig.levels[currentLevel].level</td>
			// 			<td class="">score.steps</td>
			// 			<td class="">score.time</td>
			// 		</tr>
			// 	</tbody>
			// </table>
			// </div>
			// </div>
						
			$('#tableBody').html(statisticsFieldHtml);

		});
	}

	function showStatictics(){
		listOfTheBest();
		$('#header').hide();
		$('#statistics').show();
		$('#gameField').hide();
		$('#counter').hide();
		$('#slider').hide();
	}



	$('#restartButton').click(function(){
		initGame();
	});

	$('#easyLevelButton').click(function(){
		currentLevel = 0;
		initGame();
	});

	$('#mediumLevelButton').click(function(){
		currentLevel = 1;
		initGame();
	});

	$('#hardLevelButton').click(function(){
		currentLevel = 2;
		initGame();
	});

	$('#extremeLevelButton').click(function(){
		currentLevel = 3;
		initGame();
	});

	$('#newGameButton').click(function(){
		$('#slider').show();
		$('#header').hide();
		$('#gameField').hide();
		$('#counter').hide();
		$('#statistics').hide();
	});

	$('#statisticsButton').click(function(){
		showStatictics();	
	});

	$('#saveResultsButton').click(function(){

		var score = {username: $('#user-name').val(), steps: counter, time: timer};
		
		$.ajax({
			url: "/scores",
			type: 'PUT',
			data: score,
			success: function(res) {
				showStatictics();
			} 
		});
	});


	initGame();
});

