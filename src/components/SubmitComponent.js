"use client"
import React, { useState } from 'react';
import axios from 'axios';
import OpenAI from 'openai';
import Airtable from 'airtable';


const SubmitComponent = ({ questions }) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [generatedText, setGeneratedText] = useState('');
  const base = new Airtable({apiKey:AIRTABLE_API_KEY}).base(BASE_ID)

  const handleOptionSelect = (questionId, option) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [questionId]: option,
    }));
  };

  const handleSubmit = async () => {
    const selectedOptionsArray = Object.values(selectedOptions);
    console.log('Selected Options Array:', selectedOptionsArray);

    const pairedOptions = questions.map((question, index) => ({
      selected: selectedOptionsArray[index],
      notSelected: getUnselectedOptions(question.id)[0], // Assuming only 2 options per question
    }));

    const prompt = `For context, in Avatar the Last Airbender, there are four elements which 
      people can "bend", or control. The four elements are water, earth, fire, and air. The
      four elements each correspond to character traits within a person, which I will provide below:
      Earth Benders are patient, stubborn, grounded, and strong-willed. Fire benders are prideful, 
      passionate, determined, and loyal. Air benders are gentle, creative, playful, and quick thinkers. 
      Water benders are calm, collected, flexible, and content.
      If someone identifies themselves as more ${pairedOptions
      .map(({ selected, notSelected }) => `${selected} than ${notSelected}`)
      .join(', ')}, what 'bender' are they the most similar to? Water, Earth, Fire, or Air?`;
    console.log('Prompt:', prompt); 

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/davinci/completions',
        {
          prompt: prompt,
          max_tokens: 500,
        },
        {
          headers: {
            Authorization: `Bearer ${configuration.apiKey}`,
          },
        }
      );

      console.log(response);
      const generatedText = response.data.choices[0].text.trim().split('\n');
      console.log(generatedText);
      setGeneratedText(generatedText);
    } catch (error) {
      console.error('Error generating GPT response:', error);
    }
  };

  const getUnselectedOptions = (questionId) => {
    const selectedOption = selectedOptions[questionId];
    const options = questions.find((question) => question.id === questionId)?.options || [];
    return options.filter((option) => option !== selectedOption);
  };

  return (
    <div>
      {questions.map((question) => (
        <div key={question.id}>
          <h2>{question.question}</h2>
          <div>
            {question.options.map((option) => (
              <button
                key={option}
                style={{
                  // Add your button styles here
                }}
                onClick={() => handleOptionSelect(question.id, option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
      {/* Render the rest of the components based on state */}
    </div>
  );
};

export default SubmitComponent;