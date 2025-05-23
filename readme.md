## Upute za instalaciju

1. Kreirajte PostgreSQL bazu podataka i izvršite skriptu `create-db.sql`, koja će generirati tablice i popuniti ih podacima.

2. U datoteci `db.js` unutar direktorija `backend` potrebno je postaviti podatke za povezivanje na kreiranu bazu podataka:
   - `host`
   - `port`
   - `user`
   - `password`
   - `database`

3. U direktorijima `backend` i `fe` potrebno je u terminalu izvršiti:

   - `backend`:
     ```bash
     npm install
     ```
   - `fe`:
     ```bash
     npm install
     ```

4. Pokrenite aplikaciju:

   - U direktoriju `backend`:
     ```bash
     npm start
     ```
   - U direktoriju `fe`:
     ```bash
     npm run dev
     ```


5. Pokretanje testova:
   - U oba direktorija (`backend` i `fe`) testove možete pokrenuti s:
     ```bash
     npx jest
     ```
