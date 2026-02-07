$(document).ready(function () {
    //search menu item
    $("#searchInput").on("keyup", function () {
        const value = $(this).val().toLowerCase();

        $(".menu-card").each(function () {
            $(this).toggle($(this).text().toLowerCase().includes(value));
        });
    });

    //filtering
    $(".menu-filter").click(function () {
        const filter = $(this).data("filter");
        if (filter === "all") {
            $(".menu-card").show();
        } else {
            $(".menu-card").each(function () {
                $(this).toggle($(this).data("category") === filter);
            });
        }
    });

});