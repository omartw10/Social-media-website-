const baseUrl = "https://tarmeezacademy.com/api/v1";

function setupUI(){
    const token = localStorage.getItem("token");

    let addBtn = document.getElementById("add-btn");
    if(token!=null){
        document.getElementById("login-btn").style.visibility="hidden";
        document.getElementById("register-btn").style.visibility="hidden";
        
        document.getElementById("logout-btn").style.display="block";
        document.getElementById("user-profile-pic").style.display="block";
        document.getElementById("nav-username").style.display="block";
        if(addBtn!=null){
            addBtn.style.visibility="visible";
        }
        

        let user=getCurrentUser();
        document.getElementById("nav-username").innerHTML="@"+user.username;

        let profileImage =
        (typeof user.profile_image === "string" && user.profile_image) ||
        (user.profile_image && typeof user.profile_image === "object" &&user.profile_image.url) ||
        "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";


        document.getElementById("user-profile-pic").src=profileImage;
        


    }else{
        document.getElementById("login-btn").style.visibility="visible";
        document.getElementById("register-btn").style.visibility="visible";
        
        document.getElementById("logout-btn").style.display="none";
        document.getElementById("user-profile-pic").style.display="none";
        document.getElementById("nav-username").style.display="none";
        if(addBtn!=null){
            addBtn.style.visibility="hidden";
        }
    }
}

