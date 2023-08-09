const express = require("express");
var admin = require("firebase-admin");
const path = require("path");
const app = express();
const PORT = 3000;

var serviceAccount = require("C:/Users/PRADIP/Downloads/AE/motorq-4a9c0-firebase-adminsdk-1kh8y-08687f2c26.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://motorq-4a9c0-default-rtdb.firebaseio.com"
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "public", "land.html");
  res.sendFile(filePath);
});



app.get("/dashboardStatistics", async (req, res) => {
  try {
    const db = admin.database();
    const approvalHistoryRef = db.ref("approvalHistory");

    const snapshot = await approvalHistoryRef.once("value");
    const approvalHistory = snapshot.val();

    const totalPending = Object.values(approvalHistory).filter((entry) => entry.status === "pending").length;
    const totalApproved = Object.values(approvalHistory).filter((entry) => entry.status === "approved").length;
    const totalRejected = Object.values(approvalHistory).filter((entry) => entry.status === "rejected").length;

    res.json({ totalPending, totalApproved, totalRejected });
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/adminRequests", async (req, res) => {
  try {
    const db = admin.database();
    const requestsRef = db.ref("requests");
    const snapshot = await requestsRef.once("value");
    const requests = snapshot.val();
    res.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API endpoint to get pending requests for the approver
app.get("/pendingRequests", async (req, res) => {
  try {
    const db = admin.database();
    const requestsRef = db.ref("requests");
    const snapshot = await requestsRef.orderByChild("status").equalTo("pending").once("value");
    const pendingRequests = snapshot.val();
    res.json(pendingRequests);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/createWorkflow", async (req, res) => {
  try {
    const { workflowName, approvers, approvalType } = req.body;

    const db = admin.database();
    const workflowsRef = db.ref("workflows"); // Create a reference to the "workflows" node
    await workflowsRef.push({
      workflowName,
      approvers,
      approvalType
    });

    res.sendStatus(200);
  } catch (error) {
    console.error("Error creating workflow:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// API endpoint to approve or reject a request (Approver view)
app.post("/approveRejectRequest/:requestId", async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const { status } = req.body;

    const db = admin.database();
    const requestRef = db.ref(`requests/${requestId}`);
    await requestRef.update({ indexOn: status });

    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});






// // workflows and approval history
// const workflows = [];
// const approvalHistory = [];

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// app.use(express.static("public")); 




// app.post("/createWorkflow", (req, res) => {
//   const { workflowName, approvers, approvalType } = req.body;

//   // Store the workflow in the in-memory array (in a real app, you'd use a database)
//   workflows.push({ workflowName, approvers, approvalType });

//   res.sendStatus(200);
// });

// app.get("/dashboardStatistics", (req, res) => {
//   // Calculate statistics (dummy data for demonstration)
//   const totalPending = workflows.length;
//   const totalApproved = approvalHistory.filter((entry) => entry.status === "approved").length;
//   const totalRejected = approvalHistory.filter((entry) => entry.status === "rejected").length;

//   res.json({ totalPending, totalApproved, totalRejected });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// // Endpoint to create a workflow request
// app.post("/createRequest", (req, res) => {
//     const { workflowType, description, attachments } = req.body;
  
//     // Store the request in the in-memory array (in a real app, you'd use a database)
//     const request = { workflowType, description, attachments, status: "pending" };
//     approvalHistory.push(request);
  
//     res.sendStatus(200);
//   });
  
//   // Endpoint to get requests initiated by the requester
//   app.get("/userRequests", (req, res) => {
//     const requesterRequests = approvalHistory.filter((entry) => entry.status !== "pending");
//     res.json(requesterRequests);
//   });
  

//   // Endpoint to get pending requests for the approver
// app.get("/pendingRequests", (req, res) => {
//     const pendingRequests = approvalHistory.filter((entry) => entry.status === "pending");

//     const requestsWithId = pendingRequests.map((request, index) => ({
//         ...request,
//         id:index+1
//     }));
//     res.json(requestsWithId);
//   });
  

// // Endpoint to approve or reject a request
// app.post("/approveRejectRequest/:requestId", (req, res) => {
//     const requestId = req.params.requestId;
//     const { status } = req.body;
  
//     // Find the request with the specified ID
//     const request = approvalHistory.find((entry) => entry.id === requestId);
//     if (!request) {
//       return res.status(404).json({ error: "Request not found" });
//     }
  
//     // Update the status of the request
//     request.status = status;
  
//     res.sendStatus(200);
//   });
  