/**
 * How it works?
 * TBA
 */
function start(){
  // Run Functions
  displayTime();
  displayStudentDetails();
  displayTodayEntry();
  addEntryAll();
  currentTime();
  deleteEntryHistoryNotToday();

  // Current Time (Format: Hour:Minutes)
  function currentTime(){
    let d = new Date();
    let hours = addZeroToTime(d.getHours());
    let minutes = addZeroToTime(d.getMinutes());
    let time = hours + ":" + minutes;
    return time;
  }

  // Current Date (Format: DD/MM/YYYY)
  function currentDate(){
    let d = new Date();
    let day = addZeroToTime(d.getDate());
    let month = addZeroToTime(d.getMonth());
    let year = addZeroToTime(d.getFullYear());
    let date = day + "/" + month + "/" + year;
    return date;
  }
  

  // Display Time
  function displayTime() {
    let d = new Date();
    const currentTime24Hour = document.querySelector("#current-time-24-hour");
    const currentTimeEpoch = document.querySelector("#current-time-epoch");
    currentTimeEpoch.innerText = d.getTime();
    let hours = addZeroToTime(d.getHours());
    let minutes = addZeroToTime(d.getMinutes());
    let seconds = addZeroToTime(d.getSeconds());
    currentTime24Hour.innerText = hours + ":" + minutes + ":" + seconds;
    setTimeout(displayTime, 1000);
  }
  function addZeroToTime(i){
    if(i < 10){
      i = "0" + i;
    }
    return i;
  }

  // Display student details
  function displayStudentDetails(){
    fetch('data/config.json')
    .then(response => response.json())
    .then(data => {
      const studentNameDisplay = document.querySelector("#student-name-display");
      const studentICDisplay = document.querySelector("#student-ic-display");
      const studentClassDisplay = document.querySelector("#student-class-display");
      studentNameDisplay.innerText = data.studentName;
      studentICDisplay.innerText = data.studentIC;
      studentClassDisplay.innerText = data.studentClass;
    });
    setTimeout(displayStudentDetails, 1000);
  }

  // Display Today Entry In The List If Available (Update every 1 minute)
  function displayTodayEntry(){
    const todayEntry = document.querySelector("#today-entry");
    checkTodayEntry().then(value => {
      if(Array.isArray(value)){
        if(value.length < 1){
          todayEntry.innerHTML = "<p>N/A</p>";
        }else{
          for (let index = 0; index < value.length; index++) {
            const element = value[index];
            addRow(element['code'], element['time'])
          }
        }
      }else{
        todayEntry.innerText = "N/A";
      }
    });
    todayEntry.textContent = "";
    setTimeout(displayTodayEntry, 60000);
  }

  function addRow(code, time){
    const todayEntry = document.querySelector("#today-entry");
    html = "Code: " + code + ", Time: " + time;
    node = document.createElement("div");
    node.style.display = "flex";
    node.innerHTML = html;
    todayEntry.appendChild(node);
  }

  async function checkTodayEntry(){
    const response = await fetch('data/timetable.json');
    const data = await response.json();
    for (const [key, value] of Object.entries(data)) {
      if(key == checkDay()){
        result = value;
      }else{
        result = "N/A";
      }
    }
    return result;
  }

  // Add Entry To Form
  function addEntryAll(){
    fetch('data/timetable.json')
    .then(response => response.json())
    .then(data => {
      // Current day in name
      let dayTimetableArray = data[checkDay()];
      for (let i = 0; i < dayTimetableArray.length; i++){
        let timetableTime = dayTimetableArray[i]["time"];
        let timetableCode = dayTimetableArray[i]["code"];
        // Check if current time is equal to any of the listed classes in the timetable. 
        if(timetableTime == currentTime()){
          if(!checkEntryHistory(timetableCode)){
            console.log("Added entry for " + timetableCode + " on " + currentDate() + " " + timetableTime);
            addEntryHistory(timetableCode);
            addEntryToEndpoint(timetableCode);
          }
        }
      }
    });
    setTimeout(addEntryAll, 1000);
  }

  // Get All localStorage Items
  function allStorage(){
    keys = Object.keys(localStorage);
    return keys;
}

  // Delete All Entry History From Local Storage If Not Equal To Current Date
  function deleteEntryHistoryNotToday(){
    localStorageItems = allStorage();
    for (let i = 0; i < localStorageItems.length; i++){
      if(localStorage.getItem(localStorageItems[i]) != currentDate()){
        console.log("Removed: " + localStorageItems[i]);
        localStorage.removeItem(localStorageItems[i]);
      }
    }
    setTimeout(deleteEntryHistoryNotToday, 1000);
  }
  //Check For Current Day and Timetable
  function checkDay(){
    let d = new Date();
    let currentDay = d.getDay();
    switch (currentDay) {
      case 0:
        currentDay = "Sunday";
        break;
      case 1:
        currentDay = "Monday";
        break;
      case 2:
        currentDay = "Tuesday";
        break;
      case 3:
        currentDay = "Wednesday";
        break;
      case 4:
        currentDay = "Thursday";
        break;
      case 5:
        currentDay = "Friday";
        break;
      case 6:
        currentDay = "Saturday";
        break;
      default:
        currentDay = "Unknown";
        break;
    }
    return currentDay;
  }

  // Check Entry History in localStorage if exist for the code
  function checkEntryHistory(code){
    if(localStorage.getItem(code) !== null){
      return true;
    }else{
      return false;
    }
  }

  // Add Entry History To Local Storage
  function addEntryHistory(code){
    // Add the code with current date
    localStorage.setItem(code, currentDate());
  }

  // Add Entry to the Endpoint
  function addEntryToEndpoint(code){
    fetch('data/config.json')
    .then(response => response.json())
    .then(data => {
      let formData = new FormData();
      let endpointURL = data.endpointURL;
      let kelas = data.studentClass;
      let kod = code + kelas;
      let nama = data.studentName;
      let kp = data.studentIC;
      formData.append('kod', kod);
      formData.append('nama', nama);
      formData.append('kp', kp);
      // Send Post Request
      fetch(endpointURL, {
        method: 'post',
        mode: "no-cors",
        body: formData
      }).then(function (response){
        return response.text();
      }).then(function (text){
        console.log(text);
      }).catch(function (error){
        console.log(error);
      });
    });
  }
}