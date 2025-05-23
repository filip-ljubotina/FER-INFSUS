const queries = require("../models/queries");

const mapUser = (row) => ({
  id: row.idkorisnik.toString(),
  ime: row.ime,
  prezime: row.prezime,
  oib: row.oib,
  uloga: row.uloga,
});

const mapDepartment = (row) => ({
  idOdjel: row.idodjel.toString(),
  imeOdjela: row.imeodjela,
  kriloBolnice: row.krilobolnice,
  idVoditeljOdjela:
    row.idvoditeljodjela !== null ? row.idvoditeljodjela.toString() : null,
});

module.exports = {
  fetchUsers: async (req, res) => {
    const { rows } = await queries.getUsers();
    res.json(rows.map(mapUser));
  },

  fetchDepartments: async (req, res) => {
    const { rows } = await queries.getDepartments();
    res.json(rows.map(mapDepartment));
  },
  createDepartment: async (req, res) => {
    try {
      if (req.body.idVoditeljOdjela) {
        const chk = await queries.isManagerAssignedToAnotherDepartment(
          req.body.idVoditeljOdjela
        );
        if (chk.rows.length > 0) {
          return res
            .status(400)
            .json({ error: "Manager already leads another department" });
        }
      }
      const { rows } = await queries.addDepartment(
        req.body.imeOdjela,
        req.body.kriloBolnice,
        req.body.idVoditeljOdjela
      );
      res.status(201).json(mapDepartment(rows[0]));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  updateDepartment: async (req, res) => {
    const { idOdjel, imeOdjela, kriloBolnice, idVoditeljOdjela } = req.body;

    try {
      if (idVoditeljOdjela) {
        const chk = await queries.isManagerAssignedToAnotherDepartment(
          idVoditeljOdjela
        );
        if (chk.rows.length > 0) {
          return res
            .status(400)
            .json({ error: "Manager already leads another department" });
        }
      }

      const current = await queries.getDepartmentById(idOdjel);
      const currentVoditelj = current.rows[0]?.idvoditeljodjela;

      if (
        currentVoditelj &&
        idVoditeljOdjela &&
        currentVoditelj.toString() !== idVoditeljOdjela.toString()
      ) {
        await queries.clearUserDepartment(currentVoditelj);
      }

      const { rows } = await queries.updateDepartment(
        idOdjel,
        imeOdjela,
        kriloBolnice,
        idVoditeljOdjela
      );

      if (!rows.length) {
        return res.status(404).json({ error: "Department not found" });
      }

      res.json(mapDepartment(rows[0]));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  deleteDepartment: async (req, res) => {
    const { idOdjela } = req.query;
    try {
      const result = await queries.deleteDepartment(idOdjela);
      if (result.rowCount) {
        res.json({ message: "Deleted" });
      } else {
        res.status(404).json({ error: "Department not found" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Materials
  fetchMaterialsByDepartment: async (req, res) => {
    const { rows } = await queries.getMaterialsByDepartment();
    const result = {};
    rows.forEach((row) => {
      const odjelId = row.idodjel.toString();
      const item = {
        idMaterijal: row.idmaterijal,
        naziv: row.naziv,
        brand: row.brand,
        namjena: row.namjena,
        kolicina: row.kolicina,
        minimalnaDozvoljenaKolicina: row.minimalnadozvoljenakolicina,
      };

      if (!result[odjelId]) {
        result[odjelId] = [];
      }

      result[odjelId].push(item);
    });
    res.json(result);
  },

  createConsumableMaterial: async (req, res) => {
    const {
      idOdjela,
      naziv,
      brand,
      namjena,
      kolicina,
      minimalnaDozvoljenaKolicina,
    } = req.body;

    try {
      const row = await queries.addConsumableMaterial(
        idOdjela,
        naziv,
        brand,
        namjena,
        kolicina,
        minimalnaDozvoljenaKolicina
      );

      res.status(201).json({
        idMaterijal: row.idmaterijal.toString(),
        naziv,
        brand,
        namjena,
        kolicina,
        minimalnaDozvoljenaKolicina,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateMaterial: async (req, res) => {
    const {
      idMaterijal,
      naziv,
      brand,
      namjena,
      kolicina,
      minimalnaDozvoljenaKolicina,
    } = req.body;

    if (
      !idMaterijal ||
      kolicina == null ||
      minimalnaDozvoljenaKolicina == null
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      await queries.updateMaterial(
        idMaterijal,
        naziv,
        brand,
        namjena,
        kolicina,
        minimalnaDozvoljenaKolicina
      );

      res.json({
        idMaterijal: idMaterijal.toString(),
        naziv,
        brand,
        namjena,
        kolicina,
        minimalnaDozvoljenaKolicina,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteMaterial: async (req, res) => {
    const { idOdjela, idMaterijala } = req.query;
    await queries.deleteMaterial(idOdjela, idMaterijala);
    res.json({ message: "Deleted" });
  },
};
