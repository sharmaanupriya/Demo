function showWelcomePage() {
  const welcomeOverlay = document.getElementById('welcomeOverlay');
  welcomeOverlay.style.display = 'block'; // Show the second page overlay

  eel.setPageId("welcomeOverlay");
}

showWelcomePage();

// Function to show the second page after a delay
function showSecondPage() {
  const mainOverlay = document.getElementById('optionOverlay');
  mainOverlay.style.display = 'block'; // Show the second page overlay

  eel.setPageId("optionOverlay");
}

// Call the function to show the second page after 5 seconds
setTimeout(showSecondPage, 5000); // 5,000 milliseconds = 5 seconds

// Call onPageLoad when the page loads
onPageLoad();

function setAxis() {
  // Get the selected radio button
  var selectedAxis = document.querySelector('input[name="rd"]:checked');
  eel.setUIOption(selectedAxis.id)

  if (selectedAxis) {
      // Check the value of the selected radio button
      if (selectedAxis.id === "single") {
          // Show the main overlay for single axis
          document.getElementById("mainOverlay").style.display = "flex";
      } else {
          // Hide the main overlay for other options
          document.getElementById("mainOverlay").style.display = "none";
      }

      // Hide the UI Setting Overlay
      document.getElementById("uiSettingOverlay").style.display = "none";
  }
}

// let isFocusSet = false; // Variable to track whether focus is set
// let enterKeyPressed = false; // Flag to track if Enter key is pressed
// // Function to send acknowledgment and trigger machine to go home
// function mainHome() {
//   console.log("Entering goHome function");
//   // Get acknowledgment input value
//   var ackData = document.getElementById('ack-input').value;

//   // Get the selected COM port and baud rate from the UI
//   var selectedComPort = document.getElementById('comPortDropdown').value;
//   var selectedBaudRate = parseInt(document.getElementById('baudRateDropdown').value);

//   // Send acknowledgment to Python
//   eel.send_ack(ackData);

//   // Clear the input field
//   document.getElementById('ack-input').value = '';

//   // Trigger machine to go home with the selected COM port and baud rate
//   eel.goHomePos(selectedComPort, selectedBaudRate);
//   // Reset the focus status when going home
//   isFocusSet = false;
//   enterKeyPressed = false;
// }


// eel.expose(showMainPage);  // Expose the function to Python
// Function to show the third page
// function showMainPage() 
function mainHome() {
  console.log("Showing the third page");
  const homeOverlay = document.getElementById('homeOverlay');
  const mainOverlay = document.getElementById('mainOverlay');
  mainOverlay.style.display = 'none'; // Show the second page overlay
  homeOverlay.style.display = 'block'; // Show the third page overlay

  eel.setPageId("homeOverlay");
}

let restartButtonClicked = false;

// Function to go back to the second page and clear input values
function homePrevious() {
  // Assuming you have declared interval, isPaused, elapsedTime, and countdownCompleted elsewhere in your code
  clearInterval(interval);
  isPaused = false;
  elapsedTime = 0;
  countdownCompleted = false;

  // Clear input values on the fifth page
  document.getElementById("diameterInput2").value = "";
  document.getElementById("currentInput").value = "";
  // document.getElementById("diameterInput3").value = "";
  document.getElementById("laserdensity").value = "";

  // Clear input values on the sixth page
  document.getElementById("hours").value = "0";
  document.getElementById("minutes").value = "0";
  document.getElementById("seconds").value = "0";

  var countdownSeventhElement = document.getElementById("countdownSeventh");
  countdownSeventhElement.textContent = "00:00:00";

  // Reset button display
  document.getElementById("timerResumeBtn").style.display = "none";
  document.getElementById("timerPauseBtn").style.display = "block";

  // Assuming you have a function to send acknowledgment in your EelUI
  eel.timerRestart(); // No need to pass any arguments

  if (!restartButtonClicked) {
    // Add event listener for the reset button only if it hasn't been clicked before
    document.getElementById("homeBackBtn").addEventListener("click", homePrevious);
    restartButtonClicked = true; // Set the flag to true when the restart button is clicked

  }

  const homeOverlay = document.getElementById("homeOverlay");
  const mainOverlay = document.getElementById("mainOverlay");
  document.getElementById("exposureBackBtn").disabled = false

  homeOverlay.style.display = "none";
  document.getElementById("goHome").style.display = "none"; // Hide the machineStatus
  document.getElementById("timerOverlay").style.display = "none";

  // Ensure that the mainOverlay is displayed only if the restart button is not clicked
  if (!restartButtonClicked) {
    mainOverlay.style.display = "block";
    eel.setPageId("mainOverlay");
  }
}


// Function to switch to the fourth page
function homeNext() {
  const homeOverlay = document.getElementById("homeOverlay");
  const indexOverlay = document.getElementById("indexOverlay");

  homeOverlay.style.display = "none";
  indexOverlay.style.display = "block";

  eel.setPageId("indexOverlay");
}


// Function to go back to the third page from the fourth page
function indexPrevious() {
  const indexOverlay = document.getElementById("indexOverlay");
  const homeOverlay = document.getElementById("mainOverlay");

  indexOverlay.style.display = "none";
  homeOverlay.style.display = "block";

  eel.setPageId("mainOverlay");
}





// Function to go back to the fourth page from the fifth page
function paraPrevious() {
  const paraOverlay = document.getElementById("paraOverlay");
  const indexOverlay = document.getElementById("indexOverlay");

  paraOverlay.style.display = "none";
  indexOverlay.style.display = "block";

  eel.setPageId("paraOverlay");
}


// Function to start the sixth page from the fifth page
function paraNext() {
  const paraOverlay = document.getElementById("paraOverlay");
  const exposureOverlay = document.getElementById("exposureOverlay");

  paraOverlay.style.display = "none";
  exposureOverlay.style.display = "block";

  eel.setPageId("exposureOverlay");
}


// Function to go back to the fifth page from the sixth page
function exposurePrevious() {
  // if (!disableexposurePrevious) {
  const exposureOverlay = document.getElementById("exposureOverlay");
  const paraOverlay = document.getElementById("paraOverlay");

  exposureOverlay.style.display = "none";
  paraOverlay.style.display = "block";
  eel.setPageId("paraOverlay");
}


