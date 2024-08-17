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
const validationSchema = Yup.object({
  fullName: Yup.string()
   .trim()
   .min(3, 'Must be at least 3 characters')
   .max(20, 'Must be 20 characters or less')
   .required('Required'),
  size: Yup.string()
   .oneOf(['S', 'M', 'L'], 'Invalid size')
   .required('Required'),
  toppings: Yup.array(),
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

  // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await axios.post('http://localhost:9009/api/order', values);
      if (response.status === 201) {
        setFormStatus('success');
        resetForm(); // Reset the form on successful submission
      }
    } catch (error) {
      setFormStatus('error');
    }
  };

  return (
    <Formik initialValues={{ fullName: '', size: '', toppings: [], }} validationSchema={validationSchema} onSubmit={Formik.handleSubmit}>
      {({ isValid }) => (
        <FormikForm>
          <h2>Order Your Pizza</h2>
          {formStatus === 'success' && <div className="success">Thank you for your order!</div>}
          {formStatus === 'error' && <div className="failure">Something went wrong</div>}
  
          <div className="input-group">
            <div>
              <label htmlFor="fullName">Full Name</label><br />
              <Field name="fullName" type="text" placeholder="Type full name" id="fullName" />
              <ErrorMessage name="fullName" component="div" className="error" />
            </div>
          </div>
  
          <div className="input-group">
            <div>
              <label htmlFor="size">Size</label><br />
              <Field as="select" name="size" id="size">
                <option value="">----Choose Size----</option>
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
              </Field>
              <ErrorMessage name="size" component="div" className="error" />
            </div>
          </div>
  
          <div className="input-group">
          {/* 👇 Maybe you could generate the checkboxes dynamically */}
            <label>Toppings:</label>
            {toppings.map(topping => (
              <div key={topping.topping_id}>
                <label>
                  <Field type="checkbox" name="toppings" value="1" as="input" />
                  Pepperoni
                </label>
                <label>
                  <Field as="input" type="checkbox" name="toppings" value="2" />
                  Green Peppers
                </label>
                <label>
                  <Field as="input" type="checkbox" name="toppings" value="3" />
                  Pineapple
                </label>
                <label>
                  <Field as="input" type="checkbox" name="toppings" value="4" />
                  Mushrooms
                </label>
                <label>
                  <Field as="input" type="checkbox" name="toppings" value="5" />
                  Ham
                </label>
              </div>
            ))}
        </div>
        {/* 👇 Make sure the submit stays disabled until the form validates! */}
        <input type="submit" disabled={!isValid} value="Order Pizza" />
        {successMessage && <div>{successMessage}</div>}
      </FormikForm>
      )}
    </Formik>
  );
};
