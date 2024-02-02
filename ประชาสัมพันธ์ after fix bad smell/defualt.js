function upload() {
   
    let image = document.getElementById('image').files[0];
    
    let post = document.getElementById('post').value;
    
    let topic = document.getElementById('topic').value;
    
    let imageName = image.name;

    
    let storageRef = firebase.storage().ref('images/' + imageName);

    
    let uploadTask = storageRef.put(image);

    
    uploadTask.on('state_changed', function (snapshot) {
        
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("upload is " + progress + " done");
    }, function (error) {
        
        console.log(error.message);
    }, function () {
       
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            
            let timestamp = new Date().toLocaleString();

            
            firebase.database().ref('blogs/').push().set({
                topic: topic, 
                text: post,
                imageURL: downloadURL,
                timestamp: timestamp 
            }, function (error) {
                if (error) {
                    alert("Error while uploading");
                } else {
                    alert("Successfully uploaded");
                    
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
    let posts_div = document.getElementById('posts');
    posts_div.innerHTML = ""; 

    firebase.database().ref('blogs/').once('value').then(function (snapshot) {
        let data = snapshot.val();

        for (let [key, value] of Object.entries(data)) {
            
            let postContainer = document.createElement('div');
            postContainer.classList.add('col-sm-4', 'mt-2', 'mb-2');

            let card = document.createElement('div');
            card.classList.add('card');

            let image = document.createElement('img');
            image.src = value.imageURL;
            image.classList.add('mx-auto', 'd-block', 'mt-3');
            image.style.height = '280px';
            image.style.width = '325px';

            let cardBody = document.createElement('div');
            cardBody.classList.add('card-body', );

            let cardTitle = document.createElement('h5');
            cardTitle.classList.add('card-title');
            cardTitle.textContent = value.topic;

            let cardText = document.createElement('p');
            cardText.classList.add('card-text' );
            cardText.textContent = value.text.length > 200 ? value.text.substring(0, 200) + '...' : value.text;

            let timestamp = document.createElement('p');
            timestamp.classList.add('card-text', 'text-muted');
            timestamp.textContent = "Uploaded on " + value.timestamp;

            let readMoreBtn = document.createElement('a');
            readMoreBtn.href = 'detail.html?id=' + key;
            readMoreBtn.classList.add('btn', 'btn-primary', 'mr-2'); 
            readMoreBtn.textContent = 'Read More';

            let deleteBtn = document.createElement('button');
            deleteBtn.classList.add('btn', 'btn-danger', 'mt-2');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', function () {
                delete_post(key);
            });

           
            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardText);
            cardBody.appendChild(timestamp);
            cardBody.appendChild(readMoreBtn);
            cardBody.appendChild(deleteBtn);


            card.appendChild(image);
            card.appendChild(cardBody);

            postContainer.appendChild(card);

            posts_div.appendChild(postContainer);
        }
    }).catch(function (error) {
        console.error("Error fetching data:", error.message);
        alert("Error fetching data: " + error.message); 
        console.error("Error fetching data:", error.message);
        alert("Error fetching data: " + error.message);
    });
}


function delete_post(key) {
    
    let postRef = firebase.database().ref('blogs/' + key);

    
    postRef.remove()
        .then(function () {
            console.log("Post deleted successfully");
        })
        .catch(function (error) {
            console.error("Error deleting post:", error.message);
            alert("Error deleting post: " + error.message); 
        })
        .finally(function () {
            
            getdata();
        });
}