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
                        <td>Button</td>
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