jest.mock("../models/db", () => ({
  query: jest.fn(),
}));

jest.mock("../models/queries", () => ({
  getUsers: jest.fn(),
}));

const { fetchUsers } = require("../controllers/controllers");
const queries = require("../models/queries");

describe("Controller: fetchUsers", () => {
  it("should return mapped users", async () => {
    const mockUsers = [
      {
        idkorisnik: 1,
        ime: "Ana",
        prezime: "Anić",
        oib: "12345678901",
        uloga: "admin",
      },
    ];
    queries.getUsers.mockResolvedValue({ rows: mockUsers });

    const req = {};
    const res = {
      json: jest.fn(),
    };

    await fetchUsers(req, res);

    expect(res.json).toHaveBeenCalledWith([
      {
        id: "1",
        ime: "Ana",
        prezime: "Anić",
        oib: "12345678901",
        uloga: "admin",
      },
    ]);
  });
});
