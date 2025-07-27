// sw.js — Monetag Verification Service Worker

self.addEventListener('install', function (event) {
  console.log('Service Worker installing...');
  // খুব দ্রুত সক্রিয় হবে
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  console.log('Service Worker activating...');
  // সব control ক্লায়েন্টদের হাতে নেবে
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {
  // Monetag verification এর জন্য অতিরিক্ত কোড এখানে দরকার নেই
  // শুধু ফাইলটাকে serve করতে থাকুক
  event.respondWith(fetch(event.request));
});