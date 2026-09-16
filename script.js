const items = [
    { type: 'prize', name: 'Google Cloud Prize', img: 'Google_cloud.png', message: 'คุณได้รับรางวัลสุดล้ำจาก Google Cloud!' },
    { type: 'prize', name: 'MFEC Prize', img: 'New-Logo-MFEC-More_Black-2.png', message: 'คุณได้รับรางวัลสุดคูลจาก MFEC!' },
    { type: 'miss', name: 'ไม่ได้', img: 'cyber_jellyfish.jpg', message: 'ไม่ได้รางวัลครับ... ลองพยายามใหม่อีกครั้งนะ!' },
    { type: 'miss', name: 'ไม่ได้', img: 'cyber_boot.jpg', message: 'ไม่ได้รางวัลครับ... ลองพยายามใหม่อีกครั้งนะ!' },
    { type: 'miss', name: 'ไม่ได้', img: 'cyber_shell.jpg', message: 'ไม่ได้รางวัลครับ... ลองพยายามใหม่อีกครั้งนะ!' }
];

// Preload images to prevent flickering/ghosting on Safari/iPad
items.forEach(item => {
    const img = new Image();
    img.src = item.img;
});

const catchBtn = document.getElementById('catch-btn');
const ripple = document.getElementById('ripple');
const radar = document.getElementById('radar');
const tractorBeam = document.getElementById('tractor-beam');
const caughtItem = document.getElementById('caught-item');
const mysteryOrb = document.getElementById('mystery-orb');
const caughtImg = document.getElementById('caught-img');
const mainContainer = document.getElementById('main-container');
const flashOverlay = document.getElementById('flash-overlay');

const modal = document.getElementById('result-modal');
const closeBtn = document.getElementById('close-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');

fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
});

const resultTitle = document.getElementById('result-title');
const resultImage = document.getElementById('result-image');
const resultMessage = document.getElementById('result-message');

let isCatching = false;

catchBtn.addEventListener('click', () => {
    if (isCatching) return;
    isCatching = true;
    catchBtn.disabled = true;
    catchBtn.textContent = 'SCANNING...';
    
    // โอกาสได้รางวัล 30%
    const winRate = 0.30;
    const isWinner = Math.random() < winRate;
    
    let selectedItem;
    if (isWinner) {
        const prizes = items.filter(i => i.type === 'prize');
        selectedItem = prizes[Math.floor(Math.random() * prizes.length)];
    } else {
        const misses = items.filter(i => i.type === 'miss');
        selectedItem = misses[Math.floor(Math.random() * misses.length)];
    }
    
    // Phase 1: SCANNING (Radar on water)
    radar.classList.add('active');
    
    setTimeout(() => {
        // Phase 2: TARGET LOCKED
        radar.classList.remove('active');
        ripple.classList.add('active');
        catchBtn.textContent = 'TARGET LOCKED';
        catchBtn.style.color = '#fff';
        catchBtn.style.background = 'var(--primary-pink)';
        
        setTimeout(() => {
            // Phase 3: EXTRACTING
            tractorBeam.classList.add('active');
            catchBtn.textContent = 'EXTRACTING...';
            
            setTimeout(() => {
                // Pull up the mystery orb
                caughtImg.style.display = 'none';
                mysteryOrb.style.display = 'flex';
                
                // เริ่มสลับรูปภาพใน Mystery Orb เพื่อความลุ้น
                mysteryOrb.innerHTML = '<img src="" style="width:70%; height:70%; object-fit:contain; filter:drop-shadow(0 0 10px #fff);">';
                const shuffleImg = mysteryOrb.querySelector('img');
                let shuffleIndex = 0;
                
                const shuffleInterval = setInterval(() => {
                    // สลับรูปไวๆ โชว์ให้เห็นว่ามีรางวัลอยู่จริง
                    shuffleImg.src = items[shuffleIndex % items.length].img;
                    shuffleIndex++;
                }, 100); // เปลี่ยนรูปทุกๆ 0.1 วินาที
                
                caughtItem.classList.add('active');
                
                // Shake the container for suspense
                mainContainer.classList.add('shake');
                
                setTimeout(() => {
                    clearInterval(shuffleInterval); // หยุดสลับรูป
                    
                    // Phase 4: REVEAL (Flash and show modal with spinning roulette)
                    mainContainer.classList.remove('shake');
                    flashOverlay.classList.add('active'); // White flash
                    
                    setTimeout(() => {
                        mysteryOrb.style.display = 'none';
                        caughtImg.style.display = 'block';
                        caughtImg.src = selectedItem.img; // Fix empty src issue
                        
                        showResultWithRoulette(selectedItem);
                        
                        setTimeout(() => {
                            flashOverlay.classList.remove('active'); // Fade out flash
                        }, 200);
                        
                    }, 100);
                    
                }, 2500); // 2.5 seconds of shaking suspense and shuffling

                
            }, 1000); // Wait for beam to hit water
            
        }, 800); // 0.8s target lock delay
        
    }, 1500); // 1.5s radar scanning
});

