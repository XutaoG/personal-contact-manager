const urlBase = "http://165.22.10.169/LAMPAPI";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";
let contactEntries;
let contactEntryBase;
let contactFormBase;
let currentContactToEdit = null;

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

// * ================ NAVIGATION ================

const switchToContactsPage = () => {
	window.location.href = "contacts.html";
};

// * ================ USERS ================

const validateSignUpFields = (firstName, lastName, username, password) => {
	const errors = [];

	// Validate first name
	if (firstName.length === 0) {
		errors.push("First name cannot be empty");
	} else if (firstName.length > 24) {
		errors.push("First name cannot be longer than 24 characters");
	}

	// Validate last name
	if (lastName.length === 0) {
		errors.push("Last name cannot be empty");
	} else if (lastName.length > 24) {
		errors.push("Last name cannot be longer than 24 characters");
	}

	// Validate username
	if (username.length === 0) {
		errors.push("Username cannot be empty");
	} else if (username.length > 24) {
		errors.push("Username cannot be longer than 24 characters");
	}

	// Validate password
	if (password.length <= 8) {
		errors.push("Password must be longer than 8 characters");
	} else if (password.length > 24) {
		errors.push("Password cannot be longer than 24 characters");
	}

	return errors;
};

const signUp = () => {
	// Get add contact input values
	const firstName = document.getElementById("signUpFirstName").value.trim();
	const lastName = document.getElementById("signUpLastName").value.trim();
	const username = document.getElementById("signUpUsername").value.trim();
	const password = document.getElementById("signUpPassword").value.trim();

	// Trim input spaces
	document.getElementById("signUpFirstName").value = firstName;
	document.getElementById("signUpLastName").value = lastName;
	document.getElementById("signUpUsername").value = username;
	document.getElementById("signUpPassword").value = password;

	signUpErrors = validateSignUpFields(
		firstName,
		lastName,
		username,
		password
	);

	// Display errors if error exists
	if (signUpErrors.length !== 0) {
		const signUpErrorsElement = document.getElementById("signUpErrors");
		signUpErrorsElement.innerHTML = "";

		signUpErrors.forEach((error) => {
			signUpErrorsElement.innerHTML += `<li>${error}</li>`;
		});

		return;
	}

	// TODO - Make signUp API call
};

const validateLoginFields = (username, password) => {
	const errors = [];

	// Validate username
	if (username.length === 0) {
		errors.push("Username cannot be empty");
	}

	// Validate password
	if (password.length === 0) {
		errors.push("Password cannot be empty");
	}

	return errors;
};

const login = () => {
	// Get login input values
	const username = document.getElementById("loginUsername").value.trim();
	const password = document.getElementById("loginPassword").value.trim();

	loginErrors = validateLoginFields(username, password);

	// Display errors if error exists
	if (loginErrors.length !== 0) {
		const loginErrorsElement = document.getElementById("loginErrors");
		loginErrorsElement.innerHTML = "";

		loginErrors.forEach((error) => {
			loginErrorsElement.innerHTML += `<li>${error}</li>`;
		});

		return;
	}

	// TODO - Make login API call

	// window.location.href = "contacts.html";
};

const logout = () => {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
};

// * ================ CONTACTS ================

// TODO - Retrieve all contacts
const getAllContacts = () => {};

const searchContacts = () => {
	const searchKeyword = document.querySelector("#search input").value;

	// TODO - Make searchContacts API call
};

const resetSearch = () => {
	document.querySelector("#search input").value = "";

	searchContacts();
};

const initializeContactsPage = () => {
	contactEntries = document.querySelector("#contact-entries");
	contactEntryBase = contactEntries
		.querySelector(".contact-entry")
		.cloneNode(true);
	contactEntries.querySelector(".contact-entry").remove();
	contactFormBase = document.getElementById("contactForm").cloneNode(true);

	// TODO - To be removed
	insertContact("Peter", "Griffin", "(743)453-2134", "Peter@gmail.com");
	insertContact("Rick", "Sanchez", "(743)432-1234", "Rick@gmail.com");
	insertContact("Jon", "Snow", "(744)532-1234", "Jon@gmail.com");
	insertContact("Morty", "Smith", "(743)452-1234", "Morty@gmail.com");
};

const validateContactFields = (firstName, lastName, phoneNumber, email) => {
	const errors = [];

	// Validate first name
	if (firstName.length === 0) {
		errors.push("First name cannot be empty");
	} else if (firstName.length > 24) {
		errors.push("First name cannot be longer than 24 characters");
	}

	// Validate last name
	if (lastName.length === 0) {
		errors.push("Last name cannot be empty");
	} else if (lastName.length > 24) {
		errors.push("Last name cannot be longer than 24 characters");
	}

	// Validate phone number
	if (phoneNumber.length === 0) {
		errors.push("Phone number cannot be empty");
	} else if (!phoneNumber.match(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/)) {
		errors.push("Please enter a valid 10-digit US phone number");
	}

	// Validate email
	if (email.length === 0) {
		errors.push("Email cannot be empty");
	} else if (
		!email.match(
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)
	) {
		errors.push("Please enter a valid email (example@email.com)");
	}

	return errors;
};

