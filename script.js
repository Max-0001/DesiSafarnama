// Admin Password
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

// Keep session
if(localStorage.getItem('adminLoggedIn')==='true' && postSection){
  loginForm.parentElement.hidden=true;
  postSection.hidden=false;
}

// Post Blog
if(postForm){
  postForm.addEventListener('submit', e=>{
    e.preventDefault();
    const title = document.getElementById('blog-title').value;
    const content = document.getElementById('blog-content').value;
    let blogs = JSON.parse(localStorage.getItem('blogs')||'[]');
    blogs.unshift({id:Date.now(),title,content,date:new Date().toLocaleString()});
    localStorage.setItem('blogs',JSON.stringify(blogs));
    postMsg.textContent="Blog posted successfully!";
    postForm.reset();
  });
}

// Load Blogs (Homepage)
function loadBlogs(){
  const blogList = document.getElementById('blog-list');
  if(!blogList) return;
  const blogs = JSON.parse(localStorage.getItem('blogs')||'[]');
  blogList.innerHTML='';
  if(blogs.length===0){ blogList.innerHTML="<p>No blogs yet.</p>"; return; }
  blogs.forEach(blog=>{
    const div = document.createElement('div');
    div.className='blog-item';
    div.innerHTML = `<h3><a href="blog.html?id=${blog.id}">${blog.title}</a></h3>
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
    blogContainer.innerHTML = `<h2>${blog.title}</h2>
                               <small>Posted on ${blog.date}</small>
                               <p>${blog.content.replace(/\n/g,'<br>')}</p>`;
  } else {
    blogContainer.innerHTML="<p>Blog not found!</p>";
  }
}
