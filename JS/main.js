const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = [...document.querySelectorAll(".main-nav a")];
const sections = [...document.querySelectorAll("main section[id]")];
const year = document.querySelector("[data-year]");
const galleryItems = document.querySelectorAll("[data-gallery] .gallery-item");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxTitle = document.querySelector("[data-lightbox-title]");
const lightboxDescription = document.querySelector("[data-lightbox-description]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
let lastFocusedGalleryItem = null;

if (year) {
    year.textContent = new Date().getFullYear();
}

const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 18);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (!nav || !navToggle) return;
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
    });
});

if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                navLinks.forEach((link) => {
                    link.classList.toggle(
                        "is-active",
                        link.getAttribute("href") === `#${entry.target.id}`
                    );
                });
            });
        },
        {
            rootMargin: "-45% 0px -45% 0px",
            threshold: 0
        }
    );

    sections.forEach((section) => observer.observe(section));
}

const openLightbox = (item) => {
    if (!lightbox || !lightboxImage || !lightboxTitle || !lightboxDescription) return;

    const image = item.dataset.image;
    const title = item.dataset.title || "Création graphique";
    const description = item.dataset.description || "";

    lightboxImage.src = image;
    lightboxImage.alt = title;
    lightboxTitle.textContent = title;
    lightboxDescription.textContent = description;
    lightbox.hidden = false;
    lastFocusedGalleryItem = item;
    document.body.style.overflow = "hidden";
    lightboxClose?.focus();
};

const closeLightbox = () => {
    if (!lightbox || !lightboxImage) return;

    lightbox.hidden = true;
    lightboxImage.src = "";
    document.body.style.overflow = "";
    lastFocusedGalleryItem?.focus();
};

galleryItems.forEach((item) => {
    item.addEventListener("click", () => openLightbox(item));
});

if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
}

if (lightbox) {
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox && !lightbox.hidden) {
        closeLightbox();
    }
});
