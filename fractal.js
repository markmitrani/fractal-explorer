// Main fractal visualization system
let fractalType = 'A';
let unfoldingLevel = 0;
let targetLevel = 0;
let maxLevel = 4; // 0-4 for 5 levels as shown in the image
let particles = [];
let lastScrollTime = 0;
let scrollThreshold = 300;
let isTransitioning = false;
let canvas;
let offscreenBuffer;

// Level names for consciousness evolution
const levelNames = [
    "Base Consciousness", 
    "First Unfolding", 
    "Second Unfolding", 
    "Third Unfolding", 
    "Full Unfoldment"
];

// Create the p5 instance in instance mode
const sketch = (p) => {
    p.setup = function() {
        canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent('fractal-canvas');
        p.frameRate(30);
        p.pixelDensity(1);
        
        // Create offscreen buffer for fractal rendering
        offscreenBuffer = p.createGraphics(800, 800);
        
        // Initialize particles for glow effect
        initParticles();
        
        // Initial fractal render
        updateFractal();
    };

    p.draw = function() {
        p.background(0);
        
        // Smooth transition between levels
        if (Math.abs(unfoldingLevel - targetLevel) > 0.01) {
            unfoldingLevel = p.lerp(unfoldingLevel, targetLevel, 0.05);
            updateFractal();
        }
        
        // Display the fractal centered on screen
        p.imageMode(p.CENTER);
        p.image(offscreenBuffer, p.width/2, p.height/2, 
                Math.min(p.width, p.height) * 0.8, 
                Math.min(p.width, p.height) * 0.8);
        
        // Update and draw particles for glow effect
        updateParticles();
        drawParticles(p);
        
        // Update level display text
        document.getElementById('level-value').textContent = `Level ${Math.floor(unfoldingLevel)}`;
        document.getElementById('level-name').textContent = levelNames[Math.floor(unfoldingLevel)];
    };

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
};

// Create a new p5 instance
new p5(sketch);

// ======= FRACTAL GENERATION FUNCTIONS =======

function updateFractal() {
    offscreenBuffer.background(0);
    offscreenBuffer.noStroke();
    offscreenBuffer.fill(255);
    
    // Clear particles to regenerate based on new fractal
    particles = [];
    
    // Determine the effective level (blend between discrete levels)
    const baseLevel = Math.floor(unfoldingLevel);
    const nextLevel = Math.min(baseLevel + 1, maxLevel);
    const blendFactor = unfoldingLevel - baseLevel;
    
    // Generate the appropriate fractal
    switch(fractalType) {
        case 'A':
            generateFractalA(baseLevel, nextLevel, blendFactor);
            break;
        case 'B':
            generateFractalB(baseLevel, nextLevel, blendFactor);
            break;
        case 'C':
            generateFractalC(baseLevel, nextLevel, blendFactor);
            break;
        case 'D':
            generateFractalD(baseLevel, nextLevel, blendFactor);
            break;
    }
}

