# Serveerster
## Installatie
1. Download de versie 0base en pak deze uit op je server
2. Maak een bot aan in Discord Dev Portal
3. Plak de token van de bot in data/token.txt
4. Download de nieuwste update en vervang data/workspaces.json
5. Maak een SQL database en maak de structuur aan volgens de instructies beneden.
6. Volg ook de instructies onder "bdaybot"
7. Zorg ervoor dat je nodeJS 18.14.2 of nieuwer hebt.
8. Draai "npm i" in de map met de bot
9. Start de bot met "node bot.js"

## Setup
1. Doe t!setupmain
2. Stel de staff role, logging channel en Status in
3. Stel daarna met /setconfig de rest van de configuratie in.
4. Laat config/ en .txt weg uit deze configuratie.

## Configuratie vlaggen
- server (Wordt automatisch ingevuld door t!setupmain)
- status (Wordt automatisch ingevuld door de "status" knop in setupmain)
- roles/member (ID van de Member role)
- roles/inactive (ID van de Inactive role)
- roles/bday (ID van de Gefelicitaart role)
- roles/booster (ID van de Booster role)
- roles/cuddlegang (ID van de Cuddlegang role)
- roles/it (ID van de ICT-Hulpjes role)
- roles/staff (ID van de Staff role, wordt automatisch ingevuld door de Staff Role knop in setupmain)
- roles/timeout (ID van de Timeout role)
- roles/verified (ID van de Verified role)
- rolecheck/16min (ID van de <16 role voor het niet toelaten)
- rolecheck/age (Lijst met ID's van de leeftijdsrollen, gescheiden door comma's. Bijvoorbeeld 123456789,123456790,123456791)
- rolecheck/gender (Lijst met ID's van de gender rollen, gescheiden door comma's)
- rolecheck/id (Lijst met ID's van de cis/afvragend/trans rollen, gescheiden door comma's)
- rolecheck/pronouns (Lijst met ID's van de voornaamwoorden rollen, gescheiden door comma's)
- db/host (Hostname/IP van de SQL server)
- db/port (Portnummer van de SQL server)
- db/user (Username van de SQL server)
- db/pass (Wachtwoord van de SQL server)
- db/db (Database op de SQL server)
- channels/intro (ID van introductie kanaal)
- channels/log (ID van serveerster_log kanaal)
- channels/roles (ID van self_roles kanaal)
- channels/stats (ID van stats voice channel. Wordt automatisch aangemaakt met t!statssetup)
- channels/mod (ID van mod chat)

## SQL
```
CREATE DATABASE IF NOT EXISTS `serveerster` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `serveerster`;
CREATE TABLE `appeals` (
  `id` int NOT NULL,
  `channel` varchar(255) NOT NULL,
  `user` varchar(255) NOT NULL,
  `time` int NOT NULL,
  `open` varchar(255) NOT NULL,
  `denied` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `appealsticketdeletequeue` (
  `id` int NOT NULL,
  `channelid` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `bdays` (
  `ID` int NOT NULL,
  `UserID` varchar(255) NOT NULL,
  `Bday` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `haldesroems` (
  `id` int NOT NULL,
  `message` varchar(255) NOT NULL,
  `stars` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `mc` (
  `id` int NOT NULL,
  `userid` varchar(255) NOT NULL,
  `mcuser` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `messages` (
  `id` int NOT NULL,
  `UserID` varchar(255) NOT NULL,
  `datetime` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `notities` (
  `id` int NOT NULL,
  `UserID` varchar(255) NOT NULL,
  `datetime` varchar(255) NOT NULL,
  `notitie` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `staff` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ticketdeletequeue` (
  `id` int NOT NULL,
  `channelid` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tickets` (
  `id` int NOT NULL,
  `channel` varchar(255) NOT NULL,
  `button` varchar(255) NOT NULL,
  `user` varchar(255) DEFAULT NULL,
  `open` varchar(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `warns` (
  `id` int NOT NULL,
  `UserID` varchar(255) NOT NULL,
  `datetime` varchar(255) NOT NULL,
  `notitie` text NOT NULL,
  `staff` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `appeals`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `appealsticketdeletequeue`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `bdays`
  ADD PRIMARY KEY (`ID`);

ALTER TABLE `haldesroems`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `mc`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `notities`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `ticketdeletequeue`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `warns`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `appeals`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `appealsticketdeletequeue`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `bdays`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `haldesroems`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `mc`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `notities`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `ticketdeletequeue`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `tickets`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `warns`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
COMMIT;

```

## bdaybot
1. Maak een bestand aan /temp/querymagic.sh
2. Voer de volgende code in:

```
checkdate=$(date +%d-%m)
rm /var/lib/mysql-files/thuisbday.txt
rm /map/naar/serveerster/bday.txt
mysql -u root serveerster -e "SELECT GROUP_CONCAT(UserID) FROM bdays WHERE bday LIKE '$checkdate' INTO OUTFILE '/var/lib/mysq>mv /var/lib/mysql-files/thuisbday.txt /map/naar/serveerster/bday.txt
chown user:user /map/naar/serveerster/bday.txt
```
3. Vervang /map/naar/serveerster met het juiste pad
4. Vervang user:user met de juiste gebruiker en groep waaronder Serveerster draait
5. Voer de volgende opdracht uit:

```
chown +Xx /temp/querymagic.sh
```
6. Pas /etc/crontab aan en voer het volgende in:

```
0 0 * * * root /temp/querymagic.sh
```
