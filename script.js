// --- 1. INITIALIZATION ---
window.addEventListener('load', () => {
    initTypewriter(); 
    resizeCanvas();
    animateParticles();
});

// --- 2. SCROLL & CANVAS ---
window.onscroll = function() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    let bar = document.getElementById("scroll-bar");
    if(bar) bar.style.width = scrolled + "%";
};

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particlesArray;
let particleColor = '#00f0ff'; 

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles(); 
}
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.directionX = (Math.random() * 0.2) - 0.1;
        this.directionY = (Math.random() * 0.2) - 0.1;
        this.size = Math.random() * 2;
    }
    update() {
        if(this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if(this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
        this.x += this.directionX;
        this.y += this.directionY;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = particleColor; 
        ctx.globalAlpha = 0.5;
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.width * canvas.height) / 15000;
    for(let i=0; i<numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0,0, canvas.width, canvas.height);
    for(let i=0; i<particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        for(let j=i; j<particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx*dx + dy*dy);
            if(distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = particleColor; 
                ctx.lineWidth = 0.5;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
}

// --- 3. TYPEWRITER ---
const typeTarget = document.getElementById('dynamic-text');
const texts = ["anomalies and alerts", "logs into actionable insights"];
let count = 0;

function initTypewriter() {
    if(!typeTarget) return;
    if(count >= texts.length) count = 0;
    typeTarget.classList.remove('slide-text');
    void typeTarget.offsetWidth; 
    typeTarget.innerText = texts[count];
    typeTarget.classList.add('slide-text');
    count++;
    setTimeout(initTypewriter, 3000); 
}

// --- 4. SCROLL REVEAL ---
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting) entry.target.classList.add('active-reveal');
    });
});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// --- 5. MOBILE MENU TOGGLE ---
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('active');
}

// --- 6. INTERACTIVE THREAT LEVEL SWITCHER ---
const threatLevels = [
    { color: '#00f0ff', glow: 'rgba(0, 240, 255, 0.4)' },  // Cyan (Secure)
    { color: '#00ff41', glow: 'rgba(0, 255, 65, 0.4)' },   // Green (Normal/Safe)
    { color: '#ff0033', glow: 'rgba(255, 0, 51, 0.4)' }    // Red (Critical)
];
let currentThreat = 0;

function cycleThreatLevel() {
    // Move to the next threat level, loop back to 0 if at the end
    currentThreat = (currentThreat + 1) % threatLevels.length;
    const level = threatLevels[currentThreat];
    
    // Update CSS Custom Variables for the whole UI
    document.documentElement.style.setProperty('--accent', level.color);
    document.documentElement.style.setProperty('--accent-glow', level.glow);
    
    // Update Canvas Particle Color
    particleColor = level.color;
}

