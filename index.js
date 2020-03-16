var express = require("express");
var request = require("request");
var mysql = require('./dbcon.js')
bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({extended: true})); 
app.use(express.static("public"));  //Serve Public folder
app.set("view engine", "ejs");      //allows links to "about" instead of "about.ejs"
// app.set('port', process.argv[2]);
app.set('mysql', mysql);


// ==============================================
// DATABASE CALL FUNCTIONS
// ==============================================

//Home page
    //Get user info for all employees
function getUsers(res, mysql, context, complete){
    mysql.pool.query("SELECT firstName, lastName, employeeID, isManager  FROM `Employees`", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.info = JSON.parse(JSON.stringify(results));
        complete();
    });
}

//User Page
    //Get user info for a single employee
function getSingleUser(res, mysql, context, complete, employeeNum){
    mysql.pool.query("SELECT firstName, lastName, employeeID, managerID, monStart, monStop, tuesStart, tuesStop, wedStart, wedStop, thurStart, " +
                        "thurStop, friStart, friStop, satStart, satStop, sunStart, sunStop  FROM `Employees` WHERE employeeID = " + employeeNum, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.userinfo = JSON.parse(JSON.stringify(results));
        complete();
    });
}
    //Get a users time off requests
function getUserRequests(res, mysql, context, complete, employeeNum){
    mysql.pool.query("SELECT date, comment, approvalStatus  FROM `Time-Off-Requests` WHERE employeeID = " + employeeNum, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.requestinfo = JSON.parse(JSON.stringify(results));
        complete();
    });
}
    //Get a employee's shifts
function getUserShifts(res, mysql, context, complete, employeeNum){
    mysql.pool.query("SELECT Shifts.date, Shifts.startTime, Shifts.stopTime, Schedules.name, Employees.firstname, Employees.lastname FROM `Shifts`"+
                        "INNER JOIN Schedules ON Schedules.scheduleID = Shifts.scheduleID INNER JOIN Employees ON Employees.employeeID = Schedules.managerID "+
                         "WHERE Shifts.employeeID = " + employeeNum, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.shiftinfo = JSON.parse(JSON.stringify(results));
        complete();
    });
}
//Manager Page
    // get time off requests for all employees under a manager
function getManTOR(res, mysql, context, complete, employeeNum){
    mysql.pool.query("SELECT tor.date, tor.requestID, tor.comment, tor.approvalStatus, tor.employeeID, Employees.firstName, Employees.lastName" +
                         " FROM `Time-Off-Requests` tor INNER JOIN Employees ON tor.employeeID = Employees.employeeID WHERE Employees.managerID = " + employeeNum, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.torinfo = JSON.parse(JSON.stringify(results));
        complete();
    });
}
    //get a manager's schedules
function getManSchedules(res, mysql, context, complete, employeeNum){
    mysql.pool.query("SELECT scheduleID, startDate, endDate, name  FROM Schedules WHERE managerID = " + employeeNum, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.schedinfo = JSON.parse(JSON.stringify(results));
        complete();
    });
}
    //get a manager's assigned employees
function getManEmployees(res, mysql, context, complete, employeeNum){
    mysql.pool.query("SELECT employeeID, firstName, lastName FROM `Employees` WHERE managerID = " + employeeNum, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.employeeinfo = JSON.parse(JSON.stringify(results));
        complete();
    });
}

