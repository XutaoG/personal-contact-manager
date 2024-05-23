<?php

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$inData = getRequestInfo();

$id = $inData["id"];
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$phoneNumber = $inData["phoneNumber"];
$emailAddress = $inData["emailAddress"];

$conn = new mysqli("localhost", "TheBeast", "We4331!L", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, PhoneNumber=?, EmailAddress=? WHERE ID=?");
    $stmt->bind_param("ssssi", $firstName, $lastName, $phoneNumber, $emailAddress, $id);
    if($stmt->execute()) {
        $stmt->close();
        $conn->close();
        returnWithError("");
    } else {
        returnWithError($stmt->error);
    }
}

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err) {
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}
?>
