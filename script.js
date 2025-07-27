let userPoints = 0;

// Update UI
function updatePointsUI() {
  document.getElementById("points").innerText = userPoints;
}

// Show Monetag Rewarded Popup Ad
function showAd() {
  show_9628733('pop') // Use your own Zone ID
    .then(() => {
      userPoints += 40;
      updatePointsUI();
      alert("✅ You earned 40 points!");
    })
    .catch((e) => {
      console.error("Ad failed:", e);
    });
}

// Refer & Earn (Placeholder)
function referFriend() {
  alert("Refer system coming soon!\nRefer friends to earn 500 points.");
}

// Bonus (Join Telegram)
function showBonus() {
  window.open("https://t.me/shikto237277", "_blank");
  alert("✅ You joined the bonus channel.\n500 points will be added after verification.");
}

// Withdraw form toggle
function withdraw() {
  const form = document.getElementById("withdraw-form");
  form.classList.toggle("hidden");
}

// Withdraw submission (Placeholder logic)
function submitWithdraw() {
  const method = document.getElementById("method").value;
  const account = document.getElementById("account").value;
  const amount = parseInt(document.getElementById("amount").value);

  if (!account || isNaN(amount) || amount <= 0) {
    alert("❌ Please enter valid account and amount.");
    return;
  }

  if (amount > userPoints) {
    alert("❌ Not enough points.");
    return;
  }

  userPoints -= amount;
  updatePointsUI();

  alert(`✅ Withdraw request submitted:\n${method} - ${account}\nAmount: ৳${amount}\n\nAdmin will verify and send.`);

  // Optional: Send to Telegram bot via backend (future)
}
