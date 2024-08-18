import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import axios from 'axios';

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.
const validationSchema = Yup.object().shape({
  fullName: Yup.string().trim().min(3).max(20).required('Full name is required'),
  size: Yup.string().oneOf(['S', 'M', 'L'], 'Invalid size').required('Size is required'),
  toppings: Yup.array().of(yup.number().oneOf([1, 2, 3, 4, 5]))
});

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

export default function PizzaOrderForm() {
  const [formStatus, setFormStatus] = useState(null); // Track form submission status
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    try {
      await schema.validate(formValues, { abortEarly: false });
      const response = await axios.post('http://localhost:9009/api/order', formValues);
      setSuccessMessage(response.data.message);
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

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label for="fullName">Full Name:</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formValues.fullName}
          onChange={handleChange}
        />
        {errors.fullName && <p>{errors.fullName}</p>}
      </div>

      <div>
        <label for="size">Size:</label>
        <select
          id="size"
          name="size"
          value={formValues.size}
          onChange={handleChange}
        >
          <option value="">Select a size</option>
          <option value="S">Small</option>
          <option value="M">Medium</option>
          <option value="L">Large</option>
        </select>
        {errors.size && <p>{errors.size}</p>}
      </div>

      <div>
        <p>Toppings:</p>
        {['Pepperoni', 'Green Peppers', 'Pineapple', 'Mushrooms', 'Ham'].map((topping, index) => (
          <label key={index}>
            <input
             type="checkbox"
             name="toppings"
             value={index + 1}
             checked={formValues.toppings.includes(index + 1)}
             onChange={handleChange}
            />
          </label>
        ))}
      </div>

      <input type="submit" value="Order Pizza" />

      {successMessage && <p>{successMessage}</p>}
    </form>
  );
};
