let currentBracketsJson;

//$(document).ready(function () {

//    $(".bracket-name").click(function (e) {
//        e.preventDefault();
//        console.log(this.id);
//        clickBracketAction(this.id)
//    });
//});

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
            $(".bracket").click(function (e) {
                e.preventDefault();
                //console.log(this.id)

                clickBracketAction(this.id)
            });

        },
        error: function () {
            console.log("error");
        }
    });
}

function populateBrackets(bracketsInfo) {

    for (var i = 0; i < bracketsInfo.brackets.length; i++) {

        // SPara bracketId lite mer läsbart i en variabel
        let bracketId = `#b${bracketsInfo.brackets[i].bracketId}`;

        // Skriv ut namnet om det finns något, annars tom <span>
        if (bracketsInfo.brackets[i].playerName != null) {
            $(bracketId).html(`<span class="bracket-name">${bracketsInfo.brackets[i].playerName}</span>`)
        }
        else {
            $(bracketId).html(`<span class="bracket-name"></span>`);
            $(bracketId).prop("class", "bracket-empty rounded")
        }
    }
}

function clickBracketAction(bracketId) {
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
            if (checkIfTargetBracketIsEmpty('b3') || checkIfTargetIsOpponent('b3', 'b7'))
                setPlayerInBracketAsWinner('b8', 'b3', 'b7');
            else
                removePlayerInBracketAsWinner('b8', 'b3', 'b7');
            break;
        case 'b7':
            if (checkIfTargetBracketIsEmpty('b3') || checkIfTargetIsOpponent('b3', 'b8'))
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

function checkIfTargetBracketIsEmpty(bracketId) {
    //console.log(bracketId)
    let bracket = document.getElementById(bracketId);

    if (bracket.innerHTML === `<span class="bracket-name"></span>`) {
        return true;
    }
    else {
        return false;
    }
}

function checkIfTargetIsOpponent(targetBracketId, opponentBracketId) {

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

    // Change classes (colors and other things css)
    $(`#${fromBracketId}`).prop("class", "bracket winner rounded");
    $(`#${targetBracketId}`).prop("class", "bracket rounded");
    $(`#${opponentBracketId}`).prop("class", "bracket loser rounded");

    // Copy name to next bracket
    document.getElementById(targetBracketId).innerHTML = document.getElementById(fromBracketId).innerHTML;
}

function removePlayerInBracketAsWinner(fromBracketId, targetBracketId, opponentBracketId) {

    // Change classes (colors and other things css)
    $(`#${fromBracketId}`).prop("class", "bracket rounded");
    $(`#${targetBracketId}`).prop("class", "bracket-empty rounded");
    $(`#${opponentBracketId}`).prop("class", "bracket rounded");

    // Copy name to next bracket
    document.getElementById(targetBracketId).innerHTML = `<span class="bracket-name"></span>`;
}


