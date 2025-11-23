const ADMIN_PASSWORD = "Desi@Safarnama123";

// Elements
const loginForm = document.getElementById('login-form');
const loginMsg = document.getElementById('login-msg');
const postSection = document.getElementById('post-section');
const postForm = document.getElementById('post-form');
const postMsg = document.getElementById('post-msg');

// Admin Login
if(loginForm){
  loginForm.addEventListener('submit', e=>{
    e.preventDefault();
    const pwd = document.getElementById('admin-password').value;
    if(pwd === ADMIN_PASSWORD){
      loginForm.parentElement.hidden=true;
      postSection.hidden=false;
      localStorage.setItem('adminLoggedIn','true');
    } else {
      loginMsg.textContent="Incorrect password!";
    }
  });
}

if(localStorage.getItem('adminLoggedIn')==='true' && postSection){
  loginForm.parentElement.hidden=true;
  postSection.hidden=false;
}

// Convert image to base64
function fileToBase64(file){
  return new Promise((resolve,reject)=>{
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

// Post Blog
if(postForm){
  postForm.addEventListener('submit', async e=>{
    e.preventDefault();
    const title = document.getElementById('blog-title').value;
    const content = document.getElementById('blog-content').value;
    const mainImageFile = document.getElementById('main-image').files[0];
    const otherFiles = document.getElementById('other-images').files;

    if(!mainImageFile){ postMsg.textContent="Main image required!"; return; }

    const mainImage = await fileToBase64(mainImageFile);

    let otherImages = [];
    for(let file of otherFiles){
      const img = await fileToBase64(file);
      otherImages.push(img);
    }

    let blogs = JSON.parse(localStorage.getItem('blogs')||'[]');
    blogs.unshift({id:Date.now(), title, content, mainImage, otherImages, date:new Date().toLocaleString()});
    localStorage.setItem('blogs', JSON.stringify(blogs));
    postMsg.textContent="Blog posted successfully!";
    postForm.reset();
  });
}

// Load Blogs
function loadBlogs(){
  const blogList = document.getElementById('blog-list');
  if(!blogList) return;
  const blogs = JSON.parse(localStorage.getItem('blogs')||'[]');
  blogList.innerHTML='';
  if(blogs.length===0){ blogList.innerHTML="<p>No blogs yet.</p>"; return; }
  blogs.forEach(blog=>{
    const div = document.createElement('div');
    div.className='blog-item';
    div.innerHTML = `
      <img src="${blog.mainImage}" alt="${blog.title}">
      <h3><a href="blog.html?id=${blog.id}">${blog.title}</a></h3>
      <small>Posted on ${blog.date}</small>
      <p>${blog.content.substring(0,150)}...</p>`;
    blogList.appendChild(div);
  });
}

// Load Single Blog
function loadSingleBlog(){
  const blogContainer = document.getElementById('blog-post');
  if(!blogContainer) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const blogs = JSON.parse(localStorage.getItem('blogs')||'[]');
  const blog = blogs.find(b=>b.id==id);
  if(blog){
    document.title = blog.title + " – DesiSafarnama";
    let galleryHTML = '';
    blog.otherImages.forEach(img=>{ galleryHTML += `<img src="${img}" style="width:100%;margin-top:10px;">`; });
    blogContainer.innerHTML = `
      <h2>${blog.title}</h2>
      <small>Posted on ${blog.date}</small>
      <img src="${blog.mainImage}" style="width:100%;margin:10px 0;">
      <p>${blog.content.replace(/\n/g,'<br>')}</p>
      ${galleryHTML}`;
  } else {
    blogContainer.innerHTML="<p>Blog not found!</p>";
  }
}
