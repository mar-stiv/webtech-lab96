// Task 1 - Sortable tables
//Code working for Dynamic tables


//Code for Static Table
function sortTable(n){
  if(typeof n == 'number'){
    var table, rows, switching, el1, el2, shouldSwitch, direction, switchCount = 0;
    table = document.getElementsById("phones");
    switching = true;
    direction = "asc" // ascending directionection to sort

    while(switching){ // loops until no switching can be done
      switching = false;
      rows = table.rows;

      for(var i=1; i<(rows.length - 2); i++){ // loops through rows from the 2nd
        shouldSwitch = false; // there should be no switching
        el1 = rows[i].getElementsByTagName("td")[n]; // element 1
        el2 = rows[i+1].getElementsByTagName("td")[n]; // element 2

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
}

//Sorting for Dynamic table

// Task 2 - Reset button
function thisFormReset() {
  $.ajax({
    url:https://wt.ops.labs.vu.nl/api22/779519fb/reset, method: "GET"
  })
}

//Task 3 - Dynamic table content
$(function(){
  function getTable(){
    $.ajax({
       type: "GET",
       url:"https://wt.ops.labs.vu.nl/api22/779519fb",
       dataType: "json"
     })
     .done(function(data){
       console.log(data); // write to console
       renderDataIntoTable(data);
     });

     function renderDataIntoTable(phones){ // finds table in DOM to append new rows to
       const $mytable = $("#phones"); // finds table
       $thead = $mytable.find("thead");
       $thead.append("<tbody></tbody>") // creates tbody
        phones.forEach(phone =>{
          $tbody = $mytable.find("tbody");
          $tbody.append("<tr></tr>");
          $newRow =  $tbody.find("tr");// for each item, create new tr element
          Object.values(phone).forEach((value) =>{
            $newRow.append("<td></td>");
            $cell = $newRow.find("td").last(); // adds each value as a td element
            $cell.addClass("have-border"); // adds class for css functionality
            if(isValidURL(value)){
              value = "<img src= \"" + value + "\" width=\"154\" height=\"192\"></a>";
              $cell.html(value); // places image
            }else{
              $cell.text(value); // places text
            }
            $newRow.append($cell);
          })
          $mytable.append($newRow);
        });
    }

    function isValidURL(str){ // validate URL
      const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
       '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
       '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
       '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
       '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
       '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
       return !!pattern.test(str);
    }
  }
})


//Task 4 - Single page form submit
$( "form" ).on( "submit", function(e) {
     var dataString = $(this).serialize();

     $.ajax({
       type: "POST",
       url: "https://wt.ops.labs.vu.nl/api22/779519fb",
       data: dataString,
       success: function () {
         $("#data-form").html("<div id='message'></div>");
         $("#message").html("<h2>Form Submitted!</h2>")
           .append("<p>Phone will be added to server.</p>")
           //.hide()
       }
     });
     e.preventDefault();
   });// code credit: https://code.tutsplus.com/tutorials/submit-a-form-without-page-refresh-using-jquery--net-59