//Schedule Page
    //get Schedule data
    function getSchedule(res, mysql, context, complete, scheduleNum){
        mysql.pool.query("SELECT managerID, startDate, endDate, name, scheduleID FROM `Schedules` WHERE scheduleID = " + scheduleNum, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.scheduleinfo = JSON.parse(JSON.stringify(results));
            complete();
        });
    }
    //Get shift data for a schedule
    function getSchedShifts(res, mysql, context, complete, scheduleNum){
        mysql.pool.query("SELECT sh.shiftID, sh.employeeID, sh.startTime, sh.stopTime, sh.date, e.firstName, e.lastName FROM `Shifts` sh"+
        " LEFT JOIN Employees e ON e.employeeID = sh.employeeID WHERE scheduleID = " + scheduleNum, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.shiftinfo = JSON.parse(JSON.stringify(results));
            complete();
        });
    }



    //get employees available to work a shift
    function shiftQueryCall(res, mysql, context, complete, query, index){
        mysql.pool.query(query, function(error, results, fields){
            if (error){
                res.write(JSON.stringify(error));
                res.end();
            }
            // console.log("returned sql: ", results)
            context.shiftinfo[index].possibleEmploy = JSON.parse(JSON.stringify(results));
            complete();

        });


    }
    
    
    function getEmployeesforShifts(res, mysql, context, renderPage ){
        var callbackCount = 0;
        if (context.shiftinfo.length === 0)
        { res.render("schedule.ejs",{pagetitle: "Schedule Page", schedInfo: context.scheduleinfo, shiftInfo: context.shiftinfo}); } 
                   
        for(var j = 0; j < context.shiftinfo.length; j++){
            // console.log(j)
            // console.log(context.scheduleinfo);
            var query = "SELECT e.employeeID, e.lastname, e.firstname  FROM Employees e WHERE e.managerID = " + context.scheduleinfo[0].managerID +" AND e." + context.shiftinfo[j].datestart  +
            " <= '" + context.shiftinfo[j].startTime + "' AND e." + context.shiftinfo[j].datestop + " >= '" + context.shiftinfo[j].stopTime + 
            "' AND e.isManager = 0 AND e.employeeID NOT IN (SELECT tor.employeeID FROM `Time-Off-Requests` tor WHERE tor.date = '" + context.shiftinfo[j].date +"' AND tor.approvalStatus = 1 );"
            // console.log(query);
            shiftQueryCall(res, mysql, context, complete, query, j);
            function complete(){
                callbackCount++;
                if(callbackCount >= context.shiftinfo.length){
                    res.render("schedule.ejs",{pagetitle: "Schedule Page", schedInfo: context.scheduleinfo, shiftInfo: context.shiftinfo});          
                }
            }
        }    
    }
    
    
    

    //Assign employee to shift
    //
    //
    //
    //
    //
    //


// ==============================================
// ROUTES
// ==============================================

//Homepage
app.get("/", function(req,res){
    res.redirect("/home");
});

app.get("/home", function(req,res){
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get('mysql');
    getUsers(res, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 1){
            res.render("home.ejs",{pagetitle: "Home", Users: context.info});;
        }
    }
});

//create new employee or manager
app.post("/createuser", function(req,res){
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO Employees (email, lastName, firstName, isManager, managerID) VALUES (?,?,?,?,?)";
    var manId = 0;
    if(req.body.userType == 0)
        {manId = req.body.userNumber;}; 
    var inserts = [req.body.email, req.body.lastname, req.body.firstname, req.body.userType, manId];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.redirect("/home")
        }
    });
});

//link to employee pages
app.post("/accessuser", function(req,res){
    var userid = req.body.userNumber
    res.redirect("/user/" + userid)
});

//link to manager pages
app.post("/accessmanager", function(req,res){
    var userid = req.body.userNumber
    res.redirect("/manager/" + userid)
});

//////////////////////////////////////////////////////////
//USER account page
app.get("/user/:usernum", function(req,res){
    //get user data

    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get('mysql');
    getSingleUser(res, mysql, context, complete, req.params.usernum);
    getUserRequests(res, mysql, context, complete, req.params.usernum);
    getUserShifts(res, mysql, context, complete, req.params.usernum);
    function complete(){
        callbackCount++;
        if(callbackCount >= 3){
            //Trim timestamp off of datetime
            for(var j = 0; j < context.requestinfo.length; j++){
                var tempDate = context.requestinfo[j].date.split('T')
                context.requestinfo[j].date = tempDate[0];
            }
            console.log(context.shiftinfo)
            for(var j = 0; j < context.shiftinfo.length; j++){
                var tempDate = context.shiftinfo[j].date.split('T')
                context.shiftinfo[j].date = tempDate[0];
            }


            res.render("user.ejs",{pagetitle: "User Account", userInfo: context.userinfo, schInfo: context.shiftinfo, requestInfo: context.requestinfo});
        }
    }
    
});

