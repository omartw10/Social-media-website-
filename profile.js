document.getElementById("user-posts").innerHTML ="";
document.getElementById("name-posts").innerHTML ="";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");


setupUI();
getUser();

function getUser(){
    const userId = id;
    axios.get(`${baseUrl}/users/${userId}`)
    .then((response) => {
        let user = response.data.data;

        const defaultProfileImage = "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";

        
            const profileImage =
                (typeof user["profile_image"] === "string" && user["profile_image"]) ||
                (user["profile_image"] && typeof user["profile_image"] === "object" && user["profile_image"].url) ||
                defaultProfileImage;

            console.log(response.data);

            // helper to set image with fallback on error or when src points to localhost
            function setImageWithFallback(imgEl, src, fallback) {
                if (!imgEl) return;
                // If the src contains localhost or 127.0.0.1, use the fallback immediately
                if (typeof src === 'string' && /(^https?:\/\/)?(localhost|127\.0\.0\.1)/i.test(src)) {
                    imgEl.onerror = null;
                    imgEl.src = fallback;
                    return;
                }

                // Attach onerror to replace broken images with fallback
                imgEl.onerror = function () {
                    this.onerror = null; // prevent infinite loop if fallback fails
                    this.src = fallback;
                };

                imgEl.src = src;
            }

            const imgEl = document.getElementById("user-profile-image");

            setImageWithFallback(imgEl, profileImage, defaultProfileImage);
            document.getElementById("main-info-name").innerText = user.name;
            document.getElementById("main-info-email").innerText = user.email;
            document.getElementById("main-info-username").innerText = user.username;
            document.getElementById("user-posts-count").innerText = user.posts_count;
            document.getElementById("user-comments-count").innerText = user.comments_count;
            document.getElementById("name-posts").innerText = `${user.name}'s Posts`;
        })
        .catch((err) => {
            console.error('Failed to fetch user:', err);
        });
}

getUserPosts()

function getUserPosts() {
    
  axios(`${baseUrl}/users/${id}/posts`)
    .then((response) => {
      const posts = response.data.data;
      console.log(response.data);
      

     
      for (const post of posts) {

        
        let user = getCurrentUser();
        let isMyPost = user != null && post.author.id == user.id ;
        let profileImage =
        (typeof post.author["profile_image"] === "string" && post.author["profile_image"]) ||
        (post.author["profile_image"] && typeof post.author["profile_image"] === "object" && post.author["profile_image"].url) ||
        "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";
        
        let editBtnContent = ``;
        let deletePost = ``;

        if(isMyPost){
          editBtnContent = `
            <button class="btn btn-secondary " style="float: right; margin-right:5px;  " onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                </svg>
            </button>

          `;

          deletePost = `
            <button class="btn btn-danger " style="float: right;"   " onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>
            </button>
          
          `
        }


        

        const rawPostImage = post.image ?? post.post_image ?? post.media ?? null;

        const postImageUrl = resolveImageUrl(rawPostImage);

        const postImageHtml = postImageUrl ? `<img class="rounded" src="${postImageUrl}" style="width: 100%;" loading="lazy">` : "";

        let content = `
          <div class="card shadow mb-5 bg-body-tertiary rounded">
              <div class="card-header">
                  <span style="cursor: pointer;" onclick="goToUserProfile(${post.author.id})">
                      <img src="${profileImage}" class="rounded-circle border border-2" style="width: 40px; height: 40px;">
                      <h7 style="margin-left: 5px;"><b>${post.author.username}</b></h7> 
                  </span>
                  ${deletePost}
                  ${editBtnContent}
                 
              </div>
              <div class="card-body" onclick="postClicked(${post.id})" style="cursor:pointer;">
                  ${postImageHtml}
                  <p style="text-align: right;">${post.created_at ?? ""}</p>
                  <h4>${post.title ?? ""}</h4>
                  <p>${post.body ?? ""}</p>
                  <div id="bottom-bar">
                      <hr>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" 
                          class="bi bi-chat" viewBox="0 0 16 16">
                          <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/>
                      </svg>
                      <span>(${post.comments_count}) comments</span>
                      <span id="tags-${post.id}"></span>
                  </div>
              </div>
          </div>
          `;
        document.getElementById("user-posts").innerHTML += content;


        const tagsContainer = document.getElementById(`tags-${post.id}`);
        for (const tag of post.tags) {
          tagsContainer.innerHTML += `
            <button class="btn btn-sm rounded-5" style="background-color: gray; color: white;">
              ${tag.name}
            </button>
          `;
        }
      }

      
      
    })
    .catch((error) => {
        console.error(error);
       showAlert(`"❌ Error loading posts:"${error.message}" `,"danger" , 4000)    
    })
    .finally(() => {
      isLoading = false;
      
    });
}
   
function goToUserProfile(userId){
    window.location.href = `profile.html?id=${userId}`;
}



    