// Fractal A: Boundary-based fractal similar to Julia set variant
function generateFractalA(baseLevel, nextLevel, blend) {
    offscreenBuffer.loadPixels();
    
    const w = offscreenBuffer.width;
    const h = offscreenBuffer.height;
    const baseDetail = Math.pow(2, baseLevel + 1) * 10;
    const nextDetail = Math.pow(2, nextLevel + 1) * 10;
    const detail = Math.floor(baseDetail * (1 - blend) + nextDetail * blend);
    
    // Set initial conditions that match the pattern in the image
    const centerX = -0.1;
    const centerY = 0.8;
    const scale = 1.8;
    
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            // Map to complex plane
            const a = scale * (x - w/2) / (w/2) + centerX;
            const b = scale * (y - h/2) / (h/2) + centerY;
            
            // Initial condition
            let za = a;
            let zb = b;
            let i = 0;
            
            // Iterate until escape or max iterations reached
            while (i < detail && za*za + zb*zb < 4) {
                const temp = za*za - zb*zb + 0.28;
                zb = 2*za*zb + 0.01;
                za = temp;
                i++;
            }
            
            // Color pixels based on whether the point escapes
            const idx = 4 * (y * w + x);
            if (i === detail) {
                offscreenBuffer.pixels[idx] = 255;  // R
                offscreenBuffer.pixels[idx+1] = 255;  // G
                offscreenBuffer.pixels[idx+2] = 255;  // B
                offscreenBuffer.pixels[idx+3] = 255;  // A
                
                // Add glow particles sparsely
                if (Math.random() < 0.001) {
                    addGlowParticle(x / w * offscreenBuffer.width, y / h * offscreenBuffer.height);
                }
            } else {
                offscreenBuffer.pixels[idx] = 0;
                offscreenBuffer.pixels[idx+1] = 0;
                offscreenBuffer.pixels[idx+2] = 0;
                offscreenBuffer.pixels[idx+3] = 255;
            }
        }
    }
    
    offscreenBuffer.updatePixels();
}

// Fractal B: Similar to A but with different parameters
function generateFractalB(baseLevel, nextLevel, blend) {
    offscreenBuffer.loadPixels();
    
    const w = offscreenBuffer.width;
    const h = offscreenBuffer.height;
    const baseDetail = Math.pow(2, baseLevel + 1) * 10;
    const nextDetail = Math.pow(2, nextLevel + 1) * 10;
    const detail = Math.floor(baseDetail * (1 - blend) + nextDetail * blend);
    
    // Different parameters for fractal B
    const centerX = 0.3;
    const centerY = -0.01;
    const scale = 1.5;
    
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            // Map to complex plane
            const a = scale * (x - w/2) / (w/2) + centerX;
            const b = scale * (y - h/2) / (h/2) + centerY;
            
            // Initial condition
            let za = a;
            let zb = b;
            let i = 0;
            
            // Different equation for fractal B
            while (i < detail && za*za + zb*zb < 4) {
                const temp = za*za - zb*zb - 0.7;
                zb = 2*za*zb + 0.27;
                za = temp;
                i++;
            }
            
            // Color pixels based on whether the point escapes
            const idx = 4 * (y * w + x);
            if (i === detail) {
                offscreenBuffer.pixels[idx] = 255;
                offscreenBuffer.pixels[idx+1] = 255;
                offscreenBuffer.pixels[idx+2] = 255;
                offscreenBuffer.pixels[idx+3] = 255;
                
                // Add glow particles sparsely
                if (Math.random() < 0.001) {
                    addGlowParticle(x / w * offscreenBuffer.width, y / h * offscreenBuffer.height);
                }
            } else {
                offscreenBuffer.pixels[idx] = 0;
                offscreenBuffer.pixels[idx+1] = 0;
                offscreenBuffer.pixels[idx+2] = 0;
                offscreenBuffer.pixels[idx+3] = 255;
            }
        }
    }
    
    offscreenBuffer.updatePixels();
}

// Fractal C: Radial Sierpinski-like pattern
function generateFractalC(baseLevel, nextLevel, blend) {
    offscreenBuffer.background(0);
    offscreenBuffer.fill(255);
    
    // Initialize with a center circle
    const centerSize = 40;
    offscreenBuffer.ellipse(offscreenBuffer.width/2, offscreenBuffer.height/2, centerSize);
    
    // Draw the fractal flower pattern
    drawSierpinskiFlower(
        offscreenBuffer.width/2, 
        offscreenBuffer.height/2, 
        offscreenBuffer.width * 0.45, 
        baseLevel, 
        nextLevel, 
        blend
    );
}

