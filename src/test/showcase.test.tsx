import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createMemoryRouter, RouterProvider } from "react-router"
import { describe, expect, it } from "vitest"
import { routes } from "@/router"

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

describe("Showcase", () => {
  it("rend le titre 'Showcase'", () => {
    renderAt("/showcase")
    expect(screen.getByRole("heading", { level: 1, name: "Showcase" })).toBeInTheDocument()
  })

  it("toggle theme bascule la classe 'dark' sur <html>", async () => {
    const user = userEvent.setup()
    renderAt("/showcase")

    expect(document.documentElement.classList.contains("dark")).toBe(false)

    await user.click(screen.getByRole("button", { name: /^theme: light$/ }))
    expect(document.documentElement.classList.contains("dark")).toBe(true)

    await user.click(screen.getByRole("button", { name: /^theme: dark$/ }))
    expect(document.documentElement.classList.contains("dark")).toBe(false)
  })
})
