
function openNav() {
    var sidebar = document.getElementById("mySidenav");
    sidebar.style.width = "200px";
    //sidebar.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}


//#region themes

let currentTheme = 'default';

function setTheme(theme) {
    console.log(theme)
    $("div").removeClass(currentTheme);
    $("body").removeClass(currentTheme);

        $("div").addClass(theme);
    $("body").addClass(theme);

    currentTheme = theme;

}

//#endregion