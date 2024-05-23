<?php

$inData = getRequestInfo();
	
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$login = $inData["login"];
$password = $inData["password"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ( $conn->connect_error ) {
    returnWithError( $conn->connect_error );
} else {
    // Check for existing login
    $stmt = $conn->prepare("SELECT login FROM Users WHERE login=?");
    $stmt->bind_param("s", $login);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->fetch_assoc()) {
        returnWithError("User already exists");
    } else {
        // Hash Password for Extra Security
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Insert new user information
        $stmt = $conn->prepare("INSERT INTO Users (firstName, lastName, login, password) VALUES (?,?,?,?)");
        $stmt->bind_param("ssss", $firstName, $lastName, $login, $hashedPassword);

        if ($stmt->execute()) {
            returnWithInfo($firstName, $lastName);
        }
        else {
            returnWithError($stmt->error);
        }
    }
    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError( $err )
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}

function returnWithInfo( $firstName, $lastName, $id )
{
    $retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
    sendResultInfoAsJson( $retValue );
}

?>