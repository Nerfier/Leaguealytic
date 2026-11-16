import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import type { Player } from "../types.ts";
import useFetch from "../hooks/useFetch.ts";

const MIN_LENGTH = 2;

export default function SearchBox() {
    const [inputText, setInputText] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [debouncedQuery, setDebouncedQuery] = useState<string>("");
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const navigate = useNavigate();

    const namePart = inputText.includes("#") ? "" : inputText;

    useEffect(() => {
        const t = setTimeout(() => setDebouncedQuery(namePart.trim()), 50);
        return () => clearTimeout(t);
    }, [namePart]);

    const url = debouncedQuery.length >= MIN_LENGTH
        ? `/api/players/suggest?q=${encodeURIComponent(debouncedQuery)}`
        : null;

    const { data , dataUrl } = useFetch<Player[]>(url);
   
    useEffect(() => {
        console.log("SearchBox mounted");
        return () => console.log("SearchBox unmounted");
    }, []);
    
    const dataQuery = dataUrl
        ? new URL(dataUrl, window.location.origin).searchParams.get("q") ?? ""
        : "";

    const live = namePart.trim().toLowerCase();
    const related =
        live.startsWith(dataQuery.toLocaleLowerCase()) ||
        dataQuery.toLocaleLowerCase().startsWith(live);
    const suggestions = live.length >= MIN_LENGTH && related
        ? (data ?? []).filter(p => p.game_name.toLowerCase().startsWith(live))
        : [];
    const showList = open && suggestions.length > 0;

    console.log({ open, data, count: suggestions.length });  // in the component body

    const searchPlayer = (name: string, tag: string) => {
        setError(null);
        setInputText("");
        setOpen(false);
        setActiveIndex(-1);
        
        navigate(
            `player/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`
        );
    }

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
        const tag = trimmed.slice(idx + 1);

        if (!name || !tag) setError("Missing name or tag");
        else searchPlayer(name, tag);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showList) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setActiveIndex(i => (i + 1) % suggestions.length);
                break;
            case "ArrowUp":
                e.preventDefault();
                setActiveIndex(i => (i <= 0 ? suggestions.length - 1 : i - 1));
                break;
            case "Enter":
                if (activeIndex >= 0) {
                    e.preventDefault();
                    const s: Player | undefined = suggestions[activeIndex];
                    if (!s) break;
                    searchPlayer(s.game_name, s.tag_line);
                }
                break;
            case "Escape":
                setOpen(false);
                break;
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div style={{ position: "relative", display: "inline-block"}}>
                <input
                    type="text"
                    value={inputText}
                    onChange={e => {
                        setInputText(e.target.value);
                        setOpen(true);
                        setActiveIndex(-1);
                        if (error) setError(null);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setOpen(true)}
                    onBlur={() => {
                        setOpen(false);
                        console.log("onblur")
                    }}
                    placeholder="Name#Tag"
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={showList}
                    aria-controls="player-suggestions"
                    aria-autocomplete="list"
                    aria-activedescendant={
                        activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined
                    }
                    aria-invalid={!!error}
                    aria-describedby={error ? "riot-id-error" : undefined}
                />

                {showList && (
                    <ul
                        id="player-suggestions"
                        role="listbox"
                        style={{ 
                            position: "absolute"
                        }}
                    >
                        {suggestions.map((s, i) => (
                            <li
                                key={`${s.game_name}#${s.tag_line}`}
                                id={`suggestion-${i}`}
                                role="option"
                                aria-selected={i === activeIndex}
                                // OnMouseDown fires before onBlur
                                onMouseDown={e => {
                                    e.preventDefault();
                                    searchPlayer(s.game_name, s.tag_line);
                                }}
                                onMouseEnter={() => setActiveIndex(i)}
                                style={{
                                    background: i === 
                                        activeIndex ? "#eef3ff" : "transparent",
                                    cursor: "default",
                                }}
                                

                            >
                                {s.game_name}#{s.tag_line}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button type="submit">Search</button>
            {error && (
                <p 
                    id="riot-id-error" 
                    role="alert"
                    style={{
                        color: "crimson",
                        fontSize: "0.875rem"
                    }}
                >
                    {error}
                </p>
            )}
        </form>
    );
}