let currentBracketsJson;
let isWaitingForResponse;

let emptyBracketHtml = '<span class="player-name"></span><span class="player-id"></span>';
let emptyBracketClasses = "bracket empty rounded";
let populatedBracketClasses = "bracket rounded";
let winnerBracketClasses = "bracket winner rounded";
let loserBracketClasses = "bracket loser rounded";

function getTournamentBracketJSON(bracketId) {

    var url = "b/" + bracketId;
    $.ajax({
        url: url,
        type: "GET",
        success: function (response) {
            // Save brackets Json for later
            currentBracketsJson = response;

            // Populate brackets with names (and classes if empty)
            populateBrackets(response);

            // Make add click events on brackets with names
            addClickListenersOnAllBrackets();

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

function populateBrackets(bracketsInfo) {

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
            case 'b14':
                console.log(bracketId);
                break;
            case 'b13':
                console.log(bracketId);
                break;
            case 'b12':
                console.log(bracketId);
                break;
            case 'b11':
                console.log(bracketId);
                break;
            case 'b10':
                console.log(bracketId);
                break;
            case 'b9':
                console.log(bracketId);
                break;
            case 'b8':
                if (checkIfTargetBracketIsEmpty('b3') || checkIfTargetBracketHasOpponent('b3', 'b7'))
                    setPlayerInBracketAsWinner('b8', 'b3', 'b7');
                else
                    removePlayerInBracketAsWinner('b8', 'b3', 'b7');
                break;
            case 'b7':
                if (checkIfTargetBracketIsEmpty('b3') || checkIfTargetBracketHasOpponent('b3', 'b8'))
                    setPlayerInBracketAsWinner('b7', 'b3', 'b8');
                else
                    removePlayerInBracketAsWinner('b7', 'b3', 'b8');
                break;
            case 'b6':
                console.log(bracketId);
                break;
            case 'b5':
                console.log(bracketId);
                break;
            case 'b4':
                console.log(bracketId);
                break;
            case 'b3':
                console.log(bracketId);
                break;
            case 'b2':
                console.log(bracketId);
                break;
            case 'b1':
                console.log(bracketId);
                break;
            case 'b0':
                console.log(bracketId);
                break;
            default:
        }

    }
}

function checkIfTargetBracketIsEmpty(bracketId) {

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
    updateCurrentBracketsJson(fromBracketId, targetBracketId);

    // Save changes on DB
    let success = saveChangesToDB();

    // If DB returns success
    if (success) {

        // Change classes (colors and other things css)
        $(`#${fromBracketId}`).prop("class", winnerBracketClasses);
        $(`#${targetBracketId}`).prop("class", populatedBracketClasses);
        $(`#${opponentBracketId}`).prop("class", loserBracketClasses);

        // Copy name to next bracket
        document.getElementById(targetBracketId).innerHTML = document.getElementById(fromBracketId).innerHTML;
    }

    // Set to false to be able to click again
    isWaitingForResponse = false;
}

function removePlayerInBracketAsWinner(fromBracketId, targetBracketId, opponentBracketId) {

    // Set to true to disable click on all brackets
    isWaitingForResponse = true;

    // Update json object
    updateCurrentBracketsJson(fromBracketId, targetBracketId);

    // Save changes on DB
    let success = saveChangesToDB();

    // If DB returns success
    if (success) {

        // Change classes (colors and other things css)
        $(`#${fromBracketId}`).prop("class", populatedBracketClasses);
        $(`#${targetBracketId}`).prop("class", emptyBracketClasses);
        $(`#${opponentBracketId}`).prop("class", populatedBracketClasses);

        // Empty target bracket
        document.getElementById(targetBracketId).innerHTML = emptyBracketHtml;
    }
}

function saveChangesToDB(fromBracketId, targetBracketId) {
    // TODO
    console.log("saveCHangesToDB function");
    return true;
}

function updateCurrentBracketsJson(fromBracketId, targetBracketId) {
    // TODO
    console.log("updateCurrentBracketsJson function");

}
