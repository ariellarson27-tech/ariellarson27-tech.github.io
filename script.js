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

// Book Reading Popup
const bookPopup = document.querySelector("#bookPopup");
const closeBook = document.querySelector(".close-book");
const pageContents = document.querySelectorAll(".page-content");
const sampleFolder = "samples/";
const pageNumbers = document.querySelectorAll(".page-number");
const previousPage = document.querySelector(".previous-page");
const nextPage = document.querySelector(".next-page");
let currentPage = 0;
let bookPages = [];
let currentMarkdown = "";

function paginateSample(markdown) {
    const html = marked.parse(markdown);

    const measurePage = document.createElement("div");
    measurePage.className = "page-content";

    measurePage.style.position = "absolute";
    measurePage.style.visibility = "hidden";
    measurePage.style.width = pageContents[0].clientWidth + "px";
    measurePage.style.height = pageContents[0].clientHeight + "px";

    document.body.appendChild(measurePage);

    const temporaryContent = document.createElement("div");
    temporaryContent.innerHTML = html;

    let pages = [];
    let currentContent = "";

    function savePage() {
        if (currentContent.trim()) {
            pages.push(currentContent);
        }
        currentContent = "";
        measurePage.innerHTML = "";
    }

    Array.from(temporaryContent.children).forEach(function (element) {
        // Try placing the entire element on the current page
        measurePage.innerHTML = currentContent;
        measurePage.appendChild(element.cloneNode(true));

        if (measurePage.scrollHeight <= measurePage.clientHeight) {
            currentContent = measurePage.innerHTML;
            return;
        }

        // If it doesn't fit, split paragraphs across pages
        if (element.tagName === "P") {
            const words = element.textContent.split(/\s+/);
            let paragraph = document.createElement("p");

            measurePage.innerHTML = currentContent;
            measurePage.appendChild(paragraph);

            words.forEach(function (word) {
                paragraph.textContent += (paragraph.textContent ? " " : "") + word;

                if (measurePage.scrollHeight > measurePage.clientHeight) {
                    paragraph.textContent = paragraph.textContent
                        .split(/\s+/)
                        .slice(0, -1)
                        .join(" ");

                    currentContent = measurePage.innerHTML;
                    savePage();

                    paragraph = document.createElement("p");
                    paragraph.textContent = word;
                    measurePage.appendChild(paragraph);
                }
            });

            currentContent = measurePage.innerHTML;
        } else {
            // Keep headings and other elements together
            savePage();
            currentContent = element.outerHTML;
        }
    });

    savePage();

    document.body.removeChild(measurePage);

    return pages;
}

function displaySpread() {
    pageContents[0].innerHTML = bookPages[currentPage] || "";
    pageContents[1].innerHTML = bookPages[currentPage + 1] || "";

    pageNumbers[0].textContent = currentPage + 1;
    pageNumbers[1].textContent = currentPage + 2;

    previousPage.disabled = currentPage === 0;
    nextPage.disabled = currentPage + 2 >= bookPages.length;
}

previousPage.addEventListener("click", function () {
    if (currentPage >= 2) {
        currentPage -= 2;
        displaySpread();
    }
});

nextPage.addEventListener("click", function () {
    if (currentPage + 2 < bookPages.length) {
        currentPage += 2;
        displaySpread();
    }
});


document.querySelectorAll(".book[data-sample]").forEach(function (book) {
    book.addEventListener("click", async function () {
        bookPopup.hidden = false;

        pageContents[0].textContent = "Opening book...";
        pageContents[1].innerHTML = "";

        const fileName = book.dataset.sample;
        const response = await fetch(sampleFolder + fileName);
        const markdown = await response.text();
        currentMarkdown = markdown;
        bookPages = paginateSample(currentMarkdown);
        currentPage = 0;
        displaySpread();
    });
});

closeBook.addEventListener("click", function () {
    bookPopup.hidden = true;
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !bookPopup.hidden) {
        bookPopup.hidden = true;
    }
});

// Recalculate pages when the browser is resized
window.addEventListener("resize", function () {
    if (!bookPopup.hidden && currentMarkdown) {
        const oldPage = currentPage;

        bookPages = paginateSample(currentMarkdown);

        currentPage = Math.min(
            Math.floor(oldPage / 2) * 2,
            Math.max(0, bookPages.length - 2)
        );

        displaySpread();
    }
});

// =============================
// Gallery Image Popup
// =============================

const galleryPopup = document.getElementById("gallery-popup");
const galleryLargeImage = document.getElementById("gallery-large-image");
const galleryLargeCaption = document.getElementById("gallery-large-caption");
const galleryClose = document.querySelector(".gallery-close");

const galleryPolaroids = document.querySelectorAll("#gallery .polaroid");

galleryPolaroids.forEach(function (polaroid) {
    polaroid.addEventListener("click", function () {

        const image = polaroid.querySelector(".polaroid-photo");

        galleryLargeImage.src = image.src;
        galleryLargeImage.alt = image.alt;
        galleryLargeCaption.textContent = polaroid.dataset.caption || "";

        galleryPopup.hidden = false;
    });
});

galleryClose.addEventListener("click", function () {
    galleryPopup.hidden = true;
});

galleryPopup.addEventListener("click", function (event) {
    if (event.target === galleryPopup) {
        galleryPopup.hidden = true;
    }
});

// Desk Notecard Interaction

const deskNotecard = document.getElementById("desk-notecard");
const notecardTitle = document.getElementById("notecard-title");
const notecardDescription = document.getElementById("notecard-description");
const notecardClose = document.getElementById("notecard-close");

const deskProjects = {
    cs: {
        title: "Cybersecurity & IT",
        description: "I'm starting to explore the world of cybersecurity and IT, with my sights set on earning my CompTIA Security+ certification. I'm curious to see where this path might take me, whether that's cybersecurity, IT support, or something I haven't discovered yet. There's a whole new corner of tech I'd love to explore!"
    },
    jrnl: {
        title: "Writing Journal",
        description: "I've finally got a full plot mapped out for my first novel, and I'm so excited to start putting it all together! I've spent so much time dreaming up this story, working through the details, and figuring out where I want it to go. Now I finally have a roadmap to follow, and my next goal is to turn all those ideas into a first draft."
    },
    wllnss: {
        title: "Health & Wellness",
        description: "I've been working on getting back into the habit of taking care of myself, both physically and mentally. Between work, family, and everything else life throws my way, it's easy to put myself on the back burner. I'm trying to change that. My goal is to build routines I can actually stick with, get stronger, and make a little more time for me. It's a process, but I'm working on it!"
    }
};

document.querySelectorAll(".desk-image").forEach(function (item) {
    item.addEventListener("click", function () {
        const projectKey = Object.keys(deskProjects).find(function (key) {
            return item.classList.contains(key);
        });

        if (!projectKey) return;

        notecardTitle.textContent = deskProjects[projectKey].title;
        notecardDescription.textContent = deskProjects[projectKey].description;
        deskNotecard.hidden = false;
    });
});

notecardClose.addEventListener("click", function () {
    deskNotecard.hidden = true;
});