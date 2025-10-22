
let currentPage = 1;
let lastPage = 1;
let isLoading = false;
let lastScrollHeight = 0; 

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("postId");

document.getElementById("posts").innerHTML = "";
setupUI()
startUp(false, currentPage);
scrollFun()
function scrollFun(){
  window.addEventListener("scroll", () => {
      const reachedBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
      if (
          reachedBottom &&
          !isLoading &&
          currentPage < lastPage &&
          window.scrollY > lastScrollHeight
      ) {
          isLoading = true;
          
          lastScrollHeight = window.scrollY;
          currentPage++;
          startUp(false, currentPage);
      }
  });

}



function startUp(reload = true, page = 1) {
  toggleLoader(true);
  axios(`${baseUrl}/posts?limit=5&page=${page}`)
    .then((response) => {
      const posts = response.data.data;
      lastPage = response.data.meta.last_page;

      if (reload) {
        document.getElementById("posts").innerHTML = "";
      }

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
            <button class="btn btn-dark " style="float: right; margin-right:5px;  " onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                </svg>
            </button>

          `;

          deletePost = `
            <button class="btn btn-dark " style="float: right;"   " onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">
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
                    <h7 style="margin-left: 5px;"><b>${post.author.username ?? "no user"}</b></h7>
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
        document.getElementById("posts").innerHTML += content;


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
       showAlert(`"❌ Error loading posts:"${error.message}" `,"danger")    
    })
    .finally(() => {
      isLoading = false;
      toggleLoader(false);
    });
}
 
// ====SCROLL TO TOP BUTTON==== //
(function(){
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;

  // Show button after user scrolls down 200px
  window.addEventListener('scroll', () => {
      if (window.scrollY > 200) btn.style.display = 'flex';
      else btn.style.display = 'none';
  });

  btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
// ====SCROLL TO TOP BUTTON==== //



function goToUserProfile(userId) {
    window.location.href = `profile.html?id=${userId}`;
}

// centralized toggleLoader is provided by mainLogic.js









