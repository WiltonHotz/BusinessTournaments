let currentBracketsJson;
let isWaitingForResponse;

let emptyBracketHtml = '<span class="player-name"></span><span class="score"></span><span class="player-id"></span>';
let emptyBracketClasses = "bracket empty rounded";
let populatedBracketClasses = "bracket rounded";
let winnerBracketClasses = "bracket winner rounded";
let totalWinnerBracketClasses = "bracket totalwinner rounded";
let loserBracketClasses = "bracket loser rounded";

const unique = (value, index, self) => {
    return self.indexOf(value) === index;
}

function getTournamentBracketJSON(bracketId) {

    var url = "b/" + bracketId;
    $.ajax({
        url: url,
        type: "GET",
        success: function (response) {
            // Save brackets Json for later
            currentBracketsJson = response;
            console.log(currentBracketsJson)
            // add tournament name to html
            $('.TournamentName').html(`- ${currentBracketsJson.tournamentName} -`)

            // Check how many players
            let players = response.brackets.filter(b => b.playerId != 0).map(p => p.playerId);
            let numOfPlayers = players.filter(unique).length;

            // Get brackets partial view
            getBracketsPartialView(response, numOfPlayers);

        },
        error: function () {
            console.log("error");
        }
    });
}

function addClickListenersOnAllBrackets() {
    $(".bracket").click(function (e) {
        e.preventDefault();
        clickBracketAction(this.id);
    });
}

function getBracketsPartialView(bracketsInfo, numOfPlayers) {

    var url = `/getbracketspartialview/${numOfPlayers}`;

    $.ajax({
        url: url,
        type: "GET",
        success: function (response) {

            $(".bracket-container").html(response);

            // Populate brackets with names (and classes if empty)
            populateBrackets(bracketsInfo, numOfPlayers);

            // Make add click events on brackets with names
            addClickListenersOnAllBrackets();
        },
        error: function () {
            console.log("error");
        }
    });
}

function populateBrackets(bracketsInfo, numOfPlayers) {

    // If four players, remove quarters div
    if (numOfPlayers === 4)
        document.getElementById("quarters").style.display = "none";

    for (var i = 0; i < bracketsInfo.brackets.length; i++) {

        // SPara bracketId lite mer läsbart i en variabel
        let bracketId = `#b${bracketsInfo.brackets[i].bracketId}`;

        // Skriv ut namnet om det finns något, annars tom <span>
        if (bracketsInfo.brackets[i].playerName != null) {
            $(bracketId).html(`<span class="player-name">${bracketsInfo.brackets[i].playerName.toUpperCase()}</span><span class="score"></span><span class="player-id">${bracketsInfo.brackets[i].playerId}</span>`)
            if (bracketsInfo.brackets[i].bracketState === 'winner') {
                $(bracketId).prop("class", winnerBracketClasses)
            }
            else if (bracketsInfo.brackets[i].bracketState === 'loser') {
                $(bracketId).prop("class", loserBracketClasses)
            }
            else if (bracketsInfo.brackets[i].bracketState === 'totalwinner') {
                $(bracketId).prop("class", totalWinnerBracketClasses);
            }
        }
        else {
            $(bracketId).html(emptyBracketHtml);
            $(bracketId).prop("class", emptyBracketClasses) // Byter class till "bracket-empty" ist för "bracket" och får därmed inget click-event
        }

        checkIfBracketLevelsAreLocked();
    }
}

function clickBracketAction(bracketId) {


    // Om bracketen INTE har "empty" i class så kör vi metoden
    if (!$(`#${bracketId}`).hasClass('empty') && !isWaitingForResponse) {

        calculateBrackets(bracketId);
      
    }
}

function checkIfBracketIsEmpty(bracketId) {

    let bracket = document.getElementById(bracketId);

    if (bracket.innerHTML === emptyBracketHtml) {
        return true;
    }
    else {
        return false;
    }
}