// Function to show the custom dialog box
function showCustomDialog() {
  const customDialog = document.getElementById("customDialog");
  customDialog.style.display = "block";
}

// Function to close the custom dialog box
function closeCustomDialog() {
  const customDialog = document.getElementById("customDialog");
  customDialog.style.display = "none";
}

// Function to start the seventh page from the sixth page
function exposureNext() {
  const hours = parseInt(document.getElementById("hours").value);
  const minutes = parseInt(document.getElementById("minutes").value);
  const seconds = parseInt(document.getElementById("seconds").value);

  if (hours === 0 && minutes === 0 && seconds === 0) {
    // If the timer is not set, show the custom dialog
    showCustomDialog();
  }
  else {
    const exposureOverlay = document.getElementById("exposureOverlay").style.display = "none";
    const wellOverlay = document.getElementById("wellOverlay").style.display = "block";

    document.getElementById("timerStartBtn").disabled = false
    document.getElementById("timerPauseBtn").disabled = true
    document.getElementById("timerResumeBtn").disabled = true
    document.getElementById("timerResetBtn").disabled = true
    document.getElementById("timerBackBtn").disabled = true
  }

  eel.setPageId("wellOverlay");
}


let specifiedTime = 0;
let elapsedTime = 0;
let interval;
let isPaused = false;
let isCountdownRunning = false;
let countdownCompleted = false;

function setStopwatchTime() {
  const hoursInput = parseInt(document.getElementById("hours").value) || 0;
  const minutesInput = parseInt(document.getElementById("minutes").value) || 0;
  const secondsInput = parseInt(document.getElementById("seconds").value) || 0;

  specifiedTime = (hoursInput * 3600 + minutesInput * 60 + secondsInput) * 1000;
}

function manageCountdown() {
  if (isCountdownRunning || isPaused || countdownCompleted) {
    return;
  }

  isCountdownRunning = true;

  setStopwatchTime();
  document.getElementById("exposureOverlay").style.display = "none";
  document.getElementById("timerOverlay").style.display = "block";

  let startTime = Date.now() - elapsedTime;
  let justStarted = true;

  interval = setInterval(function () {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    updateCountdown();

    if (justStarted) {
      startMachine(specifiedTime);
      justStarted = false;
    }

    if (elapsedTime >= specifiedTime) {
      clearInterval(interval);
      showPopup();
      isCountdownRunning = false;
      countdownCompleted = true;
    }
  }, 1000);
}

function timerStart() {
  // Check if the countdown is already running or completed
  if (!isCountdownRunning && !countdownCompleted) {
    manageCountdown();

    document.getElementById("timerStartBtn").disabled = true
    document.getElementById("timerPauseBtn").disabled = false
    document.getElementById("timerResumeBtn").disabled = false
    document.getElementById("timerResetBtn").disabled = false
    document.getElementById("timerBackBtn").disabled = true
  }
}

function timerPause() {
  if (isCountdownRunning) {
    clearInterval(interval);
    isPaused = true;
    isCountdownRunning = false;
    document.getElementById("timerResumeBtn").style.display = "block";
    document.getElementById("timerPauseBtn").style.display = "none";
    eel.pauseCountdown();
  }
}

function timerResume() {
  if (isPaused) {
    isPaused = false;
    manageCountdown();
    document.getElementById("timerPauseBtn").style.display = "block";
    document.getElementById("timerResumeBtn").style.display = "none";
    eel.resumeCountdown();
  }
}

function updateCountdown() {
  const hours = Math.floor(elapsedTime / 3600000);
  const minutes = Math.floor((elapsedTime % 3600000) / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);

  const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  document.getElementById("countdownSeventh").textContent = formattedTime;
}

function startMachine(seconds) {
  // Assuming you have a function to send acknowledgment in your EelUI
  eel.startMachine(seconds); // passing seconds as an argument
}

function timerRestart() {
  homePrevious();
}

function showPopup() {
  document.getElementById("customDialogSeventhPage").style.display = "block";
  eel.showPopup();
}

function handleConfirmation() {
  document.getElementById("customDialogSeventhPage").style.display = "none";

  document.getElementById("timerStartBtn").disabled = true
  document.getElementById("timerPauseBtn").disabled = true
  document.getElementById("timerResumeBtn").disabled = true
  document.getElementById("timerResetBtn").disabled = false
  document.getElementById("timerBackBtn").disabled = true
}

document.getElementById("confirmDialogSeventhPage").addEventListener("click", handleConfirmation);

let resetButtonClicked = false; // Flag to track if the "Reset" button is clicked
// let disableexposurePrevious = false;

eel.expose(resetTimer);

function resetTimer(){
  timerReset()
}
// Reset button
function timerReset() {
  resetButtonClicked = true; // Set the flag when the "Reset" button is clicked
  // disableexposurePrevious = true;


  clearInterval(interval);
  isPaused = false;
  elapsedTime = 0;
  countdownCompleted = false; // Reset the flag
  isCountdownRunning = false; // Reset the countdown running flag

  var countdownSeventhElement = document.getElementById("countdownSeventh");
  countdownSeventhElement.textContent = "00:00:00";

  // Reset button display
  document.getElementById("timerResumeBtn").style.display = "none";
  document.getElementById("timerPauseBtn").style.display = "block";

  // Assuming you have a function to send acknowledgment in your EelUI
  eel.sendAcknowledgment(); // No need to pass any arguments

  document.getElementById("timerStartBtn").disabled = false
  document.getElementById("timerPauseBtn").disabled = true
  document.getElementById("timerResumeBtn").disabled = true
  document.getElementById("timerResetBtn").disabled = true
  document.getElementById("timerBackBtn").disabled = false
  // Disable exposureBackBtn
  document.getElementById("exposureBackBtn").disabled = true;
}

// Add event listener for the reset button
document.getElementById("timerResetBtn").addEventListener("click", timerReset);

