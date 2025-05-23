import '@testing-library/jest-dom'
import { render, screen, fireEvent } from "@testing-library/react"
import { ConsumablesTable, type Consumable } from "@/components/consumables-table"

describe("ConsumablesTable Unit Tests", () => {
  const mockConsumables: Consumable[] = [
    {
      idMaterijal: "C101",
      naziv: "Sterilne rukavice",
      brand: "MediGlove",
      namjena: "Pregled",
      kolicina: 150,
      minimalnaDozvoljenaKolicina: 50,
    },
    {
      idMaterijal: "C102",
      naziv: "EKG elektrode",
      brand: "CardioTech",
      namjena: "Dijagnostika",
      kolicina: 75,
      minimalnaDozvoljenaKolicina: 30,
    },
    {
      idMaterijal: "C103",
      naziv: "Šprice",
      brand: "MediJect",
      namjena: "Terapija",
      kolicina: 200,
      minimalnaDozvoljenaKolicina: 100,
    },
  ]

  const mockEditConsumable = jest.fn()
  const mockDeleteConsumable = jest.fn()
  const mockCreateConsumable = jest.fn()

  test("should render all consumables when no search query is provided", () => {
    render(
      <ConsumablesTable
        departmentId="1"
        consumables={mockConsumables}
        onEditConsumable={mockEditConsumable}
        onDeleteConsumable={mockDeleteConsumable}
        onCreateConsumable={mockCreateConsumable}
      />,
    )

    expect(screen.getByText("Sterilne rukavice")).toBeInTheDocument()
    expect(screen.getByText("EKG elektrode")).toBeInTheDocument()
    expect(screen.getByText("Šprice")).toBeInTheDocument()
  })

  test("should filter consumables based on search query", () => {
    render(
      <ConsumablesTable
        departmentId="1"
        consumables={mockConsumables}
        onEditConsumable={mockEditConsumable}
        onDeleteConsumable={mockDeleteConsumable}
        onCreateConsumable={mockCreateConsumable}
      />,
    )

    const searchInput = screen.getByPlaceholderText("Search consumables...")
    fireEvent.change(searchInput, { target: { value: "EKG" } })

    expect(screen.getByText("EKG elektrode")).toBeInTheDocument()
    expect(screen.queryByText("Sterilne rukavice")).not.toBeInTheDocument()
    expect(screen.queryByText("Šprice")).not.toBeInTheDocument()
  })

  test("should call onDeleteConsumable when delete button is clicked and confirmed", () => {
    const confirmMock = jest.fn().mockReturnValue(true)
    global.confirm = confirmMock

    render(
      <ConsumablesTable
        departmentId="1"
        consumables={mockConsumables}
        onEditConsumable={mockEditConsumable}
        onDeleteConsumable={mockDeleteConsumable}
        onCreateConsumable={mockCreateConsumable}
      />,
    )

    const deleteButtons = screen.getAllByRole("button", { name: "" }) 
    const firstDeleteButton = deleteButtons.find((button) => button.classList.contains("text-red-500"))
    fireEvent.click(firstDeleteButton!)

    expect(confirmMock).toHaveBeenCalledWith("Are you sure you want to delete this consumable?")
    expect(mockDeleteConsumable).toHaveBeenCalledWith("C101") 
  })

  test("should display 'No consumables found' message when there are no consumables", () => {
    render(
      <ConsumablesTable
        departmentId="1"
        consumables={[]}
        onEditConsumable={mockEditConsumable}
        onDeleteConsumable={mockDeleteConsumable}
        onCreateConsumable={mockCreateConsumable}
      />,
    )

    expect(screen.getByText("No consumables found for this department.")).toBeInTheDocument()
  })
})
