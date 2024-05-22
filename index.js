const COHORT = "2403-ftb-wt-web-pt";

const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/`;

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
        console.log(error);
    }
};

const createNewParty = async (name, date, time, location, description) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                date: new Date(date).toISOString(),
                time: new Time(time).toISOString(),
                location,
                description,
            }),
        });
        await fetchAllParties();
    } catch (error) {
        console.log(error);
    }
};

const removeParty = async (id) => {
    try {
        await fetch (`{$API_URL}/${id}`, {
            method: "DELETE",
        });
        await fetchAllParties();
        } catch (error) {
            console.log(error);
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

    partyList.forEach ((party) => {
        const partyElement =document.createElement("div");
        partyElement.classList.add("party-card");
        partyElement.innerHTML = `
        <h4>${party.name}</h4>
        <h5>${party.date}</h5>
        <h6>${party.time}</h6>
        <h7>${party.location}</h7>
        <p>${party.description}</p>
        <button class="delete-button" data-id="${party.id}">Remove</button>
        `;
partiesContainer.appendChild(partyElement);

const deleteButton = partyElement.querySelector(".delete-button");

deleteButton.addEventListener("click", (event) => {
    try {
        event.preventDefault();
        removeParty(party.id);
    } catch (error) {
        console.log(error);
    }
});
        });
};

const addListenerToForm = () => {
    const form = document.querySelector("#new-party-form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        await createNewParty(
            form.name.value,
            form.date.value,
            form.time.value,
            form.location.value,
            form.description.value
        );
        form.name.value = "";
        form.date.value = "";
        form.time.value = "";
        form.location.value = "";
        form.description.value = "";
    });
};

const init = async () => {

    await fetchAllParties();

    addListenerToForm();
};

init ();