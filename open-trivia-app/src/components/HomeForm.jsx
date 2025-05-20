import React, { useState, useEffect } from 'react';
import styles from './HomeForm.module.css';

const HomeForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        category: '',
        difficulty: '',
        numQuestions: 10
    });
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([
        { value: '', label: 'Loading categories...' }
    ]);

    useEffect(() => {
        fetch('https://opentdb.com/api_category.php')
            .then(res => res.json())
            .then(data => {
                setCategories([
                    { value: '', label: 'Select a category' },
                    { value: 'all', label: 'All Categories' },
                    ...data.trivia_categories.map(cat => ({
                        value: cat.id,
                        label: cat.name
                    }))
                ]);
            })
            .catch(() => {
                setCategories([
                    { value: '', label: 'Failed to load categories' }
                ]);
            });
    }, []);

    const difficulties = [
        { value: '', label: 'Select difficulty' },
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.category || !formData.difficulty) {
            setError('All fields are required.');
            return;
        }
        setError('');
        onSubmit(formData);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Welcome to the Trivia Quiz!</h1>
            <h2 className={styles.subheading}>Get ready to test your knowledge!</h2>
            <p>Please fill out the form below to get started.</p>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div>
                    <label className={styles.label}>
                        First Name:
                        <input
                            className={styles.input}
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div>
                    <label className={styles.label}>
                        Category:
                        <select
                            className={styles.select}
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            {categories.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label className={styles.label}>
                        Difficulty:
                        <select
                            className={styles.select}
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                        >
                            {difficulties.map((diff) => (
                                <option key={diff.value} value={diff.value}>
                                    {diff.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label className={styles.label}>
                        Number of Questions:
                        <input
                            className={styles.input}
                            type="number"
                            name="numQuestions"
                            min="10"
                            value={formData.numQuestions}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <button className={styles.button} type="submit">Get Question</button>
            </form>
        </div>
    );
};

export default HomeForm;