document.addEventListener("DOMContentLoaded", function () {
    const workflowForm = document.getElementById("workflowForm");
    const totalPending = document.getElementById("totalPending");
    const totalApproved = document.getElementById("totalApproved");
    const totalRejected = document.getElementById("totalRejected");
  
    workflowForm.addEventListener("submit", async function (event) {
      event.preventDefault();
  
      const workflowName = document.getElementById("workflowName").value;
      const approvers = document.getElementById("approvers").value.split(",");
      const approvalType = document.getElementById("approvalType").value;
  
      try {
        const response = await fetch("/createWorkflow", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ workflowName, approvers, approvalType }),
        });
  
        if (response.ok) {
          console.log("Workflow created successfully.");

        } else {
          console.error("Error creating workflow.");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    });
  
    // Fetch and update dashboard statistics
    async function updateDashboard() {
      try {
        const response = await fetch("/dashboardStatistics");
        const data = await response.json();
  
        totalPending.textContent = data.totalPending;
        totalApproved.textContent = data.totalApproved;
        totalRejected.textContent = data.totalRejected;
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  
    // Update dashboard on page load
    updateDashboard();
  });
  