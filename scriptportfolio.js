
/*min logo nav*/
const menuToggle = document.querySelector("#menuToggle");
const navMenu = document.querySelector("#navMenu");

function closeMenu() {
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Åbn menu");
    navMenu.setAttribute("aria-hidden", "true");
}

menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Luk menu" : "Åbn menu"
    );
    navMenu.setAttribute("aria-hidden", String(!isOpen));
});

navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeMenu();
    }
});




const semesterDropdown = document.querySelector("#semesterDropdown");

if (semesterDropdown) {
    const toggle = document.querySelector("#semesterToggle");
    const options = document.querySelector("#semesterOptions");
    const selectedText = document.querySelector("#semesterSelected");
    const optionButtons = options.querySelectorAll("[data-value]");

    function closeSemesterDropdown() {
        semesterDropdown.classList.remove("open");
        options.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
    }

    function openSemesterDropdown() {
        semesterDropdown.classList.add("open");
        options.hidden = false;
        toggle.setAttribute("aria-expanded", "true");
    }

    toggle.addEventListener("click", () => {
        if (options.hidden) {
            openSemesterDropdown();
        } else {
            closeSemesterDropdown();
        }
    });

    optionButtons.forEach(button => {
        button.addEventListener("click", () => {
            const semester = button.dataset.value;

            selectedText.textContent =
                semester === "all"
                    ? "All semesters"
                    : button.textContent.trim();

            optionButtons.forEach(option => {
                option.setAttribute(
                    "aria-selected",
                    String(option === button)
                );
            });

            closeSemesterDropdown();

            // Filtrer projekterne
            const projects = document.querySelectorAll(
                '[data-project-group="school"] .semester-project'
            );

            projects.forEach(project => {
                project.hidden =
                    semester !== "all" &&
                    project.dataset.semester !== semester;
            });

            // Scroll til det valgte semesters første projekt
            if (semester !== "all") {
                const firstProject = document.querySelector(
                    `[data-project-group="school"] .semester-project[data-semester="${semester}"]`
                );

                if (firstProject) {
                    firstProject.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }
        });
    });

    // Luk ved klik udenfor
    document.addEventListener("click", event => {
        if (!semesterDropdown.contains(event.target)) {
            closeSemesterDropdown();
        }
    });

    // Luk med Escape
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !options.hidden) {
            closeSemesterDropdown();
            toggle.focus();
        }
    });
}




const projectObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");

                // Animate only once
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    }
);

document.querySelectorAll(".project.reveal").forEach(
    (project, index) => {
        project.style.setProperty(
            "--reveal-delay",
            `${(index % 2) * 120}ms`
        );

        projectObserver.observe(project);
    }
);

const projectSwitches = document.querySelectorAll(".project-switch");
const projectGroups = document.querySelectorAll(".project-group");

let activeCategory = "school";
let switchTimeout;