const addContact = () => {
	// Get add contact input values
	const firstName = document
		.getElementById("addContactFirstName")
		.value.trim();
	const lastName = document.getElementById("addContactLastName").value.trim();
	const phoneNumber = document
		.getElementById("addContactPhoneNumber")
		.value.trim();
	const email = document.getElementById("addContactEmail").value.trim();

	// Trim input spaces
	document.getElementById("addContactFirstName").value = firstName;
	document.getElementById("addContactLastName").value = lastName;
	document.getElementById("addContactPhoneNumber").value = phoneNumber;
	document.getElementById("addContactEmail").value = email;

	const addContactErrors = validateContactFields(
		firstName,
		lastName,
		phoneNumber,
		email
	);

	// Display errors if error exists
	if (addContactErrors.length !== 0) {
		const addContactErrorsElement =
			document.getElementById("addContactErrors");
		addContactErrorsElement.innerHTML = "";

		addContactErrors.forEach((error) => {
			addContactErrorsElement.innerHTML += `<li>${error}</li>`;
		});

		return;
	}

	// TODO - Make AddContact API call

	// TODO - To be removed
	insertContact(
		firstName,
		lastName,
		convertPhoneNumberFormat(phoneNumber),
		email
	);
};

const insertContact = (firstName, lastName, phoneNumber, email) => {
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

		// Close all otherr contact edit form
		contactEntries
			.querySelectorAll(".contact-entry")
			.forEach((contactEntry) => {
				contactEntry.querySelector("#contactForm").style.display =
					"none";

				// Remove all errors
				contactEntry.querySelector(".field-errors").innerHTML = "";
			});

		// Open the selected contact edit form
		const selectedContactEntry = contactEntries.querySelector(
			`#${currentContactToEdit}`
		);

		selectedContactEntry.querySelector(`#contactForm`).style.display =
			"flex";

		// Popular edit form fields with existing data
		const editFormFields = contactEntries.querySelectorAll(
			`#${currentContactToEdit} .form-field`
		);

		const formData = selectedContactEntry.querySelectorAll(
			".contact-entry-info p"
		);

		editFormFields[0].querySelector("input").value =
			formData[0].innerHTML.split(" ")[0];
		editFormFields[1].querySelector("input").value =
			formData[0].innerHTML.split(" ")[1];
		editFormFields[2].querySelector("input").value = formData[1].innerHTML;
		editFormFields[3].querySelector("input").value = formData[2].innerHTML;
	}
};

const editContact = () => {
	const editContactFields = contactEntries.querySelectorAll(
		`#${currentContactToEdit} #contactForm .form-fields .form-field`
	);

	// Get add contact input values
	const firstNameField = editContactFields[0].querySelector("input");
	const lastNameField = editContactFields[1].querySelector("input");
	const phoneNumberField = editContactFields[2].querySelector("input");
	const emailField = editContactFields[3].querySelector("input");

	const firstName = firstNameField.value.trim();
	const lastName = lastNameField.value.trim();
	const phoneNumber = phoneNumberField.value.trim();
	const email = emailField.value.trim();

	// Trim input spaces
	firstNameField.value = firstName;
	lastNameField.value = lastName;
	phoneNumberField.value = phoneNumber;
	emailField.value = email;

	editContactErrors = validateContactFields(
		firstName,
		lastName,
		phoneNumber,
		email
	);

	// Display errors if error exists
	if (editContactErrors.length !== 0) {
		const editContactErrorsElement = document.querySelector(
			`#${currentContactToEdit} .field-errors`
		);
		editContactErrorsElement.innerHTML = "";

		editContactErrors.forEach((error) => {
			editContactErrorsElement.innerHTML += `<li>${error}</li>`;
		});

		return;
	}

	// TODO - Make EditContact API call
};

const deleteContact = (event) => {
	let foundContactEntry =
		event.target.parentElement.parentElement.parentElement;

	if (event.target.nodeName === "H3") {
		foundContactEntry = foundContactEntry.parentElement;
	}

	const foundId = foundContactEntry.id;

	// TODO - Make deleteContacts API call
};

// * ================ UTILS ================
const convertPhoneNumberFormat = (phoneNumber) => {
	const phoneNumberPure = [];

	for (let i = 0; i < phoneNumber.length; i++) {
		if (!isNaN(phoneNumber.charAt(i))) {
			phoneNumberPure.push(phoneNumber.charAt(i));
		}
	}

	phoneNumberPure.splice(0, 0, "(");
	phoneNumberPure.splice(4, 0, ")");
	phoneNumberPure.splice(8, 0, "-");

	return phoneNumberPure.join("");
};
