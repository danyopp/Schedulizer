-- SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
-- SET AUTOCOMMIT = 0;
-- START TRANSACTION;
-- SET time_zone = "+00:00";

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `Shifts`;
DROP TABLE IF EXISTS `Time-Off-Requests`;
DROP TABLE IF EXISTS `Schedules`;
DROP TABLE IF EXISTS `Employees`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `Employees` (
  `employeeID` INT(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(50) NOT NULL,
  `lastName` VARCHAR(50) NOT NULL,
  `firstName` VARCHAR(50) NOT NULL,
  `isManager` BOOLEAN NOT NULL default 0,
  `managerID` INT(11) default NULL,
  `monStart` TIME NOT NULL default '12:00:00', 
  `monStop` TIME NOT NULL default '12:00:00', 
  `tuesStart` TIME NOT NULL default '12:00:00', 
  `tuesStop` TIME NOT NULL default '12:00:00', 
  `wedStart` TIME NOT NULL default '12:00:00', 
  `wedStop` TIME NOT NULL default '12:00:00', 
  `thurStart` TIME NOT NULL default '12:00:00', 
  `thurStop` TIME NOT NULL default '12:00:00', 
  `friStart` TIME NOT NULL default '12:00:00', 
  `friStop` TIME NOT NULL default '12:00:00', 
  `satStart` TIME NOT NULL default '12:00:00', 
  `satStop` TIME NOT NULL default '12:00:00', 
  `sunStart` TIME NOT NULL default '12:00:00', 
  `sunStop` TIME NOT NULL default '12:00:00', 
  PRIMARY KEY(`employeeID`)
  
);

INSERT INTO `Employees` (`employeeID`, `email`, `lastname`, `firstname`, `isManager` ) VALUES
(6, "bill@msn.com", "Miller", "Bill", True),
(9, "steph@yahoo.com", "MacMall", "Steph", True);

INSERT INTO `Employees` ( `email`,  `firstname`, `lastname`, `isManager`, `managerID`, `sunStart`, `sunStop`, `monStart`, `monStop`, `tuesStart`, `tuesStop`, `wedStart`, `wedStop`, `thurStart`, `thurStop`, `friStart`, `friStop`, `satStart`, `satStop`) VALUES
-- 10
( 'arowley@gmail.com', 'Ashlee', 'Rowley', FALSE, 6,                                  '08:00:00', "20:00:00", '08:00:00', "17:00:00", '08:00:00', "16:00:00", '00:00:00', "00:00:00", '00:00:00', '00:00:00', '08:00:00', "20:00:00", '08:45:00', "21:00:00" ),
-- 11
( 'kMcP@gmail.com', 'Kali', 'Mcpherson', FALSE, 6,                                    '08:00:00', "20:00:00", '08:00:00', "17:00:00", '11:00:00', "19:00:00", '08:00:00', "16:00:00", '00:00:00', '00:00:00', '08:00:00', "20:00:00", '08:45:00', "21:00:00" ),
-- 12
( 'mchap@yahoo.com', 'Melody', 'Chapman', FALSE, 6,                                   '08:00:00', "20:00:00", '08:00:00', "17:00:00", '00:00:00', "00:00:00", '11:00:00', "19:00:00", '00:00:00', '00:00:00', '08:00:00', "20:00:00", '08:45:00', "21:00:00" ),
-- 13
( 'clay@gmail.com', 'Clay', 'Curry', FALSE, 6,                                        '08:00:00', "20:00:00", '08:00:00', "17:00:00", '00:00:00', "00:00:00", '12:00:00', "21:00:00", '00:00:00', '00:00:00', '08:00:00', "20:00:00", '08:45:00', "21:00:00" ),
-- 14
( 'Lw4alkerP@gmail.com', 'Lacy', 'Walker', FALSE, 9,                                   '08:00:00', "20:00:00", '08:00:00', "17:00:00", '06:00:00', "14:00:00", '00:00:00', "00:00:00", '00:00:00', '00:00:00', '08:00:00', "20:00:00", '08:45:00', "21:00:00" ),
-- 15
( 'sgil@yahoo.com', 'Sandra', 'Gilmour', FALSE, 9,                                    '08:00:00', "20:00:00", '08:00:00', "17:00:00", '09:00:00', "18:00:00", '08:00:00', "16:00:00", '00:00:00', '00:00:00', '08:00:00', "20:00:00", '08:45:00', "21:00:00" ),
-- 16
( 'conrad@gmail.com', 'Conrad', 'Gutierrez', FALSE, 9,                                '08:00:00', "20:00:00", '08:00:00', "17:00:00", '12:00:00', "21:00:00", '11:00:00', "19:00:00", '00:00:00', '00:00:00', '08:00:00', "20:00:00", '08:45:00', "21:00:00" ),
-- 17
( 'mccray@gmail.com', 'Dolly', 'McCray', FALSE, 9,                                    '08:00:00', "20:00:00", '08:00:00', "17:00:00", '00:00:00', "00:00:00", '12:00:00', "21:00:00", '00:00:00', '00:00:00', '08:00:00', "20:00:00", '08:45:00', "21:00:00" );


CREATE TABLE `Time-Off-Requests` (
  `requestID` INT(11) NOT NULL AUTO_INCREMENT,
  `employeeID` INT(11) NOT NULL,
  `date` DATE NOT NULL,
  `comment` VARCHAR(256) ,
  `approvalStatus` BOOLEAN NOT NULL default 0,
  PRIMARY KEY(`requestID`)
) ;

INSERT INTO `Time-Off-Requests` (`employeeID`, `date`, `comment`, `approvalStatus`) VALUES
(12, '2020-3-18', 'Melody Going on Vacation', True),
(13, '2020-3-18', 'Clay Out of Town', False),
(16, '2019-3-18', "Conrad's Family in town", True),
(17, '2019-3-18', 'Dolly Out of Town', FALSE);


CREATE TABLE `Schedules` (
  `scheduleID` INT(11) NOT NULL AUTO_INCREMENT,
  `managerID` INT(11) NOT NULL,
  `startDate` DATE NOT NULL,
  `endDate` DATE NOT NULL,
  `name` VARCHAR(256) ,
  PRIMARY KEY(`scheduleID`)  
);

INSERT INTO `Schedules` (`managerID`, `startDate`, `endDate`, `name`) VALUES
(6, "2020-03-16", "2020-03-18", 'Cashiers-March2020, Period 2'),
(9, "2020-03-16", "2020-03-18", 'Stockers-March2020, Period 2');


CREATE TABLE `Shifts` (
  `shiftID` INT(11) NOT NULL AUTO_INCREMENT,
  `scheduleID` INT(11) NOT NULL,
  `employeeID` INT(11),
  `startTime` TIME NOT NULL,
  `stopTime` TIME NOT NULL,
  `date` DATE NOT NULL,
   PRIMARY KEY(`shiftID`)
);

INSERT INTO `Shifts` (`scheduleID`, `employeeID`, `startTime`, `stopTime`, `date`) VALUES
-- Cashiers Shifts
(1, NULL, "07:00:00", "11:00:00", "2020-03-16"),
(1, 13, "08:00:00", "11:00:00", "2020-03-16"),
(1, NULL, "10:00:00", "17:00:00", "2020-03-16"),
(1, NULL, "14:00:00", "17:00:00", "2020-03-16"),

(1, NULL, "08:00:00", "12:00:00", "2020-03-17"),
(1, NULL, "12:00:00", "16:00:00", "2020-03-17"),

(1, NULL, "11:00:00", "16:00:00", "2020-03-18"),
(1, NULL, "13:00:00", "20:00:00", "2020-03-18"),
-- Stocker Shifts
(2, NULL, "07:00:00", "11:00:00", "2020-03-16"),
(2, 16, "08:00:00", "11:00:00", "2020-03-16"),
(2, 17, "10:00:00", "17:00:00", "2020-03-16"),
(2, NULL, "14:00:00", "21:00:00", "2020-03-16"),

(2, NULL, "09:00:00", "14:00:00", "2020-03-17"),
(2, NULL, "12:00:00", "18:00:00", "2020-03-17"),
(2, NULL, "16:00:00", "21:00:00", "2020-03-17"),

(2, NULL, "08:00:00", "12:00:00", "2020-03-18"),
(2, NULL, "12:00:00", "16:00:00", "2020-03-18");



ALTER TABLE `Shifts`
  ADD CONSTRAINT `shift_employee` FOREIGN KEY(`employeeID`) REFERENCES `Employees`(`employeeID`) ON UPDATE CASCADE ON DELETE SET NULL,   
  ADD CONSTRAINT `shift_schedule` FOREIGN KEY(`scheduleID`) REFERENCES `Schedules`(`scheduleID`) ON UPDATE CASCADE ON DELETE CASCADE;     

ALTER TABLE `Time-Off-Requests`
  ADD CONSTRAINT `TOR_employee` FOREIGN KEY(`employeeID`) REFERENCES `Employees`(`employeeID`) ON UPDATE CASCADE ON DELETE CASCADE;
 
ALTER TABLE `Schedules`
  ADD CONSTRAINT `sched_manager` FOREIGN KEY(`managerID`) REFERENCES `Employees`(`employeeID`) ON UPDATE CASCADE ON DELETE CASCADE;  