function checkIfTargetBracketHasOpponent(targetBracketId, opponentBracketId) {

    //let target = document.getElementById(targetBracketId);
    //let opponent = document.getElementById(opponentBracketId);
    let target = document.getElementById(`${targetBracketId}`).querySelector('.player-id');
    let opponent = document.getElementById(`${opponentBracketId}`).querySelector('.player-id');

    if (target.innerHTML === opponent.innerHTML) {
        return true;
    }
    else {
        return false;
    }
}

function setPlayerInBracketAsWinner(fromBracketId, targetBracketId, opponentBracketId) {

    // Set to true to disable click on all brackets
    isWaitingForResponse = true;

    // Update json object
    let newBracketsJson = setWinnerInBracketsJson(fromBracketId, targetBracketId, opponentBracketId);
    console.log(opponentBracketId)
    // Save changes on DB
    let success = saveChangesToDB(newBracketsJson);

    // If DB returns success
    if (success) {

        // Change classes (colors and other things css)
        $(`#${fromBracketId}`).prop("class", winnerBracketClasses);
        $(`#${opponentBracketId}`).prop("class", loserBracketClasses);
        if (targetBracketId != 'b0') {
            $(`#${targetBracketId}`).prop("class", populatedBracketClasses);
        }
        else {
            $(`#${targetBracketId}`).prop("class", totalWinnerBracketClasses);
        }


        // Copy name to next bracket
        document.getElementById(targetBracketId).innerHTML = document.getElementById(fromBracketId).innerHTML;
     
        //score
        if (targetBracketId == 'b0') {
            let winner = document.getElementById(`${targetBracketId}`).querySelector('.score');
            let secondPlace = document.getElementById(`${opponentBracketId}`).querySelector('.score');
            let clickedPlayer = document.getElementById(`${fromBracketId}`).querySelector('.score');

            if (currentBracketsJson.brackets.length === 7)
                winnerScore = 2;
            else if (currentBracketsJson.brackets.length === 15)
                winnerScore = 3;
            else if (currentBracketsJson.brackets.length === 31)
                winnerScore = 4;

            winner.innerHTML = `+${winnerScore} p`;
            secondPlace.innerHTML = " +1 p"
            clickedPlayer.innerHTML = ""
 
        }

        // Make locked bracket-levels darker
        checkIfBracketLevelsAreLocked();

        // Set newBracketsJson to current
        currentBracketsJson = newBracketsJson;
    }

    // Set to false to be able to click again
    isWaitingForResponse = false;
}

function removePlayerInBracketAsWinner(fromBracketId, targetBracketId, opponentBracketId) {

    // Set to true to disable click on all brackets
    isWaitingForResponse = true;

    // Update json object
    let newBracketsJson = removeWinnerInBracketsJson(fromBracketId, targetBracketId, opponentBracketId);

    // Save changes on DB
    let success = saveChangesToDB(newBracketsJson);

    // If DB returns success
    if (success) {

        // Change classes (colors and other things css)
        $(`#${fromBracketId}`).prop("class", populatedBracketClasses);
        $(`#${targetBracketId}`).prop("class", emptyBracketClasses);
        $(`#${opponentBracketId}`).prop("class", populatedBracketClasses);

        // Empty target bracket
        document.getElementById(targetBracketId).innerHTML = emptyBracketHtml;


       //  score
        if (targetBracketId === 'b0') {
            let clickedPlayer = document.getElementById(`${fromBracketId}`).querySelector('.score');
            let opponent = document.getElementById(`${opponentBracketId}`).querySelector('.score');

            clickedPlayer.innerHTML = "";
            opponent.innerHTML = "";
        }
       
 

        // Make locked bracket-levels darker
        checkIfBracketLevelsAreLocked();

        // Set newBracketsJson to current
        currentBracketsJson = newBracketsJson;
    }

    // Set to false to be able to click again
    isWaitingForResponse = false;
}

