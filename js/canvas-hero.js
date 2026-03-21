/**
 * Interactive Cursor Trajectory System
 * Dynamically switches between:
 * - Fluid Star Wave (Dark Mode)
 * - Neural Network Plexus (Light Mode)
 */
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const initCanvasSystem = () => {
        function isLightMode() {
            return document.documentElement.getAttribute('data-theme') === 'light';
        }

        const ctx = canvas.getContext('2d');
        let width, height;

    const mouse = {
        x: undefined,
        y: undefined,
        radius: 150
    };

    // Handle Resize
    function resize() {
        const heroSection = document.querySelector('.hero-section');
        width = heroSection.offsetWidth;
        height = heroSection.offsetHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }

    window.addEventListener('resize', resize);

    // Mouse Events
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        if (e.clientY > rect.bottom) {
            mouse.x = undefined;
            mouse.y = undefined;
            return;
        }
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    const particlesArray = [];
    let currentRenderMode = isLightMode() ? 'light' : 'dark';

    // Theme colors
    const lightNodeColor = 'rgba(148, 163, 184, 0.4)';
    const darkStarColors = ['rgba(255, 255, 255, 0.8)', 'rgba(200, 200, 255, 0.5)', 'rgba(255, 255, 255, 0.15)'];

    class Particle {
        constructor(isLight) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.baseX = this.x;
            this.baseY = this.y;
            this.size = isLight ? (Math.random() * 2 + 1) : (Math.random() * 1.5 + 0.5);

            if (isLight) {
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.color = lightNodeColor;
            } else {
                this.color = darkStarColors[Math.floor(Math.random() * darkStarColors.length)];
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update(isLight) {
            if (isLight) {
                // Light mode Plexus logic: Drift freely
                this.x += this.vx;
                this.y += this.vy;

                // Bounce smoothly off boundaries
                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;

                // Subtle Mouse Repulsion
                if (mouse.x !== undefined && mouse.y !== undefined) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        let forceDirectionX = dx / distance;
                        let forceDirectionY = dy / distance;
                        this.x -= forceDirectionX * force * 1.5;
                        this.y -= forceDirectionY * force * 1.5;
                    }
                }
            } else {
                // Dark mode Star Wave logic: Elastic ripple and upward drift
                if (mouse.x !== undefined && mouse.y !== undefined) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    // Larger wave repulsion range in dark mode
                    let maxDistance = 200; 

                    if (distance < maxDistance) {
                        let force = (maxDistance - distance) / maxDistance;
                        let forceDirectionX = dx / distance;
                        let forceDirectionY = dy / distance;
                        this.x -= forceDirectionX * force * 15;
                        this.y -= forceDirectionY * force * 15;
                    }
                }

                // Return to base slowly (elasticity)
                let dx = this.baseX - this.x;
                this.x += dx * 0.05;
                let dy = this.baseY - this.y;
                this.y += dy * 0.05;

                // Natural drift (anti-gravity floating feel)
                this.baseY -= 0.3; // slowly float up
                if (this.baseY < -10) {
                    this.baseY = height + 10;
                    this.y = height + 10;
                    this.baseX = Math.random() * width;
                    this.x = this.baseX;
                }
            }
            
            this.draw();
        }
    }

    function initParticles() {
        particlesArray.length = 0;
        let isLight = isLightMode();
        currentRenderMode = isLight ? 'light' : 'dark';
        
        // Dynamic density: 160 for Plexus (light), 1000 for Star Wave (dark)
        let particleCount = isLight ? 
            Math.min(Math.floor((width * height) / 9000), 160) :
            Math.min(Math.floor((width * height) / 3000), 1000); 
            
        for (let i = 0; i < particleCount; i++) {
            particlesArray.push(new Particle(isLight));
        }
    }

    function connect() {
        let maxDistance = 120;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    let opacity = 1 - (distance / maxDistance);
                    // Light mode specific styling
                    ctx.strokeStyle = `rgba(148, 163, 184, ${opacity * 0.35})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    let isCanvasVisible = true;
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isCanvasVisible = entry.isIntersecting;
        });
    }, { threshold: 0 });
    
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) heroObserver.observe(heroSection);

    function animate() {
        // Detect theme toggle on the fly to hot-swap particle engine
        let activeTheme = isLightMode() ? 'light' : 'dark';
        if (activeTheme !== currentRenderMode) {
            initParticles();
        }

        if (isCanvasVisible) {
            let isLight = isLightMode();
            
            if (isLight) {
                // Light mode Plexus: Clean clearRect for sharp lines
                ctx.clearRect(0, 0, width, height);
            } else {
                // Dark mode Star Wave: Translucent trail fill
                ctx.fillStyle = `rgba(10, 10, 10, 0.5)`; 
                ctx.fillRect(0, 0, width, height);
            }

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update(isLight);
            }
            
            // Only draw plexus connections in light mode
            if (isLight) {
                connect();
            }
        }

        requestAnimationFrame(animate);
    }

    // Initialize
    resize();
    animate();
    };

    if ('requestIdleCallback' in window) {
        requestIdleCallback(initCanvasSystem, { timeout: 1000 });
    } else {
        setTimeout(initCanvasSystem, 100);
    }
});
