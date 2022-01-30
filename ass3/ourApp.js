$(function(){ // when page is loaded
  getTable(); // renders table in place

  // Task 4 - Single page form submit
  $("#my-form").on("submit", function (e) {
    var dataString = $(this).serialize(); // captures data from form to send

    $.ajax({ // process values in dataString
      type: "POST",
      url: "http://localhost:3000/api/insert",
      data: dataString,
      success: function () {
        $('#data-form').html("<div id='message'></div>"); // display message back to user
        $('#message').html("<h2>Form Submitted!</h2>")
        .append("<p>Phone is being added to server</p>")
        .hide()
      }
    });
    getTable(); // Sometimes the server doesn't reload the table fast enough so you need to wait until the server is done resetting
    $('input').not(".button").val(""); // clears out the form
    e.preventDefault();
  });

  //BONUS POINT FOR ASS 3

  //Update Table with New Phone Data
  $("#updateForm").on("submit",function (e){
    console.log("update has been submitted");
    var dataString = $(this).serialize(); // captures data from form to send
    console.log(dataString);
    console.log(dataString.id);
    $.ajax({
      type: "PUT",
      url:"http://localhost:3000/api/update/" +dataString.id,
      data: dataString,
      success: function(){
        getTable(); // Sometimes the server doesn't reload the table fast enough so you need to wait until the server is done resetting
        $('input').not(".button").val("");
      }
    });
    getTable(); // Sometimes the server doesn't reload the table fast enough so you need to wait until the server is done resetting
    $('input').not(".button").val(""); // clears out the form
    //e.preventDefault();
  });

  // Delete Button removes Phone w/Specific ID
  $('#deleteForm').on("submit",function(e){
    console.log("delete has been submitted");
    var id = $(this).serialize(); // captures data from form to send
    console.log(id);
    $.ajax({
      url:"http://localhost:3000/api/remove/" +id,
      type: "DELETE",
      data: id,
    });
    getTable(); // Sometimes the server doesn't reload the table fast enough so you need to wait until the server is done resetting
    $('input').not(".button").val(""); // clears out the form
    //e.preventDefault();
  });

  // Task 1 - Sorting Dynamic Table
  $("th").not("#no-sort").click(function(){ // sorts everything but the image
    sortTable($(this).attr('id')); // calls function below to sort column

    function sortTable(n) {
      var table;
      table = document.getElementById("phones"); // finds table
      var rows, i, x, y, count = 0;
      var switching = true;

      // Order is set as ascending
      var direction = "ascending";

      // Run loop until no switching is required
      while (switching) {
        switching = false;
        var rows = table.rows;

        //Loop through all rows
        for (i = 1; i < (rows.length - 1); i++) {
          var Switch = false;

          // 2 elements that need to be compared in the tbody
          x = rows[i].querySelectorAll("tbody td")[n];
          console.log(x);
          y = rows[i + 1].querySelectorAll("tbody td")[n];
          console.log(y);

          // Check the direction of order and that y is not null
          if (direction == "ascending" && y) {

            // Check if 2 rows need to be switched
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase())
            {
              // If yes, mark Switch as required and break loop
              Switch = true;
              break;
            }
          } else if (direction == "descending") {

            // Check direction
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase())
            {
              // If yes, mark Switch as required and break loop
              Switch = true;
              break;
            }
          }
        }
        if (Switch) {
          // switches rows and mark switch as complete
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;

          // Increase count for each switch
          count++;
        } else {
          // Run while loop again for descending order
          if (count == 0 && direction == "ascending") {
            direction = "descending";
            switching = true;
          }
        }
      }
    }
  });
});

//Task 3
function getTable(){
  $.ajax({
    type: "GET",
    url:"http://localhost:3000/api/phones",
    dataType: "json"
  })
  .done(function(data){
    renderDataIntoTable(data); // calls function defined below with json data from server
  });

  function renderDataIntoTable(phones){ // finds table in DOM to append new rows to
    const $mytable = $("#phones"); // finds table
    $thead = $mytable.find("thead");
    $("tbody tr").remove(); // removes previous rows (if it finds one)
    phones.rows.forEach(phone =>{
      $tbody = $mytable.find("tbody");
      $tbody.append("<tr></tr>");
      $newRow =  $tbody.find("tr");// for each item, create new tr element
      Object.values(phone).forEach((value) =>{
        if(phone.id != value){
          $newRow.append("<td></td>");
          $cell = $newRow.find("td").last(); // adds each value as a td element
          $cell.addClass("have-border"); // adds class for css functionality
          if(isValidURL(value)){
            value = "<img src= \"" + value + "\" width=\"154\" height=\"192\"></a>";
            $cell.html(value); // places image
          }else{
            $cell.text(value); // places text
          }
        }
      })
    });
  }

  function isValidURL(str){ // validates URL
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR iPv4 address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }
}
