let currentBracketsJson;
let isWaitingForResponse;

let emptyBracketHtml = '<span class="player-name"></span><span class="player-id"></span>';
let emptyBracketClasses = "bracket empty rounded";
let populatedBracketClasses = "bracket rounded";
let winnerBracketClasses = "bracket winner rounded";
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

            // Check how many players
            let players = response.brackets.filter(b => b.playerId != 0).map(p => p.playerName);  //<<CHANGE TO UNIQUE PLAYERS
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
            $(bracketId).html(`<span class="player-name">${bracketsInfo.brackets[i].playerName}</span><span class="player-id">${bracketsInfo.brackets[i].playerId}</span>`)
        }
        else {
            $(bracketId).html(emptyBracketHtml);
            $(bracketId).prop("class", emptyBracketClasses) // Byter class till "bracket-empty" ist för "bracket" och får därmed inget click-event
        }
    }
}

function clickBracketAction(bracketId) {

    // Om bracketen INTE har "empty" i class så kör vi switchen
    if (!$(`#${bracketId}`).hasClass('empty') && !isWaitingForResponse) {

        switch (bracketId) {
            case 'b30':
            case 'b29':
            case 'b28':
            case 'b27':
            case 'b26':
            case 'b25':
            case 'b24':
            case 'b23':
            case 'b22':
            case 'b21':
            case 'b20':
            case 'b19':
            case 'b18':
            case 'b17':
            case 'b16':
                if (checkIfBracketIsEmpty('b3')) {
                    if (!checkIfBracketIsEmpty('b15')) {

                        if (checkIfBracketIsEmpty('b7') || checkIfTargetBracketHasOpponent('b7', 'b15'))
                            setPlayerInBracketAsWinner('b16', 'b7', 'b15');
                        else
                            removePlayerInBracketAsWinner('b15', 'b7', 'b16');
                    }
                }
                break;
            case 'b15':
                if (checkIfBracketIsEmpty('b3')) {
                    if (!checkIfBracketIsEmpty('b16')) {

                        if (checkIfBracketIsEmpty('b7') || checkIfTargetBracketHasOpponent('b7', 'b16'))
                            setPlayerInBracketAsWinner('b15', 'b7', 'b16');
                        else
                            removePlayerInBracketAsWinner('b16', 'b7', 'b15');
                    }
                }
                break;
            case 'b14':
                if (checkIfBracketIsEmpty('b2')) {
                    if (!checkIfBracketIsEmpty('b13')) {

                        if (checkIfBracketIsEmpty('b6') || checkIfTargetBracketHasOpponent('b6', 'b13'))
                            setPlayerInBracketAsWinner('b14', 'b6', 'b13');
                        else
                            removePlayerInBracketAsWinner('b14', 'b6', 'b13');
                    }
                }
                break;
            case 'b13':
                if (checkIfBracketIsEmpty('b2')) {
                    if (!checkIfBracketIsEmpty('b14')) {

                        if (checkIfBracketIsEmpty('b6') || checkIfTargetBracketHasOpponent('b6', 'b14'))
                            setPlayerInBracketAsWinner('b13', 'b6', 'b14');
                        else
                            removePlayerInBracketAsWinner('b13', 'b6', 'b14');
                    }
                }
                break;
            case 'b12':
                if (checkIfBracketIsEmpty('b2')) {
                    if (!checkIfBracketIsEmpty('b11')) {

                        if (checkIfBracketIsEmpty('b5') || checkIfTargetBracketHasOpponent('b5', 'b11'))
                            setPlayerInBracketAsWinner('b12', 'b5', 'b11');
                        else
                            removePlayerInBracketAsWinner('b12', 'b5', 'b11');
                    }
                }
                break;
            case 'b11':
                if (checkIfBracketIsEmpty('b2')) {
                    if (!checkIfBracketIsEmpty('b12')) {

                        if (checkIfBracketIsEmpty('b5') || checkIfTargetBracketHasOpponent('b5', 'b12'))
                            setPlayerInBracketAsWinner('b11', 'b5', 'b12');
                        else
                            removePlayerInBracketAsWinner('b11', 'b5', 'b12');
                    }
                }
                break;
            case 'b10':
                if (checkIfBracketIsEmpty('b1')) {
                    if (!checkIfBracketIsEmpty('b9')) {
                        if (checkIfBracketIsEmpty('b4') || checkIfTargetBracketHasOpponent('b4', 'b9'))
                            setPlayerInBracketAsWinner('b10', 'b4', 'b9');
                        else
                            removePlayerInBracketAsWinner('b10', 'b4', 'b9');
                    }
                }
                break;
            case 'b9':
                if (checkIfBracketIsEmpty('b1')) {
                    if (!checkIfBracketIsEmpty('b10')) {

                        if (checkIfBracketIsEmpty('b4') || checkIfTargetBracketHasOpponent('b4', 'b10'))
                            setPlayerInBracketAsWinner('b9', 'b4', 'b10');
                        else
                            removePlayerInBracketAsWinner('b9', 'b4', 'b10');
                    }
                }
                break;
            case 'b8':
                if (checkIfBracketIsEmpty('b1')) {
                    if (!checkIfBracketIsEmpty('b7')) {
                        if (checkIfBracketIsEmpty('b3') || checkIfTargetBracketHasOpponent('b3', 'b7'))
                            setPlayerInBracketAsWinner('b8', 'b3', 'b7');
                        else
                            removePlayerInBracketAsWinner('b8', 'b3', 'b7');
                    }
                }
                break;
            case 'b7':
                if (checkIfBracketIsEmpty('b1')) {
                    if (!checkIfBracketIsEmpty('b8')) {
                        if (checkIfBracketIsEmpty('b3') || checkIfTargetBracketHasOpponent('b3', 'b8'))
                            setPlayerInBracketAsWinner('b7', 'b3', 'b8');
                        else
                            removePlayerInBracketAsWinner('b7', 'b3', 'b8');
                    }
                }
                break;
            case 'b6':
                if (!checkIfBracketIsEmpty('b5')) {
                    if (checkIfBracketIsEmpty('b2') || checkIfTargetBracketHasOpponent('b2', 'b5'))
                        setPlayerInBracketAsWinner('b6', 'b2', 'b5');
                    else
                        removePlayerInBracketAsWinner('b6', 'b2', 'b5');
                }
                break;
            case 'b5':
                if (!checkIfBracketIsEmpty('b6')) {
                    if (checkIfBracketIsEmpty('b2') || checkIfTargetBracketHasOpponent('b2', 'b6'))
                        setPlayerInBracketAsWinner('b5', 'b2', 'b6');
                    else
                        removePlayerInBracketAsWinner('b5', 'b2', 'b6');
                }
                break;
            case 'b4':
                if (!checkIfBracketIsEmpty('b3')) {
                    if (checkIfBracketIsEmpty('b1') || checkIfTargetBracketHasOpponent('b1', 'b3'))
                        setPlayerInBracketAsWinner('b4', 'b1', 'b3');
                    else
                        removePlayerInBracketAsWinner('b4', 'b1', 'b3');
                }
                break;
            case 'b3':
                if (!checkIfBracketIsEmpty('b4')) {
                    if (checkIfBracketIsEmpty('b1') || checkIfTargetBracketHasOpponent('b1', 'b4'))
                        setPlayerInBracketAsWinner('b3', 'b1', 'b4');
                    else
                        removePlayerInBracketAsWinner('b3', 'b1', 'b4');
                }
                break;
            case 'b2':
                if (!checkIfBracketIsEmpty('b1')) {
                    if (checkIfBracketIsEmpty('b0') || checkIfTargetBracketHasOpponent('b0', 'b1'))
                        setPlayerInBracketAsWinner('b2', 'b0', 'b1');
                    else
                        removePlayerInBracketAsWinner('b2', 'b0', 'b1');
                }
                break;
            case 'b1':
                if (!checkIfBracketIsEmpty('b2')) {
                    if (checkIfBracketIsEmpty('b0') || checkIfTargetBracketHasOpponent('b0', 'b2'))
                        setPlayerInBracketAsWinner('b1', 'b0', 'b2');
                    else
                        removePlayerInBracketAsWinner('b1', 'b0', 'b2');
                }
                break;
            case 'b0':
                console.log(bracketId);
                break;
            default:
        }

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

    let target = document.getElementById(targetBracketId);
    let opponent = document.getElementById(opponentBracketId);

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
    let newBracketsJson = setWinnerInBracketsJson(fromBracketId, targetBracketId);

    // Save changes on DB
    let success = saveChangesToDB(newBracketsJson);

    // If DB returns success
    if (success) {

        // Change classes (colors and other things css)
        $(`#${fromBracketId}`).prop("class", winnerBracketClasses);
        $(`#${targetBracketId}`).prop("class", populatedBracketClasses);
        $(`#${opponentBracketId}`).prop("class", loserBracketClasses);

        // Copy name to next bracket
        document.getElementById(targetBracketId).innerHTML = document.getElementById(fromBracketId).innerHTML;

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
    let newBracketsJson = removeWinnerInBracketsJson(targetBracketId);

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

        // Set newBracketsJson to current
        currentBracketsJson = newBracketsJson;
    }

    // Set to false to be able to click again
    isWaitingForResponse = false;
}

function setWinnerInBracketsJson(fromBracketId, targetBracketId) {

    let bracketState;

    // Get player name and ID
    let playerName = $(`#${fromBracketId}`).find('.player-name').text();
    let playerId = $(`#${fromBracketId}`).find('.player-id').text();

    // OBS OBS OBS OBS OBS OBS OBS OBSO OBS!!!!!
    if ($(fromBracketId).hasClass('winner'))
        bracketState = 'winner';


    // Make a copy of currentBracketsJson
    var newBracketsJson = Object.assign({}, currentBracketsJson);

    // Find targetBracket index
    var index = newBracketsJson.brackets.findIndex(b => b.bracketId == targetBracketId.substring(1));

    // Assign new values to targetBracket
    newBracketsJson.brackets[index].playerName = playerName;
    newBracketsJson.brackets[index].playerId = parseInt(playerId);

    return newBracketsJson;

}

function removeWinnerInBracketsJson(targetBracketId) {

    // Make a copy of currentBracketsJson
    var newBracketsJson = Object.assign({}, currentBracketsJson);

    // Find targetBracket index
    var index = newBracketsJson.brackets.findIndex(b => b.bracketId == targetBracketId.substring(1));

    // Assign new values to targetBracket
    newBracketsJson.brackets[index].playerName = null;
    newBracketsJson.brackets[index].playerId = 0;

    return newBracketsJson;
}

function saveChangesToDB(newBracketsJson) {
    // TODO
    console.log(newBracketsJson);
   // newBracketsJson.tournamentId = `${newBracketsJson.tournamentId}`
    let output = true;
    let jsonStr = JSON.stringify(newBracketsJson)

    $.ajax({
        url: 'updatetournamentbracket',
        type: 'POST',
        contentType: 'application/json',
        data: jsonStr,
        success: function (data) {
            console.log(data)
    
        },
        error: function () {
            console.log("error");
            output = false;
        }
    });
    return output;
}

