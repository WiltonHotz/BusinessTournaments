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
            if (bracketsInfo.brackets[i].bracketState === 'winner') {
                $(bracketId).prop("class", winnerBracketClasses)
            } else if (bracketsInfo.brackets[i].bracketState === 'loser') {
                $(bracketId).prop("class", loserBracketClasses)
            }
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
                if (checkIfBracketIsEmpty('b6')) {
                    if (!checkIfBracketIsEmpty('b29')) {

                        if (checkIfBracketIsEmpty('b14') || checkIfTargetBracketHasOpponent('b14', 'b29'))
                            setPlayerInBracketAsWinner('b30', 'b14', 'b29');
                        else
                            removePlayerInBracketAsWinner('b29', 'b14', 'b30');
                    }
                }
                break;
            case 'b29':
                if (checkIfBracketIsEmpty('b6')) {
                    if (!checkIfBracketIsEmpty('b30')) {

                        if (checkIfBracketIsEmpty('b14') || checkIfTargetBracketHasOpponent('b14', 'b30'))
                            setPlayerInBracketAsWinner('b29', 'b14', 'b30');
                        else
                            removePlayerInBracketAsWinner('b30', 'b14', 'b29');
                    }
                }
                break;
            case 'b28':
                if (checkIfBracketIsEmpty('b6')) {
                    if (!checkIfBracketIsEmpty('b27')) {

                        if (checkIfBracketIsEmpty('b13') || checkIfTargetBracketHasOpponent('b13', 'b27'))
                            setPlayerInBracketAsWinner('b28', 'b13', 'b27');
                        else
                            removePlayerInBracketAsWinner('b27', 'b13', 'b28');
                    }
                }
                break;
            case 'b27':
                if (checkIfBracketIsEmpty('b6')) {
                    if (!checkIfBracketIsEmpty('b28')) {

                        if (checkIfBracketIsEmpty('b13') || checkIfTargetBracketHasOpponent('b13', 'b28'))
                            setPlayerInBracketAsWinner('b27', 'b13', 'b28');
                        else
                            removePlayerInBracketAsWinner('b28', 'b13', 'b27');
                    }
                }
                break;
            case 'b26':
                if (checkIfBracketIsEmpty('b5')) {
                    if (!checkIfBracketIsEmpty('b25')) {

                        if (checkIfBracketIsEmpty('b12') || checkIfTargetBracketHasOpponent('b12', 'b25'))
                            setPlayerInBracketAsWinner('b26', 'b12', 'b25');
                        else
                            removePlayerInBracketAsWinner('b25', 'b12', 'b26');
                    }
                }
                break;
            case 'b25':
                if (checkIfBracketIsEmpty('b5')) {
                    if (!checkIfBracketIsEmpty('b26')) {

                        if (checkIfBracketIsEmpty('b12') || checkIfTargetBracketHasOpponent('b12', 'b26'))
                            setPlayerInBracketAsWinner('b25', 'b12', 'b26');
                        else
                            removePlayerInBracketAsWinner('b26', 'b12', 'b25');
                    }
                }
                break;
            case 'b24':
                if (checkIfBracketIsEmpty('b5')) {
                    if (!checkIfBracketIsEmpty('b23')) {

                        if (checkIfBracketIsEmpty('b11') || checkIfTargetBracketHasOpponent('b11', 'b23'))
                            setPlayerInBracketAsWinner('b24', 'b11', 'b23');
                        else
                            removePlayerInBracketAsWinner('b23', 'b11', 'b24');
                    }
                }
                break;
            case 'b23':
                if (checkIfBracketIsEmpty('b5')) {
                    if (!checkIfBracketIsEmpty('b24')) {

                        if (checkIfBracketIsEmpty('b11') || checkIfTargetBracketHasOpponent('b11', 'b24'))
                            setPlayerInBracketAsWinner('b23', 'b11', 'b24');
                        else
                            removePlayerInBracketAsWinner('b24', 'b11', 'b23');
                    }
                }
                break;
            case 'b22':
                if (checkIfBracketIsEmpty('b4')) {
                    if (!checkIfBracketIsEmpty('b21')) {

                        if (checkIfBracketIsEmpty('b10') || checkIfTargetBracketHasOpponent('b10', 'b21'))
                            setPlayerInBracketAsWinner('b22', 'b10', 'b21');
                        else
                            removePlayerInBracketAsWinner('b21', 'b10', 'b22');
                    }
                }
                break;
            case 'b21':
                if (checkIfBracketIsEmpty('b4')) {
                    if (!checkIfBracketIsEmpty('b22')) {

                        if (checkIfBracketIsEmpty('b10') || checkIfTargetBracketHasOpponent('b10', 'b22'))
                            setPlayerInBracketAsWinner('b21', 'b10', 'b22');
                        else
                            removePlayerInBracketAsWinner('b22', 'b10', 'b21');
                    }
                }
                break;
            case 'b20':
                if (checkIfBracketIsEmpty('b4')) {
                    if (!checkIfBracketIsEmpty('b19')) {

                        if (checkIfBracketIsEmpty('b9') || checkIfTargetBracketHasOpponent('b9', 'b19'))
                            setPlayerInBracketAsWinner('b20', 'b9', 'b19');
                        else
                            removePlayerInBracketAsWinner('b19', 'b9', 'b20');
                    }
                }
                break;
            case 'b19':
                if (checkIfBracketIsEmpty('b4')) {
                    if (!checkIfBracketIsEmpty('b20')) {

                        if (checkIfBracketIsEmpty('b9') || checkIfTargetBracketHasOpponent('b9', 'b20'))
                            setPlayerInBracketAsWinner('b19', 'b9', 'b20');
                        else
                            removePlayerInBracketAsWinner('b20', 'b9', 'b19');
                    }
                }
                break;
            case 'b18':
                if (checkIfBracketIsEmpty('b3')) {
                    if (!checkIfBracketIsEmpty('b17')) {

                        if (checkIfBracketIsEmpty('b8') || checkIfTargetBracketHasOpponent('b8', 'b17'))
                            setPlayerInBracketAsWinner('b18', 'b8', 'b17');
                        else
                            removePlayerInBracketAsWinner('b17', 'b8', 'b18');
                    }
                }
                break;
            case 'b17':
                if (checkIfBracketIsEmpty('b3')) {
                    if (!checkIfBracketIsEmpty('b18')) {

                        if (checkIfBracketIsEmpty('b8') || checkIfTargetBracketHasOpponent('b8', 'b18'))
                            setPlayerInBracketAsWinner('b17', 'b8', 'b18');
                        else
                            removePlayerInBracketAsWinner('b18', 'b8', 'b17');
                    }
                }
                break;
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
                if (checkIfBracketIsEmpty('b0')) {
                    if (!checkIfBracketIsEmpty('b5')) {
                        if (checkIfBracketIsEmpty('b2') || checkIfTargetBracketHasOpponent('b2', 'b5'))
                            setPlayerInBracketAsWinner('b6', 'b2', 'b5');
                        else
                            removePlayerInBracketAsWinner('b6', 'b2', 'b5');
                    }
                }
                break;
            case 'b5':
                if (checkIfBracketIsEmpty('b0')) {
                    if (!checkIfBracketIsEmpty('b6')) {
                        if (checkIfBracketIsEmpty('b2') || checkIfTargetBracketHasOpponent('b2', 'b6'))
                            setPlayerInBracketAsWinner('b5', 'b2', 'b6');
                        else
                            removePlayerInBracketAsWinner('b5', 'b2', 'b6');
                    }
                }
                break;
            case 'b4':
                if (checkIfBracketIsEmpty('b0')) {
                    if (!checkIfBracketIsEmpty('b3')) {
                        if (checkIfBracketIsEmpty('b1') || checkIfTargetBracketHasOpponent('b1', 'b3'))
                            setPlayerInBracketAsWinner('b4', 'b1', 'b3');
                        else
                            removePlayerInBracketAsWinner('b4', 'b1', 'b3');
                    }
                }
                break;
            case 'b3':
                if (checkIfBracketIsEmpty('b0')) {
                    if (!checkIfBracketIsEmpty('b4')) {
                        if (checkIfBracketIsEmpty('b1') || checkIfTargetBracketHasOpponent('b1', 'b4'))
                            setPlayerInBracketAsWinner('b3', 'b1', 'b4');
                        else
                            removePlayerInBracketAsWinner('b3', 'b1', 'b4');
                    }
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
    let newBracketsJson = setWinnerInBracketsJson(fromBracketId, targetBracketId, opponentBracketId);
    console.log(opponentBracketId)
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

    // OBS OBS OBS OBS OBS OBS OBS OBSO OBS!!!!!
    if ($(fromBracketId).hasClass('winner'))
        bracketState = 'winner';


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

    // Set state(class) on brackets
    newBracketsJson.brackets[fromBracketIndex].bracketState = 'winner';
    newBracketsJson.brackets[opponentBracketIndex].bracketState = 'loser';

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
    newBracketsJson.brackets[index].bracketState = '';

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

function checkIfBracketLevelsAreLocked() {

    if (currentBracketsJson.brackets.length === 31) {

        let quartersLeftWinnersAndLosers = document.getElementById('quarters-left').querySelectorAll('.winner, .loser');
        let quartersRightWinnersAndLosers = document.getElementById('quarters-right').querySelectorAll('.winner, .loser');
        let semisLeftWinnersAndLosers = document.getElementById('semis-left').querySelectorAll('.winner, .loser');
        let semisRightWinnersAndLosers = document.getElementById('semis-right').querySelectorAll('.winner, .loser');
        let finalWinnerAndLoser = document.getElementById('final').querySelectorAll('.winner, .loser');

        if (quartersLeftWinnersAndLosers.length === 4)
            document.getElementById('eights-left').style.opacity = "0.3";
        else
            document.getElementById('eights-left').style.opacity = "1";

        if (quartersRightWinnersAndLosers.length === 4)
            document.getElementById('eights-right').style.opacity = "0.3";
        else
            document.getElementById('eights-right').style.opacity = "1";

        if (semisLeftWinnersAndLosers.length === 2)
            document.getElementById('quarters-left').style.opacity = "0.3";
        else
            document.getElementById('quarters-left').style.opacity = "1";

        if (semisRightWinnersAndLosers.length === 2)
            document.getElementById('quarters-right').style.opacity = "0.3";
        else
            document.getElementById('quarters-right').style.opacity = "1";

        if (finalWinnerAndLoser.length === 2) {
            document.getElementById('semis-left').style.opacity = "0.3";
            document.getElementById('semis-right').style.opacity = "0.3";
        }
        else {
            document.getElementById('semis-left').style.opacity = "1";
            document.getElementById('semis-right').style.opacity = "1";
        }
    }
    if (currentBracketsJson.brackets.length === 15) {

        let semisWinnersAndLosers = document.getElementById('semis').querySelectorAll('.winner, .loser');
        let finalWinnerAndLoser = document.getElementById('final').querySelectorAll('.winner, .loser');

        if (semisWinnersAndLosers.length === 4)
            document.getElementById('quarters').style.opacity = "0.3";
        else
            document.getElementById('quarters').style.opacity = "1";

        if (finalWinnerAndLoser.length === 2) {
            document.getElementById('semis').style.opacity = "0.3";
        }
        else {
            document.getElementById('semis').style.opacity = "1";
        }
    }
}