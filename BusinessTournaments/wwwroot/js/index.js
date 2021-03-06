﻿//#region object variables

let startTournamentInfo = {
    playerIds: [],
    tournamentName: '',
    tournamentId: ''
}
let tournamentNameInput = document.getElementById("tournamentNameInput");
let canAddMorePlayers = true;
let playerIdToEdit;
let sortedByNamesDesc = true;
let sortedByScoreDesc = true;


//#endregion

//#region color variables

//let emptyBracketHtml = '<span class="player-name"></span><span class="player-id"></span>';
let tableContentColor = ".Gradient";
let leaderBoardClasses = "leaderboardContent";
let selectedClasses = "selectedClasses";
let ongoingClasses = "ongoingClasses";
let completedClasses = "completedClasses";

//#endregion

let octiconArrowRemove = `<svg viewBox="0 0 10 16" version="1.1" class="octicon octicon-arrow-remove"><path fill-rule="evenodd" d="M6 3L0 8l6 5v-3h4V6H6z"/></svg>`;
let octiconArrowSelect = `<svg viewBox="0 0 10 16" version="1.1" class="octicon octicon-arrow-select"><path fill-rule="evenodd" d="M10 8L4 3v3H0v4h4v3z"/></svg>`;
let octiconEditIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="octicon octicon-edit-icon" viewBox="0 0 14 16" fill="currentColor"><path fill-rule="evenodd" d="M0 12v3h3l8-8-3-3-8 8zm3 2H1v-2h1v1h1v1zm10.3-9.3L12 6 9 3l1.3-1.3a.996.996 0 0 1 1.41 0l1.59 1.59c.39.39.39 1.02 0 1.41z"/></svg>`;
let octiconX = `<svg class="octicon octicon-x" viewBox="0 0 12 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"/></svg>`;
let octiconArrowOngoing = `<svg viewBox="0 0 10 16" version="1.1" class="octicon octicon-arrow-ongoing"><path fill-rule="evenodd" d="M6 3L0 8l6 5v-3h4V6H6z"/></svg>`;
let octiconArrowCompleted = `<svg viewBox="0 0 10 16" version="1.1" class="octicon octicon-arrow-completed"><path fill-rule="evenodd" d="M6 3L0 8l6 5v-3h4V6H6z"/></svg>`;

let resumeButtonClasses = "btn btn-block resume-btn"

//#region scrolling
function tableFixHead(e) {
    const el = e.target,
        sT = el.scrollTop;
    el.querySelectorAll("thead th").forEach(th =>
        th.style.transform = `translateY(${sT}px)`
    );
}
//#endregion

//#region modals
$(document).ready(function () {
    $("#addPlayerModalBtn").click(function () {
        $("#addPlayerModal").modal("show");
    });
    $("#addPlayerModal").on('shown.bs.modal', function () {
        initiateAddPlayerModal()
        addAddPlayerFieldEnterButtonEventListener('pninp0')
    });
    $("#addPlayerModal").on("hidden.bs.modal", function () {
        $("#modalPlayerNames").html("");
    });
});
//#endregion

//#region Event listeners
document.addEventListener("DOMContentLoaded", function (event) {

    getIndexVMJSON()

});
document.querySelectorAll(".tableFixHead").forEach(el =>
    el.addEventListener("scroll", tableFixHead)
);
//#endregion

//#region populate Grid

function getIndexVMJSON() {

    var url = "GetIndexVM";
    $.ajax({
        url: url,
        type: "GET",
        success: function (response) {
            PopulatePlayersOnLoad(response.leaderboard);
            PopulateOngoingTournamentsOnLoad(response.ongoingTournaments)
            PopulateCompletedTournamentsOnLoad(response.completedTournaments)
            populateSelectedWithInstructions()
        }
    });
}

function PopulatePlayersOnLoad(leaderboard) {


    for (var i = 0; i < leaderboard.length; i++) {

        $("#leaderboard")
            .append(`<tr style="height: 38px;" id='l${leaderboard[i].playerId}' class="leaderboard-row">
                        <td class="edit-icon-td"><span class="editIcon" id="editPlayer${leaderboard[i].playerId}" data-toggle="modal" data-target="#editPlayerModal" onclick="editPlayer('lname${leaderboard[i].playerId}','${leaderboard[i].playerId}')">${octiconEditIcon}</span></td>
                        <td class="scoretd">${leaderboard[i].score}</td>
                        <td class="nametd" id="lname${leaderboard[i].playerId}">${leaderboard[i].playerName}</td>
                        ${canAddMorePlayers ? `<td style="width: 5px; text-align: right; padding-right: 15px;" id="selectarrowtd${leaderboard[i].playerId}"><span class="select-button" id="sBtn${leaderboard[i].playerId}" onclick="selectPlayer('${leaderboard[i].playerId}','${leaderboard[i].playerName}')">${octiconArrowSelect}</span></td>` : `<td style="width: 5px; text-align: right; visibility: hidden; padding-right: 15px;" id="selectarrowtd${leaderboard[i].playerId}">${octiconArrowSelect}</td>`}
                        </tr>`);
    }
}

function PopulateOngoingTournamentsOnLoad(tournaments) {
    for (var i = 0; i < tournaments.length; i++) {
        
        $("#ongoing")
            .append(`<tr id='ot${tournaments[i].tournamentId}'>
                        <td width="60% class="resumetour-button" id="restourBtn${tournaments[i].playerId}" onclick="showOngoingTournament('${tournaments[i].tournamentId}','${tournaments[i].tournamentName}')">${octiconArrowOngoing}&nbsp&nbsp&nbsp&nbsp${tournaments[i].tournamentName}</td>
                        <td>${ReturnDateFormat(tournaments[i].date)}</td>
                        <td style="width: 20px; padding-right: 20px;"><span class="delete-button" id="deleteBtn${tournaments[i].tournamentId}" onclick="confirmDeleteTournament('${tournaments[i].tournamentId}')">${octiconX}</span></td>
                        </tr>`);
    }
}

function PopulateCompletedTournamentsOnLoad(tournaments) {

    for (var i = 0; i < tournaments.length; i++) {
        $("#completed")
            .append(`<tr id='ct${tournaments[i].tournamentId}'>
                        <td width="60%" class="resumetour-button" id="completedBtn${tournaments[i].playerId}" onclick="selectPlayersFromCompletedTournament('${tournaments[i].tournamentId}','${tournaments[i].tournamentName}')">${octiconArrowCompleted}&nbsp&nbsp&nbsp&nbsp${tournaments[i].tournamentName}</td>
                        <td>${ReturnDateFormat(tournaments[i].date)}</td>
                        <td style="width: 20px; padding-right: 20px;"></td>
                        </tr>`);
    }
}

function populateSelectedWithInstructions() {
    if (document.getElementById("textInSelected") != null) {
        document.getElementById("textInSelected").innerHTML = "Use the arrows to add players to your tournament";
        document.getElementById("textInSelected").style = "color: darkgrey; opacity: 0.8; text-align: center; font-size: 14px; padding-top: 10%; border: none; padding-left: 20%; padding-right: 20%;"
    }
}

//}

//#endregion

//#region tiny little helpers
function ReturnDateFormat(date) {
    return date.substring(0, 10);
}

function focusField(field) {
    document.getElementById(field).focus();
}

function hideSelectPlayerArrows() {
    var arrows = document.getElementsByClassName("select-button");

    for (var i = 0; i < arrows.length; i++) {
        arrows[i].style.visibility = "hidden";
    }
}

function showSelectPlayerArrows() {

    // arrowid on players in leaderboard
    var arrowsInLeaderBoard = document.getElementsByClassName("select-button");

    // arrowid on selected players
    var arrowIdListSelectedPlayers = startTournamentInfo.playerIds.map(x => `sBtn${x}`)

    for (i = 0; i < arrowsInLeaderBoard.length; i++) {
       
        //check if the player from leaderboard is in selectedPlayers:
        if (!arrowIdListSelectedPlayers.some(x => x == arrowsInLeaderBoard[i].id)) {
            var arrow = document.getElementById(arrowsInLeaderBoard[i].id)
            arrow.style.visibility = "visible";
        }
    }
}
//#endregion

//#region add player modal

function initiateAddPlayerModal() {

    $("#modalPlayerNames")
        .append(`<div id="pndiv0" style="margin-bottom: -20px; padding: 0;">
                    <input type="text" id="pninp0" placeholder="Enter player name here..." />
                    <input type="button" style="color: lightgray; font-size: 30px; margin-bottom: 13px; padding: 0;" class="btn" aria-label="Add Another Player" value="+" id="pnbtn0" onclick="addAddPlayerField(this)" />
                    <span style="color: red; text-align: left;" id="badpninp0"></span>
                </div>`);

    focusField('pninp0')
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
            PopulatePlayersOnLoad(data);
            $('#addPlayerModal').modal('hide');
            $("#modalPlayerNames").html("");
        },
        error: function (data) {
            console.log("error");

            var result = data.responseJSON

            var duplicates = find_duplicate_in_array(names);

            if (result != null) {

                for (var i = 0; i < names.length; i++) {

                    if (result.some(x => x.playerName.toLowerCase() == names[i].toLowerCase())) {
                        $(`#badpninp${i}`).html('Name is already in list')
                    } else if (duplicates.length > 0) {

                        if (duplicates.some(x => x.toLowerCase() == names[i].toLowerCase())) {
                            $(`#badpninp${i}`).html('Please enter unique names')
                        }
                        if (names[i].length > 23) {
                            $(`#badpninp${i}`).html('Max 23 characters!')
                        }
                    } else if (names[i].length > 23) {
                        $(`#badpninp${i}`).html('Max 23 characters!')

                    } else {
                        $(`#badpninp${i}`).html('')
                    }

                }
            }
            else {
                for (var i = 0; i < names.length; i++) {

                    if (duplicates.some(x => x.toLowerCase() == names[i].toLowerCase())) {
                        $(`#badpninp${i}`).html('Please give unique names')
                    }
                    else if (names[i].length > 23) {
                        $(`#badpninp${i}`).html('Max 23 characters!')
                    }
                    else {
                        $(`#badpninp${i}`).html('')
                    }
                }
            }
        }
    });
}