//update availability
app.post("/updateAva", function(req,res){
    var mysql = req.app.get('mysql');
    var sql = "UPDATE Employees SET sunStart=?, sunStop=?, monStart=?, monStop=?, tuesStart=?, tuesStop=?, wedStart=?, wedStop=?, thurStart=?," +
                " thurStop=?, friStart=?, friStop=?, satStart=?, satStop=? WHERE employeeID = " + req.body.userId;
    var inserts = [req.body.sunStart, req.body.sunStop, req.body.monStart, req.body.monStop, req.body.tuesStart, req.body.tuesStop, req.body.wedStart, 
                    req.body.wedStop, req.body.thurStart, req.body.thurStop, req.body.friStart, req.body.friStop,req.body.satStart, req.body.satStop];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.redirect("/user/" + req.body.userId)
        }
    });
});

//add time off request
app.post("/addTimeOff", function(req,res){
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO `Time-Off-Requests` (employeeID, date, comment, approvalStatus) VALUES (?,?,?,?)";
    var inserts = [req.body.userId, req.body.date, req.body.comment, 0];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.redirect("/user/" + req.body.userId)
        }
    });
});



///////////////////////////////////////////////////////////////////////////////
//Manager Page
app.get("/manager/:usernum", function(req,res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getManEmployees(res, mysql, context, complete, req.params.usernum);
        getManTOR(res, mysql, context, complete, req.params.usernum);
        getSingleUser(res, mysql, context, complete, req.params.usernum);
        getManSchedules(res, mysql, context, complete, req.params.usernum);
        function complete(){
            callbackCount++;
            if(callbackCount >= 4){
                //Trim timestamp off of datetime
                for(var j = 0; j < context.torinfo.length; j++){
                    var tempDate = context.torinfo[j].date.split('T')
                    context.torinfo[j].date = tempDate[0];
                }
                for(var j = 0; j < context.schedinfo.length; j++){
                    var tempDate = context.schedinfo[j].startDate.split('T')
                    context.schedinfo[j].startDate = tempDate[0];
                    tempDate = context.schedinfo[j].endDate.split('T')
                    context.schedinfo[j].endDate = tempDate[0];
                }
                res.render("manager.ejs", {pagetitle: "Manager Account", 
                userInfo: context.userinfo, 
                schInfo: context.schedinfo,
                 timeOff: context.torinfo, 
                 employeeInfo: context.employeeinfo});
                }
        }
});

//Approve time off request
app.get("/timeoff/approve/:manager/:torReq", function(req,res){
    var mysql = req.app.get('mysql');
    var sql = "UPDATE `Time-Off-Requests` SET approvalStatus=? WHERE requestID = " + req.params.torReq;
    var inserts = [1];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.redirect("/manager/" + req.params.manager)
        }
    });
});

//deny time off request
app.get("/timeoff/deny/:manager/:torReq", function(req,res){
    var mysql = req.app.get('mysql');
    var sql = "UPDATE `Time-Off-Requests` SET approvalStatus=? WHERE requestID = " + req.params.torReq;
    var inserts = [0];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.redirect("/manager/" + req.params.manager)
        }
    });
});

//delete employee
app.get("/userdelete/:manager/:userId", function(req,res){
    var mysql = req.app.get('mysql');
    var sql = "DELETE FROM Employees WHERE employeeID = ?";
    var inserts = [req.params.userId];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.status(400);
            res.end();
        }else{
            res.redirect("/manager/" + req.params.manager)
        }
    });
});

//delete schedule
app.get("/manager/delete/:managerId/:schedId", function(req,res){
    var mysql = req.app.get('mysql');
    var sql = "DELETE FROM Schedules WHERE scheduleID = ?";
    var inserts = [req.params.schedId];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.status(400);
            res.end();
        }else{
            res.redirect("/manager/" + req.params.managerId)
        }
    });
});

//create schedule
app.post("/manager/create", function(req,res){
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO `Schedules` (managerID, startDate, endDate, name) VALUES (?,?,?,?)";
    var inserts = [req.body.employeeId, req.body.startdate, req.body.enddate, req.body.name];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.redirect("/manager/" + req.body.employeeId)
        }
    });
    
});

