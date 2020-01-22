let newTournamentInfo = {
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

function addPlayers() {

    var inpIds = [];
    var names = [];
    var c = document.querySelectorAll("#modalPlayerNames > div");
    console.log(c);
    for (var i = 0; i < c.length; i++) {
        inpIds[i] = `pninp${i}`
        names[i] = $(`#${inpIds[i]}`).val()
    }
    console.log(inpIds)
    console.log(names)

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
            alert(`${names} was already in the database`)
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

function selectPlayer(playerId, playerName, score) {

    newTournamentInfo.playerIds.push(playerId); // Add Player id to array

    $("#selected")
        .append(`<tr id='selected${playerId}'>

                        <td onclick="removePlayer('${playerId}') "class="btn btn-success btn-sm">Remove</td>
                       
                        <td>${playerName}</td>
                       
                        </tr>`);
}

function removePlayer(playerId) {

    newTournamentInfo.playerIds.splice(newTournamentInfo.playerIds.indexOf(playerId), 1);

    document.getElementById('selected' + playerId).remove();

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