function loginBtnClicked(){
    let username = document.getElementById("username-input").value;
    let password = document.getElementById("password-input").value;

      
    const params ={
        "username":username,
        "password":password
    }
    const url = `https://tarmeezacademy.com/api/v1/login`
    axios.post(url,params)
    .then((response)=>{
        let token = response.data.token;
        let user = response.data.user;
        
        localStorage.setItem("token",token);
        localStorage.setItem("user",JSON.stringify(user) );

        const modal = document.getElementById("login-modal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();

        showAlert("Logged in successfully!",`success`);
        setupUI();
        

        
    })

}

function registerBtnClicked(){
    let username = document.getElementById("register-username-input").value;
    let name = document.getElementById("register-name-input").value;
    let email = document.getElementById("register-email-input").value;
    let password = document.getElementById("register-password-input").value;
    let image = document.getElementById("prfile-image-input").files[0];

    const bodyFormData = new FormData();
    bodyFormData.append("username",username);
    bodyFormData.append("password",password);
    bodyFormData.append("name",name);
    bodyFormData.append("email",email);
    if(image){
        bodyFormData.append("image", image, "mu_image.jpg");
    }

    
    const url = `https://tarmeezacademy.com/api/v1/register`;
    axios.post(url,bodyFormData)
    .then((response)=>{
        let token = response.data.token;
        let user = response.data.user;
        
        localStorage.setItem("token",token);
        localStorage.setItem("user",JSON.stringify(user) );

        
        const modal = document.getElementById("register-modal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();

        showAlert("Registered successfully!",'success');
        setupUI();
   
    })
    .catch((error)=>{
        showAlert(error.response.data.message,`danger`);
    })

    
}

function showAlert(message,type="success",time = 2000){
    const alertPlaceholder = document.getElementById('success-alert')
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute("id","alert-success-message");
    wrapper.setAttribute("class","show fade");
    wrapper.innerHTML = [
        `<div  class="alert alert-${type} alert-dismissible" role="alert" >`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
    }
    
    appendAlert(message , type)
    
    setTimeout(() => {
        document.getElementById("success-alert").innerHTML="";    
    }, time);   
}

function showLoggedOutAlert(){
    const alertPlaceholder = document.getElementById('success-alert')
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute("id","alert-danger-message");
    wrapper.innerHTML = [
        `<div  class="alert alert-${type} alert-dismissible" role="alert" >`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
    }
    
    appendAlert(`Logged out` , 'danger')
    setTimeout(() => {
        document.getElementById("alert-danger-message").innerHTML="";    
    }, 2000);    
}

function getCurrentUser(){
    let user = null ;
    const storageUser= localStorage.getItem("user");
    if (storageUser!=null){
        user = JSON.parse(storageUser);
    }
    return user;
}

function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showLoggedOutAlert();
    setupUI();
}

function resolveImageUrl(maybeImage) {
  // حالات ممكنة:
  // - null / undefined -> null
  // - string (direct URL) -> string
  // - object with url -> url
  // - object with path or src -> try common keys
  // - array -> take first element and recurse
  if (!maybeImage) return null;

  // string
  if (typeof maybeImage === "string") {
    return maybeImage;
  }

  // array -> take first item
  if (Array.isArray(maybeImage) && maybeImage.length > 0) {
    return resolveImageUrl(maybeImage[0]);
  }

  // object -> try common keys
  if (typeof maybeImage === "object") {
    const tryKeys = ["url", "src", "path", "link", "full", "original"];
    for (const k of tryKeys) {
      if (maybeImage[k] && typeof maybeImage[k] === "string") return maybeImage[k];
    }

    // sometimes object has nested structure: { data: { url: ... } }
    if (maybeImage.data) {
      return resolveImageUrl(maybeImage.data);
    }

    // fallback: if object has a toString that is not useful, return null
    return null;
  }

  return null;
}

function editPostBtnClicked(postObj){
  let post = JSON.parse(decodeURIComponent(postObj))

  document.getElementById("image-container").style.visibility="hidden"
  document.getElementById("post-id-input").value = post.id;
  document.getElementById("post-modal.title").innerHTML = "Edit Post"
  document.getElementById("create-edit-btn").innerHTML = "Update"
  document.getElementById("title-input").value = post.title;
  document.getElementById("body-input").value = post.body;

  let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"),{})
  postModal.toggle()
}


function deletePostBtnClicked(postObj){
  let post = JSON.parse(decodeURIComponent(postObj))
  document.getElementById("post-id-input").value = post.id;
  
  let postModal = new bootstrap.Modal(document.getElementById("deleteModal"),{})
  postModal.toggle()

}

function deletePostSubmitBtnClicked(){
  let postId = document.getElementById("post-id-input").value;
  let token = localStorage.getItem("token");
  axios.post(`${baseUrl}/posts/${postId}`,{
    "_method": "delete"
  },{
    headers:{
      "authorization":`Bearer ${token}`,
      
    }
  }).then((response)=>{
    const modal = document.getElementById("deleteModal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    startUp()

    showAlert("Post Deleted successfully","success",3000)
  }).catch((error)=>{
    console.log(error);
    showAlert("Login Or register ","danger")
  })

}

function createNewPostClicked(){

  let postId = document.getElementById("post-id-input").value;
  let isCreate = postId == null || postId =="";
  
    

  let token = localStorage.getItem("token");
  let title = document.getElementById("title-input").value;
  let body = document.getElementById("body-input").value;
  let image = document.getElementById("image-input").files[0];
  let alertMessage = ""
  
  
  const bodyFormData = new FormData();
  bodyFormData.append("title", title);
  bodyFormData.append("body", body);

  if(image){
    bodyFormData.append("image", image, "mu_image.jpg");
  }
  

  if(isCreate){
    url = `${baseUrl}/posts`
    alertMessage="Post Created Successfully!"
  }else {
    url=`https://tarmeezacademy.com/api/v1/posts/${postId}`
    document.getElementById("post-id-input").value="";    
    bodyFormData.append("_method","put")
    alertMessage="Post Updated Successfully!"
  }
    

      axios({
        method:"post",
        url:url,
        data:bodyFormData,
        headers:{
          "Authorization":`Bearer ${token}`
        }
      })
      .then((response)=>{

        const modal = document.getElementById("create-post-modal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        startUp()
        showAlert(alertMessage,"success" , 3000)

      }).catch((error)=>{
        if(isCreate){
          errorMessage = error.response.data.message;
          showAlert(errorMessage,"danger",4000);
        }else{
          errorMessage = error.response.data.error_message;
          showAlert(errorMessage,"danger",4000);
        }
          
        })
    
    
  } 
    