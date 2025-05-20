// -------------------------------
// Constants and DOM References
// -------------------------------
const timerText = document.getElementById("timer-value");
const timerWrapper = document.getElementById("timer");
const mobileTimer = document.getElementById("mobile-timer");
const releaseDate = new Date("2025-08-01T09:00:00Z"); // Launch date/time

// -------------------------------
// Visual Timer Tick Effect
// -------------------------------
function applyTickEffect(el) {
	el.classList.add("tick"); // CSS animation for tick
	setTimeout(() => el.classList.remove("tick"), 300);
}

// -------------------------------
// Add Pulse Animation for Imminent Launch
// -------------------------------
function applyUrgency(el) {
	el.classList.add("urgent"); // Adds pulsing red urgency style
}

// -------------------------------
// Update Countdown Timer
// -------------------------------
function updateCountdown() {
	const now = new Date();
	const diff = releaseDate - now;

	// If time is up, show LIVE status
	if (diff <= 0) {
		const liveHTML = `
			<span class="text-red-500 font-semibold tracking-wide flex items-center justify-center gap-2">
				THE GAME IS LIVE
				<span class="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
			</span>`;
		if (timerWrapper) timerWrapper.innerHTML = liveHTML;
		if (mobileTimer) {
			mobileTimer.textContent = "LIVE";
			mobileTimer.classList.add("text-red-500", "font-semibold");
		}
		return;
	}

	// Otherwise, calculate remaining time
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
	const minutes = Math.floor((diff / (1000 * 60)) % 60);
	const seconds = Math.floor((diff / 1000) % 60);
	const timeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

	// Update both desktop and mobile timers
	if (timerText) {
		timerText.textContent = timeString;
		applyTickEffect(timerText);
		if (diff <= 86400000) applyUrgency(timerText); // Add urgency within 24hrs
	}
	if (mobileTimer) {
		mobileTimer.textContent = timeString;
		applyTickEffect(mobileTimer);
		if (diff <= 86400000) applyUrgency(mobileTimer);
	}
}

// Initialize countdown
updateCountdown();
setInterval(updateCountdown, 1000); // Update every second

// -------------------------------
// Glitch Animation (Randomly applied every few seconds)
// -------------------------------
setInterval(() => {
	if (Math.random() < 0.8) {
		if (timerWrapper) {
			timerWrapper.classList.add("glitch");
			setTimeout(() => timerWrapper.classList.remove("glitch"), 300);
		}
		if (mobileTimer) {
			mobileTimer.classList.add("glitch");
			setTimeout(() => mobileTimer.classList.remove("glitch"), 300);
		}
	}
}, 3000);

// -------------------------------
// Analytics + Cookie Banner
// -------------------------------

// Dynamically load Google Analytics
function enableAnalytics() {
	const gaScript = document.createElement("script");
	gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-2K2V116QZB";
	gaScript.async = true;
	document.head.appendChild(gaScript);

	window.dataLayer = window.dataLayer || [];
	function gtag() {
		dataLayer.push(arguments);
	}
	window.gtag = gtag;
	gtag("js", new Date());
	gtag("config", "G-2K2V116QZB");
}

// Show cookie banner and set up buttons
function showCookieBanner() {
	const banner = document.getElementById("cookie-banner");
	banner.style.display = "flex";

	// Accept button
	document.getElementById("cookie-accept").onclick = () => {
		localStorage.setItem("cookieConsent", "accepted");
		enableAnalytics();
		banner.remove();
	};

	// Decline button
	document.getElementById("cookie-decline").onclick = () => {
		localStorage.setItem("cookieConsent", "declined");
		banner.remove();
	};
}

// On page load: check for cookie consent
window.addEventListener("DOMContentLoaded", () => {
	const consent = localStorage.getItem("cookieConsent");
	if (consent === "accepted") {
		enableAnalytics();
	} else if (!consent) {
		showCookieBanner();
	}
});
