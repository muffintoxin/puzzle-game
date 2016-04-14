
var counter = 0;
var timer = 0;
var timerId = setInterval(myTimer, 1000);

function myTimer() {
    timer++;
	var hour = Math.floor(timer/3600);
	var min = Math.floor((timer%3600)/60);
	var sec = timer%3600-min*60;
    $('#timer').text(hour+'h:'+min+'m:'+sec+'s');
}
function myStopFunction() {
    clearInterval(timerId);
}


function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var drag1 = ev.target;
    var drop1 = document.getElementById(data).parentNode;
    var drop2 = drag1.parentNode;
    drop2.appendChild(document.getElementById(data));
    drop1.appendChild(drag1);
    counter++;
    $('#countMoves').text(counter);

    if (checkIfComplete()) {
    	myStopFunction();
    	alert('You completed the puzzle with '+counter+' moves in '+timer+'s');
    }
    
}

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

    var sliderInt = 1;
	var count = $('.slides li').size();

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

	$('#countMoves').text(counter);

	function initGame() {
		//gets the url parameters into an array
		$.urlParam = function(name){
			var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);

			return results != null ? results[1] : '-1';
		}

		// example.com?param1=name&param2=&id=6
		var imageId = $.urlParam('image');
		$('#slider').show();
		$('#header').hide();
		$('#gameField').hide();

		//check if there is actually a valid imageId
		if ( imageId !== '-1' ) {
			$('#gameField').show();
			$('#slider').hide();
			$('#header').show();

			var gameFieldHtml = '';
			for (var i = 0; i < 20; i++) {
				gameFieldHtml +=
					'<div id="drop_'+i+'" ondrop="drop(event)" ondragover="allowDrop(event)">'+
				        '<img class="puzzle-card" src="images/tiles/tile'+imageId+'_'+i+'.jpg" id="drag_'+i+'" draggable="true" ondragstart="drag(event)"/>'+
				    '</div>';
			}
			$('#gameField').html(gameFieldHtml);

			randomizeCards();
		}
	}

	initGame();
});

