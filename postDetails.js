const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("postId");
document.getElementById("post-container").innerHTML="";

setupUI()
getPost()

function getPost(){
    toggleLoader(true);
    axios.get(`${baseUrl}/posts/${id}`)
    .then((response)=>{
        let post = response.data.data;
        let comments = post.comments

        let profileImage =
        (typeof post.author["profile_image"] === "string" && post.author["profile_image"]) ||
        (post.author["profile_image"] && typeof post.author["profile_image"] === "object" && post.author["profile_image"].url) ||
        "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";

        const rawPostImage = post.image ?? post.post_image ?? post.media ?? null;

        const postImageUrl = resolveImageUrl(rawPostImage);

        const postImageHtml = postImageUrl ? `<img class="rounded" src="${postImageUrl}" style="width: 100%;" loading="lazy">` : "";

        let commentsContent =""

        for(comment of comments){

            let profileImage =
            (typeof comment.author["profile_image"] === "string" && comment.author["profile_image"]) ||
            (comment.author["profile_image"] && typeof comment.author["profile_image"] === "object" && comment.author["profile_image"].url) ||
            "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";
            commentsContent += 
            `
            

        
                <!-- COMMENT -->
                <div id="comments" class="p-3  " style="background-color: rgb(235, 234, 234); ">

                    <!-- PROFILE PICTURE + USERNAME -->
                    <div>
                        <img src="${profileImage}" class="rounded-circle border border-2" style="width: 40px; height: 40px; display: inline-block; ;" >
                        <h7 style="display: inline-block; margin-left: 5px;"><b>${comment.author.username} </b></h7>
                    </div>
                    <!-- PROFILE PICTURE + USERNAME -->

                    <!-- COMMENT's BODY -->
                    <div>
                        ${comment.body}

                    </div>
                    <hr>
                    <!--/ COMMENT's BODY /-->

                </div>
                <!--/ COMMENT /-->

                
            
            
            `

            
        }
        
        let content=
        `
    <!-- POST CONTAINER -->
    <div id="post-container" style="width: 100%; height: 100vh;">

        <!-- USER's POST -->
        
            
            <div class="row d-flex justify-content-center mt-5 " >
                <div class="col-lg-9">         
                    <!-- USER'S POST -->
                    <h1>
                        <span>
                            ${post.author.username}'s
                        </span>
                        Post
                    </h1>
                    <hr>
                
                </div>
            </div>

        
            <div class="row d-flex justify-content-center mt-5 " >
                <!-- POST1 -->
                <div class="card shadow p-0  mb-5 bg-body-tertiary rounded col-lg-9">
                    <div class="card-header " >
                        <span style="cursor: pointer;" onclick="goToUserProfile(${post.author.id})">
                            <img src="${profileImage}" class="rounded-circle border border-2" style="width: 40px; height: 40px;">
                            <h7 style="margin-left: 5px;"><b>${post.author.username ?? "no user"}</b></h7>
                        </span>
                    </div>
                        <div class="card-body"  >
                            ${postImageHtml}
                            <p style="text-align: right;">${post.created_at ?? ""}</p>
                            <h4>${post.title ?? ""}</h4>
                            <p>${post.body ?? ""}</p>
                            <div id="bottom-bar">
                                <hr>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat" viewBox="0 0 16 16">
                                    <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/>
                                </svg>
                                
                                <span>(${post.comments_count}) comments</span>
                                <span id="tags-${post.id}"></span>
                    </div>

                    </div>

                    <!-- ==== COMMENTS ==== -->
                    <div id="commEnts">
                    ${commentsContent}
                    </div>
                    <!--/ ==== COMMENTS ==== /-->

                    <!-- CREATE COMMENT -->
                    <div class="input-group mb-3">
                        <input id="comment-input" type="text" class="form-control" placeholder="Add Comment..." aria-label="Recipient's username" aria-describedby="button-addon2">
                        <button onclick="sendCommentBtnClicked()" class="btn btn-outline-secondary" type="button" id="button-addon2">Send</button>
                    </div>
                    <!--/ CREATE COMMENT /-->

                    
                </div>
                <!--/ POST1 /-->

            </div>

    </div>
    <!--/ POST CONTAINER /-->
`



        document.getElementById("post-container").innerHTML=content;
    })
    .catch((err) => {
        console.error('Failed to fetch post:', err);
    })
    .finally(() => {
        toggleLoader(false);
    });
}


function sendCommentBtnClicked(){
    let comment = document.getElementById("comment-input").value
    let token = localStorage.getItem("token");
    if (token== null){
        showAlert("Login or register first!","danger")
    }else{
        let body = {
            "body":comment
        }
        toggleLoader(true);
        axios.post((`${baseUrl}/posts/${id}/comments`),body,{
            headers :{
                "Authorization":`Bearer ${token}`
            }
        }).then((response)=>{
            showAlert("Comment added successfully ! ","success")
            getPost()
            

        })
        .catch((error)=>{
            if(error.response.data.message == "Unauthenticated."){
                showAlert("Login or register first!","danger")
            }
            
        })

        .finally(() => {
            toggleLoader(false);
        })
        
    

    }
}

