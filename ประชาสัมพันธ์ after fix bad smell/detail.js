document.addEventListener("DOMContentLoaded", function () {
    // Get the blog detail content from Firebase based on the unique ID passed through URL
    var postId = getParameterByName('id');

    if (postId) {
        function fetchData() {
            firebase.database().ref('blogs/' + postId).once('value').then(function (snapshot) {
                var detailContent = snapshot.val();

                if (detailContent) {
                    var blogDetailContent = document.getElementById('blog-detail-content');
                    blogDetailContent.innerHTML =
                        "<img src='" + detailContent.imageURL + "' class='img-fluid mx-auto d-block mb-3' alt='Image'>" +
                        "<h2 class='card-title text-center'>" + detailContent.topic + "</h2>" +
                        "<p class='card-text'>" + detailContent.text + "</p>";
                } else {
                    console.log("Post not found");
                }
            });
        }

        fetchData();

        var refreshButton = document.getElementById('refresh-button');
        if (refreshButton) {
            refreshButton.addEventListener('click', function () {
                fetchData();
            });
        }
    } else {
        console.log("Post ID not provided");
    }
});

function getParameterByName(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
