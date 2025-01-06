
function handleShowButtons() {
    const moreButtons = document.getElementById('hiddenButtons');
    if (moreButtons.style.display === 'none') {
        moreButtons.style.display = 'block';
    } else {
        moreButtons.style.display = 'none';
    }
}

const body = document.getElementById("body");
function handleTextAlign() {
    if (body.style.textAlign === "end") {
    	body.style.textAlign = "start";
    } else if (body.style.textAlign === "start") {
    	body.style.textAlign = "center";
    } else {
    	body.style.textAlign = "end";
    }
  }


const spotlightTable = document.getElementById("commentBox");
function handleSpotlight() {
	let userInput = window.prompt("Hey king, you like Tanktop?", "");
	if (userInput) {
		console.log("start");
		const newRow = spotlightTable.insertRow(-1);
		let newCell = newRow.insertCell(0);
		let newText = document.createTextNode(userInput);
		newCell.appendChild(newText);
		newCell.classList.add("comment");
		console.log("end");
	}
}

const script = document.createElement('script');
script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
document.head.appendChild(script);

document.getElementById("timeButton").onclick = function () {
    var formattedTime = new Date().toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false}).replace(',', '');
    document.querySelector(".toast-body").innerHTML = `It's ${formattedTime}. Tank Topper waste no time.`;
    document.querySelector(".toast-body").style.color = "#00022a"; // Set text color to white
    new bootstrap.Toast(document.getElementById("time"), { autohide: false }).show();
};

function closeToast() {
    new bootstrap.Toast(document.getElementById("time")).hide();
}

function handleCheckEmail() {
	const emailInput = document.querySelector("#email").value;
	const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const submitButton = document.querySelector("button[type='submit']");
	const emailWarning = document.querySelector("#email-warning");

	if (emailPattern.test(emailInput)) {
		submitButton.disabled = false;
		emailWarning.classList.add("warning");
	} else {
		submitButton.disabled = true;
		emailWarning.classList.remove("warning");
	}
}

function validateForm() {
	const email = document.querySelector("#email").value;
	const colorChoice = document.querySelector("input[name='color_choice']:checked").value;
	const introduction = document.querySelector("#introduction").value;

	if (email && colorChoice && introduction) {
		const newComment = document.createElement("div");
		newComment.className = "d-flex";
		newComment.innerHTML = `
			<div class="flex-shrink-0"><img src="images/tanktop.png" height="50" width="50"></div>
			<div class="flex-grow-1"><h6>${email}</h6><p>${introduction}</p></div>
		`;
		newComment.id = 'c' + (Number(document.querySelector("#comments").lastElementChild.id.substr(1)) + 1);
		newComment.style.cssText = `
			background-color: ${colorChoice === "red" ? "darkred" : colorChoice === "yellow" ? "darkgoldenrod" : colorChoice === "blue" ? "darkblue" : colorChoice};
			margin: 10px;
			padding: 10px;
			border-radius: 5px;
			font-size: small;
		`;
		document.querySelector("#comments").appendChild(newComment);
		document.querySelector("form").reset();

		// Use fetch to get the original content in data.txt, append the new one, and PUT it back
		fetch("http://127.0.0.1:8080/data.txt")
			.then(response => response.text())
			.then(originalData => {
				const updatedData = originalData + `\n${JSON.stringify({ email, colorChoice, introduction })}`;
				return fetch("http://127.0.0.1:8080/data.txt", {
					method: "PUT",
					headers: {
						"Content-Type": "application/json"
					},
					body: updatedData
				});
			})
			.then(response => response.text())
			.then(data => {
				console.log("Data successfully updated:", data);
				// Scroll to the bottom of the page
				window.scrollTo(0, document.body.scrollHeight);
			})
			.catch(error => console.error("Error updating data:", error));
	}
}

function loadComments() {
	fetch("http://127.0.0.1:8080/data.txt")
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.text();
		})
		.then(data => {
			const comments = data.trim().split('\n').map(line => JSON.parse(line));
			comments.forEach(comment => {
				const newComment = document.createElement("div");
				newComment.className = "d-flex";
				newComment.innerHTML = `
					<div class="flex-shrink-0"><img src="images/tanktop.png" height="50" width="50"></div>
					<div class="flex-grow-1"><h6>${comment.email}</h6><p>${comment.introduction}</p></div>
				`;
				newComment.style.cssText = `
					background-color: ${comment.colorChoice === "red" ? "darkred" : comment.colorChoice === "yellow" ? "darkgoldenrod" : comment.colorChoice === "blue" ? "darkblue" : comment.colorChoice};
					margin: 10px;
					padding: 10px;
					border-radius: 5px;
					font-size: small;
				`;
				document.querySelector("#comments").appendChild(newComment);
			});
		})
		.catch(error => {
			console.error("Error loading comments:", error);
			// Create a new data.txt file if it doesn't exist
			fetch("http://127.0.0.1:8080/data.txt", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: ""
			})
			.then(response => response.text())
			.then(data => console.log("data.txt file created:", data))
			.catch(error => console.error("Error creating data.txt file:", error));
		});
}

// Call loadComments when the page loads
document.addEventListener("DOMContentLoaded", loadComments);
