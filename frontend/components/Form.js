import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';

// 👇 Here you will create your schema.
const validationSchema = Yup.object().shape({
  fullName: Yup.string().trim().min(3, 'full name must be at least 3 characters').required('full name is required'),
  size: Yup.string().oneOf(['S', 'M', 'L'], 'size must be S or M or L').required('size is required'),
  toppings: Yup.array().of(Yup.number().oneOf([1, 2, 3, 4, 5]))
});

const initialValues = {
  fullName: '',
  size: '',
  toppings: []
};

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

export default function PizzaOrderForm() {
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormValues(prev => ({
        ...prev,
        toppings: checked
          ? [...prev.toppings, Number(value)]
          : prev.toppings.filter(topping => topping !== Number(value))
      }));
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    try {
      validationSchema.validateSyncAt(name, formValues);
      setErrors(prev => ({ ...prev, [name]: err.message }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    try {
       validationSchema.validateSync(formValues, { abortEarly: false });
      setSuccessMessage(`Thank you for your order, ${formValues.fullName}!`);
      setFormValues(initialValues);
    } catch (err) {
      if (err.name === 'ValidationError') {
        const newErrors = {};
        err.inner.forEach(error => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      } else {
        console.error('API Error:', err);
      }
    }
  };

  const isFormValid = () => {
    return formValues.fullName.trim().length >= 3 && ['S', 'M', 'L'].includes(formValues.size);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      <div>
        <label htmlFor="fullName">Full Name:</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formValues.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.fullName && <p className="error">{errors.fullName}</p>}
      </div>

      <div>
        <label htmlFor="size">Size:</label>
        <select
          id="size"
          name="size"
          value={formValues.size}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="">Select a size</option>
          <option value="S">Small</option>
          <option value="M">Medium</option>
          <option value="L">Large</option>
        </select>
        {errors.size && <p className="error">{errors.size}</p>}
      </div>

      <div>
        <p>Toppings:</p>
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input
              type="checkbox"
              name="toppings"
              value={topping.topping_id}
              checked={formValues.toppings.includes(Number(topping.topping_id))}
              onChange={handleChange}
            />
            {topping.text}
          </label>
        ))}
      </div>

      <button type="submit" disabled={!isFormValid()} data-testid="submit-button">Order Pizza</button>

      {successMessage && <p>{successMessage}</p>}
    </form>
  );
}
