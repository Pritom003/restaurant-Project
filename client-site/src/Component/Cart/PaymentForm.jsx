import  { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentForm = ({ totalPrice, handleOrderCompletion }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { data } = await axios.post('http://localhost:3000/api/create-payment-intent', { totalPrice });
        const clientSecret = data.clientSecret;

        const cardElement = elements.getElement(CardElement);

        const paymentResult = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });

 // Handle errors or successful payment
 if (paymentResult.error) {
    setError(paymentResult.error.message);
} else if (paymentResult.paymentIntent.status === 'succeeded') {
    handleOrderCompletion(paymentResult.paymentIntent); // Pass the paymentIntent to handleOrderCompletion
}
};


    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe}>Pay</button>
            {error && <div>{error}</div>}
        </form>
    );
};

export default PaymentForm;
