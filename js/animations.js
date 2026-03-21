document.addEventListener('DOMContentLoaded', () => {
    // Set up Intersection Observer for fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');

    const appearanceOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearanceOptions);

    fadeElements.forEach(el => {
        appearOnScroll.observe(el);
    });
});
