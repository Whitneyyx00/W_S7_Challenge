import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Sprint 7 Challenge Learner Tests', () => {
  function sum(a, b) {
    a = Number(a);
    b = Number(b);
    if (isNaN(a) || isNaN(b)) {
      throw new Error('pass valid numbers');
    }
    return a + b
  }

  it('should throw an error when no arguments are passed to sum()', () => {
    expect(() => sum()).toThrow('pass valid numbers');
  });

  it('should throw an error when non-numeric arguments are passed to sum()', () => {
    expect(() => sum(2, 'seven')).toThrow('pass valid numbers');
  });

  it('should return the correct sum when valid numeric arguments are passed', () => {
    expect(sum(1, 3)).toBe(4);
  });

  it('should handle string numeric arguments and return the correct sum', () => {
    expect(sum('1', 2)).toBe(3);
    expect(sum('10', 3)).toBe(13);
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
  it('renders links in HelloWorld component', () => {
    render(<HelloWorld />);

    expect(screen.queryByText('Home')).toBeInTheDocument();
    expect(screen.queryByText('About')).toBeInTheDocument();
    expect(screen.queryByText('Blog')).toBeInTheDocument();
    expect(screen.queryByText('The Truth')).toBeInTheDocument();
    expect(screen.queryByText('JavaScript is pretty awesome')).toBeInTheDocument();
    expect(screen.queryByText(/javaScript is pretty/i)).toBeInTheDocument();
  });
});

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
