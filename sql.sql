-- MySQL dump 10.13  Distrib 8.0.18, for macos10.14 (x86_64)
--
-- Host: 127.0.0.1    Database: RPS_NSW_Ecology
-- ------------------------------------------------------
-- Server version	8.0.18

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Access`
--

DROP TABLE IF EXISTS `Access`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 
CREATE TABLE `Access` (
  `UserID` int(11) NOT NULL,
  `ProjectID` int(11) NOT NULL,
  PRIMARY KEY (`UserID`,`ProjectID`),
  KEY `ProjectID_idx` (`ProjectID`),
  CONSTRAINT `ProjectID_3` FOREIGN KEY (`ProjectID`) REFERENCES `projects` (`ID`),
  CONSTRAINT `UserID` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Access`
--

LOCK TABLES `Access` WRITE;
/*!40000 ALTER TABLE `Access` DISABLE KEYS */;
/*!40000 ALTER TABLE `Access` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BaseData`
--

DROP TABLE IF EXISTS `BaseData`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BaseData` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ScientificName` varchar(45) DEFAULT NULL,
  `CommonName` varchar(45) DEFAULT NULL,
  `TSC Act` varchar(45) DEFAULT NULL,
  `EPB Act` varchar(45) DEFAULT NULL,
  `Habitat` varchar(45) DEFAULT NULL,
  `Type` varchar(45) DEFAULT NULL,
  `Family` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BaseData`
--

LOCK TABLES `BaseData` WRITE;
/*!40000 ALTER TABLE `BaseData` DISABLE KEYS */;
/*!40000 ALTER TABLE `BaseData` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Companies`
--

DROP TABLE IF EXISTS `Companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Companies` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Companies`
--

LOCK TABLES `Companies` WRITE;
/*!40000 ALTER TABLE `Companies` DISABLE KEYS */;
INSERT INTO `Companies` VALUES (1,'RPS'),(2,'QUT'),(3,'InTech');
/*!40000 ALTER TABLE `Companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ConsolidatedList`
--

DROP TABLE IF EXISTS `ConsolidatedList`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ConsolidatedList` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ProjectID` int(11) NOT NULL,
  `VersionID` int(11) NOT NULL,
  `SpeciesID` int(11) NOT NULL,
  `EPBC` tinyint(4) NOT NULL,
  `BAM` tinyint(4) NOT NULL,
  `ATLAS` tinyint(4) NOT NULL,
  `CandidateSpecies` tinyint(4) NOT NULL,
  `DateAdded` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID_UNIQUE` (`ID`),
  KEY `SpeciesID_idx` (`SpeciesID`),
  KEY `VersionID_idx` (`VersionID`),
  KEY `ProjectID_idx` (`ProjectID`),
  CONSTRAINT `ProjectID` FOREIGN KEY (`ProjectID`) REFERENCES `versions` (`ProjectID`),
  CONSTRAINT `SpeciesID` FOREIGN KEY (`SpeciesID`) REFERENCES `onlinedata` (`ID`),
  CONSTRAINT `VersionID` FOREIGN KEY (`VersionID`) REFERENCES `versions` (`VersionID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ConsolidatedList`
--

LOCK TABLES `ConsolidatedList` WRITE;
/*!40000 ALTER TABLE `ConsolidatedList` DISABLE KEYS */;
/*!40000 ALTER TABLE `ConsolidatedList` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ImpactIntensity`
--

DROP TABLE IF EXISTS `ImpactIntensity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ImpactIntensity` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ProjectID` int(11) DEFAULT NULL,
  `VersionID` int(11) DEFAULT NULL,
  `SpeciesID` int(11) DEFAULT NULL,
  `Answer` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `ProjectID_idx` (`ProjectID`),
  KEY `VersionID_idx` (`VersionID`),
  KEY `SpeciesID_idx` (`SpeciesID`),
  CONSTRAINT `ProjectID_1` FOREIGN KEY (`ProjectID`) REFERENCES `consolidatedlist` (`ProjectID`),
  CONSTRAINT `SpeciesID_1` FOREIGN KEY (`SpeciesID`) REFERENCES `consolidatedlist` (`SpeciesID`),
  CONSTRAINT `VersionID_1` FOREIGN KEY (`VersionID`) REFERENCES `consolidatedlist` (`VersionID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ImpactIntensity`
--

LOCK TABLES `ImpactIntensity` WRITE;
/*!40000 ALTER TABLE `ImpactIntensity` DISABLE KEYS */;
/*!40000 ALTER TABLE `ImpactIntensity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Impactintensity_Questions`
--

DROP TABLE IF EXISTS `Impactintensity_Questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Impactintensity_Questions` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Question` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Impactintensity_Questions`
--

LOCK TABLES `Impactintensity_Questions` WRITE;
/*!40000 ALTER TABLE `Impactintensity_Questions` DISABLE KEYS */;
/*!40000 ALTER TABLE `Impactintensity_Questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `InternalProjectsIDs`
--

DROP TABLE IF EXISTS `InternalProjectsIDs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `InternalProjectsIDs` (
  `ID` int(11) NOT NULL,
  `ProjectID` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID_UNIQUE` (`ID`),
  UNIQUE KEY `ProjectID_UNIQUE` (`ProjectID`),
  CONSTRAINT `ProjectID_4` FOREIGN KEY (`ProjectID`) REFERENCES `projects` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `InternalProjectsIDs`
--

LOCK TABLES `InternalProjectsIDs` WRITE;
/*!40000 ALTER TABLE `InternalProjectsIDs` DISABLE KEYS */;
/*!40000 ALTER TABLE `InternalProjectsIDs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LegislativeContext`
--

DROP TABLE IF EXISTS `LegislativeContext`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LegislativeContext` (
  `ID` int(11) NOT NULL,
  `Name` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LegislativeContext`
--

LOCK TABLES `LegislativeContext` WRITE;
/*!40000 ALTER TABLE `LegislativeContext` DISABLE KEYS */;
/*!40000 ALTER TABLE `LegislativeContext` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LOO`
--

DROP TABLE IF EXISTS `LOO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LOO` (
  `ID` int(11) NOT NULL,
  `ProjectID` int(11) NOT NULL,
  `VersionID` int(11) NOT NULL,
  `SpeciesID` int(11) NOT NULL,
  `Lookup` int(11) NOT NULL,
  `SurveyAdequacy` int(11) NOT NULL,
  `ImpactIntensity` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `SpeciesID_idx` (`SpeciesID`),
  KEY `VersionID_idx` (`VersionID`),
  KEY `ProjectID_idx` (`ProjectID`),
  CONSTRAINT `ProjectID_2` FOREIGN KEY (`ProjectID`) REFERENCES `projects` (`ID`),
  CONSTRAINT `SpeciesID_2` FOREIGN KEY (`SpeciesID`) REFERENCES `consolidatedlist` (`SpeciesID`),
  CONSTRAINT `VersionID_2` FOREIGN KEY (`VersionID`) REFERENCES `versions` (`VersionID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LOO`
--

LOCK TABLES `LOO` WRITE;
/*!40000 ALTER TABLE `LOO` DISABLE KEYS */;
/*!40000 ALTER TABLE `LOO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OnlineData`
--

DROP TABLE IF EXISTS `OnlineData`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OnlineData` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ScientificName` varchar(45) NOT NULL,
  `CommonName` varchar(45) NOT NULL,
  `TypeID` varchar(45) NOT NULL,
  `FamilyID` varchar(45) NOT NULL,
  `SAII` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OnlineData`
--

LOCK TABLES `OnlineData` WRITE;
/*!40000 ALTER TABLE `OnlineData` DISABLE KEYS */;
/*!40000 ALTER TABLE `OnlineData` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Projects`
--

DROP TABLE IF EXISTS `Projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Projects` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `CompanyID` int(11) NOT NULL,
  `Name` varchar(45) NOT NULL,
  `ContextID` int(11) NOT NULL,
  `Latitude` varchar(45) NOT NULL,
  `Longitude` varchar(45) NOT NULL,
  `StateID` int(11) DEFAULT NULL,
  `RegionID` int(11) DEFAULT NULL,
  `RadiusCovered` int(11) DEFAULT NULL,
   `Deadline` DATETIME NOT NULL, 
  `CommonWealth` tinyint(4) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID_UNIQUE` (`ID`),
  KEY `Company_idx` (`CompanyID`),
   KEY `ContextID_idx` (`ContextID`),
  KEY `StateID_idx` (`StateID`),
  KEY `RegionID_idx` (`RegionID`),
  CONSTRAINT `CompanyID_2` FOREIGN KEY (`CompanyID`) REFERENCES `companies` (`ID`),
  CONSTRAINT `ContextID` FOREIGN KEY (`ContextID`) REFERENCES `legislativecontext` (`ID`),
  CONSTRAINT `RegionID` FOREIGN KEY (`RegionID`) REFERENCES `regions` (`ID`),
  CONSTRAINT `StateID` FOREIGN KEY (`StateID`) REFERENCES `states` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Projects`
--

LOCK TABLES `Projects` WRITE;
/*!40000 ALTER TABLE `Projects` DISABLE KEYS */;
/*!40000 ALTER TABLE `Projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Regions`
--

DROP TABLE IF EXISTS `Regions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Regions` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Regions`
--

LOCK TABLES `Regions` WRITE;
/*!40000 ALTER TABLE `Regions` DISABLE KEYS */;
/*!40000 ALTER TABLE `Regions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Roles`
--

DROP TABLE IF EXISTS `Roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Roles` (
  `ID` int(11) NOT NULL,
  `Name` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Type_UNIQUE` (`Name`),
  UNIQUE KEY `ID_UNIQUE` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Roles`
--

LOCK TABLES `Roles` WRITE;
/*!40000 ALTER TABLE `Roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `Roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `States`
--

DROP TABLE IF EXISTS `States`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `States` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `States`
--

LOCK TABLES `States` WRITE;
/*!40000 ALTER TABLE `States` DISABLE KEYS */;
/*!40000 ALTER TABLE `States` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SubRegions`
--

DROP TABLE IF EXISTS `SubRegions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SubRegions` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SubRegions`
--

LOCK TABLES `SubRegions` WRITE;
/*!40000 ALTER TABLE `SubRegions` DISABLE KEYS */;
/*!40000 ALTER TABLE `SubRegions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SurveyAdequecy`
--

DROP TABLE IF EXISTS `SurveyAdequecy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SurveyAdequecy` (
  `ID` int(11) NOT NULL,
  `Description` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SurveyAdequecy`
--

LOCK TABLES `SurveyAdequecy` WRITE;
/*!40000 ALTER TABLE `SurveyAdequecy` DISABLE KEYS */;
/*!40000 ALTER TABLE `SurveyAdequecy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Email` varchar(45) NOT NULL,
  `FirstName` varchar(45) NOT NULL,
  `LastName` varchar(45) NOT NULL,
  `Password` varchar(45) NOT NULL,
  `CompanyID` int(11) NOT NULL,
  `RoleID` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`,`Email`),
  UNIQUE KEY `ID_UNIQUE` (`ID`),
  UNIQUE KEY `Email_UNIQUE` (`Email`),
  KEY `CompanyID_idx` (`CompanyID`),
  KEY `RoleID_idx` (`RoleID`),
  CONSTRAINT `CompanyID_1` FOREIGN KEY (`CompanyID`) REFERENCES `companies` (`ID`),
  CONSTRAINT `RoleID` FOREIGN KEY (`RoleID`) REFERENCES `roles` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'test@rps.com','Test','Tester','Password',1,NULL);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Versions`
--

DROP TABLE IF EXISTS `Versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Versions` (
  `VersionID` int(11) NOT NULL,
  `ProjectID` int(11) DEFAULT NULL,
  `LastEdited` datetime DEFAULT NULL,
  `EditedBy` int(11) DEFAULT NULL,
  `Progress` varchar(45) DEFAULT NULL,
  `LastReviewed` datetime DEFAULT NULL,
  `ReviewedBy` int(11) DEFAULT NULL,
  `Created` datetime DEFAULT NULL,
  `CreatedBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`VersionID`),
  KEY `ProjectID_0_idx` (`ProjectID`),
  CONSTRAINT `ProjectID_0` FOREIGN KEY (`ProjectID`) REFERENCES `projects` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Versions`
--

LOCK TABLES `Versions` WRITE;
/*!40000 ALTER TABLE `Versions` DISABLE KEYS */;
/*!40000 ALTER TABLE `Versions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-10-23 14:05:27