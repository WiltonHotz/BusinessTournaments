let allThemes;

$('body').click(function () {
    closeNav();
});

$('#mySidenav').click(function (event) {
    event.stopPropagation(); // remove if you want menu gone after any click
});

function openHelpModal() {

    $("#helpModal").modal("show");
}

function openAboutModal() {

    $("#aboutModal").modal("show");
}
document.addEventListener("DOMContentLoaded", function (event) {
    LoadThemes();
    setTheme(currentTheme);
});

function LoadThemes() {
    var url = `/GetThemes`;

    $.ajax({
        url: url,
        type: "GET",
        success: function (response) {

            allThemes = response;
            PopulateMenu(allThemes);
        },
        error: function () {
            console.log("error");
        }
    });
}

function PopulateMenu(allThemes) {
    $(`#themes`).append(`<ul>`)
    for (var i = 0; i < allThemes.length; i++) {
        $(`#themes`).append(`
    <li>
             <a href="javascript:void updateTheme('${allThemes[i]}');" style="font-size: 20px;">${allThemes[i].toLowerCase()}</a>
</li>
`)
    }
    $(`#themes`).append(`</ul>`)

    $(`#logoutDiv`).css({ "position": "absolute", "bottom": "50px" });
}

function clearPlayerScores() {

    var r = confirm(`Are you sure you want to clear all player scores?`);
    if (r == true) {

        var url = `ClearPlayerScores`;

        $.ajax({
            url: url,
            type: "GET",
            success: function (response) {
                // needs more work!!
                $("#leaderboard").html("")
                var sortByScore = response.sort(compareValues("score"))
                PopulatePlayersOnLoad(sortByScore);
            },
            error: function () {
                console.log("error");
            }
        });
    }
}

function openNav() {
    event.stopPropagation();
    var sidebar = document.getElementById("mySidenav");
    sidebar.style.width = "250px";
    //sidebar.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}


//#region themes

function updateTheme(theme) {

    $.ajax({
        url: '/SetTheme',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(theme),
        success: function (newTheme) {
            setTheme(newTheme)
        },
        error: function () {
            console.log("error");
        }
    });
}

function setTheme(theme) {

    if (theme === 'default') {

            $("div").removeClass(currentTheme);
            $("body").removeClass(currentTheme);

    }
    else {
        $("div").removeClass(currentTheme);
        $("body").removeClass(currentTheme);

        $("div").addClass(theme);
        $("body").addClass(theme);
    }

    currentTheme = theme;

}

//#endregion