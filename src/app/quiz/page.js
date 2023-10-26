"use client";

import React from "react";
import { useEffect, useState } from "react";
import Card from "../../components/Card";
import "../style/style.css";

const Page = () => {
  const [processedData, setProcessedData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [generatedText, setGeneratedText] = useState([``]);
  const [submitted, setSubmitted] = useState(false);

  const handleCardSelect = (questionId, option) => {
    setSelectedOptions((prevOptions) => [
      ...prevOptions.filter((item) => item.questionId !== questionId),
      { questionId, option },
    ]);
  };
  const generateGPTResponse = async () => {
    const optionsList = selectedOptions.map((item) => item.option);
    if (optionsList.length !== processedData.length) {
      console.error("Empty or invalid prompt");
      return;
    }
    setSubmitted(true);
    const selectedPrompt = JSON.stringify(optionsList);
    const availableOptions = JSON.stringify(
      processedData.map((item) => [item.One, item.Two])
    );
    setGeneratedText("");
    try {
      const response = await fetch("/api/openAI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedPrompt, availableOptions }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = response.body;
      if (!data) {
        return;
      }
      const reader = data.getReader();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async () => {
    const optionsList = selectedOptions.map((item) => item.option);
    if (optionsList.length !== processedData.length) {
      console.error("Empty or invalid prompt");
      return;
    }
    setSubmitted(true);
    const selectedPrompt = JSON.stringify(optionsList);
    const availableOptions = JSON.stringify(
      processedData.map((item) => [item.One, item.Two])
    );
    try {
      const response = await fetch("api/openAI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedPrompt, availableOptions }),
      });

      if (response.ok) {
        console.log("API request successful!");
        const data = await response.json();
        setGeneratedText(data.result);
      } else {
        console.error("API request failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/airtable");
        if (response.ok) {
          const data = await response.json();
          setProcessedData(data.result.airtableData);
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  if (!submitted) {
    return (
      <body className="container">
        <h1 className="title">Choose your preferences!</h1>
        {processedData.map((record) => (
        <div key={record.id}>
          <Card
            options={record.options}
            selectedOption={selectedOptions.find((item) => item.questionId === record.id)?.option || ''}
            onSelect={(option) => handleCardSelect(record.id, option)}
          />
        </div>
      ))}
        <div style={{ textAlign: "center" }}>
          <button className="button" onClick={generateGPTResponse}>
            Submit
          </button>
        </div>
      </body>
    );
  } else {
      return (
        <div className="container">
          <div>
            <p>{generatedText}</p>
          </div>
        </div>
      );
    }
};

export default Page;