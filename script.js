// --- 1. INITIALIZATION & CTF HINT ---
window.addEventListener('load', () => {
    initTypewriter(); 
    resizeCanvas();
    animateParticles();
    
    // CTF HINT: Hidden in console for developers
    console.log("%c STOP! ", "color: red; font-size: 30px; font-weight: bold;");
    console.log("%c If you are looking for the root password, try: 'halamadrid'", "color: #00f0ff; font-size: 14px;");
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

// --- 4. ADVANCED TERMINAL & CHATBOT ---
const chatHistory = document.getElementById('chat-history');
const chatInput = document.getElementById('chat-input');
const terminal = document.getElementById('terminal-modal');

function toggleTerminal() {
    const isFlex = terminal.style.display === 'flex';
    terminal.style.display = isFlex ? 'none' : 'flex';
    if (!isFlex) setTimeout(() => chatInput.focus(), 100);
}

function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById('tab-'+tab).classList.add('active');
    event.currentTarget.classList.add('active');
}

function addMessage(text, type) {
    const div = document.createElement('div');
    div.classList.add('chat-msg', type); // type can be 'user', 'ai', 'system', 'success', 'error'
    div.innerHTML = (type === 'user' ? '> ' : '') + text;
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function handleChat(e) {
    if(e.key === 'Enter') processCommand();
}

async function processCommand() {
    const input = chatInput.value.trim();
    if(!input) return;
    
    addMessage(input, 'user');
    chatInput.value = '';

    const lower = input.toLowerCase();

    // 1. HELP COMMAND
    if (lower === 'help' || lower === 'ls') {
        setTimeout(() => {
            addMessage("AVAILABLE COMMANDS:", "system");
            addMessage("- <span class='cmd'>about</span> : Display profile bio", "ai");
            addMessage("- <span class='cmd'>projects</span> : Navigate to projects", "ai");
            addMessage("- <span class='cmd'>nmap</span> : Run vulnerability scan", "ai");
            addMessage("- <span class='cmd'>theme [color]</span> : Change UI color", "ai");
            addMessage("- <span class='cmd'>clear</span> : Clear terminal", "ai");
        }, 200);
        return;
    }

    // 2. CLEAR COMMAND
    if (lower === 'clear') {
        chatHistory.innerHTML = '';
        return;
    }

    // 3. NAVIGATION COMMANDS
    if (lower.includes('project')) {
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        addMessage("Navigating to [PROJECTS] sector...", "success");
        return;
    }
    if (lower.includes('contact') || lower.includes('email')) {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        addMessage("Opening communication channels...", "success");
        return;
    }
    
    // 4. THEME COMMANDS
    if (lower.startsWith('theme')) {
        if(lower.includes('red')) changeTheme('#ff0055', 'rgba(255, 0, 85, 0.4)');
        else if(lower.includes('green')) changeTheme('#00ff41', 'rgba(0, 255, 65, 0.4)');
        else if(lower.includes('cyan')) changeTheme('#00f0ff', 'rgba(0, 240, 255, 0.4)');
        else if(lower.includes('purple')) changeTheme('#bf00ff', 'rgba(191, 0, 255, 0.4)');
        else if(lower.includes('orange')) changeTheme('#ff9900', 'rgba(255, 153, 0, 0.4)');
        
        addMessage(`Theme updated.`, "success");
        return;
    }

    // 5. NMAP SIMULATION
    if (lower === 'nmap' || lower === 'scan' || lower === 'run_scan') {
        runNmapSimulation();
        return;
    }

    // DEFAULT AI RESPONSE
    setTimeout(() => {
        if(lower.includes('hello')) addMessage("System Online. Ready for input.", "ai");
        else if(lower.includes('skill')) addMessage("Loaded modules: CrowdStrike Falcon, Splunk, Python, Linux.", "ai");
        else addMessage("Command not recognized. Type 'help' for list.", "error");
    }, 400);
}

function runNmapSimulation() {
    const steps = [
        { text: "Starting Nmap 7.94 at 2026-01-25...", delay: 200, type: "system" },
        { text: "Initiating Syn Stealth Scan...", delay: 800, type: "ai" },
        { text: "Scanning 192.168.1.1 [1000 ports]", delay: 1500, type: "ai" },
        { text: "Discovered open port 80/tcp on 192.168.1.1", delay: 2200, type: "success" },
        { text: "Discovered open port 443/tcp on 192.168.1.1", delay: 2400, type: "success" },
        { text: "Discovered open port 22/tcp on 192.168.1.1", delay: 2600, type: "warning" },
        { text: "Nmap done: 1 IP address (1 host up) scanned in 3.02 seconds", delay: 3500, type: "system" }
    ];

    steps.forEach(step => {
        setTimeout(() => {
            addMessage(step.text, step.type);
        }, step.delay);
    });
}

function changeTheme(color, glow) {
    document.documentElement.style.setProperty('--accent', color);
    document.documentElement.style.setProperty('--accent-glow', glow);
    particleColor = color; 
}

// --- 5. TERMINAL TOOLS & ROOT LOGIN ---
function runEncrypt() {
    const inp = document.getElementById('tool-input').value;
    const out = document.getElementById('tool-output');
    if(inp) out.innerText = btoa(inp);
}

function checkRoot() {
    const pass = document.getElementById('root-pass').value;
    const msg = document.getElementById('root-msg');
    
    if(pass === 'halamadrid') {
        msg.innerHTML = "<span style='color:#0f0'>ACCESS GRANTED.</span>";
        setTimeout(() => {
            changeTheme('#00ff41', 'rgba(0, 255, 65, 0.4)');
            addMessage("ROOT ACCESS VERIFIED. GOD MODE ENABLED.", "success");
            switchTab('chat'); 
        }, 1000);
    } else {
        msg.innerHTML = "<span style='color:red'>ACCESS DENIED.</span>";
    }
}

// --- 6. SCROLL REVEAL ---
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting) entry.target.classList.add('active-reveal');
    });
});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// --- 7. MOBILE MENU TOGGLE ---
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('active');
}