function upload() {
    // Get your image
    var image = document.getElementById('image').files[0];
    // Get your blog text
    var post = document.getElementById('post').value;
    // Get the topic
    var topic = document.getElementById('topic').value;
    // Get image name
    var imageName = image.name;

    // Firebase storage reference
    // It is the path where your image will be stored
    var storageRef = firebase.storage().ref('images/' + imageName);

    // Upload image to selected storage reference
    // Make sure you pass the image here
    var uploadTask = storageRef.put(image);

    // To get the state of image uploading....
    uploadTask.on('state_changed', function (snapshot) {
        // Get task progress by following code
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("upload is " + progress + " done");
    }, function (error) {
        // Handle error here
        console.log(error.message);
    }, function () {
        // Handle successful upload here..
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            // Get the current timestamp
            var timestamp = new Date().toLocaleString();

            // Get your image download URL here and upload it to the database
            // Our path where data is stored ...push is used so that every post has a unique ID
            firebase.database().ref('blogs/').push().set({
                topic: topic, // Include the topic in the database
                text: post,
                imageURL: downloadURL,
                timestamp: timestamp // Include the timestamp
            }, function (error) {
                if (error) {
                    alert("Error while uploading");
                } else {
                    alert("Successfully uploaded");
                    // Now reset your form
                    document.getElementById('post-form').reset();
                    getdata();
                }
            });
        });
    });
}

window.onload = function () {
    this.getdata();
}

function getdata() {
    firebase.database().ref('blogs/').once('value').then(function (snapshot) {
        var posts_div = document.getElementById('posts');
        posts_div.innerHTML = ""; // Clear existing content

        var data = snapshot.val();

        for (let [key, value] of Object.entries(data)) {
            // Limit the displayed text to a maximum of 200 characters
            var truncatedText = value.text.length > 200 ? value.text.substring(0, 200) + '...' : value.text;

            var postHTML = "<div class='col-sm-4 mt-2 mb-2'>" +
                "<div class='card'>" +
                "<img src='" + value.imageURL + "' class='mx-auto d-block mt-3' style='height:280px; width: 325px;'>" +
                "<div class='card-body'>" +
                "<h5 class='card-title'>" + value.topic + "</h5>" +
                "<p class='card-text'>" + truncatedText + "</p>" +
                "<p class='card-text'><small class='text-muted'>Uploaded on " + value.timestamp + "</small></p>" + // Display timestamp
                "<div class='d-flex justify-content-between'>" +
                "<a href='detail.html?id=" + key + "' class='btn btn-primary'>Read More</a>" +
                "<button class='btn btn-danger' id='" + key + "' onclick='delete_post(this.id)'>Delete</button>" +
                "</div></div></div></div>";

            posts_div.innerHTML = postHTML + posts_div.innerHTML;
        }
    });
}


function delete_post(key) {
    firebase.database().ref('blogs/' + key).remove();
    getdata();
}