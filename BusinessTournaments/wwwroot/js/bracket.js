//let bracketsInfo;




function getTournamentBracketJSON(bracketId) {

    var url = "b/" + bracketId;
    $.ajax({
        url: url,
        type: "GET",
        success: function (response) {

            populateBrackets(response);
            //window.location.href = `/brackets/b/${bracketId}`
        },
        error: function () {
            console.log("error");
        }
    });
}

function populateBrackets(bracketsInfo) {

    for (var i = 0; i < bracketsInfo.brackets.length; i++) {
        console.log(bracketsInfo.brackets[i])
        $(`#b${bracketsInfo.brackets[i].bracketId}`).html(`${bracketsInfo.brackets[i].playerName}`)
    }
}