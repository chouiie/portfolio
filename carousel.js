const carousel = document.querySelector(".carousel");
const track = carousel.querySelector(".slides");
const slides = [...track.children];
const dotsBox = carousel.querySelector(".carousel-dots");

const dots = slides.map((slide, i) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsBox.append(dot);
    return dot;
});

function current() {
    return Math.round(track.scrollLeft / track.clientWidth);
}

function goTo(i) {
    const n = (i + slides.length) % slides.length; // wrap around at the ends
    track.scrollTo({ left: n * track.clientWidth, behavior: "smooth" });
}

function updateDots() {
    dots.forEach((dot, i) => dot.setAttribute("aria-current", i === current()));
}

carousel.querySelector(".carousel-prev").addEventListener("click", () => goTo(current() - 1));
carousel.querySelector(".carousel-next").addEventListener("click", () => goTo(current() + 1));
track.addEventListener("scroll", updateDots);
track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current() - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(current() + 1); }
});
updateDots();