function setWinnerInBracketsJson(fromBracketId, targetBracketId, opponentBracketId) {

    // Get player name and ID
    let playerName = $(`#${fromBracketId}`).find('.player-name').text();
    let playerId = $(`#${fromBracketId}`).find('.player-id').text();

    // Make a copy of currentBracketsJson
    var newBracketsJson = Object.assign({}, currentBracketsJson);

    // Find targetBracket index
    var targetBracketIndex = newBracketsJson.brackets.findIndex(b => b.bracketId == targetBracketId.substring(1));

    // Find fromBracket index
    var fromBracketIndex = newBracketsJson.brackets.findIndex(b => b.bracketId == fromBracketId.substring(1));

    var opponentBracketIndex = newBracketsJson.brackets.findIndex(b => b.bracketId == opponentBracketId.substring(1));

    // Assign new values to targetBracket
    newBracketsJson.brackets[targetBracketIndex].playerName = playerName;
    newBracketsJson.brackets[targetBracketIndex].playerId = parseInt(playerId);
    if (targetBracketIndex === 0) {
        newBracketsJson.brackets[targetBracketIndex].bracketState = 'totalwinner';
    }

    // Set state(class) on brackets
    newBracketsJson.brackets[fromBracketIndex].bracketState = 'winner';
    newBracketsJson.brackets[opponentBracketIndex].bracketState = 'loser';

    return newBracketsJson;

}

function removeWinnerInBracketsJson(fromBracketId, targetBracketId, opponentBracketId) {

    // Make a copy of currentBracketsJson
    var newBracketsJson = Object.assign({}, currentBracketsJson);

    // Find Bracket index
    var targetBracketIndex = newBracketsJson.brackets.findIndex(b => b.bracketId == targetBracketId.substring(1));

    var fromBracketIndex = newBracketsJson.brackets.findIndex(b => b.bracketId == fromBracketId.substring(1));

    var opponentBracketIndex = newBracketsJson.brackets.findIndex(b => b.bracketId == opponentBracketId.substring(1));

    // Assign new values to targetBracket
    newBracketsJson.brackets[targetBracketIndex].playerId = 0;
    newBracketsJson.brackets[targetBracketIndex].playerName = null;
    newBracketsJson.brackets[targetBracketIndex].bracketState = '';

    newBracketsJson.brackets[fromBracketIndex].bracketState = '';
    newBracketsJson.brackets[opponentBracketIndex].bracketState = '';


    return newBracketsJson;
}

function saveChangesToDB(newBracketsJson) {

    let output = true;
    let jsonStr = JSON.stringify(newBracketsJson)

    $.ajax({
        url: 'updatetournamentbracket',
        type: 'POST',
        contentType: 'application/json',
        data: jsonStr,
        success: function (data) {
            //console.log(data)

        },
        error: function () {
            console.log("error");
            output = false;
        }
    });
    return output;
}

function saveScoreAndMarkTourAsCompletedInDB() {

    console.log(currentBracketsJson)

    if (currentBracketsJson.brackets[0].playerId === 0) {
        window.location.href = "/"
    }
    else {
        let winnerScore = 0;
        let secondScore = 1;

        let winnerPlayerId = currentBracketsJson.brackets[0].playerId;
        let secondPlayerId = currentBracketsJson.brackets[1].playerId === winnerPlayerId ? currentBracketsJson.brackets[2].playerId : currentBracketsJson.brackets[1].playerId;

        // WINNER SCORES
        if (currentBracketsJson.brackets.length === 7)
            winnerScore = 2;
        else if (currentBracketsJson.brackets.length === 15)
            winnerScore = 3;
        else if (currentBracketsJson.brackets.length === 31)
        winnerScore = 4;

        // JSON OBJECT
        let finalizeTournamentJson = {
            winnerPlayerId: winnerPlayerId,
            winnerScore: winnerScore,
            secondPlayerId: secondPlayerId,
            secondScore: secondScore,
            tournamentId: currentBracketsJson.tournamentId
        }

        $.ajax({
            url: 'finalizetournament',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(finalizeTournamentJson),
            success: function (data) {

                window.location.href = "/"; // Redirect to home
            },
            error: function () {
                console.log("error");
                output = false;
            }
        });
    }
}

