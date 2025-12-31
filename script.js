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
        this.targetY = Math.random() * canvas.height / 2;
        this.speedY = Math.random() * 7 + 4;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.exploded = false;
    }

    update() {
        if (!this.exploded) {
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
        }
    }

    explode() {
        for (let i = 0; i < 80; i++) {
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
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
        this.life = 100;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.05; // gravity
        this.life--;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

/* ---------- ANIMATION LOOP ---------- */
function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.05) {
        fireworks.push(new Firework());
    }

    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        if (firework.exploded) {
            fireworks.splice(index, 1);
        }
    });

    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

animate();
