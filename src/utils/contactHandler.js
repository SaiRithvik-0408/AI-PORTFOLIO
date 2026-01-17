import { portfolioData } from '../config';

export const handleContactSubmit = async (formData, setFormStatus, resetForm) => {
    setFormStatus({ type: 'loading', message: 'Sending message...' });

    try {
        const response = await fetch(portfolioData.ui.contactFormEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            setFormStatus({ type: 'success', message: 'Thank you! Your message has been sent.' });
            resetForm();
            setTimeout(() => setFormStatus({ type: '', message: '' }), 5000);
        } else {
            throw new Error('Failed to send');
        }
    } catch (error) {
        setFormStatus({ type: 'error', message: 'Something went wrong. Please try again or use my direct email.' });
    }
};
