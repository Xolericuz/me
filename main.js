/* ============================================
   XOLERIC — Main JavaScript
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        loaderDuration: 2500,
        neuroNodes: 50,
        neuroSpeed: 0.4,
        matrixSpeed: 30,
        scrollOffset: 150
    };

    // ============================================
    // DOM REFERENCES
    // ============================================
    const dom = {
        loader: document.getElementById('loader'),
        loaderProgress: document.getElementById('loader-progress'),
        loaderStatus: document.getElementById('loader-status'),
        neuroCanvas: document.getElementById('neuro-canvas'),
        matrixCanvas: document.getElementById('matrix-canvas'),
        portal: document.getElementById('portal'),
        navbar: document.querySelector('.navbar'),
        navLinks: document.querySelectorAll('.nav-link'),
        projectCards: document.querySelectorAll('.project-card')
    };

    // ============================================
    // LOAD MESSAGES
    // ============================================
    const loadMessages = [
        'INITIALIZING',
        'LOADING CORE',
        'SYNCING DATA',
        'SYSTEM READY'
    ];

    const projectLinks = {
        'xoleric-os': 'https://xolericuz.github.io/xoleric.os/',
        'savodhon': 'https://xolericuz.github.io/Savodhon/',
        'nano-game': 'https://xolericuz.github.io/nano-game/',
        'nano-book': 'https://xolericuz.github.io/nanobook/'
    };

    // ============================================
    // MATRIX RAIN
    // ============================================
    let matrixCtx, matrixCols, matrixDrops;

    function initMatrix() {
        if (!dom.matrixCanvas) return;
        
        const canvas = dom.matrixCanvas;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        matrixCtx = canvas.getContext('2d');
        
        const chars = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱ0123456789';
        matrixCols = Math.floor(canvas.width / 12);
        matrixDrops = Array(matrixCols).fill(1);
    }

    function drawMatrix() {
        if (!matrixCtx) return;
        
        matrixCtx.fillStyle = 'rgba(2, 2, 8, 0.05)';
        matrixCtx.fillRect(0, 0, dom.matrixCanvas.width, dom.matrixCanvas.height);
        
        matrixCtx.fillStyle = '#00e5ff';
        matrixCtx.font = '12px monospace';
        
        for (let i = 0; i < matrixDrops.length; i++) {
            const char = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱ0123456789'[Math.floor(Math.random() * 40)];
            matrixCtx.fillText(char, i * 12, matrixDrops[i] * 12);
            
            if (matrixDrops[i] * 12 > dom.matrixCanvas.height && Math.random() > 0.975) {
                matrixDrops[i] = 0;
            }
            matrixDrops[i]++;
        }
    }

    // ============================================
    // NEURAL NETWORK BACKGROUND
    // ============================================
    let neuroCtx, neuroNodes, mouseX = 0, mouseY = 0;

    function initNeuro() {
        if (!dom.neuroCanvas) return;
        
        const canvas = dom.neuroCanvas;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        neuroCtx = canvas.getContext('2d');
        
        neuroNodes = [];
        for (let i = 0; i < CONFIG.neuroNodes; i++) {
            neuroNodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * CONFIG.neuroSpeed,
                vy: (Math.random() - 0.5) * CONFIG.neuroSpeed,
                r: Math.random() * 2 + 1
            });
        }
    }

    function animateNeuro() {
        if (!neuroCtx) return;
        
        neuroCtx.clearRect(0, 0, dom.neuroCanvas.width, dom.neuroCanvas.height);
        
        neuroNodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            if (node.x < 0 || node.x > dom.neuroCanvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > dom.neuroCanvas.height) node.vy *= -1;
            
            // Mouse interaction
            const dx = mouseX - node.x;
            const dy = mouseY - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                node.x -= dx * 0.01;
                node.y -= dy * 0.01;
            }
            
            // Draw node
            neuroCtx.beginPath();
            neuroCtx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
            neuroCtx.fillStyle = 'rgba(0, 229, 255, 0.5)';
            neuroCtx.fill();
        });
        
        // Draw connections
        for (let i = 0; i < neuroNodes.length; i++) {
            for (let j = i + 1; j < neuroNodes.length; j++) {
                const dx = neuroNodes[i].x - neuroNodes[j].x;
                const dy = neuroNodes[i].y - neuroNodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 150) {
                    neuroCtx.beginPath();
                    neuroCtx.moveTo(neuroNodes[i].x, neuroNodes[i].y);
                    neuroCtx.lineTo(neuroNodes[j].x, neuroNodes[j].y);
                    neuroCtx.strokeStyle = `rgba(0, 229, 255, ${0.1 * (1 - dist/150)})`;
                    neuroCtx.lineWidth = 0.5;
                    neuroCtx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animateNeuro);
    }

    // ============================================
    // LOADER
    // ============================================
    function startLoader() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 5;
            if (progress > 100) progress = 100;
            
            dom.loaderProgress.style.width = progress + '%';
            dom.loaderStatus.textContent = loadMessages[Math.min(Math.floor(progress / 25), 3)];
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    dom.loader.classList.add('hidden');
                }, 400);
            }
        }, 50);
    }

    // ============================================
    // PORTAL TRANSITION
    // ============================================
    window.openPortal = function(url) {
        dom.portal.classList.add('active');
        setTimeout(() => {
            window.open(url, '_blank');
        }, 500);
        setTimeout(() => {
            dom.portal.classList.remove('active');
        }, 1200);
    };

    // ============================================
    // SCROLL FUNCTIONS
    // ============================================
    window.scrollToTop = function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.scrollTo = function(index) {
        const sections = document.querySelectorAll('section');
        if (sections[index]) {
            sections[index].scrollIntoView({ behavior: 'smooth' });
        }
    };

    // ============================================
    // NAVIGATION ACTIVE STATE
    // ============================================
    function updateNavOnScroll() {
        const sections = document.querySelectorAll('section');
        let current = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight / 2) {
                current = section.id;
            }
        });
        
        dom.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // ============================================
    // PROJECT CARDS
    // ============================================
    function initProjectCards() {
        dom.projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const project = card.dataset.project;
                if (project && projectLinks[project]) {
                    openPortal(projectLinks[project]);
                }
            });
        });
    }

    // ============================================
    // MOUSE TRACKING
    // ============================================
    function initMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
    }

    // ============================================
    // RESIZE HANDLER
    // ============================================
    function handleResize() {
        initMatrix();
        initNeuro();
        
        if (dom.matrixCanvas) {
            matrixCols = Math.floor(dom.matrixCanvas.width / 12);
            matrixDrops = Array(matrixCols).fill(1);
        }
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        // Initialize canvases
        initMatrix();
        initNeuro();
        
        // Start animations
        setInterval(drawMatrix, CONFIG.matrixSpeed);
        requestAnimationFrame(animateNeuro);
        
        // Start loader
        startLoader();
        
        // Initialize interactions
        initMouseTracking();
        initProjectCards();
        
        // Scroll listener
        window.addEventListener('scroll', updateNavOnScroll);
        
        // Resize listener
        window.addEventListener('resize', handleResize);
        
        // Initial nav state
        updateNavOnScroll();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();