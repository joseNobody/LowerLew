
var obj,
  source;

api_key = "no key for you! hehe"
videoUrl = new URL(window.location.href);
if (videoUrl.searchParams.has('api')) {
  api_key = videoUrl.searchParams.get('api')
}
var videoClicked

const holder = document.getElementById('playerHolder')
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
    tagsVideo.style.fontSize = '12px'
    
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
      if (url == 'https://api.rule34.xxx/index.php?api_key=' + api_key + '&user_id=2995454&page=dapi&s=post&q=index&id=8699761&json=1&is=fobs') {
        source.setAttribute('src', 'https://cdn.discordapp.com/attachments/1204985147565281340/1468234097099804703/d089ceedfc50cd60968ffab6070add161620297121-640-360-391-h264.mp4?ex=6984988f&is=6983470f&hm=3084af0050e400131c4046166a8fb5cb17c28ebfdaaca82e8643f4a25f7c3301&')
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
    holder = document.getElementById('playerHolder')
    let textErr = document.createTextNode("[Connection Error] Either api is down or you are having connection issues, Try again later")
    holder.replaceChildren(textErr)
    
    console.log("oh noes: " + e)
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
  let url = 'https://api.rule34.xxx/index.php?api_key=' + api_key + '&user_id=2995454&page=dapi&s=post&q=index&id=' + videoUrl.searchParams.get('id') + '&json=1'
  getId(url)
}
else { 
  let url = 'https://api.rule34.xxx/index.php?api_key=' + api_key + '&user_id=2995454&page=dapi&s=post&q=index&id=8699761&json=1'
  getId(url)
}
