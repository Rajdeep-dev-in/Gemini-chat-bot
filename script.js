const formData = document.querySelector(".typing-form");
const userDataCollect = document.querySelector("#query");
const chatList = document.querySelector(".chat-area")
const theme_btn = document.querySelector("#toggle-theme-btn");
const delete_chat = document.querySelector("#delete-chat");
const suggestion_list = document.querySelectorAll(".suggestion-list , .suggestion");
let userMessage = null;
const API_KEY = "AIzaSyCc1JxM106xkhqYMoTNLTipqCOH8CU_Abk";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;


function localStorageData(){
    let getChat = localStorage.getItem("saveChats");
    chatList.innerHTML = getChat || '';
    const isLightMode = (localStorage.getItem("themeColor") === "light-mode")
    document.body.classList.toggle("light-mode", isLightMode);
    theme_btn.innerText = isLightMode ? 'dark_mode' : 'light_mode';
    document.body.classList.toggle("hide-header", getChat);
}
localStorageData();

formData.addEventListener('submit', (e) =>{
    e.preventDefault()
    collectUserInput()
})

function collectUserInput(){
    userMessage = userDataCollect.value.trim() || userMessage;
    if(!userMessage) return

    const html = `<div class="msg-content">
                <img src="https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2068" alt="user image" class="user-logo">
                <p class="text user-text">
                    
                </p>
            </div>`
    
    const outgoingMessageDiv = createMessageElement(html,"outgoing")
    outgoingMessageDiv.querySelector(".text").innerText = userMessage;
    chatList.appendChild(outgoingMessageDiv)

    userDataCollect.value = ""
    document.body.classList.add("hide-header");
    setTimeout(showLoadingAnimation, 500);
    console.log(userMessage);
}

function createMessageElement(content, ...classes){
    const div = document.createElement("div");
    div.classList.add("msg", ...classes);
    div.innerHTML = content;
    return div;
}

function showLoadingAnimation(){
    const html = `<div class="msg-content">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThr7qrIazsvZwJuw-uZCtLzIjaAyVW_ZrlEQ&s" alt="Gemini image" class="gemini-logo">
                <p class="text gemini-text">
                </p>
                <div class="loading-indicator">
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                </div>
            </div>
            <span onClick="copyMessage(this)" class="icon material-symbols-rounded">
                content_copy
            </span>`
    
    const incomingMessageDiv = createMessageElement(html,"incoming", "loading")
    chatList.appendChild(incomingMessageDiv)

    generateApiResponse(incomingMessageDiv)
}

async function generateApiResponse(incomingMessageDiv){
    const textElement = incomingMessageDiv.querySelector(".text");
    try{
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: userMessage }]
                }]
            })
        });
        console.log(res);
        const data = await res.json()
        console.log(data);
        const apiRes = data?.candidates[0].content.parts[0].text;
        textElement.innerText = apiRes
        incomingMessageDiv.classList.remove("loading");
        localStorage.setItem("saveChats", chatList.innerHTML );
        console.log(apiRes);
    }catch(err){
        console.log(err);
    }finally{
        incomingMessageDiv.classList.remove("loading");
    }
}

function copyMessage(payload){
    const msgText = payload.parentElement.querySelector(".text").innerText;
    navigator.clipboard.writeText(msgText)
    payload.innerText = "done";
    setTimeout(() => {
        payload.innerText = "content_copy"
    }, 1000);
}

theme_btn.addEventListener("click", (e) =>{
    let isLightMode = document.body.classList.toggle("light-mode");
    theme_btn.innerText = isLightMode ? 'dark_mode' : 'light_mode';
    localStorage.setItem("themeColor", isLightMode ? "light-mode" : "dark-mode");
    
})

delete_chat.addEventListener("click", (e) =>{
    if(confirm("Are you  want to delete all messages ?")){
        localStorage.removeItem("saveChats");
        localStorageData()
    }
})

suggestion_list.forEach((suggestion) => {
    console.log(suggestion ,'hello');
    suggestion.addEventListener('click', (e) =>{
        e.stopPropagation()
        console.log(e.target.innerText, 'h45456');
        //userMessage = e.querySelector(".text").innerText;
        userMessage = e.target.innerText;
        // console.log(userMessage, 'line last');
        collectUserInput();
    })
})