// Function to validate the input based on the provided [FOCUS]
function validateInput() {
  // Get the parameter value from the overlay
  const maxLength = parseInt(document.getElementById('parameterInput').value);

  // Get the user input from the overlay
  const inputValue = document.getElementById('diameterInput').value.trim();

  // Get the validation message element
  const validationMessageElement = document.getElementById("validationMessage");

  // Positive integer validation
  const positiveIntegerPattern = /^[1-9]\d*$/;

  if (!positiveIntegerPattern.test(inputValue) || parseInt(inputValue) <= 0 || isNaN(parseInt(inputValue))) {
    // Display validation message for non-positive integer input
    displayValidationMessage("Please enter a positive integer", "red", validationMessageElement);
    return false; // Input is not valid
  } else if (parseInt(inputValue) > maxLength) {
    // Display validation message for exceeding the maximum length
    displayValidationMessage("Value exceeds the maximum length of " + maxLength, "red", validationMessageElement);
    return false; // Input is not valid
  } else {
    // Input is valid
    displayValidationMessage("Input is valid", "green", validationMessageElement);
    return true; // Input is valid
  }
}


// SET FOCUS
function setFocus() {
  // Validate the input before setting focus
  if (validateInput()) {
    const inputValue = parseInt(document.getElementById('diameterInput').value);
    eel.setFocus(inputValue);
    isFocusSet = true; // Update the focus status
    document.getElementById("focusNextBtn").removeAttribute("disabled"); // Enable the "Next" button
  }
}


// Function to set the focus value from default
function machineSetDfocus() {
  // Validate the input before setting the focus
  if (validateInputForFocus()) {
    // Get the input value
    const inputValue = document.getElementById('diameterInput').value;

    // Set the focus value to the read-only input
    document.getElementById('focus').value = inputValue;

    // Send the valid input value to the Python backend
    id = "focus";
    eel.updateParameter(inputValue, id);
  }
}

// Function to validate the input for focus
function validateInputForFocus() {
  // Get the user input from the overlay
  const inputValue = document.getElementById('diameterInput').value.trim();

  // Get the validation message element
  const validationMessageElement = document.getElementById("validationMessage");

  // Positive integer validation
  const positiveIntegerPattern = /^[1-9]\d*$/;

  if (!positiveIntegerPattern.test(inputValue) || parseInt(inputValue) <= 0) {
    // Display validation message for non-positive integer input
    displayValidationMessage("Please enter a positive integer", "red", validationMessageElement);
    return false; // Input is not valid
  } else {
    // Input is valid
    displayValidationMessage("", "", validationMessageElement);
    return true; // Input is valid
  }
}


// Function to send the valid input value to the Python backend
function updateDefaultFocus(value) {
  id = "focus";
  eel.updateParameter(value, id);
}

eel.expose(updateDefaultFocus);


// Get the select element LASER TYPE
var laserTypeSelect = document.getElementById("laserType");

// Add options dynamically
var option1 = document.createElement("option");
option1.value = "2W";
option1.text = "2W";
laserTypeSelect.add(option1);

var option2 = document.createElement("option");
option2.value = "8W";
option2.text = "8W";
laserTypeSelect.add(option2);

function machineSetLaser() {
  var selectedValue = laserTypeSelect.value;

  if (selectedValue) {
    var id = "lasertype";
    eel.updateParameter(selectedValue, id);
    console.log("Laser type set:", selectedValue);
  } else {
    console.log("Please select a laser type before clicking Set.");
  }
}


// Expose the function to Python
eel.expose(updateCOMPort);
// Function to update COM Port
function updateCOMPort(value) {
  document.getElementById("comPortDropdown").value = value;
}


// Expose the function to Python
eel.expose(updateBaudRate);
// Function to update Baud Rate
function updateBaudRate(value) {
  document.getElementById("baudRateDropdown").value = value;
}


// Expose the function to Python
eel.expose(updateZaxisMax);
// Function to update Z-Axis Max Travel
function updateZaxisMax(value) {
  var inputElement = document.getElementById("parameterInput");
  inputElement.value = parseInt(value);
}


// Expose the function to Python
eel.expose(updateLaserType);
// Function to update Laser Type
function updateLaserType(value) {
  document.getElementById("laserType").value = value;
}


// Expose the function to Python
eel.expose(updateDefaultFocus);
// Function to update Default Focus
function updateDefaultFocus(value) {
  document.getElementById("diameterInput").value = value;
  document.getElementById('focus').value = value;
}




// Function to open the fifth page overlay
function indexNext() {
  if (isFocusSet) {
    // Input is valid, so open the fifth page overlay
    document.getElementById("indexOverlay").style.display = "none"; // Hide the fourth page overlay
    document.getElementById("paraOverlay").style.display = "block"; // Show the fifth page overlay

    eel.setPageId("paraOverlay");
  } else {
    // Input is not valid, show the custom dialog box for the fourth page
    document.getElementById("customDialogFocus").style.display = "block"; // Corrected the ID
  }
}

// Function to close the custom dialog box
function Confirmation() {
  document.getElementById("customDialogFocus").style.display = "none";
}

document.getElementById("customDialogFocus").addEventListener("click", Confirmation);
document.getElementById("diameterInput").addEventListener("input", validateInput);


// Function to validate the Laser Spot Diameter
function validateInputld() {
  var inputElement = document.getElementById("diameterInput2");
  var inputValue = inputElement.value;

  // Regular expression to match a decimal number with two decimal places
  var decimalPattern = /^\d+(\.\d{2})?$/;

  if (decimalPattern.test(inputValue)) {
    // Input is valid
    inputElement.style.border = "1px solid green";
    document.getElementById("validationMessage2").textContent = "";
    return true;
  } else {
    // Input is not valid
    inputElement.style.border = "1px solid red";
    var validationMessageElement = document.getElementById("validationMessage2");
    validationMessageElement.textContent = "Invalid Input";
    validationMessageElement.style.color = "red";
    return false;
  }
}

// Function to validate the Laser Current
function validateInputlc() {
  var inputElement = document.getElementById("currentInput");
  var inputValue = inputElement.value;

  // Regular expression to match a decimal number with up to two decimal places
  var decimalPattern = /^\d+(\.\d{2})?$/;

  if (decimalPattern.test(inputValue)) {
    // Input is valid
    inputElement.style.border = "1px solid green";
    document.getElementById("validationMessage3").textContent = "";
    return true;
  } else {
    // Input is not valid
    inputElement.style.border = "1px solid red";
    var validationMessageElement = document.getElementById("validationMessage3");
    validationMessageElement.textContent = "Invalid Input";
    validationMessageElement.style.color = "red";
    return false;
  }
}

