// ===== STARFIELD BACKGROUND =====
function initStarfield() {
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    let stars = [];
    const STAR_COUNT = 200;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2,
                color: ['#fff', '#ffeef5', '#f6e58d', '#a29bfe', '#fd79a8'][Math.floor(Math.random() * 5)]
            });
        }
    }

    function drawStars(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(star => {
            const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.globalAlpha = star.opacity * twinkle;
            ctx.fill();

            // Add glow to larger stars
            if (star.size > 1.5) {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
                const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
                gradient.addColorStop(0, star.color);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.globalAlpha = star.opacity * twinkle * 0.15;
                ctx.fill();
            }
        });
        ctx.globalAlpha = 1;
        requestAnimationFrame(drawStars);
    }

    window.addEventListener('resize', () => { resize(); createStars(); });
    resize();
    createStars();
    requestAnimationFrame(drawStars);
}

// ===== FLOATING HEARTS =====
function initFloatingHearts() {
    const container = document.getElementById('floating-hearts');
    const hearts = ['❤️', '💕', '💗', '💖', '💓', '🩷', '♥️', '🌸'];

    function spawnHeart() {
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 20 + 12) + 'px';
        heart.style.animationDuration = (Math.random() * 8 + 10) + 's';
        heart.style.animationDelay = '0s';
        container.appendChild(heart);

        setTimeout(() => heart.remove(), 18000);
    }

    // Spawn initial batch
    for (let i = 0; i < 8; i++) {
        setTimeout(spawnHeart, i * 500);
    }

    // Continuous spawning
    setInterval(spawnHeart, 2000);
}

// ===== SECTION TRANSITIONS =====
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => {
        s.classList.remove('active');
    });
    setTimeout(() => {
        document.getElementById(sectionId).classList.add('active');
    }, 500);
}

// ===== TYPEWRITER EFFECT =====
function triggerTypewriter() {
    const elements = document.querySelectorAll('.typewriter');
    elements.forEach(el => {
        const delay = parseInt(el.getAttribute('data-delay')) || 0;
        setTimeout(() => {
            el.classList.add('visible');
        }, delay);
    });

    // Show continue button after all text
    const btn = document.getElementById('btn-continue');
    setTimeout(() => {
        btn.classList.add('visible');
    }, 9000);
}

// Attempt to play the letter audio; if the browser blocks autoplay,
// show a small tap-to-play overlay so the user can manually start it.
function playLetterAudioWithFallback() {
    const audio = document.getElementById('letter-audio');
    if (!audio) return;

    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => {
            // Show overlay after a short delay if still paused
            setTimeout(() => {
                if (audio.paused) {
                    showLetterPlayOverlay(audio);
                }
            }, 200);
        });
    }
}

function showLetterPlayOverlay(audio) {
    // Avoid duplicating overlay
    if (document.getElementById('letter-play-overlay')) return;

    const overlay = document.createElement('button');
    overlay.id = 'letter-play-overlay';
    overlay.textContent = '▶ Play song';
    overlay.className = 'letter-play-overlay';

    overlay.addEventListener('click', () => {
        audio.play().catch(() => {});
        overlay.remove();
    });

    const paper = document.querySelector('.letter-paper');
    if (paper) paper.appendChild(overlay);
}

// ===== NO BUTTON DODGE =====
function initNoButtonDodge() {
    const btnNo = document.getElementById('btn-no');
    const container = document.getElementById('buttons-container');

    let dodgeCount = 0;

    btnNo.addEventListener('mouseenter', () => {
        dodgeCount++;

        // Move button to random position
        const containerRect = container.parentElement.getBoundingClientRect();
        const maxX = containerRect.width - btnNo.offsetWidth - 40;
        const maxY = containerRect.height / 2;
        const randomX = (Math.random() - 0.5) * maxX;
        const randomY = (Math.random() - 0.5) * maxY;

        btnNo.classList.add('running-away');
        btnNo.style.transform = `translate(${randomX}px, ${randomY}px) scale(${Math.max(0.5, 1 - dodgeCount * 0.08)})`;

        // Keep the original label unchanged while dodging
        // (prevents the button text from swapping while it moves)

        // After enough dodges, shrink it away
        if (dodgeCount > 6) {
            btnNo.style.opacity = Math.max(0.1, 1 - dodgeCount * 0.12);
            btnNo.style.fontSize = Math.max(0.5, 1 - dodgeCount * 0.06) + 'rem';
        }
    });

    // Also handle touch for mobile
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault();
        dodgeCount++;
        const containerRect = container.parentElement.getBoundingClientRect();
        const maxX = containerRect.width - btnNo.offsetWidth - 40;
        const maxY = containerRect.height / 2;
        const randomX = (Math.random() - 0.5) * maxX;
        const randomY = (Math.random() - 0.5) * maxY;

        btnNo.classList.add('running-away');
        btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;

        // Keep the original label unchanged on touch as well
    });
}