function checkIfBracketLevelsAreLocked() {

    if (currentBracketsJson.brackets.length === 7) {

        let finalWinnerAndLoser = document.getElementById('final-8players').querySelectorAll('.winner, .loser');

        if (finalWinnerAndLoser.length === 2) {
            document.getElementById('semis').style.opacity = "0.3";
        }
        else {
            document.getElementById('semis').style.opacity = "1";
        }
    }
    if (currentBracketsJson.brackets.length === 15) {

        let semiUpperWinnersAndLosers = document.getElementById('semis').querySelector('.upper').querySelectorAll('.winner, .loser');
        let semiLowerWinnersAndLosers = document.getElementById('semis').querySelector('.lower').querySelectorAll('.winner, .loser');
        let finalWinnerAndLoser = document.getElementById('final-8players').querySelectorAll('.winner, .loser');

        if (semiUpperWinnersAndLosers.length === 2) {
            let upper = document.getElementById('quarters').querySelectorAll('.upper');
            for (var i = 0; i < upper.length; i++) { upper[i].style.opacity = "0.3"; }
        }
        else {
            let upper = document.getElementById('quarters').querySelectorAll('.upper');
            for (var i = 0; i < upper.length; i++) { upper[i].style.opacity = "1"; }
        }

        if (semiLowerWinnersAndLosers.length === 2) {
            let lower = document.getElementById('quarters').querySelectorAll('.lower');
            for (var i = 0; i < lower.length; i++) { lower[i].style.opacity = "0.3"; }
        }
        else {
            let lower = document.getElementById('quarters').querySelectorAll('.lower');
            for (var i = 0; i < lower.length; i++) { lower[i].style.opacity = "1"; }
        }

        if (finalWinnerAndLoser.length === 2) {
            document.getElementById('semis').style.opacity = "0.3";
        }
        else {
            document.getElementById('semis').style.opacity = "1";
        }
    }
    if (currentBracketsJson.brackets.length === 31) {

        let quartersUpperLeftWinnersAndLosers = document.getElementById('quarters-left').querySelector('.upper').querySelectorAll('.winner, .loser');
        let quartersLowerLeftWinnersAndLosers = document.getElementById('quarters-left').querySelector('.lower').querySelectorAll('.winner, .loser');
        let quartersUpperRightWinnersAndLosers = document.getElementById('quarters-right').querySelector('.upper').querySelectorAll('.winner, .loser');
        let quartersLowerRightWinnersAndLosers = document.getElementById('quarters-right').querySelector('.lower').querySelectorAll('.winner, .loser');
        let semiLeftWinnersAndLosers = document.getElementById('semis-left').querySelectorAll('.winner, .loser');
        let semiRightWinnersAndLosers = document.getElementById('semis-right').querySelectorAll('.winner, .loser');
        let finalWinnerAndLoser = document.getElementById('final-16players').querySelectorAll('.winner, .loser');

        // Upper left eights
        if (quartersUpperLeftWinnersAndLosers.length === 2) {
            let brackets = document.getElementById('eights-left').querySelectorAll('.upper');
            for (var i = 0; i < brackets.length; i++) { brackets[i].style.opacity = "0.3"; }
        }
        else {
            let brackets = document.getElementById('eights-left').querySelectorAll('.upper');
            for (var i = 0; i < brackets.length; i++) { brackets[i].style.opacity = "1"; }
        }

        // Lower left eights
        if (quartersLowerLeftWinnersAndLosers.length === 2) {
            let brackets = document.getElementById('eights-left').querySelectorAll('.lower');
            for (var i = 0; i < brackets.length; i++) { brackets[i].style.opacity = "0.3"; }
        }
        else {
            let brackets = document.getElementById('eights-left').querySelectorAll('.lower');
            for (var i = 0; i < brackets.length; i++) { brackets[i].style.opacity = "1"; }
        }

        // Upper right eights
        if (quartersUpperRightWinnersAndLosers.length === 2) {
            let brackets = document.getElementById('eights-right').querySelectorAll('.upper');
            for (var i = 0; i < brackets.length; i++) { brackets[i].style.opacity = "0.3"; }
        }
        else {
            let brackets = document.getElementById('eights-right').querySelectorAll('.upper');
            for (var i = 0; i < brackets.length; i++) { brackets[i].style.opacity = "1"; }
        }

        // Lower right eights
        if (quartersLowerRightWinnersAndLosers.length === 2) {
            let brackets = document.getElementById('eights-right').querySelectorAll('.lower');
            for (var i = 0; i < brackets.length; i++) { brackets[i].style.opacity = "0.3"; }
        }
        else {
            let brackets = document.getElementById('eights-right').querySelectorAll('.lower');
            for (var i = 0; i < brackets.length; i++) { brackets[i].style.opacity = "1"; }
        }

        // Left quarters
        if (semiLeftWinnersAndLosers.length === 2)
            document.getElementById('quarters-left').style.opacity = "0.3";
        else
            document.getElementById('quarters-left').style.opacity = "1";

        // Right quarters
        if (semiRightWinnersAndLosers.length === 2)
            document.getElementById('quarters-right').style.opacity = "0.3";
        else
            document.getElementById('quarters-right').style.opacity = "1";

        // Right & left semis
        if (finalWinnerAndLoser.length === 2) {
            document.getElementById('semis-left').style.opacity = "0.3";
            document.getElementById('semis-right').style.opacity = "0.3";
        }
        else {
            document.getElementById('semis-left').style.opacity = "1";
            document.getElementById('semis-right').style.opacity = "1";
        }
    }
}

