function openSettings(){
  var wrapper = document.getElementById("overlay-wrapper");

  document.getElementById("overlay").style.height = "100%";
  wrapper.style.display = "block";
  document.getElementById("overlay-wrapper-2").style.display = "block";

  var element = document.createElement("img");
  element.src = "assets/wallpapers/add.png";
  element.id = "addNew";
  element.className = "addNew";
  element.addEventListener('click', function() {
    let menu = document.getElementById("addNewMenu");

    document.getElementById("container").style.visibility = "hidden";

    menu.style.display = "inline";

    document.getElementById("overlay").style.height = "0";
    document.getElementById("overlay-wrapper").style.display = "none";
    document.getElementById("overlay-wrapper-2").style.display = "none";

    removeImagesFromOverlayWrapperMenu();
  });

  wrapper.appendChild(element);

  chrome.storage.local.get({
    userWallpapers: []
  }, function(result) {
    var wallpapers = result.userWallpapers;

    var amount = 0;
    wallpapers.forEach(handleWallpaperImages);

    function handleWallpaperImages(image) {
      amount++;

      addImagesToOverlayWrapperMenu(image, amount);
    }
  })
}

// load images for settings menu
function addImagesToOverlayWrapperMenu(image, amount) {
  var wrapper = document.getElementById("overlay-wrapper");

  let id = amount;
  var divElement = document.createElement("div");
  divElement.setAttribute("ID", `imgButtonDiv-${id}`);
  divElement.setAttribute("class", "imgButtonDiv");

  wrapper.appendChild(divElement);

  var element = document.createElement("img");
  element.src = image;
  element.alt = `${element.src}`;
  element.class = "wallpaperButton";

  element.onerror = function() {
    console.log(`Wallpaper ${id} could not be found`);
    element.src = "./assets/wallpapers/fallback.png";
    element.alt = `${element.src}`;

    divElement.appendChild(element);
    divElement.style.width = `${element.width}px`;
    console.log(`${id} - ${element.width}px`);

    var x = document.createElement("span");
    x.setAttribute("ID", "imgLoadErrText");
    x.setAttribute("class", "material-icons");
    x.innerText = "report_gmailerrorred";

    divElement.appendChild(x);

    var alert = document.getElementById("errorAlert");
    alert.style.display = "block";
    alert.style.opacity = "100";
  }

  // console log width of each image
  element.onload = function() {
    divElement.appendChild(element);
    divElement.style.width = `${element.width}px`;
    console.log(`${id} - ${element.width}px`);
  }

  // update wallpaper to selected image
  element.addEventListener('click', function() {
    document.getElementById("bg").style.backgroundImage = `url(${this.alt})`;

    chrome.storage.local.set({
      background: `${this.alt}`
    }, function() {
      console.log(`Wallpaper changed`);
    })
  })
}
