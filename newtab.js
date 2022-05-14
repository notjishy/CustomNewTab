var settingsActive = false;

document.addEventListener('DOMContentLoaded', function() {

	// set wallaper to saved wallpaper when tab loads
	chrome.storage.local.get(['background'], function(result) {
		document.getElementById("bg").style.backgroundImage = `url(${result.background})`
	});

	// when tab loads, check if clock is enabled and display it if true
	var initialStartClock;
	chrome.storage.local.get(['showClock'], function(result) {
		if (result.showClock) {
			document.getElementById("clock-wrapper").style.display = "inline";
			document.getElementById("clock-switch").setAttribute('data-theme', 'on');
			document.getElementById("clock-toggle-icon").innerHTML = "check_circle";
			initialStartClock = 1;

			clock(initialStartClock);
		}
	});

	// Open settings overlay
	document.getElementById("settings").addEventListener('click', function() {
		if (!settingsActive) {
			settingsActive = true;
			openSettings();
		}
	});

	// clock settings toggle
	document.getElementById("clock-switch").addEventListener('click', function() {
		toggleClock();
	});

	// clock time format setting switch
	document.getElementById("hour-switch").addEventListener('click', function() {
		toggleClockFormat()
	});

	// Close settings overlay
	document.getElementById("close-overlay").addEventListener('click', function() {
		if (settingsActive){
			document.getElementById("overlay").style.height = "0";;
			document.getElementById("overlay-wrapper").style.display = "none";
			document.getElementById("overlay-wrapper-2").style.display = "none";

			removeImagesFromOverlayWrapperMenu();
			settingsActive = false;
		}
	});

	// Close add new menu
	document.getElementById("closeAddNewMenu").addEventListener('click', function() {
		let menu = document.getElementById("addNewMenu");
		let button = document.getElementById("submitButton");

		if (button.hasAttribute('data-theme')) {
			button.removeAttribute('data-theme');
		}

		document.body.style.overflowY = "hidden";
		menu.style.top = "100%";

		document.getElementById("container").style.visibility = "visible";
		document.getElementById('imgurl').value = "";

		setTimeout(function() {
			document.getElementById("preview").style.backgroundImage = "";
			document.getElementById("message").style.display = "none";
			document.body.style.overflowY = "auto";
			menu.style.top = "10%";
			menu.style.display = "none";
		}, 1000);
	});

	// take given URL to find and display image preview
	document.getElementById("imgurl").addEventListener('focusout', function() {
		var url = document.getElementById("imgurl").value;
		let previewBox = document.getElementById("preview");
		let button = document.getElementById("submitButton");

		let element = new Image();
		element.src = url;

		element.onload = function() {
			console.log('Image found');
			document.getElementById("message").style.display = "none";
			previewBox.style.backgroundImage = `url(${url})`;
			button.setAttribute('data-theme', 'enabled');
		}

		element.onerror = function() {
			document.getElementById("message").style.display = "inline";

			console.log('Image not found');
			previewBox.style.backgroundImage = "";

			if (button.hasAttribute('data-theme')) {
				button.removeAttribute('data-theme');
			}
		}
	});

	// submit new image wallpaper (saves it and sets to new wallpaper)
	document.getElementById("submitButton").addEventListener('click', function() {
		let button = document.getElementById("submitButton");
		if (button.getAttribute('data-theme') === 'enabled') {
			var url = document.getElementById('imgurl').value;
			document.getElementById('imgurl').value = "";

			chrome.storage.local.get({
				userWallpapers: []
			}, function(result) {
				var userWallpapers = result.userWallpapers;
				userWallpapers.push(url);

				chrome.storage.local.set({
					userWallpapers: userWallpapers
				}, function() {
					chrome.storage.local.get('userWallpapers', function(result) {
						console.log(result.userWallpapers);
					});
				});
			});

			document.getElementById("bg").style.backgroundImage = `url(${url})`;

			chrome.storage.local.set({
				background: `${url}`
			}, function() {
				console.log(`Wallpaper changed`);
			});

			let menu = document.getElementById("addNewMenu");

			document.body.style.overflowY = "hidden";
			menu.style.top = "100%";

			document.getElementById("container").style.visibility = "visible";

			setTimeout(function() {
				document.getElementById("preview").style.backgroundImage = "";
				document.getElementById("message").style.display = "none";
				document.body.style.overflowY = "auto";
				menu.style.top = "10%";
				menu.style.display = "none";

				if (button.hasAttribute('data-theme')) {
					button.removeAttribute('data-theme');
				}
			}, 1000);
		}
	});

	// Close popup changes alert
	document.getElementById("alert-close").addEventListener('click', function() {
		const alert = document.getElementById("errorAlert");

		alert.style.opacity = "0";

		setTimeout(function() {
			document.getElementById("errorAlert").style.display = "none";
		}, 1000);
	});

	// function to remove menu wallpapers images from displaying
	function removeImagesFromOverlayWrapperMenu() {
		var wrapper = document.getElementById("overlay-wrapper");
		wrapper.innerHTML = "";
	}
});
