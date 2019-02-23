
$("#employeeStartDate").mask("99/99/9999");

var config = {
    apiKey: "AIzaSyDlBoG7DaPhUu-mh2fvTtqAEQikLqhjIJw",
    authDomain: "timesheet-be233.firebaseapp.com",
    databaseURL: "https://timesheet-be233.firebaseio.com",
    projectId: "timesheet-be233",
    storageBucket: "timesheet-be233.appspot.com",
    messagingSenderId: "548609060395"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

  $("button[type=submit]").on("click", function (event) {

    event.preventDefault(); // avoid reloading of page

    // get employee name
    var employeeName = $("#employeeName").val().trim();

    // make sure employee exists
    if(employeeName){
        var employeeRole = $("#employeeRole").val().trim();
        var employeeStartDate = $("#employeeStartDate").val().trim();
        var employeeMonthlyRate = $("#employeeMonthlyRate").val().trim();
        
        // push to database
        database.ref().push({
          employeeName: employeeName,
          employeeRole: employeeRole,
          employeeStartDate: employeeStartDate,
          employeeMonthlyRate: employeeMonthlyRate
        });
    }
   
  });

  // watch changes and update 
  database.ref().orderByChild("employeeStartDate").on("child_added",function(snapshot){

    var entry = snapshot.val();
    var today = new Date();
    
    // make sure entry exists
    if(entry.employeeName){

        var employeeMonths = Math.round(moment(today).diff(moment(entry.employeeStartDate), 'months', true));
    
        var rowEntry = $("<tr>");
        var rowCol = $("<td>");
        rowCol.addClass("col");
        rowCol.text(entry.employeeName);
        rowEntry.append(rowCol);
    
        rowCol = $("<td>");
        rowCol.addClass("col");
        rowCol.text(entry.employeeRole);
        rowEntry.append(rowCol);
    
        rowCol = $("<td>");
        rowCol.addClass("col");
        rowCol.text(entry.employeeStartDate);
        rowEntry.append(rowCol);
    
        rowCol = $("<td>");
        rowCol.addClass("col");
        rowCol.text(employeeMonths);
        rowEntry.append(rowCol);
    
        rowCol = $("<td>");
        rowCol.addClass("col rate");
        rowCol.text(entry.employeeMonthlyRate);
        rowEntry.append(rowCol);
        
        var total = entry.employeeMonthlyRate * employeeMonths;
        rowCol = $("<td>");
        rowCol.addClass("col total");
        rowCol.text(total);
        rowEntry.append(rowCol);
    
        console.log(rowEntry);
    
        $('tbody').append(rowEntry);
        $(".total,.rate").formatCurrency({ roundToDecimalPlace: 2, eventOnDecimalsEntered: true });

    }

   

  });

  