function find_duplicate_in_array(array) {
    var object = {};
    var result = [];

    array.forEach(function (item) {
        if (!object[item])
            object[item] = 0;
        object[item] += 1;
    })

    for (var prop in object) {
        if (object[prop] >= 2) {
            result.push(prop);
        }
    }
    return result;
}

function addAddPlayerFieldEnterButtonEventListener(id) {

    let numId = id.substring(5);
    let btnId = `pnbtn${numId}`

    var input = document.getElementById(`${id}`);
    input.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById(`${btnId}`).click();
        }
    });
}

function addAddPlayerField(btn) {
    let id = btn.id;
    let numId = id.substring(5);
    let newId = parseInt(numId) + 1;

    $("#modalPlayerNames")
        .append(`<div id="pndiv${newId}" style="margin-bottom: -20px; padding: 0;">
                    <input type="text" id="pninp${newId}" placeholder="Enter player name here..." />
                    <input type="button" style="color: lightgray; font-size: 30px; margin-bottom: 13px; padding: 0;" class="btn" aria-label="Add Another Player" value="+" id="pnbtn${newId}" onclick="addAddPlayerField(this)" />
                    <span style="color: red; text-align: left;" id='badpninp${newId}'></span>

                </div>`);
    focusField(`pninp${newId}`)
    addAddPlayerFieldEnterButtonEventListener(`pninp${newId}`)

    document.getElementById(`${id}`).style.visibility = "hidden";
}

