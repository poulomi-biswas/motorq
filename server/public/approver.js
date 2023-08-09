// approver.js
const pendingRequestsList = document.getElementById("pendingRequestsList");
const reviewContainer = document.getElementById("reviewContainer");
const requestDetails = document.getElementById("requestDetails");
const approveButton = document.getElementById("approveButton");
const rejectButton = document.getElementById("rejectButton");

let currentRequestId = null;


async function fetchPendingRequests() {
  pendingRequestsList.innerHTML = "";

  const response = await fetch("/pendingRequests");
  const pendingRequests = await response.json();

  pendingRequests.forEach((request) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${request.workflowType} - ${request.status}`;
    listItem.addEventListener("click", () => showReview(request));
    pendingRequestsList.appendChild(listItem);
  });
}


function showReview(request) {
  currentRequestId = request.id; 
  reviewContainer.style.display = "block";
  requestDetails.textContent = `Workflow Type: ${request.workflowType}\nDescription: ${request.description}`;
}

// Approve request
approveButton.addEventListener("click", async () => {
  if (currentRequestId) {
    await updateRequestStatus("approved");
  }
});

// Reject request
rejectButton.addEventListener("click", async () => {
  if (currentRequestId) {
    await updateRequestStatus("rejected");
  }
});


async function updateRequestStatus(status) {
  const response = await fetch(`/approveRejectRequest/:requestId`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (response.ok) {
    reviewContainer.style.display = "none";
    fetchPendingRequests();
  }
}


fetchPendingRequests();
