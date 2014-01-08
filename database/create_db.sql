SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP SCHEMA IF EXISTS `opdracht` ;
CREATE SCHEMA IF NOT EXISTS `opdracht` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `opdracht` ;

-- -----------------------------------------------------
-- Table `opdracht`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `opdracht`.`users` ;

CREATE TABLE IF NOT EXISTS `opdracht`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `firstname` VARCHAR(45) NULL,
  `prefix` VARCHAR(45) NULL,
  `lastname` VARCHAR(45) NULL,
  `emailaddress` VARCHAR(45) NULL,
  `password` VARCHAR(45) NULL,
  `validated` TINYINT NULL DEFAULT 0,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `opdracht`.`users`
-- -----------------------------------------------------
START TRANSACTION;
USE `opdracht`;
INSERT INTO `opdracht`.`users` (`id`, `username`, `firstname`, `prefix`, `lastname`, `emailaddress`, `password`, `validated`) VALUES (1, 'martijn', 'Martijn', NULL, 'Tijsma', 'martijn@adesys.nl', 'test', 1);
INSERT INTO `opdracht`.`users` (`id`, `username`, `firstname`, `prefix`, `lastname`, `emailaddress`, `password`, `validated`) VALUES (2, 'frank', 'Frank', 'van', 'Kesteren', 'frank@adesys.nl', 'test', 1);

COMMIT;

