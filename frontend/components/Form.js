import axios from 'axios';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
fullNameTooShort: 'Full name must be at least 3 characters',
fullNameTooLong: 'Full name must be at most 20 characters',
sizeIncorrect: 'Size must be S or M or L'
};

// 👇 Here you will create your schema.
const formSchema = yup.object().shape({
fullName: yup
.string()
.trim()
.min(3, validationErrors.fullNameTooShort)
.max(20, validationErrors.fullNameTooLong),
size: yup
.string()
.trim()
.oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect),
});

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
{ topping_id: '1', text: 'Pepperoni' },
{ topping_id: '2', text: 'Green Peppers' },
{ topping_id: '3', text: 'Pineapple' },
{ topping_id: '4', text: 'Mushrooms' },
{ topping_id: '5', text: 'Ham' },
];


export default function Form() {
const [formValues, setFormValues] = useState({
fullName: '',
size: '',
toppings: Object.fromEntries(toppings.map(topping => [topping.topping_id, false])),
});
const [formErrors, setFormErrors] = useState({});
const [formValid, setFormValid] = useState(false);
const [formSuccess, setFormSuccess] = useState('');
const [formFailure, setFormFailure] = useState('');
const [message, setMessage] = useState()

useEffect(() => {
  formSchema.isValid(formValues).then((isValid) => {
    setFormValid(isValid);
  });
}, [formValues]);
console.log(formValues)
const handleSubmit = (evt) => {
evt.preventDefault();
const newFormValues = {
  ...formValues, 
  toppings: Object.keys(formValues.toppings).filter(toppingId => formValues.toppings[toppingId])
}
axios
  .post('http://localhost:9009/api/order', newFormValues)
  .then((res) => {
    console.log(res.data)
    setMessage(res.data.message)
    setFormSuccess(true)
    setFormValues({fullName: '',
    size: '',
    toppings: Object.fromEntries(toppings.map(topping => [topping.topping_id, false]))})
  })
  .catch((err) => err.message)
    setFormFailure()  
};

const handleChange = (evt, toppingId) => {
  let { type, name, value } = evt.target;
    if (type === "checkbox") {  
      setFormValues({
      ...formValues,
      toppings: { ...formValues.toppings, [toppingId]: !formValues.toppings[toppingId] },
      });
    }
    else {
    setFormValues({ ...formValues, [name]: value });
    // The ".reach()/.validate()" combination allows you to check a single value
    yup
      .reach(formSchema, name)
      .validate(value)
      .then(() => {
        // If value is valid, the corresponding error message will be deleted
        setFormErrors({ ...formErrors, [name]: "" });
      })
      .catch((err) => {
        // If invalid, we update the error message with the text returned by Yup
        // This error message was hard-coded in the schema
        setFormErrors({ ...formErrors, [name]: err.errors[0] });
      });
    }
};

return (
<form onSubmit={handleSubmit}>
<h2>Order Your Pizza</h2>
{formSuccess && <div className='success'>{message}</div>}
{formFailure && <div className='failure'>Something went wrong</div>}

<div className="input-group">
<div>
<label htmlFor="fullName">Full Name</label><br />
<input
placeholder="Type full name"
id="fullName"
name='fullName'
type="text"
value={formValues.fullName}
onChange={(evt) => handleChange(evt)}
/>
</div>
{formErrors.fullName && <div className='error'>{formErrors.fullName}</div>}
</div>

<div className="input-group">
<div>
<label htmlFor="size">Size</label><br />
<select
id="size"
name='size'
value={formValues.size}
onChange={(evt) => handleChange(evt)}
>
{/* Fill out the missing options */}
<option value="">----Choose Size----</option>
<option value="S">Small</option>
<option value="M">Medium</option>
<option value="L">Large</option>
</select>
</div>
{formErrors.size && <div className='error'>{formErrors.size}</div>}
</div>

<div className="input-group">
{/* 👇 Maybe you could generate the checkboxes dynamically */}
{toppings.map(topping => (
<label key={topping.topping_id}>
<input
name={topping.topping_id}
type="checkbox"
checked={formValues.toppings[topping.topping_id] || false}
onChange={(evt) => handleChange(evt, topping.topping_id)}
/>
{topping.text}<br />
</label>
))}
</div>

<input disabled={!formValid} type="submit" />
</form>
);
}