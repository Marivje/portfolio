
const canvas = document.getElementById("centipede");
const ctx = canvas.getContext("2d");

let width, height;
let mouse = { x: -100, y: -100 };

const SEGMENTS = 24;
const SPACING = 11;

let body = [];
let particles = [];
let creatureEnabled = true;

function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resize);
resize();

window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener("touchmove", e => {
    if (e.touches.length) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
    }
}, { passive: true });

// Initialize creature
for (let i = 0; i < SEGMENTS; i++) {
    body.push({
        x: width / 2,
        y: height / 2,
        angle: 0
    });
}

// Digital particles
function spawnParticle(x, y) {
    particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        life: 1,
        size: Math.random() * 2 + 1
    });
}

function drawParticles() {
    particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.018;

        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = "#00ffd5";
        ctx.fillRect(p.x, p.y, p.size, p.size);

        if (p.life <= 0) particles.splice(i, 1);
    });

    ctx.globalAlpha = 1;
}

// Draw circuit-style details
function drawCircuit(x, y, radius) {
    ctx.strokeStyle = "rgba(0,255,210,0.8)";
    ctx.lineWidth = 0.7;

    ctx.beginPath();
    ctx.moveTo(x - radius * 0.5, y);
    ctx.lineTo(x, y - radius * 0.5);
    ctx.lineTo(x + radius * 0.5, y);
    ctx.stroke();

    ctx.fillStyle = "#00ffd5";
    ctx.fillRect(x + radius * 0.4, y - 1, 2, 2);
}

// Draw body segments

function drawSegment(segment, index, time) {
    const progress = index / SEGMENTS;
    const radius = 7 - progress * 3;

    ctx.save();
    ctx.translate(segment.x, segment.y);
    ctx.rotate(segment.angle);

    // Long spider legs
    const legLength = 19 - progress * 5;

    // Alternating walking movement
    const phase = time * 0.012 - index * 0.8;

    for (let side of [-1, 1]) {

        const movement = Math.sin(phase + (side * Math.PI)) * 5;
        const lift = Math.max(0, Math.cos(phase + side)) * 3;

        const startX = 0;
        const startY = side * 2;

        // First joint
        const jointX = 5 + movement;
        const jointY = side * (legLength * 0.55) - lift;

        // Foot position
        const footX = 11 + movement * 1.5;
        const footY = side * legLength - lift;

        // Leg glow
        ctx.shadowBlur = 9;
        ctx.shadowColor = "#00ffd5";

        // Upper leg
        ctx.strokeStyle = "#087c7c";
        ctx.lineWidth = 1.8;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(jointX, jointY);
        ctx.stroke();

        // Lower leg
        ctx.strokeStyle = "#00ffd5";
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.moveTo(jointX, jointY);
        ctx.lineTo(footX, footY);
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Glowing joint
        ctx.fillStyle = "#cafff5";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#00ffd5";

        ctx.beginPath();
        ctx.arc(jointX, jointY, 2, 0, Math.PI * 2);
        ctx.fill();

        // Sharp foot tip
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "#00ffd5";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(footX, footY);
        ctx.lineTo(footX + 3, footY + side * 5);
        ctx.stroke();
    }

    // Digital body
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00ffd5";

    const gradient = ctx.createLinearGradient(
        -radius, -radius, radius, radius
    );

    gradient.addColorStop(0, "#00ffd5");
    gradient.addColorStop(0.5, "#073b42");
    gradient.addColorStop(1, "#071417");

    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.roundRect(
        -radius * 1.4,
        -radius,
        radius * 2.8,
        radius * 2,
        3
    );
    ctx.fill();

    ctx.shadowBlur = 0;

    // Neon border
    ctx.strokeStyle = "rgba(0,255,213,0.8)";
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Circuit details
    drawCircuit(0, 0, radius);

    ctx.restore();
}

// Draw digital head
function drawHead(time) {
    const head = body[0];

    ctx.save();
    ctx.translate(head.x, head.y);
    ctx.rotate(head.angle);

    // Outer glow
    ctx.shadowBlur = 25;
    ctx.shadowColor = "#00ffd5";

    // Head shell
    ctx.fillStyle = "#092a30";
    ctx.strokeStyle = "#00ffd5";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(-8, -9);
    ctx.lineTo(7, -12);
    ctx.lineTo(16, -5);
    ctx.lineTo(16, 5);
    ctx.lineTo(7, 12);
    ctx.lineTo(-8, 9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;

    // Digital eyes
    ctx.fillStyle = "#cafff5";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00ffd5";

    ctx.fillRect(8, -6, 3, 3);
    ctx.fillRect(8, 3, 3, 3);

    ctx.shadowBlur = 0;

    // Antenna
    ctx.strokeStyle = "#00ffd5";
    ctx.lineWidth = 1;

    for (let side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(8, side * 8);
        ctx.lineTo(16, side * 14);
        ctx.lineTo(22, side * 14);
        ctx.stroke();

        ctx.fillStyle = "#00ffd5";
        ctx.fillRect(21, side * 14 - 2, 3, 3);
    }

    ctx.restore();
}

// Digital scanlines
function drawScanlines() {
    ctx.fillStyle = "rgba(0,255,210,0.06)";

    for (let y = 0; y < height; y += 5) {
        ctx.fillRect(0, y, width, 0.5);
    }
}

// Main animation
// Main animation
function animate(time) {

    // Check if creature is enabled
    if (!creatureEnabled) {
        ctx.clearRect(0, 0, width, height);
        requestAnimationFrame(animate);
        return;
    }

    ctx.clearRect(0, 0, width, height);

    const head = body[0];

    const dx = mouse.x - head.x;
    const dy = mouse.y - head.y;

    head.x += dx * 0.12;
    head.y += dy * 0.12;

    head.angle = Math.atan2(dy, dx);



    // Body follows head
    for (let i = 1; i < body.length; i++) {
        const current = body[i];
        const previous = body[i - 1];

        const dx = previous.x - current.x;
        const dy = previous.y - current.y;

        const angle = Math.atan2(dy, dx);

        current.x = previous.x - Math.cos(angle) * SPACING;
        current.y = previous.y - Math.sin(angle) * SPACING;
        current.angle = angle;
    }

    // Random digital particles
    if (Math.random() < 0.18) {
        const segment = body[Math.floor(Math.random() * body.length)];
        spawnParticle(segment.x, segment.y);
    }

    // Draw body
    for (let i = body.length - 1; i >= 1; i--) {
        drawSegment(body[i], i, time);
    }

    drawHead(time);
    drawParticles();

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);



const toggleButton = document.getElementById("toggleCentipede");
const toggleLabel = toggleButton.querySelector(".toggle-label");

toggleButton.addEventListener("click", () => {
    creatureEnabled = !creatureEnabled;

    toggleLabel.textContent = creatureEnabled
        ? "CREATURE: ON"
        : "CREATURE: OFF";

    toggleButton.classList.toggle("off", !creatureEnabled);

    if (!creatureEnabled) {
        ctx.clearRect(0, 0, width, height);
    }
});