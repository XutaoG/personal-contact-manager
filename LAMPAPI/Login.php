<?php

$inData = getRequestInfo();

$username = $inData["username"];
$password = $inData["password"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
	returnWithError($conn->connect_error);
} else {
	$stmt = $conn->prepare("SELECT * FROM Users WHERE (Login=? AND Password=?)");
	$stmt->bind_param("ss", $username, $password);
	$stmt->execute();
	$result = $stmt->get_result();

	if ($row = $result->fetch_assoc()) {
		// password_verify() compares hash password in database with user-provided password
		http_response_code(200);
		returnWithInfo($row['ID'], $row["FirstName"], $row["LastName"], $row["Login"], $stmt->error);
	} else {
		http_response_code(401);
		returnWithError("Incorrect username or password");
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
	$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
	sendResultInfoAsJson($retValue);
}

function returnWithInfo($id, $firstName, $lastName, $username, $err)
{
	$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '", "username":"' . $username . '","error":"' . $err . '"}';
	sendResultInfoAsJson($retValue);
}

?>