//////////////////////////////////////////////////////////////////////////////
//Schedule page
app.get("/schedule/:scheNum", function(req,res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getSchedule(res, mysql, context, dataFetched, req.params.scheNum);
        getSchedShifts(res, mysql, context, dataFetched, req.params.scheNum);
        //Get employees who can work shifts
        function dataFetched(){
            callbackCount++;
            if(callbackCount >= 2){
                // console.log(context.scheduleinfo)
                for(var j = 0; j < context.shiftinfo.length; j++){
                    var tempDate = context.shiftinfo[j].date.split('T')
                    context.shiftinfo[j].date = tempDate[0];
                }
                //Get day of the week of each shift, create vars to use in mysql query
                console.log(context.shiftinfo)
                for (var j=0; j < context.shiftinfo.length; j++)
                {
                    var temp =  new Date((context.shiftinfo[j].date).replace("-","/"))
                    if(temp.getDay()===0)
                    {context.shiftinfo[j].datestart = "sunStart"; context.shiftinfo[j].datestop = "sunStop";}
                    else if(temp.getDay()===1)
                    {context.shiftinfo[j].datestart = "monStart"; context.shiftinfo[j].datestop = "monStop";}
                    else if(temp.getDay()===2)
                    {context.shiftinfo[j].datestart = "tuesStart"; context.shiftinfo[j].datestop = "tuesStop";}
                    else if(temp.getDay()===3)
                    {context.shiftinfo[j].datestart = "wedStart"; context.shiftinfo[j].datestop = "wedStop";}
                    else if(temp.getDay()===4)
                    {context.shiftinfo[j].datestart = "thurStart"; context.shiftinfo[j].datestop = "thurStop";}
                    else if(temp.getDay()===5)
                    {context.shiftinfo[j].datestart = "friStart"; context.shiftinfo[j].datestop = "friStop";}
                    else if(temp.getDay()===6)
                    {context.shiftinfo[j].datestart = "satStart"; context.shiftinfo[j].datestop = "satStop";}
                }
                console.log("debug1", context.shiftinfo.length)
                getEmployeesforShifts(res, mysql, context, renderPage )
            }
        }

        function renderPage(res){
                res.render("schedule.ejs",{pagetitle: "Schedule Page", schedInfo: context.scheduleinfo, shiftInfo: context.shiftinfo});
        }    
});


//Create a shift
app.post("/schedule/createshift", function(req,res){
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO `Shifts` (scheduleID, startTime, stopTime, date) VALUES (?,?,?,?)";
    var inserts = [req.body.scheduleId, req.body.startTime, req.body.endTime, req.body.date];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.redirect("/schedule/" + req.body.scheduleId)        
        }
    });
});

//update a shift
app.post("/shiftupdate", function(req,res){
    console.log(req.body);
    var mysql = req.app.get('mysql');
    var sql = "UPDATE `Shifts` SET startTime=?, stopTime=?, date=? WHERE shiftID = " + req.body.shiftNumber;
    var inserts = [req.body.startTime, req.body.endTime, req.body.date];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.redirect("/schedule/" + req.body.scheduleId)
        }
    });

});

//Delete a shift
app.get("/shiftdelete/:schedID/:shiftnumber", function(req,res){
    var mysql = req.app.get('mysql');
    var sql = "DELETE FROM Shifts WHERE shiftID = ?";
    var inserts = [req.params.shiftnumber];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.status(400);
            res.end();
        }else{
            res.redirect("/schedule/" + req.params.schedID)
        }
    });
});


//assign employee to shift
app.post("/shiftassign/:shiftID", function(req,res){
    //create new schedule
    // console.log(req.params.shiftID, req.params, req.params.scheduleId);
    // console.log("Selected Employee: ", req.body.userNumber)
    // res.redirect("/schedule/456" + req.params.scheduleID)
});



// ==============================================
// LISTEN
// ==============================================

const PORT = process.env.PORT || 31115;


// app.listen(app.get('port'), function(){
//     console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
//   });

app.listen(PORT, function(){
    console.log("Server started on port", PORT)
})
