
var obj,
  source;

// api key thing
api_key = ""
videoUrl = new URL(window.location.href);
if (localStorage.getItem("api_key")) {
  api_key = localStorage.getItem("api_key")
}
var videoClicked

const holder = document.getElementById('playerHolder')
// function to get image/video url and embed it
async function getId(url) {
  try {
    const loading = document.createElement('img')
    loading.src = "images/Loading.gif"
    loading.width = 120
    holder.insertBefore(loading, holder.firstChild)
    let resp = await fetch(url)
    let videoClicked = await resp.json()
    console.log(videoClicked[0])
    
    sourceUrl = document.createTextNode("Source: ")
    sourceUrl2 = document.createElement("a")
    sourceUrl2.href = "https://rule34.xxx/index.php?page=post&s=view&id=" + videoClicked[0].id
    sourceUrl2.textContent = "Rule 34 "
    comments = document.createTextNode('Comments: ' + videoClicked[0].comment_count)

    tagsTitle = document.createElement('div')
    tagsTitle.textContent = ' Tags'

    tagsVideo = document.createElement('div')
    tagsVideo.textContent = videoClicked[0].tags
    tagsVideo.style.color = 'blue'
    tagsVideo.style.fontSize = '14px'
    
    holder.replaceChildren()
    holder.append(sourceUrl)
    holder.append(sourceUrl2)
    holder.append(comments)

    const tagsBox = document.createElement('div'); 
    tagsBox.classList.add = 'tags-box';
    holder.append(tagsBox)
    tagsBox.append(tagsTitle)
    tagsBox.append(tagsVideo)
    holder.append(tagsVideo)

    
    
    if (videoClicked[0].file_url.endsWith(".mp4")) {
      console.log("current: video player")
      obj = document.createElement('video'); 
      obj.setAttribute('id', 'video-player'); 
      obj.setAttribute('class', 'video-js vjs-default-skin'); 
      obj.setAttribute('width', '100%'); 
      obj.setAttribute('data-height', 'auto'); 
      obj.setAttribute('controls', ' '); 
      obj.setAttribute('poster', videoClicked[0].preview_url); 
      obj.setAttribute('preload', 'auto'); 
      obj.setAttribute('fullscreen', true)
      obj.setAttribute('data-setup', '{}'); 
      
      

      source = document.createElement('source');
      source.setAttribute('type', 'video/mp4');
      if (url.endsWith('is=fobs')) {
        source.setAttribute('src', 'https://us-cdn09-prem.boomio-cdn.com/remote_control.php?file=kMOLEpJgMpKXFvdnJfeZ5kVVzM97v9o1IYe_HtTKbuIt8pfjQHvGPzSuRYop2NApoJwkgyS1tHXiX3ro6vM9vyeZXUZWxYP0qKlkGIj_6dwGBmLLReSk9huHUK9hD5TxVC2RiWdeGjgLJX-2anDOIzdTysLYWGpKpaKJHCgA6U7iumkAogQKHp3PY5kC5mRE2pbcME4VcJBVwwCR0oDCVkYj99UDdA.mp4&acctoken=ZTZkNzA2YTNlMzRjNzllZjk0ZDdmMGVhNDlkZTJlMzhmMjc1ODYwMGQzOTk0MzVjMGU5ZGU0MjUyY2I2MGFlZXwxNzc0MzgxOTY4fDI4NTAwMHxydWxlMzR2aWRlby5jb218MHx8NDg1MTVhODMxYmUzMWQzMDM2NGEzM2VhNzM3MDJhNGE')
      }
      else {
        source.setAttribute('src', videoClicked[0].file_url);
      }
      
      

      holder.insertBefore(obj, holder.firstChild)
      obj.append(source)
      
      var player = videojs(obj);
      player.width(window.innerWidth * 0.97);
      player.height('auto');
      player.mobileUi();
      
      
      
    }
    else {
      console.log("current: image")
      var img = document.createElement("img");
      img.src = videoClicked[0].file_url
      img.style.width = window.innerWidth * 0.97
      img.style.maxWidth = window.innerWidth * 0.98
      holder.insertBefore(img, holder.firstChild)
    }

  } catch (e) {
    let textErr = document.createTextNode("[Connection Error] Either api is down or you are having connection issues, Try again later")
    holder.replaceChildren(textErr)
    
    console.log("oh noes: ")
    throw(e)
  }
}
  
  
  