//#endregion

//#region edit / delete player modal

function editPlayer(playerNameId, playerId) {
    var playerName = $(`#${playerNameId}`).html()
    focusField(`editPlayerName`)
    $("#editPlayerName").val(playerName);
    playerIdToEdit = playerId;
}

function validateEditPlayerName() {
    var newName = $("#editPlayerName").val();
    var ok = true;

    var c = document.querySelectorAll(".nametd");
    for (var i = 0; i < c.length; i++) {
        if (newName === c[i].innerHTML) {
            ok = false;
        }
    }


    if (newName.length > 23) {
        alert("Name can't be more than 22 letters");
    }
    else if (!ok) {
        alert("Name is already in list");
    }
    else {
        confirmEditPlayer();
    }
}

function confirmEditPlayer() {
    var newName = $("#editPlayerName").val();
    var r = confirm(`Are you sure you want to change name to\n${$("#editPlayerName").val()}`);
    if (r == true) {

        $.ajax({
            url: `editPlayer/${playerIdToEdit}/${newName}`,
            type: 'POST',
            contentType: 'application/json',
            success: function (data) {

                $(`#lname${playerIdToEdit}`).html(data)

                $('#editPlayerModal').modal('hide');

                playerIdToEdit = 0;
            },
            error: function () {
                console.log("error");
            }
        });

    } else {

    }
}

