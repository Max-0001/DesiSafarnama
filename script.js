const ADMIN_PASSWORD = "Desi@Safarnama123";

// Admin login/logout
const loginForm = document.getElementById('login-form');
const postSection = document.getElementById('post-section');
const logoutBtn = document.getElementById('logout-btn');
if(loginForm){
  loginForm.addEventListener('submit', e=>{
    e.preventDefault();
    if(document.getElementById('admin-password').value===ADMIN_PASSWORD){
      loginForm.parentElement.hidden=true;
      postSection.hidden=false;
      localStorage.setItem('adminLoggedIn','true');
    } else alert("Incorrect password!");
  });
}
if(localStorage.getItem('adminLoggedIn')==='true' && postSection){
  loginForm.parentElement.hidden=true;
  postSection.hidden=false;
}
if(logoutBtn){
  logoutBtn.addEventListener('click',()=>{
    localStorage.removeItem('adminLoggedIn');
    location.reload();
  });
}

// Post blog with URL images
if(postSection){
  document.getElementById('post-form').addEventListener('submit', e=>{
    e.preventDefault();
    const title = document.getElementById('blog-title').value;
    const content = document.getElementById('blog-content').value;
    const mainImage = document.getElementById('main-image-url').value.trim();
    const otherImages = document.getElementById('other-images-urls').value.split(',').map(u=>u.trim()).filter(u=>u);
    const floatingImage = document.getElementById('floating-image-url').value.trim();
    const socialLinks = {
      facebook: document.getElementById('facebook-url').value.trim(),
      instagram: document.getElementById('instagram-url').value.trim(),
      twitter: document.getElementById('twitter-url').value.trim()
    };
    if(!mainImage){ alert("Main Image URL is required!"); return; }
    const blogs = JSON.parse(localStorage.getItem('blogs')||'[]');
    blogs.unshift({id:Date.now(),title,content,mainImage,otherImages});
    localStorage.setItem('blogs',JSON.stringify(blogs));
    if(floatingImage) localStorage.setItem('floatingImage',floatingImage);
    localStorage.setItem('socialLinks',JSON.stringify(socialLinks));
    alert("Blog posted successfully!");
    document.getElementById('post-form').reset();
  });
}

// Load blogs for homepage
function loadBlogs(){
  const blogList = document.getElementById('blog-list');
  if(!blogList) return;
  const blogs = JSON.parse(localStorage.getItem('blogs')||'[]');
  blogList.innerHTML='';
  blogs.forEach(blog=>{
    const div = document.createElement('div');
    div.className='blog-item';
    div.innerHTML = `
      <img src="${blog.mainImage}" alt="${blog.title}">
      <h3><a href="blog.html?id=${blog.id}">${blog.title}</a></h3>
      <p>${blog.content.substring(0,150)}...</p>`;
    blogList.appendChild(div);
  });
}

// Load floating image
function loadFloatingImage(){
  const img = document.getElementById('floating-img');
  if(!img) return;
  const url = localStorage.getItem('floatingImage');
  if(url) img.src=url;
}

// Load social media icons
function loadSocialIcons(){
  const container = document.getElementById('social-icons');
  if(!container) return;
  const links = JSON.parse(localStorage.getItem('socialLinks')||'{}');
  container.innerHTML='';
  for(const key in links){
    if(links[key]) container.innerHTML += `<a href="${links[key]}" target="_blank"><img src="${key}.png" alt="${key}" style="width:24px;margin:0 5px;"></a>`;
  }
}

// Blog page: single blog
function loadSingleBlog(){
  const blogContainer = document.getElementById('blog-post');
  if(!blogContainer) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const blogs = JSON.parse(localStorage.getItem('blogs')||'[]');
  const index = blogs.findIndex(b=>b.id==id);
  if(index<0){ blogContainer.innerHTML="<p>Blog not found!</p>"; return; }
  const blog = blogs[index];
  document.title = blog.title+" – DesiSafarnama";
  let galleryHTML = '';
  blog.otherImages.forEach(img=> galleryHTML += `<img src="${img}" style="width:100%;margin-top:10px;border-radius:8px;">`);
  blogContainer.innerHTML = `<h2>${blog.title}</h2>
                             <img src="${blog.mainImage}" style="width:100%;margin:10px 0;border-radius:10px;">
                             <p>${blog.content.replace(/\n/g,'<br>')}</p>
                             ${galleryHTML}`;
}

// Next/Previous buttons
function setupBlogNavigation(){
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const blogs = JSON.parse(localStorage.getItem('blogs')||'[]');
  const index = blogs.findIndex(b=>b.id==id);
  if(index<0) return;
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  if(prevBtn) prevBtn.onclick = ()=>{ if(index>0) location.href="blog.html?id="+blogs[index-1].id; };
  if(nextBtn) nextBtn.onclick = ()=>{ if(index<blogs.length-1) location.href="blog.html?id="+blogs[index+1].id; };
}
