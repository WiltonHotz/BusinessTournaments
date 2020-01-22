﻿let newTournamentInfo = {
    playerIds: [],
    tournamentName: '',
    tournamentId: ''
}
let tournamentNameInput = document.getElementById("tournamentNameInput");


document.addEventListener("DOMContentLoaded", function (event) {
    getIndexVMJSON()
});

function getIndexVMJSON() {

    var url = "GetIndexVM";
    $.ajax({
        url: url,
        type: "GET",
        success: function (response) {
            console.log(response)
            PopulatePlayersOnLoad(response.leaderboard);
            PopulateOngoingTournamentsOnLoad(response.ongoingTournaments)
            PopulateCompletedTournamentsOnLoad(response.completedTournaments)
        }
    });
}

function PopulatePlayersOnLoad(leaderboard) {
    console.log(leaderboard)

    for (var i = 0; i < leaderboard.length; i++) {
        $("#leaderboard")
            .append(`<tr id='l${leaderboard[i].playerId}'>
                        <td>${leaderboard[i].score}</td>
                        <td>${leaderboard[i].playerName}</td>
                        <td class="btn btn-danger btn-sm" onclick="selectPlayer('${leaderboard[i].playerId}','${leaderboard[i].playerName}','${leaderboard[i].score}')">Add player</td>
                        </tr>`);
    }
}

function PopulateOngoingTournamentsOnLoad(tournaments) {
    console.log(tournaments)
    for (var i = 0; i < tournaments.length; i++) {
        $("#ongoing")
            .append(`<tr id='ot${tournaments[i].tournamentId}'>
                        <td>DelBtn</td>
                        <td>${tournaments[i].tournamentName}</td>
                        <td>${ReturnDateFormat(tournaments[i].date)}</td>
                        </tr>`);
    }
}

function PopulateCompletedTournamentsOnLoad(tournaments) {
    console.log(tournaments)
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

function addPlayer() {

    var name = $("#playerName").val()

    $.ajax({
        url: 'AddPlayer',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(name),
        success: function (data) {
            
        },
        error: function () {
            console.log("error");
        }
    });
}

function selectPlayer(playerId, playerName, score) {

    if (!newTournamentInfo.playerIds.some(x => x == playerId))
    {
        newTournamentInfo.playerIds.push(playerId); // Add Player id to array

        $("#selected")
            .append(`<tr id='selected${playerId}'>

                        <td onclick="removePlayer('${playerId}') "class="btn btn-success btn-sm">Remove</td>
                       
                        <td>${playerName}</td>
                       
                        </tr>`);
        var selectedPlayerHtml = document.getElementById('l' + playerId);
        selectedPlayerHtml.style.backgroundColor = "black"
    }
}

function removePlayer(playerId) {

    newTournamentInfo.playerIds.splice(newTournamentInfo.playerIds.indexOf(playerId), 1);


    document.getElementById('selected' + playerId).remove();
    var selectedPlayerHtml = document.getElementById('l' + playerId);
    selectedPlayerHtml.style.backgroundColor = "#239165"

}

function startTournament() {

    newTournamentInfo.tournamentName = tournamentNameInput.value;
    console.log(newTournamentInfo);

    let jsonStr = JSON.stringify(newTournamentInfo)

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