function confirmDeletePlayer() {

    var r = confirm(`Are you sure you want to delete player\n${$("#editPlayerName").val()}`);
    if (r == true) {

        $.ajax({
            url: `deletePlayer/${playerIdToEdit}`,
            type: 'POST',
            contentType: 'application/json',
            success: function (data) {

                var c = document.querySelectorAll("#leaderboard > div");

                $(`#l${playerIdToEdit}`).remove();

                $('#editPlayerModal').modal('hide');

                playerIdToEdit = 0;
            },
            error: function () {
                console.log("error");
            }
        });


    } else {

    }
}

//#endregion

//#region selected (players)

function selectPlayer(playerId, playerName) {

    if (canAddMorePlayers) {

        if (!startTournamentInfo.playerIds.some(x => x == playerId)) {
            startTournamentInfo.playerIds.push(playerId); // Add Player id to array

            if (document.getElementById("textInSelected") != null) {

                document.getElementById("textInSelected").remove();
            }

            $("#selected")
                .append(`<tr id='selected${playerId}'>
                       <td style="text-align: left;" class="remove-button" id="rBtn${playerId}" onclick="removeSelectedPlayer('${playerId}', '${playerName}')">${octiconArrowRemove}&nbsp&nbsp&nbsp&nbsp${playerName}</td>
                        </tr>`);

            // Change background color and hide green arrow
            let selectedPlayerHtml = document.getElementById('l' + playerId);
            let selectArrow = document.getElementById(`sBtn${playerId}`);
            var unEditables = document.getElementById(`editPlayer${playerId}`)

            let tournamentNameInput = document.getElementById("tournamentNameInput");
            selectArrow.style.visibility = "hidden";
            selectedPlayerHtml.style.opacity = "0.2";
            unEditables.style.visibility = "hidden";


            // Activate CLEAR button
            if (startTournamentInfo.playerIds.length == 1) {
                $('#clearSelectedBtn').prop("class", "btn btn-danger btn-block");
                $('#clearSelectedBtn').prop("disabled", false);
            }

            // Set focus on tour name input
            if (startTournamentInfo.playerIds.length >= 4) {
                //tournamentNameInput.focus();

                if (tournamentNameInput.value.length > 1)
                    tournamentNameInput.style.backgroundColor = "#c1e8c9";
                else
                    tournamentNameInput.style.backgroundColor = "#f4f4b7";
            }

            // Activate CREATE TOURNAMENT button
            if (startTournamentInfo.playerIds.length >= 4 && tournamentNameInput.value.length > 1) {
                $('#startTournament').prop("class", "btn btn-block");
                $('#startTournament').prop("disabled", false);
            }

            if (startTournamentInfo.playerIds.length >= 16) {
                hideSelectPlayerArrows();
                canAddMorePlayers = false;
            }

            updateSelectedPlayerCounter()
            //selectPlayerAudio()
        }
    }
}

function removeSelectedPlayer(playerId) {

    // Remove player from array
    startTournamentInfo.playerIds.splice(startTournamentInfo.playerIds.indexOf(playerId), 1);

    // HTML resetting
    document.getElementById('selected' + playerId).remove();

    let selectedPlayerHtml = document.getElementById('l' + playerId);
    selectedPlayerHtml.style.opacity = "1";

    let tournamentNameInput = document.getElementById("tournamentNameInput");
    document.getElementById(`sBtn${playerId}`).style.visibility = "visible";

    // Make edit button visible
    document.getElementById(`editPlayer${playerId}`).style.visibility = "visible";

    // Disable create button if less than 4
    if (startTournamentInfo.playerIds.length == 3) {
        $('#startTournament').prop("class", "btn btn-secondary btn-block");
        $('#startTournament').prop("disabled", true);
        tournamentNameInput.style.backgroundColor = "white";
    }
    if (startTournamentInfo.playerIds.length == 0) {
        $('#clearSelectedBtn').prop("disabled", true);
    }

    //show arrows
    if (startTournamentInfo.playerIds.length <= 16) {
        showSelectPlayerArrows();

    }
    if (startTournamentInfo.playerIds.length < 16) {
        canAddMorePlayers = true;

    }
    updateSelectedPlayerCounter()
    //removePlayerAudio()
}

