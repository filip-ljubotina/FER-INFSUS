CREATE TABLE mjesto (
    idMjesto SERIAL PRIMARY KEY,
    grad VARCHAR(100) NOT NULL,
    postanski_broj VARCHAR(10) NOT NULL,
    drzava VARCHAR(50) NOT NULL
);

CREATE TABLE dobavljac (
    idDobavljac SERIAL PRIMARY KEY,
    imeTvrtke VARCHAR(100) NOT NULL,
    mail VARCHAR(100),
    adresa VARCHAR(100),
    idMjesto INT,
    CONSTRAINT fk_dobavljac_mjesto
        FOREIGN KEY (idMjesto)
        REFERENCES mjesto(idMjesto)
        ON DELETE SET NULL
);

CREATE TABLE odjel (
    idOdjel SERIAL PRIMARY KEY,
    imeOdjela VARCHAR(100) NOT NULL,
    kriloBolnice VARCHAR(50) NOT NULL,
    idVoditeljOdjela INT
);

CREATE TABLE korisnik (
    idKorisnik SERIAL PRIMARY KEY,
    ime VARCHAR(50) NOT NULL,
    prezime VARCHAR(50) NOT NULL,
    oib VARCHAR(11) UNIQUE, 
    uloga VARCHAR(30) NOT NULL, 
    idOdjel INT,
    CONSTRAINT fk_korisnik_odjel
        FOREIGN KEY (idOdjel)
        REFERENCES odjel(idOdjel)
        ON DELETE SET NULL
);


CREATE TABLE materijal (
    idMaterijal SERIAL PRIMARY KEY,
    naziv VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    namjena VARCHAR(100)
);

CREATE TABLE zalihaPotrosnogMaterijala (
    idOdjel INT NOT NULL,
    idMaterijal INT NOT NULL,
    kolicina INT DEFAULT 0,
    minimalnaDozvoljenaKolicina INT DEFAULT 0,
    PRIMARY KEY (idOdjel, idMaterijal),
    CONSTRAINT fk_zaliha_odjel
        FOREIGN KEY (idOdjel)
        REFERENCES odjel(idOdjel)
        ON DELETE CASCADE,
    CONSTRAINT fk_zaliha_materijal
        FOREIGN KEY (idMaterijal)
        REFERENCES materijal(idMaterijal)
        ON DELETE CASCADE
);

CREATE TABLE narudzba (
    idNarudzba SERIAL PRIMARY KEY,
    brojNarudzbe VARCHAR(20) NOT NULL,
    ukupnaCijena NUMERIC(10,2) DEFAULT 0.00,
    datumNarudzbe DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(30) NOT NULL, 
    idDobavljac INT,
    CONSTRAINT fk_narudzba_dobavljac
        FOREIGN KEY (idDobavljac)
        REFERENCES dobavljac(idDobavljac)
        ON DELETE SET NULL
);

CREATE TABLE stavkaNarudzbe (
    idNarudzba INT NOT NULL,
    idMaterijal INT NOT NULL,
    kolicina INT NOT NULL,
    jedinicnaCijena NUMERIC(10,2),
    PRIMARY KEY (idNarudzba, idMaterijal),
    CONSTRAINT fk_sn_narudzba
        FOREIGN KEY (idNarudzba)
        REFERENCES narudzba(idNarudzba)
        ON DELETE CASCADE,
    CONSTRAINT fk_sn_materijal
        FOREIGN KEY (idMaterijal)
        REFERENCES materijal(idMaterijal)
        ON DELETE RESTRICT
);

CREATE TABLE izvjestaj (
    idIzvjestaj SERIAL PRIMARY KEY,
    naziv VARCHAR(255) NOT NULL,
    datumIzrade TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    pdfDokument BYTEA,
    idKorisnik INT,
    CONSTRAINT fk_izvjestaj_korisnik
        FOREIGN KEY (idKorisnik)
        REFERENCES korisnik(idKorisnik)
        ON DELETE SET NULL
);

INSERT INTO mjesto (grad, postanski_broj, drzava)
VALUES
  ('Zagreb', '10000', 'Hrvatska'),
  ('Split', '21000', 'Hrvatska'),
  ('Osijek', '31000', 'Hrvatska');

INSERT INTO odjel (imeOdjela, kriloBolnice, idVoditeljOdjela)
VALUES
  ('Hitna služba', 'Prizemlje', NULL),
  ('Kirurgija', '1. kat', NULL),
  ('Kardiologija', '2. kat', NULL);

