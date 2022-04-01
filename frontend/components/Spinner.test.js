// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react'
import Spinner from './Spinner'
import "@testing-library/jest-dom/extend-expect"
import { render, screen } from '@testing-library/react'

test('sanity', () => {
  expect(true).toBe(true)
})

test('When you pass in a true boolean, the spinner appears', () => {
  render(<Spinner on={true}/>)
  const styledSpinner = screen.queryByText(/Please wait/i)
  expect(styledSpinner).toBeVisible();
});

test('When you pass in a false boolean, the spinner appears', () => {
  render(<Spinner on={false}/>)
  const styledSpinner = screen.queryByText(/Please wait/i)
  expect(styledSpinner).not.toBeInTheDocument();
});
