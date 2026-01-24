// --- GLOBAL VARIABLES ---
let footerTimer = null; 
let gameInterval;       
let isGameRunning = false;

// --- 1. BOOT SEQUENCE ---
let bootPercent = 0; let bootInterval; let bootSkipped = false;
window.addEventListener('load', () => { runSystemRecon(); bootInterval = setInterval(incrementBoot, 10); });
function incrementBoot() { if (bootPercent >= 100) { clearInterval(bootInterval); completeBoot(); } else { bootPercent++; updateBootUI(); } }
function updateBootUI() { const fill = document.getElementById('progress-fill'); const text = document.getElementById('boot-percent'); if(fill && text) { fill.style.width = bootPercent + "%"; text.innerText = bootPercent + "%"; } }
function accelerateBoot() { if (bootSkipped) return; clearInterval(bootInterval); bootPercent = 100; updateBootUI(); setTimeout(completeBoot, 400); }
function completeBoot() { if (bootSkipped) return; bootSkipped = true; const netStatus = document.getElementById('net-status'); if(netStatus) netStatus.innerHTML = "<span style='color: var(--accent);'>[ CONNECTED ]</span>"; const bootScreen = document.getElementById('boot-screen'); const app = document.getElementById('app'); setTimeout(() => { bootScreen.style.opacity = '0'; bootScreen.style.transition = 'opacity 0.5s'; setTimeout(() => { bootScreen.style.display = 'none'; app.style.opacity = '1'; app.style.transition = 'opacity 1s'; initTypeWriter(); }, 500); }, 500); }
document.addEventListener('keydown', (e) => { if (!bootSkipped) accelerateBoot(); else if (e.key === "Enter" || e.key === " ") enterSite(); });
function enterSite() { if (bootSkipped) return; bootSkipped = true; completeBoot(); }

// --- 2. MOBILE MENU TOGGLE ---
function toggleMenu() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('mobile-active');
}

// --- 3. ROUTING ---
function router(sectionId) {
    // 1. Hide all sections
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    // 2. Remove active class from buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    // 3. Show target section
    const targetSection = document.getElementById(sectionId);
    if(targetSection) targetSection.classList.add('active');
    
    // 4. Highlight current button
    document.querySelectorAll('.nav-btn').forEach(btn => { if(btn.getAttribute('onclick').includes(sectionId)) btn.classList.add('active'); });

    // 5. If mobile, close menu after clicking
    const navMenu = document.getElementById('nav-menu');
    if(navMenu.classList.contains('mobile-active')) {
        navMenu.classList.remove('mobile-active');
    }

    // 6. Run footer animation if contact section
    if(sectionId === 'contact') runFunnyFooterAnimation();
}

// --- 4. FOOTER TIMER (FIXED) ---
function runFunnyFooterAnimation() {
    const footer = document.querySelector('.funny-footer'); const countdownEl = document.getElementById('countdown');
    const statusEl = document.getElementById('footer-status'); const headerEl = document.querySelector('.alert-header');
    if(!footer || !countdownEl) return;
    if (footerTimer) clearInterval(footerTimer);
    footer.classList.remove('safe'); 
    headerEl.innerHTML = "⚠️ CRITICAL ALERT: SYSTEM SELF-DESTRUCT SEQUENCE ⚠️"; 
    headerEl.style.animation = "blink-panic 0.3s step-end infinite"; 
    statusEl.innerHTML = "REASON: UNAUTHORIZED LACK OF EMAIL CONTACT.<br>Please send a message to abort sequence."; 
    let steps = 1000; 
    footerTimer = setInterval(() => {
        steps -= 10; countdownEl.textContent = (steps / 100).toFixed(2); 
        if (steps <= 250) {
            clearInterval(footerTimer); footer.classList.add('safe'); 
            headerEl.innerHTML = "> SYSTEM CRISIS AVERTED"; headerEl.style.animation = "none";
            countdownEl.textContent = "[ ABORTED ]";
            statusEl.innerHTML = `Actually, destroying the system seems like a lot of paperwork.<br><br><span style='color: var(--accent); font-weight: bold; font-size: 1.1rem;'>Just send the email, it's easier.</span>`;
        }
    }, 100); 
}

