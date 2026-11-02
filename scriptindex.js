




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

/*EXPLORE MY UNIVERSE - the more you know*/

const universeTrack = document.getElementById("universeTrack");
const universePages = [...document.querySelectorAll(".universe-page")];
/*buttons frem og tilbage*/
const universePrev = document.querySelector(".universe-prev");
const universeNext = document.querySelector(".universe-next");
/*indikator for at man kan se flere sider*/
const universeIndicators = [
    ...document.querySelectorAll(".universe-page-indicator")
];

const universePlanets = [
    ...document.querySelectorAll(".universe-planet")
];

/*titel og markør for (hiver fat i universecontent)*/
const universeLabel = document.getElementById("universeLabel");
const universeTitle = document.getElementById("universeTitle");
const universeDescription = document.getElementById("universeDescription");

const universeLink = document.getElementById("universeLink");

let currentPage = 0;
/*sørger for at label, titel, osv... skifter samt hvilket indhold der skal være*/
const universeContent = {
    web: {
        number: "01",
        label: "PORTFOLIO",
        title: "The Portfolio",
        description:
            "I enjoy combining visual design with code to create digital experiences that are both engaging and functional. I'm always learning new ways to bring ideas to the web.",
        linkText: "Discover my portfolio",
        link: "portfolio.html"
    },

    process: {
        number: "02",
        label: "MY PROCESS",
        title: "Behind the Ideas",
        description:
            "Every project begins with curiosity. I explore ideas, experiment with different approaches, and turn early concepts into thoughtful digital experiences.",
        linkText: "Explore my process",
        link: "portfolio.html"
    },

    art: {
        number: "03",
        label: "ART & ILLUSTRATION",
        title: "A Creative Playground",
        description:
            "Illustration is where I explore colours, shapes, characters, and visual storytelling. It's a space where imagination leads the way and ideas can take unexpected forms.",
        linkText: "Discover my artwork",
        link: "art.html"
    },

    games: {
        number: "04",
        label: "GAME DEVELOPMENT",
        title: "Worlds in Progress",
        description:
            "I'm fascinated by interactive worlds and the experiences that make them memorable. Game development lets me bring together creativity, storytelling, design, and code.",
        linkText: "Explore my games",
        link: "games.html"
    },

    about: {
        number: "05",
        label: "ABOUT ME",
        title: "The Person Behind the Pixels",
        description:
            "I'm a curious creative who loves exploring new ideas, learning new skills, and discovering the possibilities where design and technology meet.",
        linkText: "Get to know me",
        link: "about.html"
    },

    skills: {
        number: "06",
        label: "MY SKILLS",
        title: "Tools of the Trade",
        description:
            "From visual design to coding, I'm always expanding my creative toolkit. I enjoy learning by doing and finding new ways to turn ideas into reality.",
        linkText: "Explore my skills",
        link: "skills.html"
    },

    experiments: {
        number: "07",
        label: "EXPERIMENTS",
        title: "Curiosity Without Limits",
        description:
            "Not every idea needs a plan. This is where I experiment, try unfamiliar techniques, play with new tools, and learn through making things just to see what happens.",
        linkText: "See my experiments",
        link: "experiments.html"
    },

    contact: {
        number: "08",
        label: "CONTACT",
        title: "Let's Connect",
        description:
            "Have an interesting idea, a creative project, or simply want to say hello? I'd love to hear from you and discover what we could create together.",
        linkText: "Get in touch",
        link: "contact.html"
    }
};

// tager fat i planet og panel, sektion der laver linket til scroll effekten på index
const planets = document.querySelectorAll(".universe-planet");
const universePanel = document.getElementById("my_portfolio");

planets.forEach((planet) => {
    planet.addEventListener("click", () => {

        // Find den valgte planets indhold
        const topic = planet.dataset.topic;
        const content = universeContent[topic];

        if (!content) return;

        // skifter indhold på panel, på baggrund af planet. tager udgangspunkt i label, titel, link, osv... som er defineret i const
        universeLabel.textContent =
            `DESTINATION ${content.number} / ${content.label}`;

        universeTitle.textContent = content.title;
        universeDescription.textContent = content.description;

        universeLink.textContent = content.linkText;
        universeLink.href = content.link;

        // Læser aktive planet
        planets.forEach((button) => {
            button.classList.remove("active");
            button.setAttribute("aria-pressed", "false");
        });

        planet.classList.add("active");
        planet.setAttribute("aria-pressed", "true");

        // Scroll ned til indholdspanelet = letter navigation for brugeren
        universePanel.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });
});


