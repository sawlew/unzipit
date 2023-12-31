//Startup Function
function startUp(){
  const intro = document.getElementById("intro");
  const main = document.getElementById("main");
  const mainLogo = document.getElementById("mainLogo");
  const author = document.getElementById("author");

  mainLogo.classList.add("translate-y-[200px]");
  author.classList.add("translate-y-[130px]");

    setTimeout(() =>{
        intro.classList.add("hidden");
        main.classList.remove("hidden");
    }, 5000);
}

//Social section
const close = document.getElementById("close");
const open = document.getElementById("open");
const social = document.getElementById("social");
const backDrop = document.getElementById("backDrop");

function dropDown(){
    social.classList.add("translate-y-[440px]");
    open.classList.add("hidden");
    close.classList.remove("hidden");
    backDrop.classList.remove("hidden");
}

function closeUp(){
  social.classList.remove("translate-y-[440px]");
  open.classList.remove("hidden");
  close.classList.add("hidden");
  backDrop.classList.add("hidden");
}

//File name and details
function handleFiles() {
  const fileInput = document.getElementById('zipFileInput');
  const file = fileInput.files[0];
  const boxContent = document.getElementById('boxContent');
  boxContent.innerHTML = `File selected: ${file.name}, Size: ${file.size} bytes, Type: ${file.type}`;
  
  // placeHolder.classList = "hidden";
  // tableHeader.classList.remove("hidden");
  // fileDetails.classList.remove("hidden");
  // output.innerHTML = "";
}

function loadState(){
  const loading = document.getElementById("loadingState");
  loading.classList.remove("hidden");
  setTimeout(() =>{
    loading.classList.add("hidden");
}, 3000);
}

function extractZip() {
  const fileInput = document.getElementById('zipFileInput');
  const file = fileInput.files[0];

  // Check if no file is uploaded
  if (!file) {
    const boxContent = document.getElementById("boxContent");
    boxContent.innerHTML = `
    <span class="text-red-500">
      No file selected!!! Please upload a ZIP file!!!.
    </span>`;
      clearOutput();
    return;
  }

  const output = document.getElementById('output');
  const placeHolder = document.getElementById("outputPlaceholder");
  const tableHeader = document.getElementById("tableHeader");
  const fileDetails = document.getElementById("fileDetails");
  const displayFrame = document.getElementById("displayFrame");
  const fileNameExt = file.name.split('.').pop();
  const boxContent = document.getElementById("boxContent")
  
  const clearOutput = () => {
    placeHolder.classList.remove("hidden");
    displayFrame.classList.add("lg:w-[60%]");
    tableHeader.classList.add("hidden");
    fileDetails.classList.add("hidden");
    output.innerHTML = "";
  }

  const handleUnsupportedFile = () => {
    boxContent.innerHTML = `
    <span class="text-red-500">
      Unsupported file selected
    </span>`;
    clearOutput();
  };
  

 

  if (file && fileNameExt == "zip") {
    placeHolder.classList = "hidden";
    tableHeader.classList.add("hidden");
    fileDetails.classList.add("hidden");
    output.innerHTML = "";
    
    const reader = new FileReader();
    reader.onload = function (event) {
      const arrayBuffer = event.target.result;
      const jszip = new JSZip();

      jszip.loadAsync(arrayBuffer).then(function (zip) {

        // Filter out only files (not directories)
        const files = Object.values(zip.files).filter(zipEntry => !zipEntry.dir);

        // Get the number of files
        const numberOfFiles = files.length;
        // console.log(`Number of files in the ZIP: ${numberOfFiles}`);
        fileDetails.innerHTML = `${file.name} contains ${numberOfFiles} files`

        zip.forEach(function (relativePath, zipEntry) {
          zipEntry.async('arraybuffer').then(function (data) {
            // Create a download link for each extracted file
            const blob = new Blob([data]);
            const downloadLink = document.createElement('tr');
            const fileSize = data.byteLength;
            const fileExtension = relativePath.split('.').pop();
            loadState();
            setTimeout(() =>{
              tableHeader.classList.remove("hidden");
              fileDetails.classList.remove("hidden");
              downloadLink.innerHTML = `
                <td class="py-4 px-6 border-b border-[#0E1426] text-center truncate">${relativePath}</td>
                <td class="hidden sm:table-cell py-4 px-6 border-b border-[#0E1426] text-center truncate">${fileExtension}</td>
                <td class="hidden sm:table-cell py-4 px-6 border-b border-[#0E1426] text-center truncate">${fileSize} bytes</td>                
                <td class=" border-b border-[#0E1426] text-center">
                  <a href="${URL.createObjectURL(blob)}" download="${relativePath}" class="inline-flex justify-center items-center p-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </a>
                </td>
            `;

            output.appendChild(downloadLink);
            // displayFrame.classList.remove("w-[]");
            displayFrame.classList.remove("lg:w-[60%]");
          }, 3000);
            
          });
        });
        fileInput.value = "";
      });
     };

    reader.readAsArrayBuffer(file);
  }
 else {
    handleUnsupportedFile();
  }
}
