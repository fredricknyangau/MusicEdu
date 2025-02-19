import React from 'react';
import '../styles/Contact.css';

const Contact = () => {
    return (
        <div className="contact-page">
            <h1>Contact Us</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message:</label>
                    <textarea id="message" name="message" rows="5" required></textarea>
                </div>
                <button type="submit" className="submit-button">Send Message</button>
            </form>
        </div>
    );
};

export default Contact;
