let currentTheme = 'default';

document.addEventListener("DOMContentLoaded", function (event) {
    console.log(currentTheme)
    setTheme(currentTheme);
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

function setTheme(theme) {
    console.log(theme)

        $("div").addClass(theme);
    $("body").addClass(theme);

    currentTheme = theme;

}

//#endregion