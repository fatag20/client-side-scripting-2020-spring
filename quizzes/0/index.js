const listElement = document.getElementById("list");
let numberOfClicks = 0;

function onDrummerClicked()
{
    numberOfClicks++;

    const listItemElement = document.createElement("li");
    listItemElement.textContent = numberOfClicks;
    listElement.appendChild(listItemElement);
}