document.addEventListener("DOMContentLoaded", function (event) {
    setTheme(currentTheme)
});


function openNav() {
    var sidebar = document.getElementById("mySidenav");
    sidebar.style.width = "200px";
    //sidebar.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}


//#region themes
let currentTheme = document.cookie;

function setTheme(theme) {
    console.log(theme)
    document.cookie = theme;

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