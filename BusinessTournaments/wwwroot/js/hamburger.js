let allThemes;

document.addEventListener("DOMContentLoaded", function (event) {
    console.log("content loaded")
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
            //console.log(allThemes)
            PopulateMenu(allThemes);
        },
        error: function () {
            console.log("error");
        }
    });
}

function PopulateMenu(allThemes) {
    for (var i = 0; i < allThemes.length; i++) {
        $(`#themes`).append(`

             <a href="javascript:void updateTheme('${allThemes[i]}');">${allThemes[i].toUpperCase()}</a>
        `)
    }
}

function openNav() {
    var sidebar = document.getElementById("mySidenav");
    sidebar.style.width = "200px";
    //sidebar.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}


//#region themes

function updateTheme(theme) {

    console.log(theme)

    $.ajax({
        url: '/SetTheme',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(theme),
        success: function (newTheme) {
            console.log("success: " + newTheme)
            setTheme(newTheme)
        },
        error: function () {
            console.log("error");
        }
    });
}

function setTheme(theme) {
    console.log("setTheme: " + theme)

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