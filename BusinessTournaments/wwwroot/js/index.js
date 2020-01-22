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
        let arrow = `<span class="select-button" id="sBtn${leaderboard[i].playerId}" onclick="selectPlayer('${leaderboard[i].playerId}','${leaderboard[i].playerName}')"><svg viewBox="0 0 10 16" width="20" height="35" version="1.1" class="octicon octicon-arrow-right"><path fill-rule="evenodd" d="M10 8L4 3v3H0v4h4v3z"/></svg>`;

        $("#leaderboard")
            .append(`<tr style="height: 38px" id='l${leaderboard[i].playerId}'>
                        <td>${leaderboard[i].score}</td>
                        <td>${leaderboard[i].playerName}</td>
                        <td style="width: 20px" id="selectarrowtd${leaderboard[i].playerId}">${arrow}</td>
                        </tr>`);
    }
}

function PopulateOngoingTournamentsOnLoad(tournaments) {
    console.log(tournaments)
    for (var i = 0; i < tournaments.length; i++) {
        $("#ongoing")
            .append(`<tr onclick="showOngoingTournament('ot${tournaments[i].tournamentId}','${tournaments[i].tournamentName}')" id='ot${tournaments[i].tournamentId}'>
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

function selectPlayer(playerId, playerName, score) {

    if (!newTournamentInfo.playerIds.some(x => x == playerId))
    {
        newTournamentInfo.playerIds.push(playerId); // Add Player id to array

        $("#selected")
            .append(`<tr id='selected${playerId}'>
                       <td class="remove-button" id="rBtn${playerId}" onclick="removePlayer('${playerId}', '${playerName}')"><svg viewBox="0 0 10 16" width="20" height="35" version="1.1" class="octicon octicon-arrow-left"><path fill-rule="evenodd" d="M6 3L0 8l6 5v-3h4V6H6z"/></svg></td>
                        <td>${playerName}</td>
                       
                        </tr>`);

        var selectedPlayerHtml = document.getElementById('l' + playerId);
        var selectArrow = document.getElementById(`sBtn${playerId}`);
        selectArrow.remove();
        selectedPlayerHtml.style.backgroundColor = "black"
    }
}

function removePlayer(playerId, playerName) {

    newTournamentInfo.playerIds.splice(newTournamentInfo.playerIds.indexOf(playerId), 1);


    document.getElementById('selected' + playerId).remove();
    var selectedPlayerHtml = document.getElementById('l' + playerId);
    selectedPlayerHtml.style.backgroundColor = "#239165";
    document.getElementById(`selectarrowtd${playerId}`).innerHTML = `<span class="select-button" id="sBtn${playerId}" onclick="selectPlayer('${playerId}','${playerName}')"><svg viewBox="0 0 10 16" width="20" height="35" version="1.1" class="octicon octicon-arrow-right"><path fill-rule="evenodd" d="M10 8L4 3v3H0v4h4v3z"/></svg>`;
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

function showOngoingTournament(tournamentId, tournamentName) {

    var url = "GetOngoingTournament";
    $.ajax({
        url: url,
        type: "GET",
        success: function (response) {
            console.log(response)
           
        }
    });
}