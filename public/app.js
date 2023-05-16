let cityName = "";
let activeCategory = "";

function search() {
    const searchBox = document.getElementById("search-box");
    cityName = searchBox.value;
    console.log("City Name:", cityName);
    console.log("Active Category:", activeCategory);

    removeActiveClass();

    const searchMessage = document.getElementById("search-message");
    searchMessage.textContent = `Great! We are looking for ${activeCategory} in ${cityName} - stay tuned!`;
    searchMessage.style.display = "block";

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
    const prompt = `Great! We are looking for ${activeCategory} in ${cityName} - stay tuned!`;
    console.log(prompt);

    const data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": `${prompt}`}],
        "temperature": 0.7
    };

    console.log(data.messages);

    try {
        const response = await fetch('/api/generateLocationInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const json = await response.json();
        const solution = json.choices && json.choices.length > 0 ? json.choices[0].message.content.trim() : 'No solution found.';
        console.log("the solution is: ");
        console.log(solution);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Add event listener to the search button
const searchButton = document.getElementById("citySearchBtn");
searchButton.addEventListener("click", search);
