import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';

const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L',
};

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong)
    .required('full name must be at least 3 characters'),
  size: Yup.string()
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect)
    .required('size is required'),
  toppings: Yup.array().of(Yup.number()).required(),
});

const initialValues =  {
  fullName: '',
  size: '',
  toppings: []
};

const initialErrors = {
  fullName: '',
  size: '',
};

const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

export default function Form() {
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);
  const [successMessage, setSuccessMessage] = useState('');
  const [failureMessage, setFailureMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const validateForm = async () => {
      try {
        await validationSchema.validate(formValues, { abortEarly: false });
        setIsSubmitting(true);
        setIsFormValid(true);
      } catch (err) {
        setIsSubmitting(false);
        setIsFormValid(false);
      }
    };
    validateForm();
  }, [formValues]);

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const payload = {
      fullName: formValues.fullName,
      size: formValues.size,
      toppings: formValues.toppings,
    };

    try {
      await validationSchema.validate(formValues, { abortEarly: false });
      const response = await axios.post('http://localhost:9009/api/order', payload);
      const { message } = response.data;
      setSuccessMessage(message);
      setFailureMessage('');
      setFormValues(initialValues);
      setErrors(initialErrors); // Reset errors to intital state after successful submission
    } catch (error) {
      if (error.inner) {
        const newErrors = error.inner.reduce((acc, err) => {
          acc[err.path] = err.message;
          return acc;
        }, {});
        setErrors(newErrors);
      } else {
        setFailureMessage('Failed to place order. Please try again.');
        setSuccessMessage('');
      }
    }
  };

  const handleChange = async (evt) => {
    const { type, checked, name, value } = evt.target;
    const toppingId = toppings.find((topping) => topping.text === name)?.topping_id;

    if (type === 'checkbox') {
      setFormValues((prevFormValues) => {
        const updatedToppings = checked
          ? [...prevFormValues.toppings, toppingId]
          : prevFormValues.toppings.filter((id) => id !== toppingId);

        return { ...prevFormValues, toppings: updatedToppings };
      });
    } else {
      const trimmedValue = value.trim(); // Trim the input value
      setFormValues((prevFormValues) => ({ ...prevFormValues, [name]: trimmedValue }));

      try {
        // Validate individual form field value
        Yup.reach(validationSchema, name)
          .validate(value);
          then(() => setErrors((prevErrors) => ({ ...prevErrors, [name]: err.message })))
          .catch((err) => setErrors((prevErrors) => ({ ...prevErrors, [name]: err.message })));
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {successMessage && <div className='success'>{successMessage}</div>}
      {failureMessage && <div className='failure'>{failureMessage}</div>}

    <div className="input-group">
      <div>
        <label htmlFor="fullName">Full Name</label>
        <input
          value={formValues.fullName} // Value for fullName
          name="fullName" // Name attribute for fullName
          onChange={handleChange} // Change handler for fullName
          placeholder="Type full name"
          id="fullName"
          type="text"
        />
        {errors.fullName && <div className="error">{errors.fullName}</div>} {/* Display validation error for fullName */}
      </div>
    </div>
    
    <div className="input-group">
      <div>
        <label htmlFor="size">Size</label>
        <select
          name="size"
          onChange={handleChange}
          value={formValues.size}
          id="size"
        >
          <option value="">----Choose Size----</option>
          <option value="S">Small</option>
          <option value="M">Medium</option>
          <option value="L">Large</option>
        </select>
        {errors.size && <div className="error">{errors.size}</div>}
      </div>
    </div>
  
      <div className="input-group">
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input
              type="checkbox"
              name={topping.text}
              checked={formValues.toppings.includes(topping.topping_id)}
              onChange={handleChange}
            />
            {topping.text}<br />
            </label>
        ))}
      </div>
  
      <input disabled={!isFormValid} type="submit" data-testid="submit-button" value={isSubmitting ? 'Submitting...' : 'Order Pizza'} />
    </form>
  );
}
