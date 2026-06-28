version = "4.3"
console.log('hey!')
console.log("Version: " + version)

const baseTag = document.createElement('base');
baseTag.href = window.location.origin + '/'; 
document.head.prepend(baseTag);


const suggestionsBox = document.getElementById('suggestionsBox');
const input = document.getElementById('my-input')
const btn = document.getElementById('my-button')
const randomBtn = document.getElementById('randomBtn')
const pages = document.getElementById("pages")



//api key thing
api_key = "idk"
videoUrl = new URL(window.location.href);
if (localStorage.getItem("api_key")) {
  api_key = localStorage.getItem("api_key")
}
sizeButton = window.innerWidth / 3.26
sizeImage = window.innerWidth / 3.47



isSearching = false

// Favorite tab (probably breaks if using custom url instead)
async function viewFav(web) {
  let url = "https://api.rule34.xxx/index.php?" + api_key + "&page=dapi&s=post&q=index&limit=1=&json=1&id="
  const container = document.getElementById('images');
  const loading = document.createElement('img')
  loading.src = "images/Loading.gif"
  loading.width = sizeImage
  container.insertBefore(loading, container.firstChild)
  //container.replaceChildren()
  favoritesList = new Array()
  if (localStorage.getItem("favorites")) {
    favoritesList = localStorage.getItem("favorites").split(" ")
  }
  else {
    const erro = document.createTextNode("Nothing here... Maybe try to favorite something first?")
    container.replaceChildren(erro)
    return
  }
  console.log("[Favorites] total of " + favoritesList.length + " favorites!")
  for (const [inde, i] of favoritesList.entries()) {
    try {
      let json = []
      if (!i.startsWith("https://")) {
        let resp = await fetch(url + i)
        json = await resp.json()
      }
      else {
        json.push({ is_custom: true, id: i, tags: "very cool tags (no tags)", comment_count: -1, file_url: "video.mp4", preview_url: "images/noThumb.png" })
      }
      
      console.log("==== [" + (inde + 1) +"] ====")
      console.log(json[0])
      console.log("i = " + i)
      
      var btn = document.createElement("button")
      btn.style.visibility = 'hidden'
      btn.style.height = sizeButton
      btn.style.width = sizeButton
      btn.addEventListener('click', clickB)
      async function clickB() {
        console.log("clicked video url: " + json[0].file_url)
        if (json[0].is_custom) {
          window.location.href = "player.html?tags=" + input.value.replaceAll(" ","+") + "&url=" + json[0].id
        }
        else {
        window.location.href = "player.html?tags=" + input.value.replaceAll(" ","+") + "&id=" + json[0].id
        }
        
      }
      var img = document.createElement("img");
      img.style.maxHeight = sizeImage
      img.style.maxWidth = sizeImage
      img.src = json[0].preview_url;
      var body = document.getElementById("images");
      btn.appendChild(img)
      if (json[0].file_url.endsWith(".mp4")) {
        var imgPlay = document.createElement("img")
        imgPlay.src = 'images/isVideoPreview.png'
        imgPlay.style.height = 20
        imgPlay.style.width = 40
        btn.appendChild(imgPlay)
        imgPlay.style.visibility = 'visible'
      }
      if (json[0].file_url.endsWith(".gif")) {
        var imgPlay = document.createElement("img")
        imgPlay.src = 'images/isGifPreview.png'
        imgPlay.style.height = 20
        imgPlay.style.width = 40
        btn.appendChild(imgPlay)
        imgPlay.style.visibility = 'visible'
      }
      body.appendChild(btn);
      img.style.visibility = 'visible'
      
    } catch (e) {
      console.log("Error:")
      throw(e)
    }
  }
  container.replaceChild(loading.nextSibling, loading)
}

setTimeout(function() {
  viewFav()
},100)
  



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
  window.location.href = "./?tags=" + videoUrl.searchParams.get('tags')
}



