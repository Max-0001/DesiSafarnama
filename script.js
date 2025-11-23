// Load blogs for homepage
function loadBlogs(){
  const blogList = document.getElementById('blog-list');
  if(!blogList) return;
  const blogs = JSON.parse(localStorage.getItem('blogs')||'[]');
  blogList.innerHTML='';
  blogs.forEach(blog=>{
    const div = document.createElement('div');
    div.className='blog-item';
    div.innerHTML = `<img src="${blog.mainImage}" alt="${blog.title}">
                     <h3><a href="blog.html?id=${blog.id}">${blog.title}</a></h3>
                     <p>${blog.content.substring(0,150)}...</p>`;
    blogList.appendChild(div);
  });
}

// Load featured slider (first 3 blogs)
function loadFeaturedSlider(){
  const slider = document.getElementById('featured-slider');
  if(!slider) return;
  const blogs = JSON.parse(localStorage.getItem('blogs')||'[]');
  slider.innerHTML='';
  blogs.slice(0,3).forEach(blog=>{
    const div = document.createElement('div');
    div.className='slide';
    div.innerHTML = `<img src="${blog.mainImage}" alt="${blog.title}">
                     <h3>${blog.title}</h3>`;
    div.onclick=()=>{window.location.href="blog.html?id="+blog.id;}
    slider.appendChild(div);
  });
}

// Floating Image
function loadFloatingImage(){
  const img = document.getElementById('floating-img');
  if(!img) return;
  const url = localStorage.getItem('floatingImage');
  if(url) img.src=url;
}

// Social Links
function loadSocialIcons(){
  const container = document.getElementById('social-icons');
  if(!container) return;
  const links = JSON.parse(localStorage.getItem('socialLinks')||'{}');
  container.innerHTML='';
  for(const key in links){
    if(links[key]) container.innerHTML += `<a href="${links[key]}" target="_blank"><img src="${key}.png" alt="${key}"></a>`;
  }
}