// --- 5. TYPEWRITER ---
const roles = ["Investigate anomalies and alerts", "Convert logs into actionable insight"];
let roleIndex = 0; let charIndex = 0; let isDeleting = false; const typeSpeed = 100; const deleteSpeed = 50; const delayBetween = 2000;
function initTypeWriter() {
    const target = document.getElementById('typing-text'); if(!target) return;
    const currentRole = roles[roleIndex];
    if (isDeleting) { target.textContent = currentRole.substring(0, charIndex - 1); charIndex--; } 
    else { target.textContent = currentRole.substring(0, charIndex + 1); charIndex++; }
    let nextSpeed = isDeleting ? deleteSpeed : typeSpeed;
    if (!isDeleting && charIndex === currentRole.length) { nextSpeed = delayBetween; isDeleting = true; } 
    else if (isDeleting && charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; }
    setTimeout(initTypeWriter, nextSpeed);
}

// --- 6. SYSTEM RECON ---
function runSystemRecon() {
    const now = new Date(); const timeEl = document.getElementById('sys-time');
    if(timeEl) timeEl.innerText = `${now.toLocaleDateString('en-CA')} ${now.toLocaleTimeString('en-US', { hour12: false })}`;
    const platformEl = document.getElementById('sys-os'); if(platformEl) platformEl.innerText = navigator.platform.toUpperCase();
    const resEl = document.getElementById('sys-res'); if(resEl) resEl.innerText = `${window.innerWidth}x${window.innerHeight}_RGB`;
}

// --- 7. LOGIN SYSTEM ---
function openLogin() { const modal = document.getElementById('login-overlay'); if(modal) { modal.style.display = 'flex'; setTimeout(() => document.getElementById('root-pass').focus(), 100); } }
function closeLogin() { const modal = document.getElementById('login-overlay'); if(modal) modal.style.display = 'none'; document.getElementById('login-msg').innerText = ""; document.getElementById('root-pass').value = ""; }
function attemptLogin() {
    const input = document.getElementById('root-pass').value; const msg = document.getElementById('login-msg');
    if(input.toLowerCase() === "halamadrid") { msg.style.color = "var(--accent)"; msg.innerText = "> ACCESS GRANTED. DECRYPTING..."; setTimeout(() => { closeLogin(); unlockClassified(); }, 1000); } 
    else { msg.style.color = "var(--alert)"; msg.innerText = "> ACCESS DENIED. LOGGING INCIDENT."; }
}
function checkEnter(e) { if(e.key === "Enter") attemptLogin(); }
function unlockClassified() {
    const hiddenBtns = document.querySelectorAll('.hidden-feature');
    hiddenBtns.forEach(btn => { btn.classList.add('access-granted'); btn.style.display = 'block'; });
    alert("SYSTEM ALERT: New modules loaded into the sidebar."); router('playground');
}

// --- 8. MINI APPS (SECRET) ---
function simpleEncrypt() {
    const input = document.getElementById('cypher-input').value; const output = document.getElementById('cypher-output');
    try { output.innerText = `> OUTPUT: ${btoa(input)}`; } catch(e) { output.innerText = "> ERROR: STRING INVALID"; }
}

// --- 9. PACKET RUN GAME (FLAPPY BIRD) ---
let canvas, ctx; let bird, pipes, score, gameFrame;
// UPDATED PHYSICS for slower gameplay
const GRAVITY = 0.5; const JUMP = -8; const PIPE_SPEED = 2; const PIPE_SPAWN_RATE = 140;