function updateSelectedPlayerCounter(players) {

    // players is used in populateSelectedWithPlayersInOngoingTour() because it doesnt populate startTournamentInfo.playerIds
    if (players == null) {
        if (startTournamentInfo.playerIds.length > 0 && startTournamentInfo.playerIds.length < 4) {
            $(`#playerCounter`).html(`${startTournamentInfo.playerIds.length}`)
            $(`#playerCounter`).css("color", "#ff5d5d");
           


        }   else if (startTournamentInfo.playerIds.length > 3 && startTournamentInfo.playerIds.length < 16) {
            $(`#playerCounter`).html(`${startTournamentInfo.playerIds.length}`)
            $(`#playerCounter`).css("color", "white")
          


        } else if (startTournamentInfo.playerIds.length === 16) {
            $(`#playerCounter`).html(`${startTournamentInfo.playerIds.length}`)
            $(`#playerCounter`).css("color", "#ff5d5d")



        } else {
            $(`#playerCounter`).html(`0`)
        }
    } else {
        if (players.length > 0 && players.length < 4) {
            $(`#playerCounter`).html(`${players.length}`)
            $(`#playerCounter`).css("color", "#ff5d5d")
       

        }
         else if (players.length > 3 && players.length < 16) {
            $(`#playerCounter`).html(`${players.length}`)
            $(`#playerCounter`).css("color", "white")

        } else if (players.length === 16) {
            $(`#playerCounter`).html(`${players.length}`)
            $(`#playerCounter`).css("color", "#ff5d5d")

        } else {
            $(`#playerCounter`).html(`0`)


        }
    }
}

function sortByScore() {
    var url = "GetIndexVM";
    $.ajax({
        url: url,
        type: "GET",
        success: function (response) {

            if (canAddMorePlayers && startTournamentInfo.playerIds.length === 0) {

                $("#leaderboard").html("")

                if (sortedByScoreDesc) {
                    var sortByScore = response.leaderboard.sort(compareValues("score"))
                    PopulatePlayersOnLoad(sortByScore);
                    sortedByScoreDesc = false;
                    $('#score-pointer').html('&#9652;');
                    $('#score-pointer').css('visibility', 'visible')
                    $('#players-pointer').css('visibility', 'hidden')
                } else {
                    var sortByScore = response.leaderboard.sort(compareValues("score", "desc"))
                    PopulatePlayersOnLoad(sortByScore);
                    sortedByScoreDesc = true;
                    $('#score-pointer').html('&#9662;');
                    $('#score-pointer').css('visibility', 'visible')
                    $('#players-pointer').css('visibility', 'hidden')
                }

            }
        }
    });
}
function sortByName() {
    var url = "GetIndexVM";
    $.ajax({
        url: url,
        type: "GET",
        success: function (response) {

            if (canAddMorePlayers && startTournamentInfo.playerIds.length === 0) {
                $("#leaderboard").html("")
                if (sortedByNamesDesc) {
                    var sortOnName = response.leaderboard.sort(compareValues("playerName"))
                    PopulatePlayersOnLoad(sortOnName);
                    sortedByNamesDesc = false;
                    //$('#score-pointer').html('');
                    $('#players-pointer').html('&#9652;');
                    $('#players-pointer').css('visibility', 'visible')
                    $('#score-pointer').css('visibility', 'hidden')

                } else {
                    var sortOnName = response.leaderboard.sort(compareValues("playerName", "desc"))
                    PopulatePlayersOnLoad(sortOnName);
                    sortedByNamesDesc = true;
                    $('#players-pointer').html('&#9662;');
                    $('#players-pointer').css('visibility', 'visible')
                    $('#score-pointer').css('visibility', 'hidden')
                }

            }
        }
    });
}
function compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            return 0;
        }

        const varA = (typeof a[key] === 'string')
            ? a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string')
            ? b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return (
            (order === 'desc') ? (comparison * -1) : comparison
        );
    };
}
//#endregion