function drawSierpinskiFlower(x, y, size, baseLevel, nextLevel, blend) {
    // Base case
    if (baseLevel <= 0 && nextLevel <= 0) return;
    
    // Draw petals in radial pattern
    const numPetals = 6;  // Hexagonal pattern as seen in image
    for (let i = 0; i < numPetals; i++) {
        const angle = i * (2 * Math.PI / numPetals);
        const dx = Math.cos(angle) * size;
        const dy = Math.sin(angle) * size;
        
        // Calculate petal size based on blend between levels
        const basePetalSize = Math.pow(0.5, baseLevel) * 20;
        const nextPetalSize = Math.pow(0.5, nextLevel) * 20;
        const petalSize = basePetalSize * (1 - blend) + nextPetalSize * blend;
        
        // Draw the petal
        const petalX = x + dx;
        const petalY = y + dy;
        
        offscreenBuffer.ellipse(petalX, petalY, petalSize * 2);
        
        // Add glow particle at petal position
        addGlowParticle(petalX, petalY);
        
        // Recursively draw sub-petals for next level
        if (baseLevel > 0 || nextLevel > 0) {
            // Determine next level recursion
            let nextBaseLevel = baseLevel > 0 ? baseLevel - 1 : 0;
            let nextNextLevel = nextLevel > 0 ? nextLevel - 1 : 0;
            
            drawSierpinskiFlower(
                petalX, 
                petalY, 
                size / 3, 
                nextBaseLevel,
                nextNextLevel, 
                blend
            );
        }
    }
}

// Fractal D: H-Tree fractal
function generateFractalD(baseLevel, nextLevel, blend) {
    offscreenBuffer.background(0);
    offscreenBuffer.stroke(255);
    offscreenBuffer.noFill();
    
    // Calculate effective detail level
    const effectiveLevel = baseLevel + blend;
    const strokeWeight = Math.max(1, 4 - effectiveLevel * 0.6);
    offscreenBuffer.strokeWeight(strokeWeight);
    
    // Start with H shape
    const size = offscreenBuffer.width * 0.25;
    drawHTreeFractal(
        offscreenBuffer.width/2, 
        offscreenBuffer.height/2, 
        size, 
        0, 
        Math.max(baseLevel, nextLevel)
    );
}

function drawHTreeFractal(x, y, size, level, maxLevel) {
    if (level > maxLevel) return;
    
    // Draw the H
    const halfSize = size / 2;
    
    // Horizontal bar of H
    offscreenBuffer.line(x - halfSize, y, x + halfSize, y);
    
    // Left vertical bar
    offscreenBuffer.line(x - halfSize, y - halfSize, x - halfSize, y + halfSize);
    
    // Right vertical bar
    offscreenBuffer.line(x + halfSize, y - halfSize, x + halfSize, y + halfSize);
    
    // Add glow particles at endpoints
    if (level >= 1) {
        addGlowParticle(x - halfSize, y - halfSize);
        addGlowParticle(x - halfSize, y + halfSize);
        addGlowParticle(x + halfSize, y - halfSize);
        addGlowParticle(x + halfSize, y + halfSize);
    }
    
    // Recursively draw next level
    const newSize = size / 2;
    
    // Upper left H
    drawHTreeFractal(x - halfSize, y - halfSize, newSize, level + 1, maxLevel);
    
    // Upper right H
    drawHTreeFractal(x + halfSize, y - halfSize, newSize, level + 1, maxLevel);
    
    // Lower left H
    drawHTreeFractal(x - halfSize, y + halfSize, newSize, level + 1, maxLevel);
    
    // Lower right H
    drawHTreeFractal(x + halfSize, y + halfSize, newSize, level + 1, maxLevel);
}

// ======= PARTICLE SYSTEM FOR GLOW EFFECT =======

function initParticles() {
    particles = [];
}

