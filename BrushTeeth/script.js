document.addEventListener('DOMContentLoaded', () => {
    // กำหนด Element ต่างๆ
    const startScreen = document.getElementById('start-screen');
    const countdownScreen = document.getElementById('countdown-screen');
    const brushingScreen = document.getElementById('brushing-screen');
    const changeSideScreen = document.getElementById('change-side-screen'); // หน้าเปลี่ยนด้าน
    const endScreen = document.getElementById('end-screen'); // หน้าจบ
    
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const countdownDisplay = document.getElementById('countdown-display');
    const brushingVideo = document.getElementById('brushing-video');

    // รายการวิดีโอแปรงฟันของคุณ (ใส่ path relative)
    const videoList = [
        'videos/brushing_1.mp4',
        'videos/brushing_2.mp4',
        'videos/brushing_3.mp4',
        // เพิ่มวิดีโออื่นๆ ที่นี่ ตามลำดับการแปรงแต่ละด้าน
    ];

    let currentVideoIndex = 0;
    const CHANGE_SIDE_DISPLAY_TIME = 2000; // แสดงหน้า "เปลี่ยนด้าน" 2 วินาที

    // --- ฟังก์ชันควบคุมหน้าจอ ---
    function showScreen(screenId) {
        // ซ่อนทุกหน้าจอ
        startScreen.classList.add('hidden');
        countdownScreen.classList.add('hidden');
        brushingScreen.classList.add('hidden');
        changeSideScreen.classList.add('hidden'); // เพิ่มหน้านี้
        endScreen.classList.add('hidden');

        // แสดงหน้าจอที่ระบุ
        document.getElementById(screenId).classList.remove('hidden');
    }

    // --- เริ่มต้นกระบวนการ ---
    startButton.addEventListener('click', () => {
        showScreen('countdown-screen');
        startCountdown();
    });

    restartButton.addEventListener('click', () => {
        currentVideoIndex = 0; // รีเซ็ตดัชนีวิดีโอ
        showScreen('countdown-screen');
        startCountdown();
    });

    // --- นับถอยหลัง 3 2 1 ---
    function startCountdown() {
        let count = 3;
        countdownDisplay.textContent = count;

        const countdownInterval = setInterval(() => {
            count--;
            countdownDisplay.textContent = count;
            if (count === 0) {
                clearInterval(countdownInterval);
                showScreen('brushing-screen');
                startBrushingProcess(); // เริ่มกระบวนการแปรงฟัน
            }
        }, 1000);
    }

    // --- กระบวนการแปรงฟัน (เล่นวิดีโอและเปลี่ยนด้าน) ---
    function startBrushingProcess() {
        if (currentVideoIndex < videoList.length) {
            brushingVideo.src = videoList[currentVideoIndex];
            brushingVideo.load();

            // เพิ่ม Event Listener เพื่อตรวจจับเมื่อวิดีโอเล่นจบ
            brushingVideo.onended = () => {
                // ถ้าไม่ใช่คลิปสุดท้าย ให้แสดงหน้า "เปลี่ยนด้าน"
                if (currentVideoIndex < videoList.length - 1) {
                    showScreen('change-side-screen');
                    setTimeout(() => {
                        currentVideoIndex++; // ไปยังวิดีโอถัดไป
                        showScreen('brushing-screen'); // กลับไปหน้าวิดีโอ
                        startBrushingProcess(); // เล่นวิดีโอถัดไป
                    }, CHANGE_SIDE_DISPLAY_TIME); // แสดงหน้าเปลี่ยนด้านตามเวลาที่กำหนด
                } else {
                    // ถ้าเป็นคลิปสุดท้ายแล้ว ให้แสดงหน้าจบ
                    showScreen('end-screen');
                    // หยุดวิดีโอและรีเซ็ตตำแหน่งเล่น
                    brushingVideo.pause();
                    brushingVideo.currentTime = 0;
                }
            };

            // พยายามเล่นวิดีโอ
            brushingVideo.play().catch(error => {
                console.error("Video autoplay failed:", error);
                // อาจจะต้องแจ้งให้ผู้ใช้แตะหน้าจอเพื่อเล่นวิดีโอด้วยตนเอง
                // ในบางเบราว์เซอร์ หาก autoplay ถูกบล็อก
            });

        } else {
            // กรณีที่ไม่มีวิดีโอให้เล่นแล้ว (ควรแสดงหน้า end-screen ตั้งแต่ก่อนหน้านี้)
            showScreen('end-screen');
            brushingVideo.pause();
            brushingVideo.currentTime = 0;
        }
    }

    // --- เริ่มต้นที่หน้า Start เสมอเมื่อโหลดหน้าเว็บ ---
    showScreen('start-screen');
});