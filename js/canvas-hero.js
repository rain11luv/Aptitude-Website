/**
 * Interactive Cursor Trajectory System
 * Simulates an "anti-gravity" fluid particle network that follows the mouse trajectory.
 */
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    // Mouse state
    const mouse = {
        x: undefined,
        y: undefined,
        radius: 120, // Interaction radius
        moving: false
    };

    let moveTimeout;

    // Handle Resize
    function resize() {
        // Only cover the top section to save performance
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
        // Adjust for scroll and bounding box
        const rect = canvas.getBoundingClientRect();

        // Check if mouse is within hero section
        if (e.clientY > rect.bottom) {
            mouse.x = undefined;
            mouse.y = undefined;
            return;
        }

        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.moving = true;

        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
            mouse.moving = false;
        }, 100);
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    // Particles Configuration
    const particlesArray = [];
    const numberOfParticles = Math.min(Math.floor(window.innerWidth / 15), 100); // Scale based on screen width

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Native starting position
            this.baseX = this.x;
            this.baseY = this.y;
            this.size = Math.random() * 2 + 1;
            this.density = (Math.random() * 30) + 1;

            // Randomly assign subtle colors (Blue, Amber, White/Gray)
            const colors = ['rgba(59, 130, 246, 0.4)', 'rgba(245, 158, 11, 0.2)', 'rgba(255, 255, 255, 0.15)'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update() {
            if (mouse.x !== undefined && mouse.y !== undefined) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;

                // Repel effect (anti-gravity) + slight attraction to mouse path
                let maxDistance = mouse.radius;
                let force = (maxDistance - distance) / maxDistance;

                if (distance < mouse.radius) {
                    let directionX = forceDirectionX * force * this.density * 0.5;
                    let directionY = forceDirectionY * force * this.density * 0.5;

                    // Push away
                    this.x -= directionX;
                    this.y -= directionY;
                }
            } else {
                // Return to base slowly (elasticity)
                if (this.x !== this.baseX) {
                    let dx = this.baseX - this.x;
                    this.x += dx / 20; // Lower number = faster snap
                }
                if (this.y !== this.baseY) {
                    let dy = this.baseY - this.y;
                    this.y += dy / 20;
                }
            }

            // Natural drift (anti-gravity floating feel)
            this.baseY -= 0.1; // slowly float up
            if (this.baseY < -10) {
                this.baseY = height + 10;
                this.y = height + 10;
                this.baseX = Math.random() * width;
                this.x = this.baseX;
            }

            this.draw();
        }
    }

    function initParticles() {
        particlesArray.length = 0;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                // Draw connecting lines if close
                if (distance < 150) {
                    opacityValue = 1 - (distance / 150);
                    // Extremely subtle connections
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue * 0.05})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        // Clear canvas with trail effect
        ctx.fillStyle = 'rgba(10, 10, 10, 0.4)'; // Must match var(--bg-base) rgb value broadly
        ctx.fillRect(0, 0, width, height);

        // Optimization: Stop animating if scrolled far past hero
        if (window.scrollY < height + 200) {
            for (let i = 0; i < particlesArray.length; i++) {
                ctx.fillStyle = particlesArray[i].color;
                particlesArray[i].update();
            }
            connect();
        }

        requestAnimationFrame(animate);
    }

    // Initialize
    resize();
    animate();
});
