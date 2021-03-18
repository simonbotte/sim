const tokenID =
    "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjIzV0xEMzY4MlQifQ.eyJpc3MiOiJEREZCMlpGOTk4IiwiaWF0IjoxNjE1NzM1NDI3LCJleHAiOjE2NDcyMTYwMDB9.MiHsWwyJYlJR1xjsSpMRthachRlSpmlD3tDqZvvQNsKcB9GynOFZ0PlqgFyZnnymJ3t9DQsAkcqjO_FLmJZEWA";
const mapLookup = document.getElementById("mapLookup");
const resultsElement = document.getElementById("results");

function setMapToUserPos() {
    function success(position) {
        var geoloc = [];
        geoloc.push(position.coords.latitude);
        geoloc.push(position.coords.longitude);

        // Create an initial region. This also weights the search area
        var myRegion = new mapkit.CoordinateRegion(
            new mapkit.Coordinate(geoloc[0], geoloc[1]),
            new mapkit.CoordinateSpan(0.02, 0.02)
        );
        // Create map on the id 'map'

        map.region = myRegion;
    }

    function error() {
        console.log("error");
    }

    if (!navigator.geolocation) {
        console.log("You broser does not support geoloc");
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

// Initialise MapKit
mapkit.init({
    authorizationCallback: function (done) {
        done(tokenID);
    },
});
// Create an initial region. This also weights the search area
var myRegion = new mapkit.CoordinateRegion(
    new mapkit.Coordinate(40.7637325, -73.9749326),
    new mapkit.CoordinateSpan(0.05, 0.05)
);
// Create map on the id 'map'
var map = new mapkit.Map("map");
map.region = myRegion;

setMapToUserPos();
// Listen for keyup in the input field
mapLookup.addEventListener("keyup", function () {
    // Make sure it's not a zero length string
    if (mapLookup.value.length > 1) {
        resultsElement.innerHTML = "";
        let search = new mapkit.Search({ region: map.region });
        search.autocomplete(mapLookup.value, (error, data) => {
            if (error) {
                return;
            }

            console.log(data);
            // Unhide the result box
            resultsElement.style.display = "block";
            var results = "";
            // Loop through the results a build
            data.results.forEach(function (result) {
                if (result.coordinate) {
                    // Builds the HTML it'll display in the results. This includes the data in the attributes so it can be used later
                    let resultElement = document.createElement("div");
                    resultElement.classList.add("mapSearchResultsItem");
                    resultElement.setAttribute(
                        "data-title",
                        result.displayLines[0]
                    );
                    resultElement.setAttribute(
                        "data-latitude",
                        result.coordinate.latitude
                    );
                    resultElement.setAttribute(
                        "data-longitude",
                        result.coordinate.longitude
                    );
                    resultElement.setAttribute(
                        "data-address",
                        result.displayLines[1]
                    );
                    let resultFrontElement = document.createElement("span");
                    resultFrontElement.innerHTML =
                        result.displayLines[0] + " " + result.displayLines[1];

                    resultElement.appendChild(resultFrontElement);

                    resultElement.addEventListener("click", () => {
                        let latitude = resultElement.dataset.latitude;
                        let longitude = resultElement.dataset.longitude;
                        let title = resultElement.dataset.title;
                        let address = resultElement.dataset.address;
                        // Calc the new region
                        let newRegion = new mapkit.CoordinateRegion(
                            new mapkit.Coordinate(
                                parseFloat(latitude),
                                parseFloat(longitude)
                            ),
                            new mapkit.CoordinateSpan(0.05, 0.05)
                        );
                        // Clean up the map of old searches
                        map.removeAnnotations(map.annotations);
                        map.region = newRegion;

                        // Add the new annotation
                        var myAnnotation = new mapkit.MarkerAnnotation(
                            new mapkit.Coordinate(
                                parseFloat(latitude),
                                parseFloat(longitude)
                            ),
                            {
                                color: "#9b6bcc",
                                title: title,
                                subtitle: address,
                            }
                        );
                        map.addAnnotation(myAnnotation);
                        // Hide the results box
                        resultsElement.style.display = "none";
                        resultsElement.innerHTML = "";
                    });
                    resultsElement.appendChild(resultElement);
                }
            });
        });
    } else {
        resultsElement.style.display = "none";
    }
});
