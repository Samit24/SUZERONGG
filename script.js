// --- 1. ADVANCED BOOT SEQUENCE ---
let bootPercent = 0;
let bootInterval;
let bootSkipped = false;

window.addEventListener('load', () => {
    runSystemRecon(); 
    bootInterval = setInterval(incrementBoot, 20); // Speed of progress bar
});

// System Recon Logic
function runSystemRecon() {
    // Time
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    const dateStr = now.toLocaleDateString('en-CA');
    const timeEl = document.getElementById('sys-time');
    if(timeEl) timeEl.innerText = `${dateStr} ${timeStr}`;

    // OS
    const platform = navigator.platform.toUpperCase();
    const osEl = document.getElementById('sys-os');
    if(osEl) osEl.innerText = platform.includes('WIN') ? 'WIN_NT_KERNEL' : 'UNIX_SYSTEM';

    // Resolution
    const resEl = document.getElementById('sys-res');
    if(resEl) resEl.innerText = `${window.innerWidth}x${window.innerHeight}`;
}

// Progress Bar Logic
function incrementBoot() {
    if (bootPercent >= 100) {
        clearInterval(bootInterval);
        completeBoot();
    } else {
        // Randomize speed for realism
        bootPercent += Math.random() > 0.5 ? 1 : 2; 
        if(bootPercent > 100) bootPercent = 100;
        updateBootUI();
    }
}

function updateBootUI() {
    const fill = document.getElementById('progress-fill');
    const text = document.getElementById('boot-percent');
    if(fill) fill.style.width = bootPercent + "%";
    if(text) text.innerText = bootPercent + "%";
}

// Skip animation
function accelerateBoot() {
    if (bootSkipped) return;
    bootSkipped = true;
    clearInterval(bootInterval);
    bootPercent = 100;
    updateBootUI();
    setTimeout(completeBoot, 200);
}
document.addEventListener('keydown', () => accelerateBoot());

function completeBoot() {
    const bootScreen = document.getElementById('boot-screen');
    const mainInterface = document.getElementById('main-interface');
    const netStatus = document.getElementById('net-status');

    if(netStatus) netStatus.innerHTML = "<span style='color: var(--accent);'>[ ESTABLISHED ]</span>";

    setTimeout(() => {
        bootScreen.style.opacity = '0';
        bootScreen.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            bootScreen.style.display = 'none';
            mainInterface.style.opacity = '1'; 
            mainInterface.style.transition = 'opacity 1s ease';
            initTypewriter(); // Start hero text only after boot
        }, 500);
    }, 400);
}

// --- 2. CANVAS PARTICLE BACKGROUND ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particlesArray;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.directionX = (Math.random() * 0.2) - 0.1;
        this.directionY = (Math.random() * 0.2) - 0.1;
        this.size = Math.random() * 2;
        this.color = '#00f0ff';
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
        ctx.fillStyle = this.color;
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
                ctx.strokeStyle = `rgba(0, 240, 255, ${1 - distance/100})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
}
initParticles();
animateParticles();

// --- 3. TYPEWRITER ---
const typeTarget = document.getElementById('typewriter');
const texts = ["investigate anomalies and alerts", "convert logs into actionable insights"];
let count = 0; let index = 0; let currentText = ""; let letter = "";

function initTypewriter() {
    if(!typeTarget) return;
    if(count === texts.length) count = 0;
    currentText = texts[count];
    letter = currentText.slice(0, ++index);
    
    typeTarget.textContent = letter;
    
    if(letter.length === currentText.length) {
        count++; index = 0;
        setTimeout(initTypewriter, 2000);
    } else {
        setTimeout(initTypewriter, 100);
    }
}

// --- 4. TERMINAL & CHATBOT ---
const chatHistory = document.getElementById('chat-history');
const chatInput = document.getElementById('chat-input');
const terminal = document.getElementById('terminal-modal');

function toggleTerminal() {
    terminal.style.display = (terminal.style.display === 'flex') ? 'none' : 'flex';
}

function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById('tab-'+tab).classList.add('active');
    event.currentTarget.classList.add('active');
}

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('chat-msg', sender);
    div.innerHTML = (sender === 'user' ? '> ' : '') + text;
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function handleChat(e) {
    if(e.key === 'Enter') sendChat();
}

async function sendChat() {
    const text = chatInput.value.trim();
    if(!text) return;
    
    addMessage(text, 'user');
    chatInput.value = '';

    // SIMULATED AI RESPONSE
    setTimeout(() => {
        const response = getSimulatedResponse(text);
        addMessage(response, 'ai');
    }, 600);
}

function getSimulatedResponse(input) {
    const lower = input.toLowerCase();
    if(lower.includes('hello') || lower.includes('hi')) return "Greetings. I am Samit's automated assistant.";
    if(lower.includes('skill') || lower.includes('stack')) return "Samit is proficient in CrowdStrike Falcon, Splunk, Python, and Linux Forensics.";
    if(lower.includes('contact') || lower.includes('email')) return "You can reach him at pudasainisamit@gmail.com.";
    if(lower.includes('experience') || lower.includes('work')) return "He has 1 year of experience as a SOC Analyst dealing with real-time threat detection.";
    if(lower.includes('project')) return "Check out the 'Projects' tab to see his Python Automation scripts.";
    return "Command not recognized. Try asking about 'skills', 'experience', or 'contact'.";
}

// --- 5. TERMINAL TOOLS ---
function runEncrypt() {
    const inp = document.getElementById('tool-input').value;
    const out = document.getElementById('tool-output');
    if(inp) out.innerText = btoa(inp);
}

function checkRoot() {
    const pass = document.getElementById('root-pass').value;
    const msg = document.getElementById('root-msg');
    if(pass === 'halamadrid') {
        msg.style.color = '#0f0';
        msg.innerText = "ACCESS GRANTED. GOD MODE ENABLED.";
    } else {
        msg.style.color = 'red';
        msg.innerText = "ACCESS DENIED.";
    }
}

// --- 6. SCROLL REVEAL ---
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting) entry.target.classList.add('active-reveal');
    });
});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// --- 7. MOBILE MENU ---
function toggleMenu() {
    document.getElementById('mobile-menu').classList.toggle('active');
}