function launchGame(type) {
    if(type === 'flappy') {
        document.getElementById('game-overlay').style.display = 'flex';
        canvas = document.getElementById('game-canvas'); ctx = canvas.getContext('2d');
        initFlappy();
        document.addEventListener('keydown', handleInput);
        // UPDATED: Added direct touch listener to canvas as backup
        canvas.addEventListener('touchstart', jump); 
    }
}
function closeGame() {
    document.getElementById('game-overlay').style.display = 'none';
    isGameRunning = false; cancelAnimationFrame(gameInterval);
    document.removeEventListener('keydown', handleInput); 
    canvas.removeEventListener('touchstart', jump);
}
function initFlappy() {
    bird = { x: 50, y: 200, velocity: 0, size: 20 }; pipes = []; score = 0; gameFrame = 0; isGameRunning = true;
    document.getElementById('game-score').innerText = score; animate();
}
function handleInput(e) { if (e.code === 'Space') { jump(); e.preventDefault(); } }

// UPDATED JUMP: Handles both Key presses and Touch events
function jump(e) { 
    // If it's a touch, stop browser scrolling
    if (e && e.type === 'touchstart') e.preventDefault();
    if (!isGameRunning) return; 
    bird.velocity = JUMP; 
}

function animate() {
    if (!isGameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.velocity += GRAVITY; bird.y += bird.velocity;
    ctx.fillStyle = '#00ff9c'; ctx.fillRect(bird.x, bird.y, bird.size, bird.size);
    if (gameFrame % PIPE_SPAWN_RATE === 0) {
        const gapHeight = 120; const minPipe = 50; const maxPipe = canvas.height - gapHeight - minPipe;
        const topHeight = Math.floor(Math.random() * (maxPipe - minPipe + 1) + minPipe);
        pipes.push({ x: canvas.width, topHeight: topHeight, bottomY: topHeight + gapHeight, width: 40, passed: false });
    }
    for (let i = 0; i < pipes.length; i++) {
        let p = pipes[i]; p.x -= PIPE_SPEED;
        ctx.fillStyle = '#ff3333'; 
        ctx.fillRect(p.x, 0, p.width, p.topHeight);
        ctx.fillRect(p.x, p.bottomY, p.width, canvas.height - p.bottomY);
        if (bird.x < p.x + p.width && bird.x + bird.size > p.x && (bird.y < p.topHeight || bird.y + bird.size > p.bottomY)) { gameOver(); return; }
        if (p.x + p.width < bird.x && !p.passed) { score++; document.getElementById('game-score').innerText = score; p.passed = true; }
        if (p.x + p.width < 0) { pipes.shift(); i--; }
    }
    if (bird.y + bird.size > canvas.height || bird.y < 0) { gameOver(); return; }
    gameFrame++; gameInterval = requestAnimationFrame(animate);
}
function gameOver() {
    isGameRunning = false; cancelAnimationFrame(gameInterval);
    ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff'; ctx.font = '30px "VT323"'; ctx.textAlign = 'center';
    ctx.fillText("PACKET DROPPED", canvas.width/2, canvas.height/2);
    ctx.font = '20px "VT323"'; ctx.fillText("Press SPACE to Retry", canvas.width/2, canvas.height/2 + 40);
    document.addEventListener('keydown', restartListener); canvas.addEventListener('touchstart', restartListener);
}
function restartListener(e) {
    if (e.code === 'Space' || e.type === 'touchstart') {
        document.removeEventListener('keydown', restartListener); canvas.removeEventListener('touchstart', restartListener); initFlappy();
    }
}

// --- 10. PROJECT SECTION MINI-TOOL (PUBLIC) ---
function simpleEncryptProj() {
    const input = document.getElementById('cypher-input-proj').value; const output = document.getElementById('cypher-output-proj');
    if(!input) { output.innerText = "> ERROR: EMPTY INPUT"; output.style.color = "var(--alert)"; return; }
    try { const encrypted = btoa(input); output.style.color = "var(--accent)"; output.innerText = `> ${encrypted}`; } 
    catch(e) { output.style.color = "var(--alert)"; output.innerText = "> ERROR: INVALID CHARACTERS"; }
}

// UPDATED: Enter Key listener for Project Tool
function checkEnterProj(e) {
    if(e.key === "Enter") simpleEncryptProj();
}