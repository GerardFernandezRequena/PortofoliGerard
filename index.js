$(document).ready(() => {

    $("#singinbutton").click(() => {
        $("#signup").removeAttr("style");
        $("#signin").attr("style", "display:none;");
    });

    $("#singupbutton").click(() => {
        $("#signin").removeAttr("style");
        $("#signup").attr("style", "display:none;");
    });


});