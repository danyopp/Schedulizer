SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `Employees`;
DROP TABLE IF EXISTS `Shifts`;
DROP TABLE IF EXISTS `Time-Off-Requests`;
DROP TABLE IF EXISTS `Schedules`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `Employees` (
  `employeeID` INT(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(50) NOT NULL,
  `lastName` VARCHAR(50) NOT NULL,
  `firstName` VARCHAR(50) NOT NULL,
  `isManager` BOOLEAN NOT NULL default 0,
  `managerID` INT(11) default NULL,
  `monStart` TIME NOT NULL default 00:00:00, 
  `monStop` TIME NOT NULL default 00:00:00, 
  `tuesStart` TIME NOT NULL default 00:00:00, 
  `tuesStop` TIME NOT NULL default 00:00:00, 
  `wedStart` TIME NOT NULL default 00:00:00, 
  `wedStop` TIME NOT NULL default 00:00:00, 
  `thurStart` TIME NOT NULL default 00:00:00, 
  `thurStop` TIME NOT NULL default 00:00:00, 
  `friStart` TIME NOT NULL default 00:00:00, 
  `friStop` TIME NOT NULL default 00:00:00, 
  `satStart` TIME NOT NULL default 00:00:00, 
  `satStop` TIME NOT NULL default 00:00:00, 
  `sunStart` TIME NOT NULL default 00:00:00, 
  `sunStop` TIME NOT NULL default 00:00:00, 
  PRIMARY KEY(`employeeID`),
  FOREIGN KEY(`managerID`)
     REFERENCES Employees(`employeeID`)
     ON UPDATE CASCADE
     ON DELETE RESTRICT   
)  ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `TIME-OFF-REQUESTS` (
  `requestID` INT(11) NOT NULL AUTO_INCREMENT,
  `employeeID` INT(11) NOT NULL,
  `date` DATE NOT NULL,
  `comment` VARCHAR(256) ,
  `approvalStatus` BOOLEAN NOT NULL default 0,
  PRIMARY KEY(`requestID`),
  FOREIGN KEY(`employeeID`)
     REFERENCES Employees(`employeeID`)
     ON UPDATE CASCADE
     ON DELETE CASCADE   
)  ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Schedules` (
  `scheduleID` INT(11) NOT NULL AUTO_INCREMENT,
  `managerID` INT(11) NOT NULL,
  `startDate` DATE NOT NULL,
  `endDate` DATE NOT NULL,
  `name` VARCHAR(256) ,
  PRIMARY KEY(`scheduleID`),
  FOREIGN KEY(`managerID`)
     REFERENCES Employees(`employeeID`)
     ON UPDATE CASCADE
     ON DELETE CASCADE   
)  ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Shifts` (
  `shiftID` INT(11) NOT NULL AUTO_INCREMENT,
  `scheduleID` INT(11) NOT NULL,
  `employeeID` INT(11),
  `startTime` TIME NOT NULL,
  `stopTime` TIME NOT NULL,
  `date` DATE NOT NULL,
  PRIMARY KEY(`shiftID`),
  FOREIGN KEY(`employeeID`)
     REFERENCES Employees(`employeeID`)
     ON UPDATE CASCADE
     ON DELETE SET NULL   
  FOREIGN KEY(`scheduleID`)
     REFERENCES Schedules(`scheduleID`)
     ON UPDATE CASCADE
     ON DELETE DELETE     
)  ENGINE=InnoDB DEFAULT CHARSET=latin1;