INSERT INTO dobavljac (imeTvrtke, mail, adresa, idMjesto)
VALUES
  ('Medikro', 'info@medikro.hr', 'Horvaćanska 122', 1),
  ('PharmaMax', 'contact@pharmamax.hr', 'Ul. D. rata 55', 2),
  ('SanFarm', 'prodaja@sanfarm.hr', 'Trg bana J. 7', 3);


INSERT INTO materijal (naziv, brand, namjena)
VALUES
  ('Kirurški konci', 'MedKon', 'kirurški'),
  ('Gaza sterilna', 'MedGaza', 'potrošni'),
  ('EKG elektrode', 'CardioPro', 'farmaceutski'),
  ('Kanile', 'IntraSure', 'intravenozni priključak'),
  ('Šprice 5ml', 'NeedleSafe', 'potrošni'),
  ('Kateter', 'CathPro', 'intravenozni priključak'),
  ('Kirurški odijelo', 'MediWear', 'zaštitna oprema'),
  ('Anesteziološka maska', 'Respira', 'anestezija'),
  ('Infuzijski set', 'MedFlow', 'intravenozni priključak');

INSERT INTO korisnik (ime, prezime, oib, uloga, idOdjel)
VALUES
  ('Ana', 'Anić', '12345678901', 'voditelj', 1),
  ('Ivo', 'Ivić', '23456789012', 'medicinskoOsoblje', 1),
  ('Marko', 'Marić', '34567890123', 'administrator', NULL),
  ('Ivana', 'Ilić', '45678901234', 'medicinskoOsoblje', 2),
  ('Mia', 'Horvat', '56789012345', 'voditelj', 3),
  ('Luka', 'Perić',  '67890123456', 'medicinsko osoblje', 1),
  ('Ema',  'Kovač',  '78901234567', 'voditelj', 2),
  ('Tomislav', 'Jurić', '89012345678', 'administrator', NULL),
  ('Karla', 'Novak',  '90123456789', 'medicinsko osoblje', 3),
  ('Marija', 'Babić', '91234567890', 'administrator', NULL);


UPDATE odjel
SET idVoditeljOdjela = (SELECT idKorisnik 
                        FROM korisnik 
                        WHERE ime='Ana' AND prezime='Anić')
WHERE imeOdjela='Hitna služba';

UPDATE odjel
SET idVoditeljOdjela = (SELECT idKorisnik
                        FROM korisnik
                        WHERE ime='Mia' AND prezime='Horvat')
WHERE imeOdjela='Kardiologija';

UPDATE odjel 
SET idvoditeljodjela = (
			SELECT idkorisnik 
			FROM korisnik 
			WHERE oib = '78901234567')
WHERE imeodjela = 'Kirurgija';


INSERT INTO zalihaPotrosnogMaterijala (idOdjel, idMaterijal, kolicina, minimalnaDozvoljenaKolicina)
VALUES
  (1, 1, 10, 2),  
  (1, 2, 50, 10), 
  (2, 2, 30, 5),  
  (3, 3, 20, 5),  
  (3, 4, 15, 3),
  (1, 5, 40, 10),  
  (1, 7, 5, 1),    
  (1, 9, 10, 2),  
  (2, 5, 20, 5),   
  (2, 6, 15, 3),   
  (2, 7, 10, 2),   
  (3, 8, 10, 2),   
  (3, 9, 8, 2);   

INSERT INTO narudzba 
  (brojNarudzbe, datumNarudzbe, status, idDobavljac, ukupnaCijena)
VALUES
  ('NAR-1001', '2025-01-15', 'naručeno', 1, 150.00),
  ('NAR-1002', '2025-01-16', 'dostavljeno', 2, 300.00);


INSERT INTO stavkaNarudzbe (idNarudzba, idMaterijal, kolicina, jedinicnaCijena)
VALUES
  (1, 1, 10, 15.00),  
  (1, 2, 20, 1.50),   
  (2, 3, 50, 2.00),   
  (2, 4, 30, 3.50);   

INSERT INTO korisnik (ime, prezime, oib, uloga, idOdjel)
VALUES
  ('Marko', 'Marković', '6570384580', 'voditelj', NULL),
  ('Tihana', 'Tihić', '56789712345', 'voditelj', NULL),
  ('Dario', 'Darović', '67810123456', 'voditelj', NULL),
  ('Sara', 'Sarić',  '78901294567', 'voditelj', NULL);