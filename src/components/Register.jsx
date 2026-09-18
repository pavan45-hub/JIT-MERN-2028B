import { useState } from "react";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/users/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Registration failed"
                );
            }

            setMessage(
                data.message || "Registration successful!"
            );

            setFormData({
                name: "",
                email: "",
                password: ""
            });

        } catch (error) {
            console.error("Registration Error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="register-page">

            <div className="register-card">

                <div className="register-header">
                    <h1>Create Account</h1>
                    <p>Register to access your student portal</p>
                </div>

                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >

                    <div className="register-field">
                        <label>Name</label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="register-field">
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="register-field">
                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && (
                        <div className="register-error">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="register-success">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

                <div className="register-login">
                    Already have an account?
                    <a href="/login"> Login</a>
                </div>

            </div>

        </div>
    );
}

export default Register;