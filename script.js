const items = [
    { type: 'prize', name: 'Google Cloud Prize', img: 'Google_cloud.png', message: 'คุณได้รับรางวัลสุดล้ำจาก Google Cloud!' },
    { type: 'prize', name: 'MFEC Prize', img: 'New-Logo-MFEC-More_Black-2.png', message: 'คุณได้รับรางวัลสุดคูลจาก MFEC!' },
    { type: 'miss', name: 'หุ่นยนต์แมงกะพรุน', img: 'cyber_jellyfish.jpg', message: 'ดวงยังไม่มา ได้แมงกะพรุนไซเบอร์ไปเลี้ยงแทนนะ' },
    { type: 'miss', name: 'รองเท้าไซเบอร์', img: 'cyber_boot.jpg', message: 'ว้าาา ตกได้รองเท้าบูทเก่าๆ ซะงั้น' },
    { type: 'miss', name: 'เปลือกหอยเรืองแสง', img: 'cyber_shell.jpg', message: 'เปลือกหอยว่างเปล่า... พยายามใหม่อีกครั้ง!' }
];

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
const resultTitle = document.getElementById('result-title');
const resultImage = document.getElementById('result-image');
const resultMessage = document.getElementById('result-message');

let isCatching = false;

catchBtn.addEventListener('click', () => {
    if (isCatching) return;
    isCatching = true;
    catchBtn.disabled = true;
    catchBtn.textContent = 'SCANNING...';
    
    // โอกาสได้รางวัล 10%
    const winRate = 0.10;
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
                caughtItem.classList.add('active');
                
                // Shake the container for suspense
                mainContainer.classList.add('shake');
                
                setTimeout(() => {
                    // Phase 4: REVEAL (Flash and show result)
                    mainContainer.classList.remove('shake');
                    flashOverlay.classList.add('active'); // White flash
                    
                    setTimeout(() => {
                        showResult(selectedItem);
                        
                        setTimeout(() => {
                            flashOverlay.classList.remove('active'); // Fade out flash
                        }, 200);
                        
                    }, 100);
                    
                }, 2000); // 2 seconds of shaking suspense
                
            }, 1000); // Wait for beam to hit water
            
        }, 800); // 0.8s target lock delay
        
    }, 1500); // 1.5s radar scanning
});

function showResult(item) {
    resultImage.innerHTML = ''; 
    const imgElement = document.createElement('img');
    imgElement.src = item.img;
    
    if (item.type === 'prize') {
        resultTitle.textContent = '🎉 BINGO! 🎉';
        resultTitle.style.color = '#fbbf24';
        resultTitle.style.textShadow = '0 0 20px rgba(251, 191, 36, 0.6)';
        imgElement.style.background = 'white';
        imgElement.style.padding = '20px';
        createBubbles();
    } else {
        resultTitle.textContent = 'ALMOST...';
        resultTitle.style.color = '#f43f5e';
        resultTitle.style.textShadow = '0 0 20px rgba(244, 63, 94, 0.6)';
    }
    
    resultImage.appendChild(imgElement);
    resultMessage.textContent = item.message;
    
    modal.classList.add('active');
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
});

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
