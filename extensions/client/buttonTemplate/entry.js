let bar = document.querySelector(".bar");

let newButton = document.createElement("button");
newButton.classList.add("button-hdr");
newButton.innerText = "Button Template";
newButton.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
newButton.style.border = "1px solid #252525";
newButton.style.borderRadius = "2.5px";
newButton.style.fontSize = "75%";

bar.appendChild(newButton);