// ===== CONFETTI =====
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiPieces = [];
    const PIECE_COUNT = 150;
    const colors = ['#e84393', '#fd79a8', '#f6e58d', '#a29bfe', '#fab1a0', '#ff6b6b', '#ffd93d', '#ff85a1'];
    const shapes = ['circle', 'rect', 'heart'];

    for (let i = 0; i < PIECE_COUNT; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: -20 - Math.random() * canvas.height,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            speedY: Math.random() * 3 + 2,
            speedX: (Math.random() - 0.5) * 4,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            opacity: 1,
            wobble: Math.random() * 10
        });
    }

    function drawHeart(ctx, x, y, size) {
        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(x, y + topCurveHeight);
        ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
        ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.5, x, y + size);
        ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.5, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
        ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
        ctx.fill();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let activeCount = 0;

        confettiPieces.forEach(piece => {
            if (piece.opacity <= 0) return;
            activeCount++;

            piece.y += piece.speedY;
            piece.x += piece.speedX + Math.sin(piece.y * 0.02) * piece.wobble * 0.1;
            piece.rotation += piece.rotationSpeed;

            if (piece.y > canvas.height - 100) {
                piece.opacity -= 0.02;
            }

            ctx.save();
            ctx.translate(piece.x, piece.y);
            ctx.rotate((piece.rotation * Math.PI) / 180);
            ctx.globalAlpha = piece.opacity;
            ctx.fillStyle = piece.color;

            if (piece.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, piece.size / 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (piece.shape === 'rect') {
                ctx.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2);
            } else {
                drawHeart(ctx, 0, 0, piece.size);
            }

            ctx.restore();
        });

        if (activeCount > 0) {
            requestAnimationFrame(animate);
        }
    }

    animate();

    // Multiple bursts
    setTimeout(() => {
        for (let i = 0; i < 80; i++) {
            confettiPieces.push({
                x: Math.random() * canvas.width,
                y: -20 - Math.random() * 200,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                shape: shapes[Math.floor(Math.random() * shapes.length)],
                speedY: Math.random() * 3 + 2,
                speedX: (Math.random() - 0.5) * 4,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                opacity: 1,
                wobble: Math.random() * 10
            });
        }
    }, 1500);
}

// ===== HEARTS RAIN FOR CELEBRATION =====
function launchHeartsRain() {
    const container = document.getElementById('celebration');
    const hearts = ['❤️', '💕', '💗', '💖', '💓', '🩷', '🌹', '✨', '💫'];

    function spawnCelebHeart() {
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 28 + 16) + 'px';
        heart.style.animationDuration = (Math.random() * 4 + 4) + 's';
        heart.style.opacity = 0.4;
        heart.style.filter = 'blur(0px)';
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 8000);
    }

    for (let i = 0; i < 20; i++) {
        setTimeout(spawnCelebHeart, i * 200);
    }

    setInterval(spawnCelebHeart, 500);
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
    initStarfield();
    initFloatingHearts();

    // Open envelope → Letter
    document.getElementById('btn-open').addEventListener('click', () => {
        showSection('letter');
        setTimeout(triggerTypewriter, 600);

        // Play letter audio (if present)
        const audio = document.getElementById('letter-audio');
        if (audio) {
            playLetterAudioWithFallback();
        }
    });

    // Also click envelope
    document.getElementById('envelope').addEventListener('click', () => {
        showSection('letter');
        setTimeout(triggerTypewriter, 600);

        // Play letter audio (if present)
        const audio = document.getElementById('letter-audio');
        if (audio) {
            playLetterAudioWithFallback();
        }
    });

    // Continue → Question
    document.getElementById('btn-continue').addEventListener('click', () => {
        showSection('question');

        // Trigger word animations after section transition
        setTimeout(() => {
            const words = document.querySelectorAll('.word');
            words.forEach((w, index) => {
                setTimeout(() => w.classList.add('visible'), index * 300 + 200);
            });
            // Show buttons after all words appear
            setTimeout(() => {
                document.getElementById('buttons-container').classList.add('visible');
            }, words.length * 300 + 800);
        }, 600);

        initNoButtonDodge();
    });

    // Yes button → Celebration!!
    document.getElementById('btn-yes').addEventListener('click', () => {
        showSection('celebration');
        setTimeout(launchConfetti, 300);
        setTimeout(launchHeartsRain, 500);
    });
});
