
document.addEventListener("DOMContentLoaded", function (event) {
    getTournamentBracketJSON()
});

function getTournamentBracketJSON() {

    var url = "GetTournamentBracket";
    $.ajax({
        url: url,
        type: "GET",
        success: function (response) {
            console.log(response)
            
        }
    });
}