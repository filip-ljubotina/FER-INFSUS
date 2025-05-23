const db = require("./db");

module.exports = {
  getUsers: () =>
    db.query("SELECT idkorisnik, ime, prezime, oib, uloga FROM korisnik"),
  isManagerAssignedToAnotherDepartment: (idVoditeljOdjela) =>
    db.query(
      `SELECT 1 FROM odjel WHERE idvoditeljodjela = $1`,
      [idVoditeljOdjela]
    ),
  getDepartmentById: (idOdjel) =>
    db.query(`SELECT idvoditeljodjela FROM odjel WHERE idodjel = $1`, [
      idOdjel,
    ]),

  clearUserDepartment: (idKorisnik) =>
    db.query(`UPDATE korisnik SET idodjel = NULL WHERE idkorisnik = $1`, [
      idKorisnik,
    ]),
  getDepartments: () =>
    db.query(
      "SELECT idodjel, imeodjela, krilobolnice, idvoditeljodjela FROM odjel"
    ),

  addDepartment: (imeOdjela, kriloBolnice, idVoditeljOdjela) =>
    db.query(
      `INSERT INTO odjel (imeodjela, krilobolnice, idvoditeljodjela)
       VALUES ($1, $2, $3) RETURNING *`,
      [imeOdjela, kriloBolnice, idVoditeljOdjela]
    ),

  updateDepartment: (idOdjel, imeOdjela, kriloBolnice, idVoditeljOdjela) =>
    db.query(
      `UPDATE odjel SET imeodjela=$1, krilobolnice=$2, idvoditeljodjela=$3
       WHERE idodjel=$4 RETURNING *`,
      [imeOdjela, kriloBolnice, idVoditeljOdjela, idOdjel]
    ),

  deleteDepartment: async (idOdjela) => {
    await db.query("UPDATE korisnik SET idodjel=NULL WHERE idodjel=$1", [
      idOdjela,
    ]);
    return db.query("DELETE FROM odjel WHERE idodjel=$1", [idOdjela]);
  },

  getMaterialsByDepartment: () =>
    db.query(`SELECT z.idodjel, m.idmaterijal, m.naziv, m.brand, m.namjena,
                     z.kolicina, z.minimalnadozvoljenakolicina
              FROM zalihapotrosnogmaterijala z
              JOIN materijal m ON z.idmaterijal = m.idmaterijal`),

  addConsumableMaterial: async (
    idOdjela,
    naziv,
    brand,
    namjena,
    kolicina,
    minKolicina
  ) => {
    await db.query("BEGIN");

    let res = await db.query(
      `SELECT idmaterijal FROM materijal
       WHERE naziv=$1 AND brand=$2 AND namjena=$3`,
      [naziv, brand, namjena]
    );

    let idMaterijal;
    if (res.rows.length) idMaterijal = res.rows[0].idmaterijal;
    else {
      res = await db.query(
        "INSERT INTO materijal (naziv, brand, namjena) VALUES ($1, $2, $3) RETURNING idmaterijal",
        [naziv, brand, namjena]
      );
      idMaterijal = res.rows[0].idmaterijal;
    }

    const invRes = await db.query(
      `INSERT INTO zalihapotrosnogmaterijala (idodjel, idmaterijal, kolicina, minimalnadozvoljenakolicina)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [idOdjela, idMaterijal, kolicina, minKolicina]
    );

    await db.query("COMMIT");

    return invRes.rows[0];
  },

  updateMaterial: async (
    idMaterijal,
    naziv,
    brand,
    namjena,
    kolicina,
    minKolicina
  ) => {
    await db.query("BEGIN");

    await db.query(
      `UPDATE materijal SET naziv=$1, brand=$2, namjena=$3 WHERE idmaterijal=$4`,
      [naziv, brand, namjena, idMaterijal]
    );

    await db.query(
      `UPDATE zalihapotrosnogmaterijala SET kolicina=$1, minimalnadozvoljenakolicina=$2
       WHERE idmaterijal=$3`,
      [kolicina, minKolicina, idMaterijal]
    );

    await db.query("COMMIT");
  },

  deleteMaterial: (idOdjela, idMaterijala) =>
    db.query(
      "DELETE FROM zalihapotrosnogmaterijala WHERE idodjel=$1 AND idmaterijal=$2",
      [idOdjela, idMaterijala]
    ),
};