function showResultWithRoulette(finalItem) {
    modal.classList.add('active');
    resultTitle.textContent = 'REVEALING...';
    resultTitle.style.color = '#fff';
    resultTitle.style.textShadow = '0 0 15px #fff';
    resultTitle.classList.remove('fake-out-glitch');
    
    resultImage.innerHTML = '';
    const imgElement = document.createElement('img');
    resultImage.appendChild(imgElement);
    imgElement.style.background = 'transparent';
    imgElement.style.padding = '0';
    imgElement.classList.remove('fake-out-glitch');
    
    resultMessage.textContent = 'กำลังประมวลผล...';
    
    let spinCount = 0;
    const maxSpins = 15;
    let currentDelay = 40;
    
    function spin() {
        imgElement.src = items[spinCount % items.length].img;
        spinCount++;
        
        if (spinCount < maxSpins) {
            if (spinCount > 8) currentDelay += 20; // slow down
            setTimeout(spin, currentDelay);
        } else {
            renderFinalResult(finalItem, false, imgElement);
        }
    }
    
    spin();
}

function renderFinalResult(item, isTemporary, imgElement) {
    imgElement.src = item.img;
    resultMessage.textContent = item.message;
    
    if (item.type === 'prize') {
        resultTitle.textContent = '🎉 BINGO! 🎉';
        resultTitle.style.color = '#fbbf24';
        resultTitle.style.textShadow = '0 0 20px rgba(251, 191, 36, 0.6)';
        imgElement.style.background = 'white';
        imgElement.style.padding = '20px';
        if (!isTemporary) {
            createBubbles();
            createParticles('confetti');
        }
    } else {
        resultTitle.textContent = 'ไม่ได้รางวัล!';
        resultTitle.style.color = '#f43f5e';
        resultTitle.style.textShadow = '0 0 20px rgba(244, 63, 94, 0.6)';
        imgElement.style.background = 'transparent';
        imgElement.style.padding = '0';
        if (!isTemporary) {
            createParticles('sparks');
        }
    }
}

closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    
    // รีเซ็ตค่า
    ripple.classList.remove('active');
    tractorBeam.classList.remove('active');
    caughtItem.classList.remove('active');
    catchBtn.disabled = false;
    catchBtn.textContent = 'CATCH!';
    catchBtn.style.color = '';
    catchBtn.style.background = '';
    isCatching = false;
    
    // Clear elements
    document.querySelectorAll('.confetti, .spark').forEach(e => e.remove());
});

function createParticles(type) {
    const numParticles = type === 'confetti' ? 50 : 20;
    const colors = ['#fbbf24', '#00f0ff', '#ff003c', '#fff'];
    
    for (let i = 0; i < numParticles; i++) {
        const p = document.createElement('div');
        p.classList.add(type);
        
        if (type === 'confetti') {
            p.style.background = colors[Math.floor(Math.random() * colors.length)];
            p.style.left = `50%`;
            p.style.top = `50%`;
            const angle = Math.random() * Math.PI * 2;
            const velocity = 5 + Math.random() * 15;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            const duration = 1500 + Math.random() * 1000;
            
            p.animate([
                { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
                { transform: `translate(${vx * 20}px, ${vy * 20 + 200}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], { duration: duration, easing: 'cubic-bezier(0, .9, .57, 1)', fill: 'forwards' });
            
            setTimeout(() => p.remove(), duration);
        } else {
            p.style.left = `50%`;
            p.style.top = `50%`;
            const angle = Math.random() * Math.PI * 2;
            const velocity = 2 + Math.random() * 10;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            const duration = 500 + Math.random() * 500;
            
            p.animate([
                { transform: `translate(0, 0)`, opacity: 1 },
                { transform: `translate(${vx * 10}px, ${vy * 10}px)`, opacity: 0 }
            ], { duration: duration, easing: 'ease-out', fill: 'forwards' });
            
            setTimeout(() => p.remove(), duration);
        }
        
        document.body.appendChild(p);
    }
}

function createBubbles() {
    for (let i = 0; i < 40; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        const size = Math.random() * 20 + 10;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}vw`;
        
        const duration = Math.random() * 3 + 2;
        bubble.style.animation = `rise ${duration}s ease-in forwards`;
        bubble.style.animationDelay = `${Math.random()}s`;
        
        document.body.appendChild(bubble);
        
        setTimeout(() => {
            bubble.remove();
        }, (duration + 1) * 1000);
    }
}
