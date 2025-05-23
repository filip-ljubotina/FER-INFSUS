import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { HospitalDashboard } from "@/components/hospital-dashboard";

beforeEach(() => {
  jest.clearAllMocks();
  window.alert = jest.fn();

  global.fetch = jest.fn((url, options) => {
    if (url.endsWith("/odjel") && options?.method === "POST") {
      const requestBody = JSON.parse(options.body as string);
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            idOdjel: "6", 
            imeOdjela: requestBody.imeOdjela,
            kriloBolnice: requestBody.kriloBolnice,
            idVoditeljOdjela: requestBody.idVoditeljOdjela,
          }),
      });
    }
    if (url.endsWith("/odjel") && (!options || options.method === "GET")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              idOdjel: "1",
              imeOdjela: "Kardiologija",
              kriloBolnice: "A",
              idVoditeljOdjela: "101",
            },
            {
              idOdjel: "2",
              imeOdjela: "Neurologija",
              kriloBolnice: "B",
              idVoditeljOdjela: "102",
            },
            {
              idOdjel: "3",
              imeOdjela: "Pedijatrija",
              kriloBolnice: "C",
              idVoditeljOdjela: "103",
            },
            {
              idOdjel: "4",
              imeOdjela: "Ortopedija",
              kriloBolnice: "A",
              idVoditeljOdjela: "104",
            },
            {
              idOdjel: "5",
              imeOdjela: "Onkologija",
              kriloBolnice: "D",
              idVoditeljOdjela: "105",
            },
          ]),
      });
    }

    if (url.endsWith("/korisnici")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: "101",
              ime: "Ana",
              prezime: "Marić",
              oib: "12345678901",
              uloga: "Liječnik",
            },
            {
              id: "102",
              ime: "Ivan",
              prezime: "Kovač",
              oib: "23456789012",
              uloga: "Liječnik",
            },
            {
              id: "103",
              ime: "Marija",
              prezime: "Novak",
              oib: "34567890123",
              uloga: "Liječnik",
            },
            {
              id: "104",
              ime: "Petar",
              prezime: "Horvat",
              oib: "45678901234",
              uloga: "Liječnik",
            },
            {
              id: "105",
              ime: "Josipa",
              prezime: "Jurić",
              oib: "56789012345",
              uloga: "Liječnik",
            },
          ]),
      });
    }

    if (url.endsWith("/materijaliZaOdjel")) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    }

    return Promise.reject(new Error("Unhandled fetch request: " + url));
  }) as jest.Mock;
});

describe("Create Department Integration Tests", () => {
  test("should create a new department and display it in the sidebar", async () => {
    const { container } = render(<HospitalDashboard />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const initialDepartments = screen
      .getAllByRole("button")
      .filter((button) =>
        [
          "Kardiologija",
          "Neurologija",
          "Pedijatrija",
          "Ortopedija",
          "Onkologija",
        ].some((name) => button.textContent?.includes(name))
      );
    expect(initialDepartments.length).toBe(5);

    fireEvent.click(screen.getByText("Create Department"));
    expect(screen.getByText("Create New Department")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Department Name"), {
      target: { value: "Dermatologija" },
    });
    fireEvent.change(screen.getByLabelText("Hospital Wing"), {
      target: { value: "E" },
    });

    fireEvent.click(screen.getByText("Select department head"));
    fireEvent.click(screen.getByText("Ana Marić"));

    fireEvent.click(screen.getByRole("button", { name: "Create" }));
    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith(
        "Department created successfully!"
      )
    );

    await waitFor(() => {
      expect(screen.getByText("Dermatologija")).toBeInTheDocument();
    });
    expect(screen.getByText("Wing E")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Dermatologija"));
    expect(
      screen.getByText("Edit Department: Dermatologija")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Department Name")).toHaveValue(
      "Dermatologija"
    );
    expect(screen.getByLabelText("Hospital Wing")).toHaveValue("E");
  });

  test("should validate required fields when creating a department", async () => {
    render(<HospitalDashboard />);
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Create Department"));
    expect(screen.getByText("Create New Department")).toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: "Create",
    });
    fireEvent.click(submitButton);
    expect(window.alert).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("Department Name"), {
      target: { value: "Dermatologija" },
    });
    fireEvent.click(submitButton);
    expect(window.alert).not.toHaveBeenCalled();
  });

  test("should close the create department dialog when Cancel is clicked", async () => {
    render(<HospitalDashboard />);
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Create Department"));
    expect(screen.getByText("Create New Department")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Department Name"), {
      target: { value: "Test Department" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => {
      expect(
        screen.queryByText("Create New Department")
      ).not.toBeInTheDocument();
    });
    expect(screen.queryByText("Test Department")).not.toBeInTheDocument();
  });
});
