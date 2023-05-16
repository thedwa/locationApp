let cityName = "";
let activeCategory = "";

const overlay = document.getElementById("overlay");
const spinner = document.querySelector(".spinner");

function search() {
    const searchBox = document.getElementById("search-box");
    cityName = searchBox.value;
    console.log("City Name:", cityName);
    console.log("Active Category:", activeCategory);

    removeActiveClass();

    // Call the API here
    callOpenAPI();
}

function selectCategory(category) {
    activeCategory = category;
    console.log("Active Category:", activeCategory);

    removeActiveClass();

    const categoryButton = document.getElementById(`${category}Btn`);
    categoryButton.classList.add("active");
}

function removeActiveClass() {
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach((button) => {
        button.classList.remove("active");
    });
}

async function callOpenAPI() {
    // Show the overlay and spinner
    overlay.style.display = "flex";

    try {
        let prompt;
        if (activeCategory === "history") {
            prompt = `We are looking for historical information about ${cityName}. Please provide some details. After that, suggest 2-3 areas where you can tell more about from the text. Use the following format: 1. tell me more about XXX`;
        } else if (activeCategory === "politics") {
            prompt = `Tell us about the political landscape in ${cityName}. What are the key political events or figures? After that, suggest 2-3 areas where you can tell more about from the text. Use the following format: 1. tell me more about XXX`;
        } else if (activeCategory === "culture") {
            prompt = `Share some insights about the culture and traditions of ${cityName}. What makes it unique? After that, suggest 2-3 areas where you can tell more about from the text. Use the following format: 1. tell me more about XXX`;
        } else if (activeCategory === "funfact") {
            prompt = `Give us an interesting fun fact about ${cityName}. Something that people may not know. After that, suggest 2-3 areas where you can tell more about from the text. Use the following format: 1. tell me more about XXX`;
        } else if (activeCategory === "activities") {
            prompt = `What are some popular activities and attractions in ${cityName}? Provide a brief description. After that, suggest 2-3 areas where you can tell more about from the text. Use the following format: 1. tell me more about XXX`;
        } else if (activeCategory === "food") {
            prompt = `Describe the local cuisine of ${cityName}. What are some famous dishes or culinary specialties? After that, suggest 2-3 areas where you can tell more about from the text. Use the following format: 1. tell me more about XXX`;
        } else if (activeCategory === "nearby") {
            prompt = `What are some fun things to do nearby or in ${cityName}. Anything that I should not miss? After that, suggest 2-4 areas where you can tell more about from the text. Use the following format: 1. tell me more about XXX`;
        } 

        console.log("Prompt:", prompt);

        const data = {
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": `${prompt}`}],
            "temperature": 0.7
        };

        console.log(data.messages);

        const response = await fetch('/api/generateLocationInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const json = await response.json();
        const reply = json.choices && json.choices.length > 0 ? json.choices[0].message.content.trim() : 'No solution found.';
        console.log("the reply is: ");
        console.log(reply);

        // Display the reply text
        const responseMessage = document.getElementById("repsonse-message");
        responseMessage.textContent = reply;
        responseMessage.style.display = "block";
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Hide the overlay and spinner
        overlay.style.display = "none";
    }
}

// Add event listener to the search button
const searchButton = document.getElementById("citySearchBtn");
searchButton.addEventListener("click", search);