function addGlowParticle(x, y) {
    // Limit particles to prevent performance issues
    if (particles.length > 1000) {
        particles.shift(); // Remove oldest particle
    }
    
    // Map to screen coordinates
    const screenX = x;
    const screenY = y;
    
    particles.push({
        x: screenX,
        y: screenY,
        size: Math.random() * 4 + 2,
        life: Math.random() * 40 + 20,
        maxLife: Math.random() * 40 + 20,
        vx: Math.random() * 0.6 - 0.3,
        vy: Math.random() * 0.6 - 0.3
    });
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        // Update position with slight movement
        particles[i].x += particles[i].vx;
        particles[i].y += particles[i].vy;
        
        // Decrease life
        particles[i].life--;
        
        // Remove dead particles
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles(p) {
    p.push();
    p.noStroke();
    
    // Calculate scale to match fractal display
    const scale = Math.min(p.width, p.height) * 0.8 / offscreenBuffer.width;
    p.translate(p.width/2, p.height/2);
    
    for (let particle of particles) {
        // Calculate opacity based on life
        const opacity = p.map(particle.life, 0, particle.maxLife, 0, 0.8);
        p.fill(255, 255, 255, opacity * 255);
        
        // Position relative to center
        const displayX = (particle.x - offscreenBuffer.width/2) * scale;
        const displayY = (particle.y - offscreenBuffer.height/2) * scale;
        
        // Draw the particle
        p.ellipse(displayX, displayY, particle.size * scale);
        
        // Draw glow effect
        p.drawingContext.shadowBlur = 15;
        p.drawingContext.shadowColor = 'rgba(255, 255, 255, 0.7)';
        p.ellipse(displayX, displayY, particle.size * 0.8 * scale);
        p.drawingContext.shadowBlur = 0;
    }
    p.pop();
}

// ======= EVENT HANDLERS =======

// Handle scrolling to change levels
window.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    const now = Date.now();
    if (now - lastScrollTime < scrollThreshold) return;
    lastScrollTime = now;
    
    if (isTransitioning) return;
    
    if (e.deltaY < 0 && targetLevel < maxLevel) {
        // Scroll up - higher level
        targetLevel += 1;
        triggerTransitionEffect();
    } else if (e.deltaY > 0 && targetLevel > 0) {
        // Scroll down - lower level
        targetLevel -= 1;
        triggerTransitionEffect();
    }
}, { passive: false });

// Handle keyboard navigation
window.addEventListener('keydown', (e) => {
    if (isTransitioning) return;
    
    if ((e.key === 'ArrowUp' || e.key === 'ArrowRight') && targetLevel < maxLevel) {
        targetLevel += 1;
        triggerTransitionEffect();
    } else if ((e.key === 'ArrowDown' || e.key === 'ArrowLeft') && targetLevel > 0) {
        targetLevel -= 1;
        triggerTransitionEffect();
    }
});

// Handle fractal type selection
document.querySelectorAll('.fractal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.fractal-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        fractalType = btn.getAttribute('data-type');
        
        // Reset particles when changing fractal type
        particles = [];
        
        // Update fractal immediately
        updateFractal();
    });
});

// Handle touch events for mobile
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

window.addEventListener('touchmove', (e) => {
    if (isTransitioning) return;
    
    const touchY = e.touches[0].clientY;
    const diff = touchStartY - touchY;
    
    if (Math.abs(diff) > 50) {
        if (diff > 0 && targetLevel < maxLevel) {
            // Swipe up - higher level
            targetLevel += 1;
            triggerTransitionEffect();
        } else if (diff < 0 && targetLevel > 0) {
            // Swipe down - lower level
            targetLevel -= 1;
            triggerTransitionEffect();
        }
        touchStartY = touchY;
    }
});

// Add visual feedback during transitions
function triggerTransitionEffect() {
    isTransitioning = true;
    
    const levelDisplay = document.getElementById('level-display');
    levelDisplay.classList.add('fade-out');
    
    setTimeout(() => {
        levelDisplay.classList.remove('fade-out');
        levelDisplay.classList.add('fade-in');
        
        setTimeout(() => {
            levelDisplay.classList.remove('fade-in');
            isTransitioning = false;
        }, 500);
    }, 500);
}

// Prevent default scrolling behavior
document.addEventListener('wheel', (e) => {
    e.preventDefault();
}, { passive: false });
