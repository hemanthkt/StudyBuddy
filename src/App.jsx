import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "./components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AIChatSession } from "./../service/AIModal";

function App() {
  const [content, setContent] = useState("");
  const [count, setCount] = useState(0);
  const handleChange = (e) => {
    setContent(e.target.value);
    console.log(content);
  };

  const prompt =
    "generate 5 to 6 summarized bullet points in JSON format to better understand. here is the content {content}";

  const GeneratePoints = async () => {
    const PROMPT = prompt.replace("{content}", content);
    const result = await AIChatSession.sendMessage(PROMPT);
    const aiResponse = result.response.text();
    console.log(aiResponse);
  };

  return (
    <div className="grid w-full gap-2">
      <label>
        Welcome to AIStudyBuddy. Upload/Paste your Topic in the text area and
        click generate to get started!
      </label>
      <Textarea onChange={handleChange} placeholder="Type your message here." />
      <Button type="submit" onClick={() => GeneratePoints()}>
        Generate
      </Button>
    </div>
  );
}

export default App;
