<?php

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$inData = getRequestInfo();

$searchKeyword = $inData["searchKeyword"];
$userId = $inData["userId"];

$searchResults = "";
$searchCount = 0;

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
	returnWithError($conn->connect_error);
} else {
	// Prepare the statement with four parameters: Name, Phone, Email, and UserID
	$stmt = $conn->prepare("SELECT * FROM Contacts WHERE (Name LIKE ? OR Phone LIKE ? OR Email LIKE ?) AND UserID=?");

	// Add wildcards to the input values for partial matching
	$searchTerm = "%" . $searchKeyword . "%";

	// Bind the parameters, all as strings ('s') except for UserID ('i')
	$stmt->bind_param("sssi", $searchTerm, $searchTerm, $searchTerm, $userId);

	$stmt->execute();

	$result = $stmt->get_result();

	while ($row = $result->fetch_assoc()) {
		if ($searchCount > 0) {
			$searchResults .= ",";
		}
		$searchCount++;
		$searchResults .= '{"id": "' . $row["ID"] . '", "name" : "' . $row["Name"] . '", "phone" : "' . $row["Phone"] . '", "email" : "' . $row["Email"] . '", "userId" : ' . $row["UserID"] . '}';
	}

	if ($searchCount == 0) {
		returnWithError("No Records Found");
	} else {
		returnWithInfo($searchResults);
	}

	$stmt->close();
	$conn->close();
}

function getRequestInfo()
{
	return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
	header('Content-type: application/json');
	echo $obj;
}

function returnWithError($err)
{
	$retValue = '{"results":[],"error":"' . $err . '"}';
	sendResultInfoAsJson($retValue);
}

function returnWithInfo($searchResults)
{
	$retValue = '{"results":[' . $searchResults . '],"error":""}';
	sendResultInfoAsJson($retValue);
}

?>