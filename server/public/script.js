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
        // const response = await fetch("/dashboardStatistics");
        fetch("/dashboardStatistics")
        .then((response) => response.json())
        .then((data) => {
        
  
        totalPending.textContent = data.totalPending;
        totalApproved.textContent = data.totalApproved;
        totalRejected.textContent = data.totalRejected;
      }) 
      } catch (error) {
        console.error("Error fetching dashboard statistics:", error);
      }
    }

    //   .catch( (error) => {
    //     console.error("An error occurred:", error);
    //   });
    //   updateDashboard();
    // }
  });
    

// fetch("/dashboardStatistics")
//   .then((response) => response.json())
//   .then((data) => {
//     // Update the UI with the dashboard statistics

//     totalPending.textContent = data.totalPending;
//     totalApproved.textContent = data.totalApproved;
//     totalRejected.textContent = data.totalRejected;
//   })
//   .catch((error) => {
//     console.error("Error fetching dashboard statistics:", error);
//   });

  
//     // Update dashboard on page load
//     updateDashboard();
//   });
  