function calculateBrackets(clickedBracket) {
    let clickedBracketId = Number(clickedBracket.substring(1));
    let opponentBracketId;
    let targetBracketId;
    let targetTargetBracketId;

    if (clickedBracketId % 2 === 0) {
        opponentBracketId = clickedBracketId - 1;
        targetBracketId = clickedBracketId / 2 - 1;

    } else {
        opponentBracketId = (clickedBracketId + 1);
        targetBracketId = (clickedBracketId - 1) / 2;
    }

    if (targetBracketId % 2 === 0) {
        targetTargetBracketId = targetBracketId / 2 - 1;

    } else {
        targetTargetBracketId = (targetBracketId - 1) / 2;
    }

    setBracketState(clickedBracketId, targetBracketId, opponentBracketId, targetTargetBracketId);
}

function setBracketState(clickedBracketId, targetBracketId, opponentBracketId, targetTargetBracketId) {
    if (clickedBracketId > 2) {
        if (checkIfBracketIsEmpty(`b${targetTargetBracketId}`)) {
            if (!checkIfBracketIsEmpty(`b${opponentBracketId}`)) {

                if (checkIfBracketIsEmpty(`b${targetBracketId}`) || checkIfTargetBracketHasOpponent(`b${targetBracketId}`, `b${opponentBracketId}`))
                    setPlayerInBracketAsWinner(`b${clickedBracketId}`, `b${targetBracketId}`, `b${opponentBracketId}`);
                else
                    removePlayerInBracketAsWinner(`b${opponentBracketId}`, `b${targetBracketId}`, `b${clickedBracketId}`);
            }
        }
    } else if (clickedBracketId > 0) {
        if (!checkIfBracketIsEmpty(`b${opponentBracketId}`)) {

            if (checkIfBracketIsEmpty(`b${targetBracketId}`) || checkIfTargetBracketHasOpponent(`b${targetBracketId}`, `b${opponentBracketId}`))
                setPlayerInBracketAsWinner(`b${clickedBracketId}`, `b${targetBracketId}`, `b${opponentBracketId}`);
            else
                removePlayerInBracketAsWinner(`b${opponentBracketId}`, `b${targetBracketId}`, `b${clickedBracketId}`);
        }
        else {
            console.log(bracketId);
        }
    }
}

//#region burgers and stuff

$(document).ready(function () {
    $('#nav-icon').click(function () {
        $(this).toggleClass('open');
    });
});

function burgerStuff() {
    var x = document.getElementById("myDIV");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}

//#endregion

//function play_single_sound2() {
//    document.getElementById('audiotag2').play();
//}