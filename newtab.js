document.addEventListener('DOMContentLoaded', function() {    
    function addImagesToOverlayWrapperMenu(image) {
        var wrapper = document.getElementById("overlay-wrapper")
        var element = document.createElement("img")
        element.src = image
        element.alt = `${image}`
        element.class = "wallpaperButton"

        element.addEventListener('click', function() {
            document.body.style.backgroundImage = `url(${this.alt})`

            chrome.storage.local.set({ background: `${this.alt}` }, function() {
                console.log(`Wallpaper changed`)
            })
        })

        wrapper.appendChild(element)
    }

    function removeImagesFromOverlayWrapperMenu() {
        var wrapper = document.getElementById("overlay-wrapper")
        wrapper.innerHTML = ""
    }

    chrome.storage.local.get(['background'], function(result) {
        document.body.style.backgroundImage = `url(${result.background})`
    })

    var enabledClock = false
    chrome.storage.local.get(['showClock'], function(result) {
        if (result.showClock) {
            document.getElementById("clock-wrapper").style.display = "inline"
            document.getElementById("clock-switch").setAttribute('data-theme', 'on')
            document.getElementById("clock-toggle-icon").innerHTML = "check_circle"
            enabledClock = true
        }
    })

    var hourFormat = null
    chrome.storage.local.get(['hourFormat'], function(result) {
        if (result.hourFormat) {
            hourFormat = result.hourFormat
            
            if (result.hourFormat == 24) {
                document.getElementById("hour-switch").setAttribute('data-theme', '24')
                document.getElementById("hour-toggle-icon").innerHTML = "check_circle"
            }
        } else {
            hourFormat = 12
        }

        clock()
    })

    function clock() {
        if (enabledClock) {
            console.log('clock refreshed')

            var date = new Date()
            var hours = date.getHours()
            var mins = date.getMinutes()
            var secs = date.getSeconds()
            var day = date.getDay()
            var month = date.getMonth() + 1
            var daym = date.getDate()
            var year = date.getFullYear()

            hours = ("0" + hours).slice(-2)
            mins = ("0" + mins).slice(-2)
            secs = ("0" + secs).slice(-2)

            if (hourFormat == 12) {
                var amPm = ( hours < 12 ) ? "AM" : "PM"

                hours = ( hours > 12 ) ? hours - 12 : hours

                document.getElementById("time").innerHTML = hours + ":" + mins + "." + secs + " " + amPm
            } else {
                document.getElementById("time").innerHTML = hours + ":" + mins + "." + secs
            }

            const days = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")
            day = days[day]

            document.getElementById("day").innerHTML = day

            month = ("0" + month).slice(-2)
            daym = ("0" + daym).slice(-2)

            document.getElementById("date").innerHTML = year + "/" + month + "/" + daym

            setTimeout(clock, 500)
        }
    }

    // Open settings overlay
    document.getElementById("settings").addEventListener('click', function() {
        var wrapper = document.getElementById("overlay-wrapper")

        document.getElementById("overlay").style.height = "100%"
        wrapper.style.display = "block"
        document.getElementById("overlay-wrapper-2").style.display = "block"

        var element = document.createElement("img")
        element.src = "assets/wallpapers/add.png"
        element.id = "addNew"
        element.addEventListener('click', function() {
            let menu = document.getElementById("addNewMenu")

            document.getElementById("container").style.visibility = "hidden"
    
            menu.style.display = "inline"

            document.getElementById("overlay").style.height = "0";
            document.getElementById("overlay-wrapper").style.display = "none"
            document.getElementById("overlay-wrapper-2").style.display = "none"

            removeImagesFromOverlayWrapperMenu()
        })
        wrapper.appendChild(element)

        chrome.storage.local.get({userWallpapers: []}, function(result) {
            var wallpapers = result.userWallpapers

            wallpapers.forEach(addImagesToOverlayWrapperMenu)
        })
    })

    // Close settings overlay
    document.getElementById("close-overlay").addEventListener('click', function() {
        document.getElementById("overlay").style.height = "0";
        document.getElementById("overlay-wrapper").style.display = "none"
        document.getElementById("overlay-wrapper-2").style.display = "none"

        removeImagesFromOverlayWrapperMenu()
    })

    document.getElementById("clock-switch").addEventListener('click', function() {
        var currentData = document.getElementById("clock-switch").getAttribute('data-theme')
        if (currentData === "off" || currentData === null) {
            document.getElementById("clock-switch").setAttribute('data-theme', 'on')
            document.getElementById("clock-toggle-icon").innerHTML = "check_circle"

            chrome.storage.local.set({ showClock: true }, function() {
                console.log('Enabled clock')
            })

            document.getElementById("clock-wrapper").style.display = "inline"

            enabledClock = true
            clock()
        } else {
            document.getElementById("clock-switch").setAttribute('data-theme', 'off')
            document.getElementById("clock-toggle-icon").innerHTML = "cancel"

            chrome.storage.local.set({ showClock: false }, function() {
                console.log('Disabled clock')
            })

            document.getElementById("clock-wrapper").style.display = "none"

            enabledClock = false
        }
    })

    document.getElementById("hour-switch").addEventListener('click', function() {
        var currentData = document.getElementById("hour-switch").getAttribute('data-theme')
        if (currentData != "24") {
            document.getElementById("hour-switch").setAttribute('data-theme', '24')
            document.getElementById("hour-toggle-icon").innerHTML = "check_circle"

            chrome.storage.local.set({ hourFormat: 24 }, function() {
                console.log('Clock hour format changed to 24 hours')
            })

            document.getElementById("changesAlert").style.display = "inline"
            document.getElementById("changesAlert").style.opacity = 100
        } else {
            document.getElementById("hour-switch").removeAttribute('data-theme')
            document.getElementById("hour-toggle-icon").innerHTML = "cancel"

            chrome.storage.local.set({ hourFormat: 12 }, function() {
                console.log('Clock hour format changed to 12 hours')
            })

            document.getElementById("changesAlert").style.display = "inline"
            document.getElementById("changesAlert").style.opacity = 100
        }
    })

    // Close add new menu
    document.getElementById("closeAddNewMenu").addEventListener('click', function() {
        let menu = document.getElementById("addNewMenu")
        let button = document.getElementById("submitButton")

        if (button.hasAttribute('data-theme')) {
            button.removeAttribute('data-theme')
        }

        document.body.style.overflowY = "hidden"
        menu.style.top = "100%"

        document.getElementById("container").style.visibility = "visible"
        document.getElementById('imgurl').value = ""

        setTimeout(function() {
            document.getElementById("preview").style.backgroundImage = ""
            document.getElementById("message").style.display = "none"
            document.body.style.overflowY = "auto"
            menu.style.top = "10%"
            menu.style.display = "none"
        }, 1000)
    })

    document.getElementById("imgurl").addEventListener('focusout', function() {
        var url = document.getElementById("imgurl").value
        let previewBox = document.getElementById("preview")
        let button = document.getElementById("submitButton")
        
        let element = new Image()
        element.src = url

        element.onload = function() {
            console.log('Image found')
            document.getElementById("message").style.display = "none"
            previewBox.style.backgroundImage = `url(${url})`
            button.setAttribute('data-theme', 'enabled')
        }

        element.onerror = function() {
            document.getElementById("message").style.display = "inline"

            console.log('Image not found')
            previewBox.style.backgroundImage = ""

            if (button.hasAttribute('data-theme')) {
                button.removeAttribute('data-theme')
            }
        }
    })

    document.getElementById("submitButton").addEventListener('click', function() {
        let button = document.getElementById("submitButton")
        if (button.getAttribute('data-theme') === 'enabled') {
            var url = document.getElementById('imgurl').value
            document.getElementById('imgurl').value = ""

            chrome.storage.local.get({userWallpapers: []}, function(result) {
                var userWallpapers = result.userWallpapers
                userWallpapers.push(url)

                chrome.storage.local.set({userWallpapers: userWallpapers}, function() {
                    chrome.storage.local.get('userWallpapers', function(result) {
                        console.log(result.userWallpapers)
                    })
                })
            })

            document.body.style.backgroundImage = `url(${url})`

            chrome.storage.local.set({ background: `${url}` }, function() {
                console.log(`Wallpaper changed`)
            })

            let menu = document.getElementById("addNewMenu")

            document.body.style.overflowY = "hidden"
            menu.style.top = "100%"

            document.getElementById("container").style.visibility = "visible"

            setTimeout(function() {
                document.getElementById("preview").style.backgroundImage = ""
                document.getElementById("message").style.display = "none"
                document.body.style.overflowY = "auto"
                menu.style.top = "10%"
                menu.style.display = "none"

                if (button.hasAttribute('data-theme')) {
                    button.removeAttribute('data-theme')
                }
            }, 1000)
        }
    })

    // Close popup changes alert
    document.getElementById("alert-close").addEventListener('click', function() {
        const alert = document.getElementById("changesAlert")

        alert.style.opacity = "0"

        setTimeout(function() {
            document.getElementById("changesAlert").style.display = "none"
        }, 1000)
    })
})