const suggestionsBox = document.getElementById('suggestionsBox');
const input = document.getElementById('search')
const btn = document.getElementById('searchB')
const randomBtn = document.getElementById('randomBtn')
const pages = document.getElementById("pages")

pages.style.width = window.innerWidth / 13.5
input.style.width = window.innerWidth / 1.9
pages.style.height = window.innerHeight / 36
input.style.height = window.innerHeight / 36
btn.style.height = window.innerHeight / 36
randomBtn.style.height = window.innerHeight / 36


pages.value = sessionStorage.getItem('pages')

randomBtn.addEventListener('click', randomState)
async function randomState() {
  if (sessionStorage.getItem('random')) {
    sessionStorage.removeItem('random')
    randomBtn.style.backgroundColor = "white"
  }
  
  else {
    sessionStorage.setItem('random', true)
    randomBtn.style.backgroundColor = "green"
  }
}

if (sessionStorage.getItem('random')) {
  randomBtn.style.backgroundColor = "green"
}


input.value = videoUrl.searchParams.get("tags");


input.addEventListener('input', suggestionsF)
async function suggestionsF() {
  suggestionsBox.innerHTML = ''
  
  
  inputValues = input.value.split(" ")
  inputValue = inputValues[inputValues.length -1]
  if (inputValue.length === 0) {
    return;
  }
  let url = "https://api.rule34.xxx/autocomplete.php?q=" + inputValue
  try {
    let resp = await fetch(url)
    let json = await resp.json()
    
    
    json.forEach(sug => {
      const suggestionItem = document.createElement('div');
      suggestionItem.classList.add('suggestion-item');
      suggestionItem.style.width = window.innerWidth * 0.97
      suggestionItem.textContent = sug.label;
      suggestionItem.addEventListener('pointerdown', e => {
        e.preventDefault(); 
      });
      suggestionItem.addEventListener('click', function(e) {
        e.preventDefault()
        e.target.focus()
        sugValue = sug.value.replace(" ", "_")
        if (inputValues.length < 2) {
        input.value = input.value.replace(inputValue, sugValue + " ")
        }
        else {
          input.value = input.value.replace(" " + inputValue, " " + sugValue + " ")
        }
        suggestionsBox.innerHTML = ''; 
      });
      suggestionsBox.appendChild(suggestionItem);
    });
  }
  catch (e){
    throw e
  }
}

document.addEventListener('click', function(event) {
  if (!input.contains(event.target) && !suggestionsBox.contains(event.target)) {
    suggestionsBox.innerHTML = '';
  }
});

btn.addEventListener('click', searchBtn)
input.addEventListener('keyup', function(e){
    e.preventDefault()
    var key = e.which || e.keyCode
    if (key == 13) {
      btn.click()
    }
  })

  async function searchBtn() {
    videoUrl.searchParams.set("tags", input.value);
    sessionStorage.setItem('pages', pages.value)
    window.location.href = "./?api=" + api_key + "&tags=" + videoUrl.searchParams.get('tags')
  }




if (videoUrl.searchParams.has('id')) {
  let url = 'https://api.rule34.xxx/index.php?' + api_key + '&page=dapi&s=post&q=index&id=' + videoUrl.searchParams.get('id') + '&json=1'
  getId(url)
}
else { 
  let url = 'https://api.rule34.xxx/index.php?' + api_key + '&page=dapi&s=post&q=index&id=8699761&json=1&is=fobs'
  getId(url)
}