//#region selected (ongoing)

function showOngoingTournament(tournamentId, tournamentName) {

    clearSelected();

    var url = `GetOngoingTournament/${tournamentId}`;
    $.ajax({
        url: url,
        type: "GET",
        success: function (players) {
            populateSelectedWithPlayersInOngoingTour(players, tournamentId);
            fillTourNameInputWithOngoingTourName(tournamentName);
            hideSelectPlayerArrows();
            changeStartTournamentButtonToResumeAndActivate();
            canAddMorePlayers = false;
            hideDeleteButton(tournamentId);
            makeSelectedOngoingBold(tournamentId)
           
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
                       <td style="text-align: left;" class="remove-button" style="width: 20px">&nbsp&nbsp${players[i].playerName}</td>
                        </tr>`);

        // Mark players in Leaderboard selected
        var selectedPlayerHtml = document.getElementById('l' + players[i].playerId);
        var unEditables = document.getElementById(`editPlayer${players[i].playerId}`)
        selectedPlayerHtml.style.opacity = "0.2"
        unEditables.style.visibility = "hidden";
    }
    updateSelectedPlayerCounter(players)
    //clickOngoingAudio()
}

function fillTourNameInputWithOngoingTourName(tournamentName) {

    let tournamentNameInput = document.getElementById("tournamentNameInput");
    tournamentNameInput.value = tournamentName;
    tournamentNameInput.disabled = true;
    tournamentNameInput.style.backgroundColor = "lightgray";
}

function makeSelectedOngoingBold(tournamentId) {
    //Get all tournament tr
    var c = document.querySelectorAll("#ongoing > tr");

    //Set all to normal
    for (i = 0; i < c.length; i++) {
        c[i].style = "font-weight: normal;"
    }
    //Set clicked ongoing to bold
    document.getElementById(`ot${tournamentId}`).style = "font-weight:bold;";
}

//#endregion

//#region selected (completed)

function selectPlayersFromCompletedTournament(tournamentId) {

    clearSelected();

    var url = `GetOngoingTournament/${tournamentId}`;
    $.ajax({
        url: url,
        type: "GET",
        success: function (players) {
            populateSelectedWithPlayersFromCompletedTournament(players);

            //  hideAllArrows();

            canAddMorePlayers = true;
        }
    });
}

function populateSelectedWithPlayersFromCompletedTournament(players) {

    clearSelected();

    for (i = 0; i < players.length; i++) {

        selectPlayer(`${players[i].playerId}`, players[i].playerName)
    }
    updateSelectedPlayerCounter()
    //clickCompletedAudio()
}

//#endregion

//#region tournament name input field
function checkIfTournamentNameIsValidInput(input) {

    let tournamentNameInput = document.getElementById("tournamentNameInput");

    if (input.value.length > 1 && startTournamentInfo.playerIds.length >= 4) {
        $('#startTournament').prop("class", "btn btn-block");
        $('#startTournament').prop("disabled", false);
        //$('#tournamentNameInput').css("background-color", "lightgreen");
        tournamentNameInput.style.backgroundColor = "#c1e8c9";
    }
    else if (input.value.length < 2) {
        $('#startTournament').prop("class", "btn btn-secondary btn-block");
        $('#startTournament').prop("disabled", true);
        //$('#tournamentNameInput').css("background-color", "#ffff8e");
        tournamentNameInput.style.backgroundColor = "#f4f4b7"
    }

    if (input.value.length == 0 && startTournamentInfo.playerIds.length < 4) {
        $('#startTournament').prop("class", "btn btn-block");
        $('#startTournament').prop("disabled", false);
        //$('#tournamentNameInput').css("background-color", "lightgreen");
        tournamentNameInput.style.backgroundColor = "white";
    }
}
//#endregion

//#region ongoing tournaments
function deleteTournament(tournamentId) {

    $.ajax({
        url: `deleteTournament/${tournamentId}`,
        type: 'POST',
        contentType: 'application/json',
        success: function (data) {
            deleteSelectedTournament(data);
        },
        error: function () {
            console.log("error");
        }
    });
}

function confirmDeleteTournament(tournamentId) {
    var txt;
    var r = confirm(`Are you sure you want to delete this tournament?`);
    if (r == true) {
        txt = "You pressed OK!";

        deleteTournament(tournamentId);

    } else {
        txt = "You pressed Cancel!";
    }
}

function deleteSelectedTournament(tournamentId) {

    document.getElementById('ot' + tournamentId).remove();
}

function hideDeleteButton(tournamentId) {

    document.getElementById(`deleteBtn${tournamentId}`).style.visibility = 'hidden';
}

//#endregion

//#region start tournament button

function startTournament() {

    startTournamentInfo.tournamentName = tournamentNameInput.value;

    let jsonStr = JSON.stringify(startTournamentInfo)

    $.ajax({
        url: 'CreateTournament',
        type: 'POST',
        contentType: 'application/json',
        data: jsonStr,
        success: function (data) {

            //startTourAudio()
            getIndexVMJSON();
            window.location.href = `/brackets/${data}`
        },
        error: function () {
            console.log("error");
        }
    });
    tournamentNameInput.value = "";
}

function changeStartTournamentButtonToResumeAndActivate() {

    $('#startTournament').prop("value", "RESUME")
    $('#startTournament').prop("class", resumeButtonClasses);
    $('#startTournament').prop("disabled", false);

    $('#clearSelectedBtn').prop("disabled", false);
}

//#endregion

//#region clear button

function clearSelected() {
    document.getElementById("selected").innerHTML = ""; // Rensa selected-diven

    // Rensa infon för att starta turnering
    startTournamentInfo.playerIds = [];
    startTournamentInfo.tournamentId = "";
    startTournamentInfo.tournamentName = ""
    updateSelectedPlayerCounter()
 
    canAddMorePlayers = true;

    // Reset arrows to green
    var arrows = document.getElementsByClassName("octicon-arrow-select");

    var editIcons = document.getElementsByClassName('editIcon')

 

    for (var i = 0; i < arrows.length; i++) {
        // edit icon added
        editIcons[i].style.visibility = "visible";

        arrows[i].style.color = "";
        arrows[i].style.cursor = "pointer";
    }

    // Change background to normal
    var leaderboardRows = document.getElementsByClassName("leaderboard-row");
    for (var i = 0; i < leaderboardRows.length; i++) {
        leaderboardRows[i].style.opacity = "1"
    }

    // Show all arrows
    var selectButtons = document.getElementsByClassName("select-button");
    for (var i = 0; i < selectButtons.length; i++) {
        selectButtons[i].style.visibility = "visible"
    }

    // Show all deletebuttons

    var deleteButtons = document.getElementsByClassName("delete-button");
    for (var i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].style.visibility = "visible"
    }
    // Disable buttons and change text
    $('#startTournament').prop("value", "CREATE")
    $('#startTournament').prop("class", "btn btn-secondary btn-block");
    $('#startTournament').prop("disabled", true);

    $('#clearSelectedBtn').prop("disabled", true);

    // Clear tour name input and enable
    let tournamentNameInput = document.getElementById("tournamentNameInput");
    tournamentNameInput.value = "";
    tournamentNameInput.disabled = false;
    tournamentNameInput.style.backgroundColor = "white";

    //Get all tournament tr
    var allOngoingTours = document.querySelectorAll("#ongoing > tr");

    //Set all to normal
    for (i = 0; i < allOngoingTours.length; i++) {
        allOngoingTours[i].style = "font-weight: normal;"
    }
}

//#endregion

//#region Making Burgers

$(document).ready(function () {
    $('#nav-icon').click(function () {
        $(this).toggleClass('open');
    });
});

function burgerStuff() {
    var x = document.getElementById("myDIV");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}
//#endregion

//#region sounds
//function selectPlayerAudio() {
//    document.getElementById('selectPlayerAudio').play();
//    console.log("audio")
//}

//function removePlayerAudio() {
//    document.getElementById('removePlayerAudio').play();
//    console.log("audio")

//}

//function clickOngoingAudio() {
//    document.getElementById('clickOngoingAudio').play();
//    console.log("audio")

//}
//function clickCompletedAudio() {
//    document.getElementById('clickCompletedAudio').play();
//    console.log("audio")

//}
//function startTourAudio() {
//    document.getElementById('startTourAudio').play();
//    console.log("audio")

//}
//#endregion
