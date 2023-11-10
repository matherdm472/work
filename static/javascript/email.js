document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("report-bug").addEventListener("click", function () {
        openEmail("Bug Report");
    });

    document.getElementById("give-feedback").addEventListener("click", function () {
        openEmail("Feedback");
    });

    function openEmail(subject) {
        var recipient = "your-email@example.com";
        var body = ""; // You can add a default message if needed

        window.location.href = "mailto:" + recipient + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    }
});