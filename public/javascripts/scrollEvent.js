const scrollRevealOption = {
    distance: "50px",
    origin: "bottom",
    duration: 1000,
};

ScrollReveal().reveal(".header__image img", {
    ...scrollRevealOption,
    origin: "right",
});
ScrollReveal().reveal(".header__content h2", {
    ...scrollRevealOption,
    delay: 500,
});
ScrollReveal().reveal(".header__content h1", {
    ...scrollRevealOption,
    delay: 1000,
});
ScrollReveal().reveal(".header__content p", {
    ...scrollRevealOption,
    delay: 1500,
});
ScrollReveal().reveal(".header__content .header__btn", {
    ...scrollRevealOption,
    delay: 2000,
});
ScrollReveal().reveal(".header__content .socials", {
    ...scrollRevealOption,
    delay: 2500,
});
ScrollReveal().reveal(".header__bar", {
    ...scrollRevealOption,
    delay: 3000,
});