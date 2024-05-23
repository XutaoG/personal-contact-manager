<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$inData = getRequestInfo();

$UserID = $inData["UserID"];

$conn = new mysqli("localhost", "TheBeast", "We4331!L", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE UserID=?");
    if ($stmt) {
        $stmt->bind_param("i", $UserID);
        if ($stmt->execute()) {
            $stmt->close();
            $conn->close();
            returnWithSuccess();
        } else {
            returnWithError($stmt->error);
        }
    } else {
        returnWithError($conn->error);
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

function returnWithSuccess() {
    $retValue = '{"success":"Contacts deleted successfully"}';
    sendResultInfoAsJson($retValue);
}
?>
