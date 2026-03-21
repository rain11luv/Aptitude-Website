document.addEventListener('DOMContentLoaded', () => {
    const initAnimations = () => {
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

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Typewriter Effect Logic
    const typewriterElements = document.querySelectorAll('.typewriter-text');
    const typewriterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    typewriterEffect(entry.target);
                    observer.unobserve(entry.target);
                }, 300); // Wait for potential parent fade-in before typing
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

    typewriterElements.forEach(el => {
        el.dataset.originalText = el.textContent;
        el.textContent = ''; 
        typewriterObserver.observe(el);
    });

    function typewriterEffect(element) {
        element.classList.add('typing-started');
        element.classList.add('typing');
        
        const text = element.dataset.originalText;
        let i = 0;
        
        function typeChar() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                // Natural typing pace (approx 15-35ms per letter)
                const delay = 15 + Math.random() * 20; 
                setTimeout(typeChar, delay);
            } else {
                element.classList.remove('typing');
            }
        }
        
        typeChar();
    }

    // Scroll Indicator Fade Logic
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        let isScrolling = false;
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    if (scrollIndicator.style.transition !== 'none') {
                        scrollIndicator.style.transition = 'none';
                    }
                    
                    const scrollY = window.scrollY;
                    const baseOpacity = 0.8;
                    let opacity = baseOpacity - (scrollY / 400);
                    
                    if (opacity < 0) opacity = 0;
                    if (opacity > baseOpacity) opacity = baseOpacity;
                    
                    scrollIndicator.style.opacity = opacity;
                    scrollIndicator.style.pointerEvents = opacity === 0 ? 'none' : 'auto';
                    
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });
    }
    };

    if ('requestIdleCallback' in window) {
        requestIdleCallback(initAnimations, { timeout: 1000 });
    } else {
        setTimeout(initAnimations, 100);
    }
});
