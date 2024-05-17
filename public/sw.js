// eslint-disable-next-line no-restricted-globals
self.addEventListener("push", function (event) {
	// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
	const options = {
		body: event.data.json().descr,

		vibrate: [200, 100, 200, 100, 200, 100, 200],
		tag: "vibration-sample",
	};
	console.log(event.data.json());
	// eslint-disable-next-line no-restricted-globals
	let promise = self.registration.showNotification(event.data.json().title, options);

	event.waitUntil(promise);
});
