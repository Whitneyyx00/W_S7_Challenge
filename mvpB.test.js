import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PizzaOrderForm from '../Form';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

describe('PizzaOrderForm', () => {
 test('renders form elements', () => {
  render(<PizzaOrderForm />);
  expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/size/i)).toBeInTheDocument();
  expect(screen.getByText(/toppings/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /order pizza/i })).toBeInTheDocument();
 });

 test('validates form input', async () => {
  render(<PizzaOrderForm />);
  fireEvent.click(screen.getByRole('button', { name: /order pizza/i }));
  await waitFor(() => {
    expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/size is required/i)).toBeInTheDocument();
  });
 });

 test('submits form successfully', async () => {
  axios.post.mockResolvedValue({ data: { message: 'Order placed successfully!' } });
  render(<PizzaOrderForm />);

  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
  fireEvent.change(screen.getByLabelText(/size/i), { target: { value: 'M' } });
  fireEvent.click(screen.getByLabelText(/pepperoni/i));

  fireEvent.click(screen.getByRole('button', { name: /order pizza/i }));

  await waitFor(() => {
    expect(screen.getByText(/order placed successfully/i)).toBeInTheDocument();
  });
 });

  /*
  👉 TASK 2 - Integration Testing of HelloWorld component at the bottom of this module

  Test the <HelloWorld /> component found below...
    - using `screen.queryByText` to capture nodes
    - using `toBeInTheDocument` to assert their existence in the DOM

    [1] renders a link that reads "Home"
    [2] renders a link that reads "About"
    [3] renders a link that reads "Blog"
    [4] renders a text that reads "The Truth"
    [5] renders a text that reads "JavaScript is pretty awesome"
    [6] renders a text that includes "javaScript is pretty" (use exact = false)
  */
  test('you can comment out this test', () => {
    expect(true).toBe(false)
  });
});

function sum(a, b) {
  a = Number(a)
  b = Number(b)
  if (isNaN(a) || isNaN(b)) {
    throw new Error('pass valid numbers')
  }
  return a + b
}

function HelloWorld() {
  return (
    <div>
      <h1>Hello World Component</h1>
      <nav>
        <a href='#'>Home</a>
        <a href='#'>About</a>
        <a href='#'>Blog</a>
      </nav>
      <main>
        <section>
          <h2>The Truth</h2>
          <p>JavaScript is pretty awesome</p>
        </section>
      </main>
    </div>
  )
}
