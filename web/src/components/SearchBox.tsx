import React, { useState } from "react";
import { useNavigate } from "react-router";


export default function SearchBox() {
    const [inputText, setInputText] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!inputText) return;

        const trimmed = inputText.trim();
        const idx = trimmed.lastIndexOf("#");

        if (idx === -1) {
            setError("Enter a riot id like Name#Tag");
            return;
        }

        const name = trimmed.slice(0, idx).trim();
        const tag = trimmed.slice(idx + 1).trim();

        if (!name || !tag) setError("Missing name or tag")
        else {
            // Clear errors and input field
            setError(null);
            setInputText("");
            navigate(`/player/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <input
                type="text"
                value={inputText}
                onChange={e => {
                    setInputText(e.target.value);
                    if (error) setError(null);
                }}
                placeholder="Name#Tag"
                aria-invalid={!!error}
                aria-describedby={error ? "riot-id-error" : undefined}
            />
            <button type="submit">Search</button>
            {error && (
                <p id="riot-id-error" role="alert" style={{ color: "crimson", fontSize: "0.875rem" }}>
                    {error}
                 </p>
            )}
        </form>
    );
}

