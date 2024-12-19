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
import { createWorker } from "tesseract.js";
import { LoaderCircle } from "lucide-react";
import { fstat } from "fs";
import PdfParse from "pdf-parse";
import { fs } from "fs";
import { pdf } from "pdf-parse";

function App() {
  const [content, setContent] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [question, setQuestion] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [ploading, setpLoading] = useState(false);
  const [qloading, setqLoading] = useState(false);
  const [Imageloading, setImageLoading] = useState(false);
  const [imgGuide, setImgGuide] = useState("");
  const [pdf, setPdf] = useState(null);

  const handleChange = (e) => {
    setContent(e.target.value);
    console.log(content);
  };

  const prompt =
    "generate  summarized bullet points in JSON format to better understand for students the array should be in 'bulletpoint' array. here is the content {content}";

  const questionPrompt =
    "here are some parsed summarized points {aiResponse}. now make 7 questions and answers from the points. The questiona and answer should not be long and should be in JSON format. formating of array should be qa --> question,answer ";

  const GeneratePoints = async () => {
    setpLoading(true);
    const PROMPT = prompt.replace("{content}", content);
    const result = await AIChatSession.sendMessage(PROMPT);
    const responseText = result.response.text();
    const parsedResponse = JSON.parse(responseText);
    setAiResponse(parsedResponse);
    console.log(parsedResponse);
    setpLoading(false);
  };

  const GenerateQuestions = async () => {
    setqLoading(true);
    const Qpromt = questionPrompt.replace("{aiResponse}", aiResponse);
    const Qresult = await AIChatSession.sendMessage(Qpromt);
    const Qreponse = Qresult.response.text();
    const Qparsed = JSON.parse(Qreponse);
    setQuestion(Qparsed);
    console.log(Qparsed);
    setqLoading(false);
  };

  const image = async () => {
    try {
      setImageLoading(true);
      const worker = await createWorker("eng");
      const ret = await worker.recognize(selectedImage);
      setContent(ret.data.text);
      console.log(ret.data.text);
      await worker.terminate();
      setImageLoading(false);
      setImgGuide("Content loaded succesfully ✅ || Now click Generate 👓");
    } catch (error) {
      setImageLoading(false);
      alert("please upload a png or jpeg");
    }
  };

  return (
    <div className="grid w-full gap-2">
      <label className="font-extrabold text-lg">
        Welcome to AIStudyBuddy. Upload/Paste your Topic in the text area and
        click generate to get started!
      </label>
      <Textarea onChange={handleChange} placeholder="Type your message here." />
      <div className="mx-0">
        <h2>Upload Image Only 👇🏻</h2>
        <input
          type="file"
          name="myImage"
          // Event handler to capture file selection and update the state
          onChange={(event) => {
            console.log(event.target.files[0]); // Log the selected file
            setSelectedImage(event.target.files[0]); // Update the state with the selected file
          }}
        />

        <Button onClick={() => image()}>
          {Imageloading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Generate content from Image"
          )}
        </Button>
      </div>
      <div>
        <h2>{imgGuide}</h2>
      </div>
      <Button
        type="submit"
        disabled={ploading}
        onClick={() => GeneratePoints()}
      >
        {ploading ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          "Generate Bullet Points"
        )}
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
              {qloading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Generate Questions"
              )}
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
