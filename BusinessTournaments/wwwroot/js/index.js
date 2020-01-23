let startTournamentInfo = {
    playerIds: [],
    tournamentName: '',
    tournamentId: ''
}
let tournamentNameInput = document.getElementById("tournamentNameInput");
let canAddMorePlayers = true;


document.addEventListener("DOMContentLoaded", function (event) {
    getIndexVMJSON()
});

function getIndexVMJSON() {

    var url = "GetIndexVM";
    $.ajax({
        url: url,
        type: "GET",
        success: function (response) {
            PopulatePlayersOnLoad(response.leaderboard);
            PopulateOngoingTournamentsOnLoad(response.ongoingTournaments)
            PopulateCompletedTournamentsOnLoad(response.completedTournaments)
        }
    });
}

function PopulatePlayersOnLoad(leaderboard) {

    for (var i = 0; i < leaderboard.length; i++) {
        let arrow = `<span class="select-button" id="sBtn${leaderboard[i].playerId}" onclick="selectPlayer('${leaderboard[i].playerId}','${leaderboard[i].playerName}')"><svg viewBox="0 0 10 16" width="20" height="35" version="1.1" class="octicon octicon-arrow-right"><path fill-rule="evenodd" d="M10 8L4 3v3H0v4h4v3z"/></svg>`;

        $("#leaderboard")
            .append(`<tr style="height: 38px" id='l${leaderboard[i].playerId}' class="leaderboard-row">
                        <td>${leaderboard[i].score}</td>
                        <td>${leaderboard[i].playerName}</td>
                        <td><span class="editIcon" id="editPlayer${i}" data-toggle="modal" data-target="#editPlayerModal" onclick="editPlayer('${leaderboard[i].playerName}','${leaderboard[i].playerId}')"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 14 16" fill="currentColor"><path fill-rule="evenodd" d="M0 12v3h3l8-8-3-3-8 8zm3 2H1v-2h1v1h1v1zm10.3-9.3L12 6 9 3l1.3-1.3a.996.996 0 0 1 1.41 0l1.59 1.59c.39.39.39 1.02 0 1.41z"/></svg></span></td>
                        <td style="width: 20px" id="selectarrowtd${leaderboard[i].playerId}">${arrow}</td>
                        </tr>`);
    }
}

function PopulateOngoingTournamentsOnLoad(tournaments) {
    for (var i = 0; i < tournaments.length; i++) {
        let deleteButton = `<span class="select-button" id="deleteBtn${tournaments[i].tournamentId}" onclick="deleteTournament('${tournaments[i].tournamentId}')"><svg class="octicon octicon-x" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"/></svg>`;
        $("#ongoing")
            .append(`<tr id='ot${tournaments[i].tournamentId}'>
                        <td style="width: 20px" id="deleteBtn${tournaments[i].tournamentId}">${deleteButton}</td>
                        <td onclick="showOngoingTournament('${tournaments[i].tournamentId}','${tournaments[i].tournamentName}')">${tournaments[i].tournamentName}</td>
                        <td>${ReturnDateFormat(tournaments[i].date)}</td>
                        </tr>`);
    }
}

function PopulateCompletedTournamentsOnLoad(tournaments) {

    for (var i = 0; i < tournaments.length; i++) {
        $("#completed")
            .append(`<tr id='ct${tournaments[i].tournamentId}'>
                        <td>${tournaments[i].tournamentName}</td>
                        <td>${ReturnDateFormat(tournaments[i].date)}</td>
                        </tr>`);
    }
}

function ReturnDateFormat(date) {
    return date.substring(0, 10) + " " + date.substring(11, 16)
}

function editPlayer(playerName, playerId) {
    console.log(playerName)
    $("#editPlayerName").val(playerName);
    console.log(editPlayerId)
    $("#editPlayerId").val(playerId);
}

function confirmEditPlayer() {
    $("#editPlayerId").val();

    var txt;
    var r = confirm(`Are you sure you want to change name to\n${$("#editPlayerName").val()}`);
    if (r == true) {
        txt = "You pressed OK!";
    } else {
        txt = "You pressed Cancel!";
    }
}