// Function to handle Enter key press
function handleEnterKeyPress(event) {
  if (event.key === "Enter") {
    var isValidDiameter = validateInputld();
    var isValidCurrent = validateInputlc();

    if (isValidDiameter && isValidCurrent) {
      eel.printParameters(
        document.getElementById("diameterInput2").value,
        document.getElementById("currentInput").value,
        eel.getLaserType()
      );
    }
  }
}

// Assuming you are using an event like 'input' to trigger validation for diameter
document.getElementById("diameterInput2").addEventListener("input", function () {
  validateInputld();
});

// Assuming you are using an event like 'input' to trigger validation for current
document.getElementById("currentInput").addEventListener("input", function () {
  validateInputlc();
});

// Attach the handleEnterKeyPress function to the 'keydown' event for both input fields
document.getElementById("diameterInput2").addEventListener("keydown", handleEnterKeyPress);
document.getElementById("currentInput").addEventListener("keydown", handleEnterKeyPress);


// Function to update the density value in the readonly textarea
eel.expose(updateDensity);


function updateDensity(density, dstatus) {
  var densityTextarea = document.getElementById("laserdensity");
  var validationMessageElement = document.getElementById("validationMessage4");

  // Check if density value is not empty
  if (density !== null && density !== undefined) {
    densityTextarea.value = density.toFixed(5); // Set the value with 5 decimal places
    densityTextarea.style.border = "1px solid green"; // Optionally, set a border color
    validationMessageElement.textContent = ""; // Clear the validation message
    return true;
  } else {
    // Handle the case where density is empty
    densityTextarea.value = ""; // Clear the value
    densityTextarea.style.border = "1px solid red"; // Set a border color to indicate an issue
    validationMessageElement.textContent = "Invalid Input";
    validationMessageElement.style.color = "red";
    return false;
  }
}

function validateDensity() {
  var densityTextarea = document.getElementById("laserdensity");
  return densityTextarea.value.trim() !== ""; // Return true if not empty, false otherwise
}

// var enterKeyPressed = false;  // Variable to track Enter key press

// Function to validate the Object Height
// function validateInputoh() {
//   var inputElement = document.getElementById("diameterInput3");
//   var inputValue = inputElement.value;

//   // Regular expression to match a decimal number with two decimal places
//   // var decimalPattern = /^\d+(\.\d{2})?$/;
//   var decimalPattern = /^(?!0+(\.00?)?$)\d+(\.\d{2})?$/;

//   if (decimalPattern.test(inputValue)) {
//     // Input is valid
//     inputElement.style.border = "1px solid green";
//     document.getElementById("validationMessage5").textContent = "";
//     return true;
//   } else {
//     // Input is not valid
//     inputElement.style.border = "1px solid red";
//     var validationMessageElement = document.getElementById("validationMessage5");
//     validationMessageElement.textContent = "Invalid Input";
//     validationMessageElement.style.color = "red";
//     return false;
//   }
// }

// // Add an event listener for the Enter key press
// document.getElementById("diameterInput3").addEventListener("keydown", function (event) {
//   if (event.key === "Enter") {
//     enterKeyPressed = true;
//     setObjectHeight();
//   }
// });

// // SET OBJECT HEIGHT
// function setObjectHeight() {
//   // Validate the input before setting OBJECT HEIGHT
//   if (validateInput() && validateInputoh() && enterKeyPressed) {
//     const focusValue = parseInt(document.getElementById('diameterInput').value);
//     const objectHeightValue = parseFloat(document.getElementById('diameterInput3').value);

//     // Define maxLength and validationMessageElement
//     const maxLength = parseInt(document.getElementById('parameterInput').value); // You need to define this value
//     const validationMessageElement = document.getElementById("validationMessage5");

//     // Calculate the maximum allowed object height
//     const maxAllowedHeight = maxLength - focusValue;

//     // Ensure the object height does not exceed the maximum allowed height
//     if (objectHeightValue <= maxAllowedHeight) {
//       if (objectHeightValue > 0) {
//         eel.setObjectHeight(objectHeightValue);
//       }
//       else {
//         // Display validation message as the object height is zero
//         displayValidationMessage("Object height is 0 ", "red", validationMessageElement);
//       }
//     } else {
//       // Display validation message for exceeding the maximum allowed height
//       displayValidationMessage("Object height exceeds the maximum allowed height of " + maxAllowedHeight, "red", validationMessageElement);
//     }
//   }
// }

// Function to display validation message
function displayValidationMessage(message, color, element) {
  element.textContent = message;
  element.style.color = color;
}

function paraNext() {
  var isValidDiameter = validateInputld(document.getElementById("diameterInput2").value);
  var isValidCurrent = validateInputlc(document.getElementById("currentInput").value);
  var isValidDensity = validateDensity(); // Use validateDensity here
  // var isValidOh = validateInputoh(); // Assuming this function is defined elsewhere

  if (isValidDiameter && isValidCurrent && isValidDensity) {
    // Both inputs are valid, and Enter key was pressed, so open the sixth page overlay
    document.getElementById("paraOverlay").style.display = "none"; // Hide the fifth page overlay
    document.getElementById("exposureOverlay").style.display = "block"; // Show the sixth page overlay

    eel.setPageId("exposureOverlay");
  } else {
    // Either the Enter key is not pressed or the inputs are not valid, show the enter dialog box
    showEnterDialog();
  }
}

// if (isValidDiameter && isValidCurrent && isValidDensity && isValidOh && enterKeyPressed) {
//   // Both inputs are valid, and Enter key was pressed, so open the sixth page overlay
//   document.getElementById("paraOverlay").style.display = "none"; // Hide the fifth page overlay
//   document.getElementById("exposureOverlay").style.display = "block"; // Show the sixth page overlay

//   eel.setPageId("exposureOverlay");
// } else {
//   // Either the Enter key is not pressed or the inputs are not valid, show the enter dialog box
//   showEnterDialog();
// }


// Function to show the enter dialog box
function showEnterDialog() {
  const enterDialog = document.getElementById("enterDialog");
  enterDialog.style.display = "block";
}

