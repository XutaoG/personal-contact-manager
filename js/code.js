const urlBase = "http://COP4331-5.com/LAMPAPI";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() {
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	let tmp = { login: login, password: password };
	//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + "/Login." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;

				if (userId < 1) {
					document.getElementById("loginResult").innerHTML =
						"User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "color.html";
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + minutes * 60 * 1000);
	document.cookie =
		"firstName=" +
		firstName +
		",lastName=" +
		lastName +
		",userId=" +
		userId +
		";expires=" +
		date.toGMTString();
}

function readCookie() {
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		} else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		} else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}

	if (userId < 0) {
		window.location.href = "index.html";
	} else {
		//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addColor() {
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = { color: newColor, userId, userId };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + "/AddColor." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("colorAddResult").innerHTML =
					"Color has been added";
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
}

function searchColor() {
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";

	let colorList = "";

	let tmp = { search: srch, userId: userId };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + "/SearchColors." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("colorSearchResult").innerHTML =
					"Color(s) has been retrieved";
				let jsonObject = JSON.parse(xhr.responseText);

				for (let i = 0; i < jsonObject.results.length; i++) {
					colorList += jsonObject.results[i];
					if (i < jsonObject.results.length - 1) {
						colorList += "<br />\r\n";
					}
				}

				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}

const contactEntries = document.querySelector("#contact-entries");
const contactEntryBase = contactEntries
	.querySelector(".contact-entry")
	.cloneNode(true);
contactEntries.querySelector(".contact-entry").remove();
const contactFormBase = document.getElementById("contactForm").cloneNode(true);
let currentContactToEdit = null;

const addContact = (firstName, lastName, phoneNumber, email) => {
	const newContactEntry = contactEntryBase.cloneNode(true);

	const contactEntryInfo = newContactEntry.querySelector(
		".contact-entry-form .contact-entry-info"
	);
	// Remove existing <p> tags
	contactEntryInfo.innerHTML = "";

	// Add <p> tags with correct information
	contactEntryInfo.innerHTML += `<p>${firstName} ${lastName}</p>`;
	contactEntryInfo.innerHTML += `<p>${phoneNumber}</p>`;
	contactEntryInfo.innerHTML += `<p>${email}</p>`;

	// TODO - Set ID (To be changed)
	newContactEntry.setAttribute("id", firstName);

	// Hide edit form
	newContactEntry.querySelector("#contactForm").style.display = "none";

	// Add new contact entry
	contactEntries.appendChild(newContactEntry);
};

// * To be removed
addContact("John", "Doe", "(123)-456-7890", "john@gmail.com");
addContact("Jane", "Doe", "(123)-456-7890", "jane@gmail.com");
addContact("Peter", "Griffin", "(123)-456-7890", "peter@gmail.com");
addContact("Rick", "Sanchez", "(123)-456-7890", "rick@gmail.com");

const switchContactToEdit = (event) => {
	let foundContactEntry =
		event.target.parentElement.parentElement.parentElement;

	if (event.target.nodeName === "H3") {
		foundContactEntry = foundContactEntry.parentElement;
	}

	if (foundContactEntry.id === currentContactToEdit) {
		// Contact is currently being edit, close it
		currentContactToEdit = null;
		foundContactEntry.querySelector("#contactForm").style.display = "none";
	} else {
		// Edit a new contact, close all others
		currentContactToEdit = foundContactEntry.id;

		contactEntries
			.querySelectorAll(".contact-entry")
			.forEach((contactEntry) => {
				contactEntry.querySelector("#contactForm").style.display =
					"none";
			});

		contactEntries
			.querySelector(`#${currentContactToEdit}`)
			.querySelector("#contactForm").style.display = "flex";
	}
};
