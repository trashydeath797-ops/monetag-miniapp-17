'use strict';

// Telegram WebApp ready
if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.ready();
}

// Initialize points from localStorage
let points = parseInt(localStorage.getItem('points')) || 0;
updatePointsDisplay();

// Inject Monetag SDK for Rewarded Interstitial (Watch Ads)
const monetagScriptRewarded = document.createElement('script');
monetagScriptRewarded.src = 'https://domain.com/sdk.js'; // Replace with actual Monetag SDK URL
monetagScriptRewarded.dataset.zone = '9628731';
monetagScriptRewarded.dataset.sdk = 'show_9628731';
document.head.appendChild(monetagScriptRewarded);

// (Optional) Inject Monetag SDK for In-App Interstitial (if needed)
const monetagScriptInApp = document.createElement('script');
monetagScriptInApp.src = 'https://domain.com/sdk.js'; // Replace with actual Monetag SDK URL
monetagScriptInApp.dataset.zone = '9628734';
monetagScriptInApp.dataset.sdk = 'show_9628734';
document.head.appendChild(monetagScriptInApp);

// Check for referral start_param and reward points once
if (window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe) {
    const startParam = Telegram.WebApp.initDataUnsafe.start_param;
    if (startParam && !localStorage.getItem('refClaimed')) {
        points += 500;
        localStorage.setItem('points', points);
        localStorage.setItem('refClaimed', 'true');
        updatePointsDisplay();
        alert((500).toLocaleString('bn') + ' পয়েন্ট বোনাস হিসেবে যোগ করা হয়েছে।');
    }
}

// Watch Ads button handler
const watchAdBtn = document.getElementById('watchAdsBtn');
if (watchAdBtn) {
    watchAdBtn.addEventListener('click', function() {
        if (window.show_9628731) {
            show_9628731().then(res => {
                // Add points on ad completion
                points += 40;
                localStorage.setItem('points', points);
                updatePointsDisplay();
                alert((40).toLocaleString('bn') + ' পয়েন্ট যুক্ত করা হয়েছে।');
            }).catch(err => {
                console.error(err);
                alert('কোনও অ্যাড পাওয়া যায়নি, পরে আবার চেষ্টা করুন।');
            });
        } else {
            alert('অ্যাড লোডিং চলছে, দয়া করে কয়েক সেকেন্ড অপেক্ষা করুন।');
        }
    });
}

// Referral button handler: share app link
const referralBtn = document.getElementById('referralBtn');
if (referralBtn) {
    referralBtn.addEventListener('click', function() {
        const appUrl = window.location.href;
        const text = 'আমার রেফারেল লিঙ্ক: ' + appUrl;
        const shareUrl = 'https://t.me/share/url?url=' + encodeURIComponent(appUrl) + '&text=' + encodeURIComponent(text);
        window.open(shareUrl, '_blank');
    });
}

// Bonus button handler (daily bonus)
const bonusBtn = document.getElementById('bonusBtn');
if (bonusBtn) {
    bonusBtn.addEventListener('click', function() {
        const today = new Date().toLocaleDateString();
        if (localStorage.getItem('lastBonusDate') !== today) {
            const bonus = 100;
            points += bonus;
            localStorage.setItem('points', points);
            localStorage.setItem('lastBonusDate', today);
            updatePointsDisplay();
            alert('অভিনন্দন! আপনি ' + bonus.toLocaleString('bn') + ' পয়েন্ট বোনাস পেয়েছেন।');
        } else {
            alert('আপনি আজ ইতিমধ্যেই বোনাস পয়েন্ট নিয়েছেন।');
        }
    });
}

// Withdraw form submission handler
const withdrawForm = document.getElementById('withdrawForm');
if (withdrawForm) {
    withdrawForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Get selected payment method
        let selectedMethod = '';
        const methods = document.getElementsByName('paymentMethod');
        for (const m of methods) {
            if (m.checked) {
                selectedMethod = m.value;
                break;
            }
        }
        if (!selectedMethod) {
            alert('অনুগ্রহ করে পেমেন্ট পদ্ধতি নির্বাচন করুন।');
            return;
        }
        // Get payment number/ID and amount
        const paymentId = document.getElementById('numberInput').value.trim();
        if (!paymentId) {
            alert('অনুগ্রহ করে নম্বর/আইডি লিখুন।');
            return;
        }
        const amountTaka = parseInt(document.getElementById('amountInput').value);
        if (isNaN(amountTaka) || amountTaka <= 0) {
            alert('বৈধ পরিমাণ লিখুন।');
            return;
        }
        if (amountTaka < 10) {
            alert('ন্যূনতম উত্তোলনের পরিমাণ ১০ টাকা।');
            return;
        }
        if (amountTaka % 10 !== 0) {
            alert('পরিমাণ ১০ টাকার গুণে দিতে হবে।');
            return;
        }
        const requiredPoints = amountTaka * 500;
        if (points < requiredPoints) {
            alert('আপনার পর্যাপ্ত পয়েন্ট নেই।');
            return;
        }
        // Prepare Telegram message
        const token = '7334095574:AAH23O4Edwq-AvRNxvpDemnPEHTRGoFOl20';
        const chatId = '@shikto237277';
        const user = Telegram.WebApp.initDataUnsafe.user;
        const userName = user.first_name || 'ব্যবহারকারী';
        const userId = user.id;
        const message = `ব্যবহারকারী ${userName} (#${userId}) একটি উত্তোলন অনুরোধ করেছে। পদ্ধতি: ${selectedMethod}, নম্বর/আইডি: ${paymentId}, পরিমাণ: ${amountTaka} টাকা।`;
        // Send withdrawal request to Telegram channel
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                // Deduct points and inform user
                points -= requiredPoints;
                localStorage.setItem('points', points);
                updatePointsDisplay();
                alert('আপনার উত্তোলনের অনুরোধ সফলভাবে প্রেরিত হয়েছে।');
                withdrawForm.reset();
            } else {
                alert('ত্রুটি হয়েছে: ' + data.description);
            }
        })
        .catch(err => {
            console.error(err);
            alert('যোগাযোগে ত্রুটি হয়েছে। আবার চেষ্টা করুন।');
        });
    });
}

// Update points display on UI
function updatePointsDisplay() {
    const pointsEl = document.getElementById('pointsDisplay');
    if (pointsEl) {
        pointsEl.innerText = points.toLocaleString('bn');
    }
}