// Function to close the enter dialog box
function closeEnterDialog() {
  const enterDialog = document.getElementById("enterDialog");
  enterDialog.style.display = "none";
}

// Function to close the custom dialog box
function closeCustomDialog() {
  document.getElementById("customDialog").style.display = "none";
}

// Add event listeners to the input fields
document.getElementById("currentInput").addEventListener("input", validateInputlc);
// document.getElementById("diameterInput3").addEventListener("input", validateInputoh);
document.getElementById("diameterInput2").addEventListener("input", updateDensity);


// Function to switch to the setting page when the "Setting" button is clicked
function mainSetting() {
  const mainOverlay = document.getElementById("mainOverlay");
  const settingOverlay = document.getElementById("settingOverlay");

  mainOverlay.style.display = "none";
  settingOverlay.style.display = "block";

  eel.setPageId("settingOverlay");
}

// Function to close the Setting page
function settingClose() {
  const mainOverlay = document.getElementById("mainOverlay");
  const settingOverlay = document.getElementById("settingOverlay");

  settingOverlay.style.display = "none";
  mainOverlay.style.display = "block";

  eel.setPageId("mainOverlay");
}

// Function to switch to the COM setting page when the "COM Setting" button is clicked in the "SettingPage"
function settingCom() {
  const settingOverlay = document.getElementById("settingOverlay");
  const comOverlay = document.getElementById("comOverlay");

  settingOverlay.style.display = "none";
  comOverlay.style.display = "block";

  eel.setPageId("comOverlay");
}

// Add an event listener to ensure the COM is loaded before running your code
document.addEventListener("COMContentLoaded", function () {
  // Your other JavaScript code here`
});


// Function to close the COM Setting page
function comClose() {
  const settingOverlay = document.getElementById("settingOverlay");
  const comOverlay = document.getElementById("comOverlay");

  comOverlay.style.display = "none";
  settingOverlay.style.display = "block";

  eel.setPageId("settingOverlay");
}

// Function to switch to the Machine Parameter page when the "Machine Parameter" button is clicked
function settingMachine() {
  const settingOverlay = document.getElementById("settingOverlay");
  const machineOverlay = document.getElementById("machineOverlay");

  settingOverlay.style.display = "none";
  machineOverlay.style.display = "block";

  eel.setPageId("machineOverlay");
}

// Function to close the Machine Parameter page
function machineClose() {
  const settingOverlay = document.getElementById("settingOverlay");
  const machineOverlay = document.getElementById("machineOverlay");

  machineOverlay.style.display = "none";
  settingOverlay.style.display = "block";

  eel.setPageId("settingOverlay");
}

// Function to switch to the Machine Parameter page when the "Machine Parameter" button is clicked
function settingUpdate() {
  const settingOverlay = document.getElementById("settingOverlay");
  const updateOverlay = document.getElementById("updateOverlay");

  settingOverlay.style.display = "none";
  updateOverlay.style.display = "block";

  eel.setPageId("updateOverlay");
}

// Function to close the Machine Parameter page
function updateClose() {
  const settingOverlay = document.getElementById("settingOverlay");
  const updateOverlay = document.getElementById("updateOverlay");

  updateOverlay.style.display = "none";
  settingOverlay.style.display = "block";

  eel.setPageId("settingOverlay");
}

// Pre-set the password in the code
var presetPassword = '123456';

function showAuthenticationDialog() {
    document.getElementById('authentication').style.display = 'flex';
}

function hideAuthenticationDialog() {
    document.getElementById('authentication').style.display = 'none';
    document.getElementById('authenticationPassword').value = ''; // Clear password input
    document.getElementById('errorMessage').innerText = ''; // Clear error message
}

function checkPassword() {
  var passwordInput = document.getElementById('authenticationPassword').value;
  // Check if the input matches the pre-set password
  if (passwordInput === presetPassword) {
      // Password is correct, hide authentication dialog
      hideAuthenticationDialog();
      // Open the setting update
      settingUpdate();
  } else {
      // Incorrect password, show error message
      document.getElementById('errorMessage').innerText = 'Invalid password';
  }
}

function closeAuthentication() {
  // Close the modal
  document.getElementById('authentication').style.display = 'none';
}


var downloadInterval; // Declare downloadInterval outside the function for global scope

// Function to show the download dialog and start the download
function showDownloadDialog() {
    document.getElementById('downloadDialog').style.display = 'flex';
    startDownload();
}

// Function to hide the download dialog
function hideDownloadDialog() {
    document.getElementById('downloadDialog').style.display = 'none';
}

// Function to simulate a download with progress updates
function startDownload() {
    var progressBar = document.getElementById('downloadProgress');
    var downloadMessage = document.getElementById('downloadMessage');

    // Simulate a download process
    var totalSize = 100; // Total size of the download
    var currentSize = 0; // Current downloaded size

    downloadInterval = setInterval(function () {
        if (currentSize < totalSize) {
            // Update the progress bar
            currentSize += 10; // Simulated progress step
            progressBar.value = (currentSize / totalSize) * 100;

            // Update download message
            downloadMessage.innerText = 'Downloading: ' + currentSize + ' / ' + totalSize + ' KB';
        } else {
            // Download complete
            clearInterval(downloadInterval);
            downloadMessage.innerText = 'Download complete!';
            setTimeout(hideDownloadDialog, 2000); // Hide the dialog after 2 seconds
        }
    }, 500); // Simulated update every 500 milliseconds
}

// Function to cancel the download
function cancelDownload() {
    clearInterval(downloadInterval); // Clear the download interval
    hideDownloadDialog();
}

// Function called when the "Update" button is clicked
function startUpdate() {
    // Call the showDownloadDialog function to display the dialog
    showDownloadDialog();
}

// Function to validate the Max Length input as a positive integer
function validateMaxLengthInput() {
  var inputElement = document.getElementById("parameterInput");
  var inputValue = inputElement.value;

  // Regular expression to match a positive integer
  var positiveIntegerPattern = /^\d+$/;

  // Get the validation message element
  var validationMessageElement = document.getElementById("validationMessangeMaxLen");

  if (!positiveIntegerPattern.test(inputValue)) {
    // Display validation message for non-numeric input
    displayValidationMessage("Please enter a positive integer", "red", validationMessageElement);
  } else {
    // Validate if it's a positive integer using the provided isPositiveInteger function
    if (isPositiveInteger(parseInt(inputValue))) {
      // Clear validation message for valid input
      displayValidationMessage("", "", validationMessageElement);
    } else {
      // Display validation message for non-positive integer input
      displayValidationMessage("Please enter a positive integer", "red", validationMessageElement);
    }
  }
}
// Function to display validation messages
function displayValidationMessage(message, color, element) {
  element.textContent = message;
  element.style.color = color;
}

