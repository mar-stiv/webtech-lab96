// Task 1
function sortTable(n){
  var table, rows, switching, el1, el2, shouldSwitch, direction, switchCount = 0;
  table = document.getElementsById("myTable");
  switching = true;
  direction = "asc" // ascending directionection to sort

  while(switching){ // loops until no switching can be done
    switching = false;
    rows = table.rows;

    for(var i=1; i<(rows.length - 2); i++){ // loops through rows from the 2nd
      shouldSwitch = false; // there should be no switching
      el1 = rows[i].getElementsByTagName("TD")[n]; // element 1
      el2 = rows[i+1].getElementsByTagName("TD")[n]; // element 2

      if(direction=="asc"){ // Checks if two rows should switch position
        if(el1.innerHTML.toLowerCase()>el2.innerHTML.toLowerCase()){ // If el1 is bigger than el2
            shouldSwitch = true;
            break;
        }
      }else if(direction="desc"){
        if(el1.innerHTML.toLowerCase()<el2.innerHTML.toLowerCase()){ // If el2 is bigger than el1
            shouldSwitch = true;
            break;
        }
      }
    }

    if(shouldSwitch){ // If it is true, make the switch and say it has been done
      rows[i].parentNode.insertBefore(rows[i+1],rows[i]);
      switching = true;
      switchCount++; // each time a switch is done, increment
    }else{
      if(switchCount==0 && direction=="asc"){ // If no switching has been done and the directionection is asc
        direction = "desc";
        switching = true;
      }
    }
  }
}

// Task 2
function this.form.reset() {
  window.location.replace("https://wt.ops.labs.vu.nl/api22/779519fb/reset");
}
/*
or
function thisFormReset() {
  $("#reset").click(function () {
    $.get("https://wt.ops.labs.vu.nl/api22/779519fb/reset", function (data, status) {
        alert("Data: " + data + "\nStatus: " + status)
      }) }
  }
*/

//Task 3
fetch('https://wt.ops.labs.vu.nl/api22/779519fb') // GET request on URL
   .then(function (response) {
       return response.json(); // return array containing all phone items
   }).then(function (apiJsonData) {
       console.log(apiJsonData); // write to console
       renderDataIntoTable(apiJsonData);
   })

 function renderDataIntoTable(phones){ // finds table in DOM to append new rows to
     const mytable = document.getElementById("phones");
     phones.forEach(phone =>{
       let newRow = document.createElement("tr"); // for each item, create new tr element
       Object.values(phone).forEach((value) =>{
         let cell = document.createElement("td"); // adds each value as a td element
         cell.innerText = value;
         newRow.appendChild(cell);
       })
       mytable.appendChild(newRow);
     });
 }