function confirmDeletePlayer() {
    $("#editPlayerId").val();
    console.log("after delete pressed " + $("#editPlayerId").val())
    var txt;
    var r = confirm(`Are you sure you want to delete player\n${$("#editPlayerName").val()}`);
    if (r == true) {
        txt = "You pressed OK!";
    } else {
        txt = "You pressed Cancel!";
    }
}

function addPlayers() {

    var inpIds = [];
    var names = [];
    var c = document.querySelectorAll("#modalPlayerNames > div");
    for (var i = 0; i < c.length; i++) {
        inpIds[i] = `pninp${i}`
        names[i] = $(`#${inpIds[i]}`).val()
    }

    $.ajax({
        url: 'AddPlayers',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(names),
        success: function (data) {
            console.log(data)
            PopulatePlayersOnLoad(data);
        },
        error: function (data) {
            console.log("error");
            console.log(data)
            var result = data.responseJSON
            console.log(result)
            let names = "";
            for (var i = 0; i < result.length; i++) {

                names += result[i].playerName + "\n";
            }
            alert(`Bad names:\n${names}[ALREADY IN THE DATABASE]`)
        }
    });
}

function addAddPlayerField(btn) {
    let id = btn.id;
    let numId = id.substring(5);
    let newId = parseInt(numId) + 1;

    $("#modalPlayerNames")
        .append(`<div id="pndiv${newId}">
                    <input type="text" id="pninp${newId}" placeholder="Enter player name here..." />
                    <input type="button" class="btn btn-default" aria-label="Add Another Player" value="+" id="pnbtn${newId}" onclick="addAddPlayerField(this)" />
                </div>`);

    document.getElementById(`${id}`).style.visibility = "hidden";
}

function selectPlayer(playerId, playerName) {

    if (canAddMorePlayers) {

        if (!startTournamentInfo.playerIds.some(x => x == playerId)) {
            startTournamentInfo.playerIds.push(playerId); // Add Player id to array

            $("#selected")
                .append(`<tr id='selected${playerId}'>
                       <td class="remove-button" id="rBtn${playerId}" onclick="removeSelectedPlayer('${playerId}', '${playerName}')"><svg viewBox="0 0 10 16" width="20" height="35" version="1.1" class="octicon octicon-arrow-left"><path fill-rule="evenodd" d="M6 3L0 8l6 5v-3h4V6H6z"/></svg></td>
                        <td style="text-align: left;">${playerName}</td>
                       
                        </tr>`);

            // Change background color and hide green arrow
            var selectedPlayerHtml = document.getElementById('l' + playerId);
            var selectArrow = document.getElementById(`sBtn${playerId}`);
            selectArrow.style.visibility = "hidden";
            selectedPlayerHtml.style.backgroundColor = "black"

            // Activate buttons
            if (startTournamentInfo.playerIds.length == 1) {
                $('#clearSelectedBtn').prop("class", "btn btn-danger btn-block");
                $('#clearSelectedBtn').prop("disabled", false);
            }
            if (startTournamentInfo.playerIds.length == 4) {
                $('#startTournament').prop("class", "btn btn-success btn-block");
                $('#startTournament').prop("disabled", false);
            }
        }
    }
}

function removeSelectedPlayer(playerId, playerName) {

    // Remove player from array
    startTournamentInfo.playerIds.splice(startTournamentInfo.playerIds.indexOf(playerId), 1);

    // HTML resetting
    document.getElementById('selected' + playerId).remove();
    var selectedPlayerHtml = document.getElementById('l' + playerId);
    selectedPlayerHtml.style.backgroundColor = "#239165";
    document.getElementById(`sBtn${playerId}`).style.visibility = "visible";

    // Disable create button if less than 4
    if (startTournamentInfo.playerIds.length == 3) {
        $('#startTournament').prop("class", "btn btn-secondary btn-block");
        $('#startTournament').prop("disabled", true);
    }
    if (startTournamentInfo.playerIds.length == 0) {
        $('#clearSelectedBtn').prop("disabled", true);
    }
}

function deleteTournament(tournamentId) {

    $.ajax({
        url: `deleteTournament/${tournamentId}`,
        type: 'POST',
        contentType: 'application/json',
        success: function (data) {
            console.log(data)
        },
        error: function () {
            console.log("error");
        }
    });
}

