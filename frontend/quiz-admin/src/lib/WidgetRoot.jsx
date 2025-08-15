// src/lib/WidgetRoot.jsx
import React from "react";
// Uses your alias from vite.config ("@" -> "/src")
import QuizListingPage from "../components/QuizListingPage";

/**
* Public widget root. Accepts optional props.
* @param {Object} props
* @param {string} [props.apiBase] Optional backend base URL (e.g. "https://api.example.com").
*/
export default function WidgetRoot(props) {
// You can thread widget props down later if needed (e.g., apiBase)
return <QuizListingPage {...props} />;
}