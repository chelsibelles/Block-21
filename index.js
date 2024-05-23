const COHORT = "2403-ftb-et-web-pt";

const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
    parties: [],
};

const fetchAllParties = async () => {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        state.parties = data.data;

        renderAllParties();
    } catch (error) {
        console.log("Error fetching parties:", error);
    }
};

const createNewParty = async (name, dateTime, location, description) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                dateTime: new Date(dateTime).toISOString(),
                location,
                description,
            }),
        });
        await fetchAllParties();
    } catch (error) {
        console.log("Error creating new party:", error);
    }
};

const removeParty = async (id) => {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        await fetchAllParties();
    } catch (error) {
        console.log("Error removing party:", error);
    }
};

const renderAllParties = () => {
    const partiesContainer = document.getElementById("parties-container");
    const partyList = state.parties;

    if (!partyList || partyList.length === 0) {
        partiesContainer.innerHTML = "<h3>No parties found.</h3>";
        return;
    }
    partiesContainer.innerHTML = "";

    partyList.forEach((party) => {
        const partyElement = document.createElement("div");
        partyElement.classList.add("party-card");
        partyElement.innerHTML = `
            <h4>${party.name}</h4>
            <h5>${new Date(party.dateTime).toLocaleString()}</h5>
            <h6>${party.location}</h6>
            <p>${party.description}</p>
            <button class="delete-button" data-id="${party.id}">Remove</button>
        `;
        partiesContainer.appendChild(partyElement);

        const deleteButton = partyElement.querySelector(".delete-button");
        deleteButton.addEventListener("click", async (event) => {
            event.preventDefault();
            await removeParty(party.id);
        });
    });
};

const addListenerToForm = () => {
    const form = document.querySelector("#new-party-form");

    if (!form) {
        console.error("Form not found");
        return;
    }

    const nameInput = form.querySelector("input[name='name']");
    const dateTimeInput = form.querySelector("input[name='dateTime']");
    const locationInput = form.querySelector("input[name='location']");
    const descriptionInput = form.querySelector("textarea[name='description']");

    console.log("Form elements:", {
        form,
        nameInput,
        dateTimeInput,
        locationInput,
        descriptionInput
    });

    if (!nameInput || !dateTimeInput || !locationInput || !descriptionInput) {
        console.error("One or more form elements not found");
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
            await createNewParty(
                nameInput.value,
                dateTimeInput.value,
                locationInput.value,
                descriptionInput.value
            );

            // Clear form fields after successful submission
            nameInput.value = "";
            dateTimeInput.value = "";
            locationInput.value = "";
            descriptionInput.value = "";
        } catch (error) {
            console.log("Error handling form submission:", error);
        }
    });
};

const init = async () => {
    await fetchAllParties();
    addListenerToForm();
};

init();
