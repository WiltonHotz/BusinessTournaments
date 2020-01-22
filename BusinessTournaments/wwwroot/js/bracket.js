
document.addEventListener("DOMContentLoaded", function (event) {
    getTournamentBracketJSON(id)
});

function getTournamentBracketJSON(id) {

    var url = "brackets/GetBracketVM/"+id;
    $.ajax({
        url: url,
        type: "GET",
        success: function (response) {
            console.log(response)
            
        },
        error: function () {
            console.log("error");
        }
    });
}