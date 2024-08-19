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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setErrors(prev => ({ ...prev, [name]: '' }));
    } catch (err) {
      setErrors(prev => ({ ...prev, [name]: err.message }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      await validationSchema.validate(formValues, { abortEarly: false });

      // Axios integration
      const response = await axios.post('https://localhost:9009/order', formValues);

      setSuccessMessage(`Thank you for your order, ${formValues.fullName}! Order ID: ${response.data.orderId}`);
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
        setErrors({ api: 'An error occured while submitting your order. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return formValues.fullName.trim().length >= 3 && ['S', 'M', 'L'].includes(formValues.size);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Order Your Pizza</h2>

    <fieldset>
      <div>
        <legend htmlFor="fullName">Full Name:</legend>
        <input
          type="text"
          id="fullName"
          name="fullName"
          placeholder="Type full name"
          value={formValues.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={errors.fullName ? "true" : "false"}
          aria-describedby="fullNameError"
        />
        {errors.fullName && <p id="fullNameError" className="error">{errors.fullName}</p>}
      </div>
    </fieldset>
    <br />
    <fieldset>
      <div>
        <legend htmlFor="size">Size:</legend>
        <select
          id="size"
          name="size"
          value={formValues.size}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={errors.size ? "true" : "false"}
          aria-describedby="sizeError"
        >
          <option value="">----Choose Size----</option>
          <option value="S">Small</option>
          <option value="M">Medium</option>
          <option value="L">Large</option>
        </select>
        {errors.size && <p id="sizeError" className="error">{errors.size}</p>}
      </div>
    </fieldset>
    <br />
      <fieldset>
        {toppings.map((topping) => (
          <div key={topping.topping_id}>
            <input
              type="checkbox"
              id={`topping-${topping.topping_id}`}
              name="toppings"
              value={topping.topping_id}
              checked={formValues.toppings.includes(Number(topping.topping_id))}
              onChange={handleChange}
            />
            <label htmlFor={`topping-${topping.topping_id}`}>{topping.text}</label>
          </div>
        ))}
      </fieldset>
      <br />
      <button type="submit" disabled={!isFormValid() || isSubmitting} data-testid="submit-button">{isSubmitting ? 'Ordering...' : 'Order Pizza'}</button>

      {successMessage && <p className="success">{successMessage}</p>}
      {errors.api && <p className="error">{errors.api}</p>}
    </form>
  );
}
