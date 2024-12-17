import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "./components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AIChatSession } from "./../service/AIModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function App() {
  const [content, setContent] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [question, setQuestion] = useState(null);

  const handleChange = (e) => {
    setContent(e.target.value);
    console.log(content);
  };

  const prompt =
    "generate  summarized bullet points in JSON format to better understand for students the array should be in 'bulletpoint' array. here is the content {content}";

  const questionPrompt =
    "here are some parsed summarized points {aiResponse}. now make 7 questions and answers from the points. The questiona and answer should not be long and should be in JSON format. formating of array should be qa --> question,answer ";

  const GeneratePoints = async () => {
    const PROMPT = prompt.replace("{content}", content);
    const result = await AIChatSession.sendMessage(PROMPT);
    const responseText = result.response.text();
    const parsedResponse = JSON.parse(responseText);
    setAiResponse(parsedResponse);
    console.log(parsedResponse);
  };

  const GenerateQuestions = async () => {
    const Qpromt = questionPrompt.replace("{aiResponse}", aiResponse);
    const Qresult = await AIChatSession.sendMessage(Qpromt);
    const Qreponse = Qresult.response.text();
    const Qparsed = JSON.parse(Qreponse);
    setQuestion(Qparsed);
    console.log(Qparsed);
  };

  return (
    <div className="grid w-full gap-2">
      <label className="font-extrabold text-lg">
        Welcome to AIStudyBuddy. Upload/Paste your Topic in the text area and
        click generate to get started!
      </label>
      <Textarea onChange={handleChange} placeholder="Type your message here." />
      <Button type="submit" onClick={() => GeneratePoints()}>
        Generate Bullet Points
      </Button>

      {aiResponse && (
        <div className="my-5" dir="ltr">
          <h2 className="font-extrabold text-lg">Summarized Bullet Points</h2>
          {aiResponse.bulletpoint.map((item, index) => (
            <ul className="list-disc pl">
              <li key={index}>{item}</li>
            </ul>
          ))}

          <div className="my-5 mx-96">
            <Button type="submit" onClick={() => GenerateQuestions()}>
              Generate Questions
            </Button>
          </div>

          {question && (
            <div className="my-5 font-extrabold text-lg" dir="ltr">
              Question & Answers
              {question.qa.map((item, index) => (
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1" key={index}>
                    <AccordionTrigger className="my-5 text-white">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="my-5 font-normal">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
