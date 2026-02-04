version = "3.1"
console.log('hey!')
console.log("Version: " + version)

api_key = "no key for you! hehe"
videoUrl = new URL(window.location.href);
if (videoUrl.searchParams.has('api')) {
  api_key = videoUrl.searchParams.get('api')
}
sizeButton = window.innerWidth / 3.26
sizeImage = window.innerWidth / 3.47

async function search(web, tag, quantity) {
  console.clear()
  console.log("Version: " + version)
  videoUrl.searchParams.set("tags", tag)
  tags = tag.replaceAll(" ","+")
  history.pushState({}, '', videoUrl.href)
  if (sessionStorage.getItem('random')) {
    tags = tags + "+sort:random+score:>25"
  }
  else {
     tags = tags + "+sort:score:desc"
  }
  let url = "https://api.rule34.xxx/index.php?api_key=" + api_key + "&user_id=2995454&page=dapi&s=post&q=index&limit="+ quantity +"&tags="+ tags +"&json=1"
  const container = document.getElementById('images');
  const loading = document.createElement('img')
  loading.src = "images/Loading.gif"
  loading.width = sizeImage
  container.insertBefore(loading, container.firstChild)
  try {
    let resp = await fetch(url)
    let json = await resp.json()
    container.replaceChildren();
    json.forEach((i, inde) => {
      console.log("==== [" + (inde + 1) +"] ====" )
      console.log(i)
      var btn = document.createElement("button")
      btn.style.visibility = 'hidden'
      btn.style.height = sizeButton
      btn.style.width = sizeButton
      btn.addEventListener('click', clickB)
      async function clickB() {
        sessionStorage.setItem('current_search', tag);
        console.log("hey noob: " + i.file_url)
        window.location.href = "player.html?api=" + api_key + "&tags=" + tag.replaceAll(" ","+") + "&id=" + i.id
        
        
      }
      var img = document.createElement("img");
      img.style.maxHeight = sizeImage
      img.style.maxWidth = sizeImage
      img.src = i.preview_url;
      var body = document.getElementById("images");
      btn.appendChild(img)
      if (i.file_url.endsWith(".mp4")) {
        var imgPlay = document.createElement("img")
        imgPlay.src = 'images/isVideoPreview.png'
        imgPlay.style.height = 20
        imgPlay.style.width = 20
        btn.appendChild(imgPlay)
        imgPlay.style.visibility = 'visible'
      }
      body.appendChild(btn);
      img.style.visibility = 'visible'
    })
  }
  catch (e){
    const erro = document.createTextNode("Error: invalid tags or api unreachable.")
    container.replaceChildren(erro)
    throw e
  
  }
}

const suggestionsBox = document.getElementById('suggestionsBox');
const input = document.getElementById('my-input')
const btn = document.getElementById('my-button')
const randomBtn = document.getElementById('randomBtn')
const content = document.getElementById('my-content')
const pages = document.getElementById("pages")


pages.style.width = window.innerWidth / 13.5
input.style.width = window.innerWidth / 1.9
pages.style.height = window.innerHeight / 36
input.style.height = window.innerHeight / 36
btn.style.height = window.innerHeight / 36
randomBtn.style.height = window.innerHeight / 36


if (videoUrl.searchParams.get('tags')) {
  let current_search = videoUrl.searchParams.get('tags')
  current_search.replaceAll("+", " ")
  input.value = current_search
}

if (sessionStorage.getItem('pages')) {
  let current_pages = sessionStorage.getItem('pages')
  pages.value = current_pages
  if (pages.value < 18) {
      pages.value = 18
    }
  setTimeout(function() {
    search("r34", input.value, pages.value)
  },500)
}

input.addEventListener('input', suggestions)
async function suggestions() {
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
      suggestionItem.textContent = sug.label;
      suggestionItem.addEventListener('pointerdown', e => {
        e.preventDefault(); 
      });
      suggestionItem.addEventListener('click', function(e) {
        e.preventDefault()
        input.focus()
        sugValue = sug.value.replace(" ", "_")
        inputValues[inputValues.length -1] = sugValue
        input.value = inputValues.join(" ") + " "
        suggestionsBox.innerHTML = '';
        e.target.focus()
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

if (btn) {  
  btn.addEventListener('click', searchBar)
  async function searchBar() {
    if (pages.value < 18) {
      pages.value = 18
    }
    sessionStorage.setItem('pages',pages.value)
    console.log("input: " + input.value)
    search("r34",input.value,pages.value)
  }
  input.addEventListener('keyup', function(e){
    e.preventDefault()
    var key = e.which || e.keyCode
    if (key == 13) {
      btn.click()
    }
  })
}
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