function startTournament() {

    startTournamentInfo.tournamentName = tournamentNameInput.value;
    console.log(startTournamentInfo);

    let jsonStr = JSON.stringify(startTournamentInfo)

    $.ajax({
        url: 'CreateTournament',
        type: 'POST',
        contentType: 'application/json',
        data: jsonStr,
        success: function (data) {
            console.log(data)
            window.location.href = `/brackets/${data}`
        },
        error: function () {
            console.log("error");
        }
    });
}

function showOngoingTournament(tournamentId, tournamentName) {

    clearSelected();

    var url = `GetOngoingTournament/${tournamentId}`;
    $.ajax({
        url: url,
        type: "GET",
        success: function (players) {
            console.log(players)
            populateSelectedWithPlayersInOngoingTour(players, tournamentId);
            fillTourNameInputWithOngoingTourName(tournamentName);
            hideAllArrows();
            changeStartTournamentButtonToResumeAndActivate();
            canAddMorePlayers = false;
        }
    });
}

function populateSelectedWithPlayersInOngoingTour(players, tournamentId) {

    document.getElementById("selected").innerHTML = ""; // Rensa selected-diven
    startTournamentInfo.playerIds = [];
    startTournamentInfo.tournamentId = tournamentId;

    for (var i = 0; i < players.length; i++) {

        $("#selected")
            .append(`<tr id='selected${players[i].playerId}' style="height: 38px">
                       <td class="remove-button" style="width: 20px"></td>
                        <td>${players[i].playerName}</td>
                        </tr>`);

        // Mark players in Leaderboard selected
        var selectedPlayerHtml = document.getElementById('l' + players[i].playerId);
        selectedPlayerHtml.style.backgroundColor = "black"
    }



}

function fillTourNameInputWithOngoingTourName(tournamentName) {

    let tournamentNameInput = document.getElementById("tournamentNameInput");
    tournamentNameInput.value = tournamentName;
    tournamentNameInput.disabled = true;
}

function changeStartTournamentButtonToResumeAndActivate() {

    $('#startTournament').prop("value", "RESUME TOURNAMENT")
    $('#startTournament').prop("class", "btn btn-success btn-block");
    $('#startTournament').prop("disabled", false);

    $('#clearSelectedBtn').prop("disabled", false);
}

function clearSelected() {
    document.getElementById("selected").innerHTML = ""; // Rensa selected-diven

    // Rensa infon för att starta turnering
    startTournamentInfo.playerIds = [];
    startTournamentInfo.tournamentId = "";
    startTournamentInfo.tournamentName = ""

    canAddMorePlayers = true;

    // Reset arrows to green and make all visible
    var arrows = document.getElementsByClassName("octicon-arrow-right");

    for (var i = 0; i < arrows.length; i++) {
        arrows[i].style.color = "";
        arrows[i].style.cursor = "pointer";
        arrows[i].style.visibility = "visible";
    }

    // Change background to normal
    var leaderboardRows = document.getElementsByClassName("leaderboard-row");
    for (var i = 0; i < leaderboardRows.length; i++) {
        leaderboardRows[i].style.backgroundColor = "#239165"
    }

    // Show all arrows
    var selectButtons = document.getElementsByClassName("select-button");
    for (var i = 0; i < selectButtons.length; i++) {
        selectButtons[i].style.visibility = "visible"
    }

    // Disable buttons and change text
    $('#startTournament').prop("value", "CREATE TOURNAMENT")
    $('#startTournament').prop("class", "btn btn-secondary btn-block");
    $('#startTournament').prop("disabled", true);

    $('#clearSelectedBtn').prop("disabled", true);

    // Clear tour name input and enable
    let tournamentNameInput = document.getElementById("tournamentNameInput");
    tournamentNameInput.value = "";
    tournamentNameInput.disabled = false;
}

function hideAllArrows() {
    var arrows = document.getElementsByClassName("octicon-arrow-right");

    for (var i = 0; i < arrows.length; i++) {
        arrows[i].style.visibility = "hidden";
    }
}