// Function to check if a value is a positive integer
function isPositiveInteger(value) {
  return Number.isInteger(value) && Math.sign(value) === 1;
}

// Function to handle the "Set" button click
function machineSetZmax() {
  var inputElement = document.getElementById("parameterInput");
  var inputValue = inputElement.value;

  // Validate if it's a positive integer
  if (isPositiveInteger(parseInt(inputValue))) {
    // Clear validation message for valid input
    displayValidationMessage("", "", document.getElementById("validationMessangeMaxLen"));

    // Send the valid input value to the Python backend
    id = "zmax";
    eel.updateParameter(inputValue, id);
  } else {
    // Display validation message for non-positive integer input
    displayValidationMessage("Please enter a positive integer", "red", document.getElementById("validationMessangeMaxLen"));
  }
}


// Function to handle the "Connect/Disconnect" button action
function comConnect() {
  const comPortDropdown = document.getElementById("comPortDropdown");
  const baudRateDropdown = document.getElementById("baudRateDropdown");
  const comConnectBtn = document.getElementById("comConnectBtn");

  // Get the selected COM port and baud rate
  const selectedComPort = comPortDropdown.value;
  const selectedBaudRate = baudRateDropdown.value;

  const buttonText = comConnectBtn.innerText;

  // Print the selected COM port and baud rate to the terminal
  console.log(`Connecting using COM Port: ${selectedComPort}, Baud Rate: ${selectedBaudRate}`);

  // You can add your logic here to connect or disconnect using the selected COM port and baud rate.

  // For example:
  if (comConnectBtn.innerText === "Connect") {
    // Perform connection logic
    comConnectBtn.innerText = "Disconnect";
  } else {
    // Perform disconnection logic
    comConnectBtn.innerText = "Connect";
  }
  // Call the Python function with the selected COM port and baud rate
  eel.connectDisconnect(selectedComPort, selectedBaudRate, buttonText)();
}

// Add this function to disable the stop button when the page loads
function onPageLoad() {
  initCOMPortConfig();
  eel.printDebugMsg("initCOMPortConfig")();
  eel.initCOMDone()();
  // document.getElementById('comConnectBtn').disabled = true;  
}

eel.expose(disableBtn);
function disableBtn(id) {
  // document.getElementById('comRefreshBtn').disabled = true;
  document.getElementById(id).disabled = true;
}

eel.expose(enableBtn);
function enableBtn(id) {
  // document.getElementById('comRefreshBtn').disabled = true;
  document.getElementById(id).disabled = false;
}

eel.expose(disableLabel);
function disableLabel(id) {
  // document.getElementById('comRefreshBtn').disabled = true;
  document.getElementById(id).disabled = true;
}

eel.expose(enableLabel);
function enableLabel(id) {
  // document.getElementById('comRefreshBtn').disabled = true;
  document.getElementById(id).disabled = false;
}

// Function to change the button name
eel.expose(changeBtnName);
function changeBtnName(id, name) {
  document.getElementById(id).innerText = name
  eel.getBtnName(id, document.getElementById(id).innerText)
}

function initCOMPortConfig() {
  // Fetch available ports and populate the serial port dropdown
  eel.getComPorts()().then(ports => {
    var serialPortDropdown = document.getElementById('comPortDropdown');
    ports.forEach(port => {
      var option = document.createElement('option');
      option.value = port;
      option.text = port;
      serialPortDropdown.add(option);
    });
  });

  // Fetch available baud rates and populate the baud rate dropdown
  eel.getBaudrates()().then(baudRates => {
    var baudRateDropdown = document.getElementById('baudRateDropdown');
    baudRates.forEach(baudRate => {
      var option = document.createElement('option');
      option.value = baudRate;
      option.text = baudRate;
      baudRateDropdown.add(option);
    });
  });
}

// Function to refresh available ports
function comRefresh() {
  eel.getComPorts()().then(ports => {
    var serialPortDropdown = document.getElementById('comPortDropdown');
    // Clear existing options
    serialPortDropdown.innerHTML = '<option value="">Select COM Port</option>';
    // Add new options
    ports.forEach(port => {
      var option = document.createElement('option');
      option.value = port;
      option.text = port;
      serialPortDropdown.add(option);
    });
  });
}

// Function to apply the theme based on the mode
function applyTheme(mode) {
  const body = document.body;

  if (mode === 'dark') {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }
}

/// Function to toggle between dark mode and light mode
function toggleMode() {
  const currentMode = localStorage.getItem('themeMode') || 'light';
  const newMode = currentMode === 'dark' ? 'light' : 'dark';
  localStorage.setItem('themeMode', newMode);
  applyTheme(newMode);

  // Update the icon based on the new mode
  const modeIcon = document.getElementById('modeIcon');
  modeIcon.src = newMode === 'dark' ? 'images/Light-mode-icon.png' : 'images/Dark-mode-icon.png';
  modeIcon.alt = newMode === 'dark' ? 'Light Mode Icon' : 'Dark Mode Icon';

  // Broadcast the theme change to other pages
  window.postMessage({ themeMode: newMode }, '*');
}

// Apply the theme when the page loads
applyTheme(localStorage.getItem('themeMode') || 'light');

// Set the initial icon based on the current mode
const modeIcon = document.getElementById('modeIcon');
modeIcon.src = localStorage.getItem('themeMode') === 'dark' ? 'images/Light-mode-icon.png' : 'images/Dark-mode-icon.png';
modeIcon.alt = localStorage.getItem('themeMode') === 'dark' ? 'Light Mode Icon' : 'Dark Mode Icon';


// Function to switch to the terminal page from the Terminal Button
function mainTerminal() {
  const mainOverlay = document.getElementById("mainOverlay");
  const terminalOverlay = document.getElementById("terminalOverlay");

  mainOverlay.style.display = "none";
  terminalOverlay.style.display = "block";

  eel.setPageId("terminalOverlay");
}

