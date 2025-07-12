self.addEventListener('push', function(event) {
  console.log('Push event received!', event);
  const data = event.data.json();
  const title = data.title || 'Push Notification';
  const options = {
    body: data.body || 'You have a new message.',
    icon: '/next.svg', // You can change this to your app's icon
    badge: '/next.svg'
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/') // Open the main page when notification is clicked
  );
});
