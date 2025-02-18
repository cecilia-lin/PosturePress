document.addEventListener("scroll", function () {
    let titleScreen = document.querySelector(".title-screen");
    let scrollPosition = window.scrollY;
  
    // When the user scrolls past 100px, hide the title screen
    if (scrollPosition > 10) {
        titleScreen.classList.add("hide-title");
    } else {
        titleScreen.classList.remove("hide-title");
    }
});


document.querySelectorAll(".input-container").forEach((container, index) => {
    container.addEventListener("click", function () {
        let hints = document.querySelectorAll(".hint p");
        if (hints[index]) {
            hints[index].classList.add("no-blink");
        }
    });
});