// Define the closeTerminalPage function
function terminalClose() {
  const mainOverlay = document.getElementById("mainOverlay");
  const terminalOverlay = document.getElementById("terminalOverlay");

  terminalOverlay.style.display = "none";
  mainOverlay.style.display = "block";

  eel.setPageId("mainOverlay");
}

// function to sendAck
function terminalAck() {
  var ackData = document.getElementById('ack-input').value;
  eel.send_ack(ackData);
  document.getElementById('ack-input').value = '';  // Clear the input field
}

eel.expose(update_data);
// function to update_data
function update_data(data) {
  var dataDisplay = document.getElementById('data-display');
  dataDisplay.value += data + '\n';
}

const textarea = document.querySelector("textarea");
textarea.addEventListener("keyup", e => {
  textarea.style.height = "63px";
  let scHeight = e.target.scrollHeight;
  textarea.style.height = `${scHeight}px`;
});

// eel.expose(statusWrite);
// function statusWrite(message) {
//   var dataDisplay = document.getElementById('statusbar');
//   dataDisplay.value = message
// }

eel.expose(statusWrite);
function statusWrite(status_id, message) {
  var dataDisplay = document.getElementById(status_id);
  dataDisplay.value = message
}

function focusLaser() {
  const laserButton = document.getElementById("focusLaserBtn");

  if (laserButton.innerText === "Laser ON") {
    // Call the Python function to turn ON laser
    eel.configLaser("ON");
  }
  else {
    // Call the Python function to turn OFF laser
    eel.configLaser("OFF");
  }
}

eel.expose(showExceptionMessage);

let comCloseisclicked = false;

function showExceptionMessage(current_page_id, message) {
  // get the current page overlay
  const currentOverlay = document.getElementById(current_page_id);
  
  // Close the file not found modal if open
  closefileNotFoundMessage();

  // Set the message in the modal
  document.getElementById('exceptionModalMessage').innerText = message;

  // Show the modal
  document.getElementById('exceptionMessage').style.display = 'block';

  // Close the modal and show comOverlay after 5 seconds
  setTimeout(function () {
    closeExceptionMessage();
    currentOverlay.style.display = 'none'; // hide current overlay
    showComOverlay();
  }, 5000); // 5000 milliseconds = 5 seconds
}

function closeExceptionMessage() {
  // Close the modal
  document.getElementById('exceptionMessage').style.display = 'none';
}

function showComOverlay() {
  const comOverlay = document.getElementById('comOverlay');
  comOverlay.style.display = 'block'; // Show the comOverlay
  eel.setPageId("comOverlay");
}

function closeComOverlay() {
  if (!comCloseisclicked) {
    const mainOverlay = document.getElementById("mainOverlay");
    comCloseisclicked = true;
    const comOverlay = document.getElementById('comOverlay');
    comOverlay.style.display = "none";
    mainOverlay.style.display = "block";
    eel.setPageId("mainOverlay");
  }
}

eel.expose(fileNotFound);

function fileNotFound(current_page_id, message) {
  const currentOverlay = document.getElementById(current_page_id);
  
  // Close the exception modal if open
  closeExceptionMessage();
  
  // Set the message in the modal
  document.getElementById('fileNotFoundModalMessage').innerText = message;

  // Show the modal
  document.getElementById('fileNotFoundMessage').style.display = 'block';
}

function closefileNotFoundMessage() {
  // Close the modal
  document.getElementById('fileNotFoundMessage').style.display = 'none';
}


function machineSetJob() {
  var jobTypeDropdown = document.getElementById('jobType');
  var wellTypeDropdown = document.getElementById('wellType');

  // Enable the wellTypeDropdown only if "Well plates" is selected
  wellTypeDropdown.disabled = (jobTypeDropdown.value !== 'wellPlates');
}

// Initial call to set the initial state based on the default value of jobTypeDropdown
machineSetJob();



// Define a global variable to store the selected well type
var selectedWellType;

function machineSetWell() {
    // Get the selected value from the Well Type dropdown
    selectedWellType = document.getElementById('wellType').value;

    // Perform actions based on the selected well type (if needed)
    console.log('Well Type set to:', selectedWellType);

    // Optionally, you can perform other actions here based on the selected well type

    // Call the function to display well overlay content after setting the well type
    onPageLoadWellOverlay();
}

function displayWellOverlayContent() {
    // Get the overlay content container
    var wellOverlayContent = document.getElementById('wellOverlay').getElementsByClassName('overlay-content')[0];

    // Clear the existing content
    wellOverlayContent.innerHTML = '';

    // Set the selected well type on the wellOverlay
    wellOverlayContent.innerHTML = '<h1>Well Information</h1><p>Selected Well Type: ' + selectedWellType + '</p>';

     // Add the element ID if available
     if (selectedWellType === '6Wells') {
      var sixButtonContainer = document.getElementById('container6');
      if (sixButtonContainer) {
          // Add an ID to the sixButtonContainer
          sixButtonContainer.id = 'container6';
          // Append the content of sixButtonContainer to wellOverlayContent
          wellOverlayContent.innerHTML += sixButtonContainer.outerHTML;
      }
  }

    // Add the element ID if available
    if (selectedWellType === '12Wells') {
        var twelveButtonContainer = document.getElementById('container12');
        if (twelveButtonContainer) {
            // Add an ID to the twelveButtonContainer
            twelveButtonContainer.id = 'container12';
            // Append the content of twelveButtonContainer to wellOverlayContent
            wellOverlayContent.innerHTML += twelveButtonContainer.outerHTML;
        }
    }

     // Add the element ID if available
     if (selectedWellType === '24Wells') {
      var twentyFourButtonContainer = document.getElementById('container24');
      if (twentyFourButtonContainer) {
          // Add an ID to the twentyFourButtonContainer
          twentyFourButtonContainer.id = 'container24';
          // Append the content of twentyFourButtonContainer to wellOverlayContent
          wellOverlayContent.innerHTML += twentyFourButtonContainer.outerHTML;
      }
  }

  // Add the element ID if available
  if (selectedWellType === '96Wells') {
    var ninetySixButtonContainer = document.getElementById('container96');
    if (ninetySixButtonContainer) {
        // Add an ID to the ninetySixButtonContainer
        ninetySixButtonContainer.id = 'container96';
        // Append the content of ninetySixButtonContainer to wellOverlayContent
        wellOverlayContent.innerHTML += ninetySixButtonContainer.outerHTML;
    }
}
}

