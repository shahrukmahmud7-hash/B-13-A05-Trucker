// element select
const issuesContainer = document.getElementById("issuesContainer");
const issueCountText = document.getElementById("issueCount");
const searchInput = document.getElementById("searchInput");

let allIssues = [];


// Load Issues from API
const loadIssues = async () => {
  try {
      // Loading spinner
        issuesContainer.innerHTML = `
        <div class="col-span-4 text-center py-20">
        <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
        `;
    
    // const response = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues"
    
    const response = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues"

    );
        const result = await response.json();
        allIssues = result.data;
        displayIssues(allIssues);
        console.log(result)
    } 
    catch (error) { issuesContainer.innerHTML =
        '<p class="col-span-4 text-center text-red-500">Failed to load issues!</p>';
    }

};



// Display Issues Card
const displayIssues = (issues) => {
    issuesContainer.innerHTML = "";
    issueCountText.innerText = `${issues.length} Issues`;
    issues.forEach(issue => { 
        const labels = issue.labels.map(label => 
   `<span class="badge badge-outline badge-sm text-orange-400">● ${label}</span>`
).join("");
   const borderColor = issue.status === "open" ? "border-t-green-500" : "border-t-purple-500";
  

         let imgSrc = "./assets/Open-Status.png"; 
        if(issue.priority.toLowerCase() === "low") {
            imgSrc = "./assets/Closed- Status .png"; 
        }

        const card = document.createElement("div");
        card.className = `bg-white p-5 rounded shadow-sm border-t-4 ${borderColor}
        cursor-pointer hover:shadow-md transition flex flex-col`;

        card.innerHTML = `<div class="flex justify-between items-center mb-3">
  
            <img src="${imgSrc}" alt="status image" class="w-8 h-8">
        <span class="badge badge-sm bg-red-100  border-none font-bold text-red-600">${issue.priority.toUpperCase()}</span>
     </div>

        <h3 class="font-bold text-gray-800 mb-2 text-lg">
        ${issue.title}
        </h3>

        <p class="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
        ${issue.description}
        </p>
               
         <div class="flex gap-2 mb-4">
            ${labels}
         </div> 
       
      

        <div class="text-xs text-gray-400 pt-3 border-t">
        <p>#by ${issue.author}</p>
        <p>${new Date(issue.createdAt).toLocaleDateString("en-GB")}</p>
        </div> `;

        card.onclick = () => showModal(issue.id);
        issuesContainer.appendChild(card);

    });

};
 

// Modal Show
const showModal = async (id) => {
     const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`

    );
        const result = await response.json();
        const issue = result.data
        console.log(issue);
    const modalContent = document.getElementById("modalContent");
    modalContent.innerHTML = ` <div class="p-2 space-y-4 text-left">
       <h2 class="text-xl font-bold text-[#1F2937]">
       ${issue.title}
    </h2>

    <div class="flex items-center gap-3 text-gray-500">
    <span class="px-4 py-1 rounded-full text-white font-medium
    ${issue.status === "open" ? "bg-green-500" : "bg-purple-600"}">
    ${issue.status === "open" ? "Open" : "Closed"}
    </span>
        
    <span class="text-sm normal">
    • Opened by ${issue.author}
    • ${new Date(issue.createdAt).toLocaleDateString("en-GB")}
    </span>
    </div>
     
     <div class="flex gap-2 mt-6 ">
        <span class="badge badge-outline badge-sm text-orange-400">● BUG</span>
        <span class="badge badge-outline badge-sm text-orange-400">● HELP WANTED</span>
        </div>

    <div class="text-gray-600 pt-4 text-lg">
    ${issue.description}
    </div>

    <div class="bg-gray-50 p-8 rounded-2xl flex justify-between items-center">
    <div>

    <p class="text-gray-400 text-sm mb-1">Assignee:</p>
    <p class="text-xl font-bold text-gray-800">
    ${issue.author}
    </p>
    </div>

   <div class="flex justify-center mt-4 w-full">
  <div class="flex flex-col items-center">
    <!-- Text on top -->
    <span class="text-gray-400 text-sm mb-1">Priority:</span>
    <!-- Badge below -->
    <span class="bg-red-500 text-white px-6 py-2 rounded-lg text-sm font-bold uppercase">
      ${issue.priority}
    </span>
  </div>
</div>

    </div>

   <div class="flex justify-end pt-4">

    <form method="dialog">
    <button class="btn bg-[#4F46E5] text-white px-12 h-14 rounded-xl">
    Close </button>
  </form>
    </div>

 </div> `;

    document.getElementById("issueModal").showModal();

};




// Filter Issues
//  const filterIssues = (status) => {
//   const allBtn = document.getElementById("btn-all");
//   const openBtn = document.getElementById("btn-openl");
//   const closeBtn = document.getElementById("btn-close");
 
 const filterIssues = (status) => {
  const buttons = document.querySelectorAll(".all-btn");
  buttons.forEach(btn => {
    if (btn.dataset.status === status) {
      btn.classList.replace("btn-white", "btn-primary"); 
    } else {
      btn.classList.replace("btn-primary", "btn-white"); 
    }
  });

  const filtered = status === "all" 
    ? allIssues 
    : allIssues.filter(issue => issue.status === status);

  displayIssues(filtered); // card update
};

// Search Issues
const handleSearch = async () => {
 const query = searchInput.value.trim();
    if (!query) {
     displayIssues(allIssues);
        return;
    } try {
       issuesContainer.innerHTML = `
        <div class="col-span-4 text-center py-20">
        <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
        `;

        const response = await fetch(
        `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`
        );
        const result = await response.json();
        displayIssues(result.data);
    } 
    catch (error) { console.log("Search Error:", error); }
};


// Enter press search
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
     handleSearch();

    }

});


window.filterIssues = filterIssues;
window.handleSearch = handleSearch;

// Start Load
loadIssues();