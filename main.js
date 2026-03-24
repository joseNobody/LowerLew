version = "4.0"
console.log('hey!')
console.log("Version: " + version)

api_key = "idk"
videoUrl = new URL(window.location.href);
if (localStorage.getItem("api_key")) {
  api_key = localStorage.getItem("api_key")
}
sizeButton = window.innerWidth / 3.26
sizeImage = window.innerWidth / 3.47



isSearching = false

async function search(web, tag, quantity) {
  if (isSearching) {
    console.log("[Search Canceled]: already searching.")
    return;
  }
  isSearching = true
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
  let url = "https://api.rule34.xxx/index.php?" + api_key + "&page=dapi&s=post&q=index&limit="+ quantity +"&tags="+ tags +"&json=1"
  const container = document.getElementById('images');
  const loading = document.createElement('img')
  loading.src = "images/Loading.gif"
  loading.width = sizeImage
  container.insertBefore(loading, container.firstChild)
  try {
    let resp = await fetch(url)
    let json = await resp.json()
    console.log(json)
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
        window.location.href = "player.html?tags=" + tag.replaceAll(" ","+") + "&id=" + i.id
        
        
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
        imgPlay.style.width = 40
        btn.appendChild(imgPlay)
        imgPlay.style.visibility = 'visible'
      }
      if (i.file_url.endsWith(".gif")) {
        var imgPlay = document.createElement("img")
        imgPlay.src = 'images/isGifPreview.png'
        imgPlay.style.height = 20
        imgPlay.style.width = 40
        btn.appendChild(imgPlay)
        imgPlay.style.visibility = 'visible'
      }
      body.appendChild(btn);
      img.style.visibility = 'visible'
    })
    isSearching = false
  }
  catch (e){
    const erro = document.createTextNode("[Connection Error]: invalid tags or api unreachable.")
    container.replaceChildren(erro)
    isSearching = false
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
    console.log("Searching for: " + input.value)
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


if (!localStorage.getItem("api_key")) {
  const body = document.getElementById("my-content");
  text = document.createTextNode("To use this website you need to get your api key from ")
  textUrl = document.createElement("a")
  textUrl.href = "https://rule34.xxx/index.php?page=account&s=options"
  textUrl.textContent = "Rule 34"
  text2 = document.createTextNode(', check the option "Generate New Key?", press save, go back to "API Access Credentials", copy everything in the text box and paste it bellow:')
  
  inputHolder = document.createElement('div')
  const input_api = document.createElement("textarea")
  input_api.placeholder = "paste api key here"
  input_api.style.height = '100px'
  input_api.style.width = "300px"
  input_api.style
  input_api.id = "api"
  inputHolder.appendChild(input_api)
  
  outputHolder = document.createElement('div')
  outputText = document.createTextNode("")
  outputHolder.appendChild(outputText)
  
  
  saveHolder = document.createElement("div")
  const save_btn = document.createElement("button")
  save_btn.textContent = "save"
  save_btn.style.height = "25px"
  save_btn.style.width = "50px"
  saveHolder.appendChild(save_btn)
  
  body.appendChild(text)
  body.appendChild(textUrl)
  body.appendChild(text2)
  body.appendChild(inputHolder)
  body.appendChild(saveHolder)
  body.appendChild(outputHolder)
  
  
  save_btn.addEventListener('click', saveApi)
  async function saveApi() {
    outputText.textContent = "Checking if API Key is valid..."
    let url = "https://api.rule34.xxx/index.php?" + input_api.value + "&page=dapi&s=post&q=index&limit=1&tags=test&json=1"
    try {
      console.log("Checking API Key...")
      let resp = await fetch(url)
      let json = await resp.json()
      if (!json[0].file_url) {
        console.log(json)
        outputText.textContent = "[API Error] Api key is invalid."
      }
      else {
        console.log("API key is valid.")
        localStorage.setItem("api_key", input_api.value)
        outputText.textContent = "Saved!"
        setTimeout(function() {
          window.location.reload()
        }, 5000)
      }
    }
    catch (e) {
      console.log("error")
      outputText.textContent = "[Connection Error] Either api is down or you are having connection issues, Try again later"
      throw e
    }
  }
}
//a