// Function to be called when navigating to the "WellOverlay" page
function onPageLoadWellOverlay() {
    // Call the displayWellOverlayContent function to set the content
    displayWellOverlayContent();
}

// Call onPageLoadWellOverlay when the page is loaded
document.addEventListener('DOMContentLoaded', onPageLoadWellOverlay);

document.getElementById('wellType').addEventListener('change', machineSetWell);


// Function to generate Six Well
function generate6WellButtons(numWells) {
  const container = document.getElementById('sixButtonContainer');
  container.innerHTML = '';

  for (let i = 1; i <= numWells; i++) {
      const button = document.createElement('button');
      button.className = 'sixCircularButton';
      button.innerHTML = `<span>${i}</span>`;
      button.onclick = () => toggleWellButton6(button);
      container.appendChild(button);
  }
}

// Function to toggle the selected state of a button
function toggleWellButton6(button) {
  button.classList.toggle('selected');
  // Add logic for handling the selected button
  console.log('Button clicked:', button.textContent);
}

// Function for the "Next" button in the 6-well context
function wellNext6() {
  console.log('Next button clicked');
}

function wellPrevious6() {
  clearInterval(interval);
  document.getElementById("wellOverlay").style.display = "none";
  document.getElementById("exposureOverlay").style.display = "block";

  eel.setPageId("exposureOverlay");
}

// Call the function to generate buttons for 24 wells
generate6WellButtons(6);


  // Function to generate Twelve Well
  function generate12WellButtons(numWells) {
    const container = document.getElementById('twelveButtonContainer');
    container.innerHTML = '';

    for (let i = 1; i <= numWells; i++) {
        const button = document.createElement('button');
        button.className = 'twelveCircularButton';
        button.innerHTML = `<span>${i}</span>`;
        button.onclick = () => toggleWellButton12(button);
        container.appendChild(button);
    }
}

// Function to toggle the selected state of a button
function toggleWellButton12(button) {
  button.classList.toggle('selected');
  // Add logic for handling the selected button
  console.log('Button clicked:', button.textContent);
}

// Function for the "Next" button in the 12-well context
function wellNext12() {
  console.log('Next button clicked');
}

function wellPrevious12() {
  clearInterval(interval);
  document.getElementById("wellOverlay").style.display = "none";
  document.getElementById("exposureOverlay").style.display = "block";

  eel.setPageId("exposureOverlay");
}
// Call the function to generate buttons for 24 wells
generate12WellButtons(12);



  // Function to generate Twenty-Four wells
function generate24WellButtons(numWells) {
  const container = document.getElementById('twentyFourButtonContainer');
  container.innerHTML = '';

  for (let i = 1; i <= numWells; i++) {
      const button = document.createElement('button');
      button.className = 'twentyFourCircularButton';
      button.innerHTML = `<span>${i}</span>`;
      button.onclick = () => toggleWellButton24(button);
      container.appendChild(button);
  }
}

// Function to toggle the selected state of a button
function toggleWellButton24(button) {
  button.classList.toggle('selected');
  // Add logic for handling the selected button
  console.log('Button clicked:', button.textContent);
}

// Function for the "Next" button in the 96-well context
function wellNext24() {
  console.log('Next button clicked');
}

function wellPrevious24() {
  clearInterval(interval);
  document.getElementById("wellOverlay").style.display = "none";
  document.getElementById("exposureOverlay").style.display = "block";

  eel.setPageId("exposureOverlay");
}
// Call the function to generate buttons for 24 wells
generate24WellButtons(24);


 // Function to generate Ninty-Six Well
 function generate96WellButtons(numWells) {
  const container = document.getElementById('ninetySixButtonContainer');
  container.innerHTML = '';

  for (let i = 1; i <= numWells; i++) {
      const button = document.createElement('button');
      button.className = 'ninetySixCircularButton';
      button.innerHTML = `<span>${i}</span>`;
      button.onclick = () => toggleWellButton96(button);
      container.appendChild(button);
  }
}

// Function to toggle the selected state of a button
function toggleWellButton96(button) {
  button.classList.toggle('selected');
  // Add logic for handling the selected button
  console.log('Button clicked:', button.textContent);
}

// Function for the "Next" button in the 96-well context
function wellNext96() {
  console.log('Next button clicked');
}

function wellPrevious96() {
  clearInterval(interval);
  document.getElementById("wellOverlay").style.display = "none";
  document.getElementById("exposureOverlay").style.display = "block";

  eel.setPageId("exposureOverlay");
}
// Call the function to generate buttons for 24 wells
generate96WellButtons(96);

function setTimer() {
  // Get the timer input value
  const timerInputValue = document.getElementById('timerInputBox').value;

  // Perform your timer logic here
  if (timerInputValue > 0) {
      // Placeholder: Replace this with your actual timer logic
      console.log(`Timer is set for ${timerInputValue} seconds!`);

      // You can add further logic here, such as starting a countdown
      // or triggering some action after the specified time

      // Hide the custom box
      document.getElementById('timerBox').style.display = 'none';
  } else {
      alert("Please enter a valid timer value greater than 0.");
  }
}

// Function to close the timer box
function closeTimer() {
  document.getElementById('timerBox').style.display = 'none';
}

function plusXaxisBtn(axis, direction) {
  console.log(`Moving along ${axis} ${direction}`);
  // Implement your logic for moving along the X-axis in the positive direction
}

function minusXaxisBtn(axis, direction) {
  console.log(`Moving along ${axis} ${direction}`);
  // Implement your logic for moving along the X-axis in the negative direction
}

function plusYaxisBtn(axis, direction) {
  console.log(`Moving along ${axis} ${direction}`);
  // Implement your logic for moving along the Y-axis in the positive direction
}

function minusYaxisBtn(axis, direction) {
  console.log(`Moving along ${axis} ${direction}`);
  // Implement your logic for moving along the Y-axis in the negative direction
}




