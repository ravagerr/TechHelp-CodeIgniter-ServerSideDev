CREATE TABLE `Users` (
  `UserID` INT PRIMARY KEY AUTO_INCREMENT,
  `Username` VARCHAR(255) NOT NULL,
  `Email` VARCHAR(255) UNIQUE NOT NULL,
  `PasswordHash` VARCHAR(255) NOT NULL,
  `JoinDate` DATETIME NOT NULL,
  `ReputationPoints` INT DEFAULT 0
);

CREATE TABLE `Questions` (
  `QuestionSlug` VARCHAR(255) PRIMARY KEY,
  `UserID` INT,
  `Title` VARCHAR(255) NOT NULL,
  `Body` TEXT NOT NULL,
  `PostDate` DATETIME NOT NULL,
  `Upvotes` INT DEFAULT 0,
  `Downvotes` INT DEFAULT 0
);

CREATE TABLE `Answers` (
  `AnswerID` INT PRIMARY KEY AUTO_INCREMENT,3
  `QuestionSlug` VARCHAR(255),
  `UserID` INT,
  `Body` TEXT NOT NULL,
  `PostDate` DATETIME NOT NULL,
  `Upvotes` INT DEFAULT 0,
  `Downvotes` INT DEFAULT 0
);

CREATE TABLE `Notifications` (
  `NotificationID` INT PRIMARY KEY AUTO_INCREMENT,
  `UserID` INT,
  `QuestionSlug` VARCHAR(255),
  `Type` VARCHAR(255) NOT NULL,
  `Message` TEXT NOT NULL,
  `IsRead` BOOLEAN DEFAULT false,
  `Date` DATETIME NOT NULL
);

CREATE TABLE `Tags` (
  `TagID` INT PRIMARY KEY AUTO_INCREMENT,
  `TagName` VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE `QuestionTags` (
  `QuestionSlug` VARCHAR(255),
  `TagID` INT,
  PRIMARY KEY (`QuestionSlug`, `TagID`)
);

CREATE TABLE `Subscriptions` (
  `SubscriptionID` INT PRIMARY KEY AUTO_INCREMENT,
  `UserID` INT,
  `QuestionSlug` VARCHAR(255)
);

CREATE TABLE `Votes` (
  `VoteID` INT PRIMARY KEY AUTO_INCREMENT,
  `UserID` INT,
  `ContentType` ENUM('question', 'answer'),
  `ContentID` INT,
  `VoteType` ENUM('upvote', 'downvote'),
  `VoteDate` DATETIME NOT NULL,
  UNIQUE KEY `unique_vote` (`UserID`, `ContentType`, `ContentID`),
  FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`)
);

ALTER TABLE `Subscriptions` ADD FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`);

ALTER TABLE `Subscriptions` ADD FOREIGN KEY (`QuestionSlug`) REFERENCES `Questions` (`QuestionSlug`);

ALTER TABLE `Questions` ADD FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`);

ALTER TABLE `Answers` ADD FOREIGN KEY (`QuestionSlug`) REFERENCES `Questions` (`QuestionSlug`);

ALTER TABLE `Answers` ADD FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`);

ALTER TABLE `Notifications` ADD FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`);

ALTER TABLE `Notifications` ADD FOREIGN KEY (`QuestionSlug`) REFERENCES `Questions` (`QuestionSlug`);

ALTER TABLE `QuestionTags` ADD FOREIGN KEY (`QuestionSlug`) REFERENCES `Questions` (`QuestionSlug`);

ALTER TABLE `QuestionTags` ADD FOREIGN KEY (`TagID`) REFERENCES `Tags` (`TagID`);