function switchProjectCategory(category) {
    if (category === activeCategory) return;

    const nextGroup = document.querySelector(
        `[data-project-group="${category}"]`
    );

    const currentGroup = document.querySelector(
        `[data-project-group="${activeCategory}"]`
    );

    if (!nextGroup || !currentGroup) return;

    activeCategory = category;

    projectSwitches.forEach((button) => {
        const isActive = button.dataset.category === category;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    clearTimeout(switchTimeout);

    currentGroup.classList.add("switching-out");

    switchTimeout = setTimeout(() => {
        currentGroup.hidden = true;
        currentGroup.classList.remove("switching-out");

        nextGroup.hidden = false;

        // Restart reveal animations for the newly shown projects
        nextGroup.querySelectorAll(".project.reveal").forEach(
            (project, index) => {
                project.classList.remove("is-visible");

                project.style.setProperty(
                    "--reveal-delay",
                    `${(index % 2) * 120}ms`
                );

                projectObserver.observe(project);
            }
        );
    }, 250);
}

projectSwitches.forEach((button) => {
    button.addEventListener("click", () => {
        switchProjectCategory(button.dataset.category);
    });
});


/* LIGHTBOX - separate billeder pr. kategori */

const lightbox = document.getElementById("projectLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxCounter = document.getElementById("lightboxCounter");

const closeButton = document.querySelector(".lightbox-close");
const prevButton = document.querySelector(".lightbox-prev");
const nextButton = document.querySelector(".lightbox-next");

// Billederne i den kategori, der aktuelt er åbnet
let activeLightboxImages = [];
let currentImageIndex = 0;
let lastFocusedElement = null;


// Vis et billede fra den aktive kategori
function showImage(index) {
    if (activeLightboxImages.length === 0) return;

    currentImageIndex =
        (index + activeLightboxImages.length) %
        activeLightboxImages.length;

    const selectedImage = activeLightboxImages[currentImageIndex];

    lightboxImage.src = selectedImage.src;
    lightboxImage.alt = selectedImage.alt;
    lightboxCaption.textContent = selectedImage.alt;

    lightboxCounter.textContent =
        `${currentImageIndex + 1} / ${activeLightboxImages.length}`;
}


// Åbn lightbox med billeder fra det valgte projekt
function openLightbox(image, categoryGroup) {
    // Find kun billeder fra den kategori, billedet tilhører
    activeLightboxImages = [
        ...categoryGroup.querySelectorAll(".project-image img")
    ];

    currentImageIndex = activeLightboxImages.indexOf(image);

    if (currentImageIndex === -1) return;

    lastFocusedElement = document.activeElement;

    showImage(currentImageIndex);

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
    closeButton.focus();
}


// Luk lightbox
function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}


// Klik på billederne
document.querySelectorAll(".project-image img").forEach((image) => {
    image.addEventListener("click", () => {
        const categoryGroup = image.closest(".project-group");

        if (!categoryGroup) return;

        openLightbox(image, categoryGroup);
    });
});


// Forrige billede - kun i den aktive kategori
prevButton.addEventListener("click", () => {
    showImage(currentImageIndex - 1);
});


// Næste billede - kun i den aktive kategori
nextButton.addEventListener("click", () => {
    showImage(currentImageIndex + 1);
});


// Luk-knap
closeButton.addEventListener("click", closeLightbox);


// Luk ved klik på den mørke baggrund
lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});


// Tastaturstyring
document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;

    if (event.key === "Escape") {
        stopLightboxVideo();
        closeLightbox();
    }

    if (event.key === "ArrowLeft") {
        showImage(currentImageIndex - 1);
    }

    if (event.key === "ArrowRight") {
        showImage(currentImageIndex + 1);
    }
});

/* SHOWREEL - video i lightbox */

const showreelVideo = document.querySelector(
    '[data-project-group="showreel"] video'
);

if (showreelVideo) {
    showreelVideo.addEventListener("click", (event) => {
        // Undgå at åbne popup, hvis brugeren bruger afspillerens kontroller
        if (
            event.offsetX > showreelVideo.clientWidth ||
            event.offsetY > showreelVideo.clientHeight
        ) {
            return;
        }

        openVideoLightbox();
        lightbox.classList.add("video-open");
    });
}

function openVideoLightbox() {
    const videoSrc = showreelVideo.querySelector("source")?.src;

    if (!videoSrc) return;

    // Brug samme popup som billederne
    lastFocusedElement = document.activeElement;

    // Skift billedindholdet ud med en videoafspiller
    lightboxImage.hidden = true;
    lightboxCaption.hidden = true;

    let lightboxVideo = document.getElementById("lightboxVideo");

    if (!lightboxVideo) {
        lightboxVideo = document.createElement("video");
        lightboxVideo.id = "lightboxVideo";
        lightboxVideo.controls = true;
        lightboxVideo.playsInline = true;
        lightboxVideo.autoplay = true;
        lightboxVideo.style.maxWidth = "100%";
        lightboxVideo.style.maxHeight = "70vh";

        lightboxImage.insertAdjacentElement(
            "afterend",
            lightboxVideo
        );
    }

    lightboxVideo.src = videoSrc;
    lightboxVideo.hidden = false;

    lightboxCounter.textContent = "Showreel";

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    closeButton.focus();

    lightboxVideo.play().catch(() => {
        // Brugeren kan starte videoen med play-knap.
    });
}

// Udvid den eksisterende luk-funktion med videooprydning
const originalCloseLightbox = closeLightbox;

closeButton.addEventListener("click", () => {
    stopLightboxVideo();
    lightbox.classList.remove("video-open");
});

lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        stopLightboxVideo();
    }
});

function stopLightboxVideo() {
    const video = document.getElementById("lightboxVideo");

    if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
        video.hidden = true;
    }

    lightboxImage.hidden = false;
    lightboxCaption.hidden = false;
}