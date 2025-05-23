jest.mock("../models/db", () => ({
  query: jest.fn(),
}));

jest.mock("../models/queries", () => ({
  isManagerAssignedToAnotherDepartment: jest.fn(),
  addDepartment: jest.fn(),
}));

const { createDepartment } = require("../controllers/controllers");
const queries = require("../models/queries");

describe("Integration: createDepartment", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        imeOdjela: "Kardiologija",
        kriloBolnice: "B",
        idVoditeljOdjela: "1",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should create department if manager is available", async () => {
    queries.isManagerAssignedToAnotherDepartment.mockResolvedValue({
      rows: [],
    });
    queries.addDepartment.mockResolvedValue({
      rows: [
        {
          idodjel: 10,
          imeodjela: "Kardiologija",
          krilobolnice: "B",
          idvoditeljodjela: 1,
        },
      ],
    });

    await createDepartment(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      idOdjel: "10",
      imeOdjela: "Kardiologija",
      kriloBolnice: "B",
      idVoditeljOdjela: "1",
    });
  });

  it("should return 400 if manager already leads another department", async () => {
    queries.isManagerAssignedToAnotherDepartment.mockResolvedValue({
      rows: [{ dummy: true }],
    });

    await createDepartment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Manager already leads another department",
    });
  });
});
