import { render, screen } from '@testing-library/react';

import Home from '@/pages/index';

describe('Home', () => {
    it("should render Home page correctly", () => {
        render(<Home />);
        const element = screen.getByRole("heading", {
            level: 1
        });
        expect(element).toBeInTheDocument();
    });

    it("should disable the 'Calculate distances' button at the start", () => {
        render(<Home />);
        const buttonElement = screen.getByRole("button", {
            name: /Calculate distances/i
        });
        expect(buttonElement).toHaveAttribute('disabled')
    });
})