const requestForm = document.getElementById("requestForm");
const requestsList = document.getElementById("requestsList");

const database = firebase.database();
const requestsRef = database.ref("requests"); 

requestForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(requestForm);
  const workflowType = formData.get("workflowType");
  const description = formData.get("description");
  const attachments = formData.get("attachments");

  const newRequestRef = requestsRef.push(); 
  const newRequestId = newRequestRef.key;

  const request = {
    workflowType,
    description,
    attachments,
    status: "pending",
  };

  newRequestRef.set(request)
    .then(() => {
      alert("Request submitted successfully!");
      fetchRequests();
    })
    .catch((error) => {
      console.error("Failed to submit request:", error);
    });
});

async function fetchRequests() {
  requestsList.innerHTML = "";

  requestsRef.on("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const request = childSnapshot.val();
      const listItem = document.createElement("li");
      listItem.textContent = `${request.workflowType} - ${request.status}`;
      requestsList.appendChild(listItem);
    });
  });
}

fetchRequests();
