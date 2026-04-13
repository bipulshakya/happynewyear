const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let fireworks = [];
let particles = [];

/* ---------- FIREWORK CLASS ---------- */
class Firework {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * canvas.height / 2.5; // Explode higher
        this.speedY = Math.random() * 6 + 6;
        this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
        this.exploded = false;
        this.trail = [];
    }

    update() {
        if (!this.exploded) {
            this.trail.push({x: this.x, y: this.y});
            if (this.trail.length > 5) this.trail.shift();

            this.y -= this.speedY;
            if (this.y <= this.targetY) {
                this.exploded = true;
                this.explode();
            }
        }
    }

    draw() {
        if (!this.exploded) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            
            // Trail
            if (this.trail.length > 1) {
                ctx.beginPath();
                ctx.moveTo(this.trail[0].x, this.trail[0].y);
                for(let i=1; i<this.trail.length; i++) {
                    ctx.lineTo(this.trail[i].x, this.trail[i].y);
                }
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
    }

    explode() {
        // Create particles (reduced count for performance)
        for (let i = 0; i < 45; i++) {
            particles.push(new Particle(this.x, this.y, this.color));
        }
    }
}

/* ---------- PARTICLE CLASS ---------- */
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 2 + 1;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed;
        this.life = 100 + Math.random() * 50; 
        this.maxLife = this.life;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.03; // Less gravity for floaty effect
        this.life--;
    }

    draw() {
        const alpha = Math.max(0, this.life / this.maxLife);
        
        // Outer glow (much faster than shadowBlur)
        ctx.globalAlpha = alpha * 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Inner core
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        
        // Reset properties
        ctx.globalAlpha = 1.0;
    }
}

/* ---------- ANIMATION LOOP ---------- */
function animate() {
    // This allows trails to fade away and preserves CSS background
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.globalCompositeOperation = "lighter";

    // Reduced spawn rate to prevent lag accumulation
    if (Math.random() < 0.02) {
        fireworks.push(new Firework());
    }

    for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].draw();
        if (fireworks[i].exploded) {
            fireworks.splice(i, 1);
        }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

animate();
