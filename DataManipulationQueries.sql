
-- Home Page: 
-- get all users firstname, lastname, isManager, employeeID from Employees, to populate user account drop downs
SELECT firstName, lastName, employeeID, isManager  FROM `Employees`;
-- create new user Note: password attribute needs to be added to overview/schema. 
INSERT INTO Employees (email, isManager, firstName, lastName, managerID) 
    VALUES (:emailInput, :managerBool, :firstNameInput, :lastNameInput, :managerId_from_dropdown_Input);



-- User Page: 
-- View Upcoming Shifts for a given user 
SELECT Shifts.date, Shifts.startTime, Shifts.stopTime, Schedules.name, Employees.firstname, Employees.lastname FROM `Shifts` 
    INNER JOIN Schedules ON Schedules.scheduleID = Shifts.scheduleID 
    INNER JOIN Employees ON Employees.employeeID = Schedules.managerID 
        WHERE Shifts.employeeID = :req.params.employeeID;
-- View Current User Information
SELECT firstName, lastName, employeeID, managerID, monStart, monStop, tuesStart, tuesStop, wedStart, wedStop, thurStart, thurStop, 
    friStart, friStop, satStart, satStop, sunStart, sunStop  FROM `Employees` WHERE employeeID = :req.params.employeeID;
-- Update User Availability 
UPDATE Employees SET sunStart= :req.body.sunStart, sunStop= :req.body.sunStop, monStart= :req.body.monStart, monStop= :req.body.monStop,
    tuesStart= :req.body.tuesStart, tuesStop= :req.body.tuesStop, wedStart= :req.body.wedStart, wedStop= :req.body.wedStop, 
    thurStart= :req.body.thurStart, thurStop= :req.body.thurStop, friStart= :req.body.friStart, friStop= :req.body.friStop,
    satStart= :req.body.satStart, satStop= :req.body.satStop 
    WHERE employeeID = :req.body.userId;
-- View Time-Off Request
SELECT date, comment, approvalStatus  FROM `Time-Off-Requests` WHERE employeeID = :req.params.employeeID;
--Create Time-Off Request
INSERT INTO `Time-Off-Requests` (employeeID, date, comment, approvalStatus) 
    VALUES (:req.body.userId, :req.body.date, :req.body.comment, :0);



-- Manager Page:  
-- Create Schedule
INSERT INTO `Schedules` (managerID, startDate, endDate, name) 
    VALUES (:req.body.employeeId, :req.body.startdate, :req.body.enddate, :req.body.name);
-- View Current Schedules for a manager
SELECT scheduleID, startDate, endDate, name  FROM Schedules WHERE managerID = :employeeNum;
-- Delete a schedule
DELETE FROM Schedules WHERE scheduleID = :req.params.schedId;
-- Get Time Off Requests of employees of a manager
SELECT tor.date, tor.requestID, tor.comment, tor.approvalStatus, tor.employeeID, Employees.firstName, Employees.lastName 
    FROM `Time-Off-Requests` tor 
    INNER JOIN Employees ON tor.employeeID = Employees.employeeID 
    WHERE Employees.managerID = :employeeNum;
-- Approve Time Off Request 
UPDATE `Time-Off-Requests` SET approvalStatus= 1 WHERE requestID = :req.params.torReq;
-- Deny a Time-Off-Request 
UPDATE `Time-Off-Requests` SET approvalStatus= 0 WHERE requestID = :req.params.torReq;
-- View all employees assigned to this manager
SELECT employeeID, firstName, lastName FROM `Employees` WHERE managerID =  :employeeNum;
-- Delete a User
DELETE FROM Employees WHERE employeeID = :req.params.userId;




--Current Schedules: 
-- Get Schedule Date
SELECT managerID, startDate, endDate, name, scheduleID FROM `Schedules` WHERE scheduleID = :scheduleNum;
-- Create a Shift
INSERT INTO `Shifts` (scheduleID, startTime, stopTime, date) 
    VALUES (req.body.scheduleId, req.body.startTime, req.body.endTime, req.body.date);
-- View Current Shifts  
SELECT sh.shiftID, sh.employeeID, sh.startTime, sh.stopTime, sh.date, e.firstName, e.lastName FROM `Shifts` sh
    LEFT JOIN Employees e ON e.employeeID = sh.employeeID WHERE scheduleID = :scheduleNum;
-- Edit a Shift(not add employee)
UPDATE `Shifts` SET startTime= :req.body.startTime, stopTime= :req.body.endTime, date= : req.body.date 
    WHERE shiftID = req.body.shiftNumber;
-- Edit shift(add/change an employee)
UPDATE `Shifts` SET employeeID = :req.body.userNumber WHERE shiftID = :req.params.shiftID;
-- Delete a Shift
DELETE FROM Shifts WHERE shiftID = :req.params.shiftnumber;
-- View employees available to work a shift
SELECT e.employeeID, e.lastname, e.firstname  FROM Employees e 
    WHERE e.managerID = :shiftCreatorID
        AND e.:dayStartVar(monStart) <= :shiftStartTime 
        AND e.:dayStopVar(monStop) >= :shiftStopTime 
        AND e.isManager = 0 
        AND e.employeeID NOT IN (SELECT tor.employeeID FROM `Time-Off-Requests` tor WHERE tor.date = :shiftDate AND tor.approvalStatus = 1) 
        AND e.employeeID NOT IN (SELECT s.employeeID FROM `Shifts` s WHERE s.date = :shiftDate AND s.employeeID IS NOT NULL) ;
-- Assign Employee to Shift
UPDATE `Shifts` SET employeeID = req.body.userNumber WHERE shiftID = req.params.shiftID
