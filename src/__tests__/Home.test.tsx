
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Home', () => {
  it('renders the Jacameno Messaging component', () => {
    render(<Home />)

    const jacamenoMessagingComponent = screen.getByRole('heading', { name: /Welcome to Jacameno Messenger/i })

    expect(jacamenoMessagingComponent).toBeInTheDocument()
  })
})
