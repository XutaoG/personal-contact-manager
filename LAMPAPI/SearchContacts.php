<?php

$inData = getRequestInfo();

$searchResults = "";
$searchCount = 0;

$Name = $inData["Name"];
$Phone = $inData["Phone"];
$Email = $inData["Email"];
$UserID = $inData["UserID"];

$conn = new mysqli("localhost", "TheBeast", "We4331!L", "COP4331");
if ($conn->connect_error)
{
    returnWithError($conn->connect_error);
}
else
{
    // Prepare the statement with four parameters: Name, Phone, Email, and UserID
    $stmt = $conn->prepare("SELECT * FROM Contacts WHERE Name LIKE ? OR Phone LIKE ? OR Email LIKE ? OR UserID LIKE ?");
    
    // Add wildcards to the input values for partial matching
    $Name = "%" . $Name . "%";
    $Phone = "%" . $Phone . "%";
    $Email = "%" . $Email . "%";
    $UserID = "%" . $UserID . "%";
    
    // Bind the parameters, all as strings ('s')
    $stmt->bind_param("ssss", $Name, $Phone, $Email, $UserID);
    
    $stmt->execute();
    
    $result = $stmt->get_result();
    
    while($row = $result->fetch_assoc())
    {
        if($searchCount > 0)
        {
            $searchResults .= ",";
        }
        $searchCount++;
        $searchResults .= '{"Name" : "' . $row["Name"]. '", "Phone" : "' . $row["Phone"]. '", "Email" : "' . $row["Email"]. '", "UserID" : "' . $row["UserID"]. '"}';
    }
    
    if($searchCount == 0)
    {
        returnWithError("No Records Found");
    }
    else
    {
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
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($searchResults)
{
    $retValue = '{"results":[' . $searchResults . '],"error":""}';
    sendResultInfoAsJson($retValue);
}

?>
