jest.mock("./db", () => ({
  query: jest.fn(),
}));

const db = require("./db");
const queries = require("./queries");

describe("Queries: getUsers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call db.query with correct SQL", async () => {
    db.query.mockResolvedValue({ rows: [] });

    await queries.getUsers();

    expect(db.query).toHaveBeenCalledWith(
      "SELECT idkorisnik, ime, prezime, oib, uloga FROM korisnik"
    );
  });
});
