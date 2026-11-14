const menuToggle = document.querySelector(".mobile-toggle");
const mainHeader = document.querySelector(".main_h");

menuToggle.addEventListener("click", function () {
    mainHeader.classList.toggle("open-nav");

    menuToggle.setAttribute(
        "aria-expanded",
        mainHeader.classList.contains("open-nav")
    );
});

const navLinks = document.querySelectorAll("nav a");

navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        mainHeader.classList.remove("open-nav");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

window.addEventListener("resize", function () {
    if (window.innerWidth > 766) {
        mainHeader.classList.remove("open-nav");
        menuToggle.setAttribute("aria-expanded", "false");
    }
});

window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
        mainHeader.classList.add("scrolled");
    } else {
        mainHeader.classList.remove("scrolled");
    }
});