import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "./components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AIChatSession } from "./../service/AIModal";

function App() {
  const [content, setContent] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [count, setCount] = useState(0);
  const handleChange = (e) => {
    setContent(e.target.value);
    console.log(content);
  };

  const prompt =
    "generate  summarized bullet points in JSON format to better understand for students the array should be in 'bulletpoint' array. here is the content {content}";

  const GeneratePoints = async () => {
    const PROMPT = prompt.replace("{content}", content);
    const result = await AIChatSession.sendMessage(PROMPT);
    const responseText = result.response.text();
    const parsedResponse = JSON.parse(responseText);
    setAiResponse(parsedResponse);
    console.log(parsedResponse);
  };

  return (
    <div className="grid w-full gap-2">
      <label className="font-extrabold text-lg">
        Welcome to AIStudyBuddy. Upload/Paste your Topic in the text area and
        click generate to get started!
      </label>
      <Textarea onChange={handleChange} placeholder="Type your message here." />
      <Button type="submit" onClick={() => GeneratePoints()}>
        Generate
      </Button>

      {aiResponse && (
        <div className="my-5" dir="ltr">
          <h2 className="font-extrabold text-lg">Summarized Bullet Points</h2>
          {aiResponse.bulletpoint.map((item, index) => (
            <ul className="list-disc pl">
              <li key={index}>{item}</li>
            </ul>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
