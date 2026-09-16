const items = [
    { type: 'prize', name: 'Google Cloud Prize', img: 'Google_cloud.png', message: 'คุณได้รับรางวัลสุดล้ำจาก Google Cloud!' },
    { type: 'prize', name: 'MFEC Prize', img: 'New-Logo-MFEC-More_Black-2.png', message: 'คุณได้รับรางวัลสุดคูลจาก MFEC!' },
    { type: 'miss', name: 'หุ่นยนต์แมงกะพรุน', img: 'cyber_jellyfish.jpg', message: 'ดวงยังไม่มา ได้แมงกะพรุนไซเบอร์ไปเลี้ยงแทนนะ' },
    { type: 'miss', name: 'รองเท้าไซเบอร์', img: 'cyber_boot.jpg', message: 'ว้าาา ตกได้รองเท้าบูทเก่าๆ ซะงั้น' },
    { type: 'miss', name: 'เปลือกหอยเรืองแสง', img: 'cyber_shell.jpg', message: 'เปลือกหอยว่างเปล่า... พยายามใหม่อีกครั้ง!' }
];

const catchBtn = document.getElementById('catch-btn');
const ripple = document.getElementById('ripple');
const tractorBeam = document.getElementById('tractor-beam');
const caughtItem = document.getElementById('caught-item');
const caughtImg = document.getElementById('caught-img');

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
    
    // เริ่มแอนิเมชันน้ำกระเพื่อม
    ripple.classList.add('active');
    
    setTimeout(() => {
        // ยิงลำแสง
        tractorBeam.classList.add('active');
        catchBtn.textContent = 'EXTRACTING!';
        
        setTimeout(() => {
            // ดึงของขึ้นมา
            caughtImg.src = selectedItem.img;
            if(selectedItem.type === 'prize') {
                caughtImg.style.background = 'white';
                caughtImg.style.padding = '15px';
            } else {
                caughtImg.style.background = 'transparent';
                caughtImg.style.padding = '0';
            }
            
            caughtItem.classList.add('active');
            
            setTimeout(() => {
                showResult(selectedItem);
            }, 1200);
            
        }, 1000); // รอจนแสงแตะผิวน้ำ
        
    }, 500); 
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
    
    // รีเซ็ตค่าเพื่อเล่นใหม่
    ripple.classList.remove('active');
    tractorBeam.classList.remove('active');
    caughtItem.classList.remove('active');
    catchBtn.disabled = false;
    catchBtn.textContent = 'CATCH!';
    isCatching = false;
});

// เอฟเฟกต์ฟองอากาศฉลองตอนได้รางวัล
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