/* Change carousel page, simple shift. */
function updateUniverseCarousel() {
    universeTrack.style.transform =
        `translateX(-${currentPage * 100}%)`;

    universePrev.disabled = currentPage === 0;

    universeNext.disabled =
        currentPage === universePages.length - 1;

    universeIndicators.forEach((indicator, index) => {
        indicator.classList.toggle(
            "active",
            index === currentPage
        );
    });
}


/* Show selected planet's content. */
function selectUniversePlanet(planet) {
    const topic = planet.dataset.topic;
    const content = universeContent[topic];

    if (!content) return;

    universePlanets.forEach((item) => {
        const isActive = item === planet;

        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
    });

    const page = planet.closest(".universe-page");

    currentPage = universePages.indexOf(page);

    updateUniverseCarousel();

    universeLabel.textContent =
        `DESTINATION ${content.number} / ${content.label}`;

    universeTitle.textContent = content.title;

    universeDescription.textContent = content.description;

    universeLink.textContent = content.linkText;
    universeLink.href = content.link;
}


/* Arrow navigation, this site or that site */
universePrev.addEventListener("click", () => {
    if (currentPage > 0) {
        currentPage--;
        updateUniverseCarousel();
    }
});

universeNext.addEventListener("click", () => {
    if (currentPage < universePages.length - 1) {
        currentPage++;
        updateUniverseCarousel();
    }
});


/* Planet selection, a click event. skifter aktive planet*/

universePlanets.forEach((planet) => {
    planet.addEventListener("click", () => {
        selectUniversePlanet(planet);
    });
});


/* Initial state */

updateUniverseCarousel();




const contactButton = document.querySelector(".contact-form button");

if (contactButton) {
    const starLayer = contactButton.querySelector(".contact-stars");

    if (starLayer) {
        const stars = [];
        const starCount = 24;

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement("span");
            star.className = "contact-star";

            const x = Math.random() * 100;
            const y = Math.random() * 100;

            star.style.left = `${x}%`;
            star.style.top = `${y}%`;

            starLayer.appendChild(star);

            stars.push({
                element: star,
                x: x,
                y: y,
                offsetX: 0,
                offsetY: 0,
                velocityX: 0,
                velocityY: 0,
                twinkle: Math.random() * Math.PI * 2
            });
        }

        let mouseX = -1000;
        let mouseY = -1000;
        let isHovering = false;
        let animationFrame;

        contactButton.addEventListener("pointerenter", () => {
            isHovering = true;
        });

        contactButton.addEventListener("pointerleave", () => {
            isHovering = false;
            mouseX = -1000;
            mouseY = -1000;
        });

        contactButton.addEventListener("pointermove", event => {
            const rect = starLayer.getBoundingClientRect();

            mouseX = event.clientX - rect.left;
            mouseY = event.clientY - rect.top;
        });

        function animateStars() {
            const rect = starLayer.getBoundingClientRect();

            stars.forEach(star => {
                const baseX = star.x / 100 * rect.width;
                const baseY = star.y / 100 * rect.height;

                const currentX = baseX + star.offsetX;
                const currentY = baseY + star.offsetY;

                const dx = currentX - mouseX;
                const dy = currentY - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (isHovering && distance < 65 && distance > 0) {
                    const force = (65 - distance) / 65;

                    star.velocityX += (dx / distance) * force * 1.8;
                    star.velocityY += (dy / distance) * force * 1.8;
                }

                // Træghed og langsom tilbagevenden
                star.velocityX *= 0.91;
                star.velocityY *= 0.91;

                star.offsetX += star.velocityX;
                star.offsetY += star.velocityY;

                star.offsetX *= 0.985;
                star.offsetY *= 0.985;

                star.twinkle += 0.045;

                const opacity =
                    0.45 + (Math.sin(star.twinkle) + 1) * 0.275;

                star.element.style.opacity = isHovering
                    ? opacity
                    : 0;

                star.element.style.transform =
                    `translate(${star.offsetX}px, ${star.offsetY}px)`;
            });

            animationFrame = requestAnimationFrame(animateStars);
        }

        animateStars();
    }
}

