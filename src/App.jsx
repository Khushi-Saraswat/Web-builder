import { useState } from "react";
import NavBar from "./component/NavBar";
import "./App.css";
import { MdOutlineArrowUpward } from "react-icons/md";
import { ImNewTab } from "react-icons/im";
import { IoMdDownload } from "react-icons/io";
import { BiSolidShow } from "react-icons/bi";
import { FaEyeSlash } from "react-icons/fa";
import Editor from "@monaco-editor/react";
import { RiComputerLine } from "react-icons/ri";
import { FaTabletAlt } from "react-icons/fa";
import { ImMobile2 } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import { GoogleGenAI } from "@google/genai";
import { FadeLoader } from "react-spinners";
import { API_KEY } from "./helper";

function App() {
  const [prompt, setPrompt] = useState("");
  const [isShowCode, setIsShowCode] = useState(false);
  const [isInNewTab, setIsInNewTab] = useState(false);
  const [loading, setLoading] = useState(false);
  const [device, setDevice] = useState("computer");
  const [code, setCode] = useState(`
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>web-builder</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      <div id="root"></div>
      <h1 class="text-[30px] font-[700]">Web-builder</h1>
    </body>
    </html>
  `);

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "webBuilderCode.html";
    a.click();
  };

  async function getResponse() {
    if (!prompt.trim()) return;
    setLoading(true);

    const text_prompt = `You are an expert frontend developer...Website prompt: ${prompt}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: text_prompt,
    });

    setCode(extractCode(response.text));
    setLoading(false);
  }

  return (
    <>
      <NavBar />

      {/* ── Main container ── */}
      <div className="container px-4 sm:px-8 md:px-12 lg:px-16 py-6">

        {/* Heading */}
        <h3 className="text-[22px] sm:text-[26px] md:text-[30px] font-[700] leading-snug">
          Create beautiful websites with{" "}
          <span className="bg-gradient-to-br from-violet-400 to-purple-600 bg-clip-text text-transparent">
            WebBuilder
          </span>
        </h3>
        <p className="mt-2 text-[14px] sm:text-[16px] text-[#b3b3b3]">
          Describe your website and AI will code for you.
        </p>

        {/* Input box */}
        <div className="inputBox relative mt-4">
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            placeholder="Describe your website in detail"
            className="w-full min-h-[100px] sm:min-h-[120px] resize-none"
          />
          {prompt !== "" && (
            <i
              onClick={getResponse}
              className="sendIcon absolute bottom-3 right-3 text-[20px] w-[32px] h-[32px] flex items-center justify-center bg-[#9933ff] rounded-[50%] cursor-pointer transition-all duration-300 hover:opacity-80"
            >
              <MdOutlineArrowUpward />
            </i>
          )}
        </div>

        {/* Preview box */}
        <div className="preview mt-6 w-full">

          {/* Preview header */}
          <div className="header w-full min-h-[60px] flex flex-wrap items-center justify-between gap-y-2 px-3 py-2">
            <h3 className="font-bold text-[15px] sm:text-[16px]">Live Preview</h3>

            {/* Action buttons — wrap on small screens */}
            <div className="icons flex flex-wrap items-center gap-[8px] sm:gap-[12px]">
              <div
                className="icon !w-auto !px-3 !py-2 flex items-center gap-1 text-[13px] sm:text-[14px] cursor-pointer"
                onClick={() => setIsInNewTab(!isInNewTab)}
              >
                <span className="hidden xs:inline">Open in new tab</span>
                <ImNewTab />
              </div>

              <div
                className="icon !w-auto !px-3 !py-2 flex items-center gap-1 text-[13px] sm:text-[14px] cursor-pointer"
                onClick={downloadCode}
              >
                <span className="hidden xs:inline">Download</span>
                <IoMdDownload />
              </div>

              <div
                onClick={() => setIsShowCode(!isShowCode)}
                className="icon !w-auto !px-3 !py-2 flex items-center gap-1 text-[13px] sm:text-[14px] cursor-pointer"
              >
                <span className="hidden xs:inline">
                  {isShowCode ? "Hide Code" : "Show Code"}
                </span>
                {isShowCode ? <FaEyeSlash /> : <BiSolidShow />}
              </div>
            </div>
          </div>

          {/* Preview body */}
          {isShowCode ? (
            <Editor height="100%" theme="vs-dark" defaultLanguage="html" value={code} />
          ) : loading ? (
            <div className="w-full h-full flex items-center justify-center flex-col py-16">
              <FadeLoader color="#9933ff" />
              <h3 className="text-[18px] sm:text-[23px] mt-4 font-semibold">
                <span className="bg-gradient-to-br from-violet-400 to-purple-600 bg-clip-text text-transparent">
                  Generating
                </span>{" "}
                your website...
              </h3>
            </div>
          ) : (
            <iframe srcDoc={code} className="w-full bg-white newTabIframe" />
          )}
        </div>
      </div>

      {/* ── Full-screen modal / new-tab preview ── */}
      {isInNewTab && (
        <div
          className={`modelCon transition-all duration-500 mx-auto bg-white shadow-2xl overflow-hidden flex flex-col
            ${
              device === "mobile"
                ? "w-[375px] h-[667px] border-[12px] border-black rounded-[40px] my-5"
                : device === "tablet"
                ? "w-full md:w-[768px] h-[90vh] border-[10px] border-black rounded-[25px] my-5"
                : "w-full h-screen"
            }`}
        >
          <div className="modelBox h-full flex flex-col">

            {/* Modal header */}
            <div className="header w-full px-4 sm:px-6 h-[56px] flex items-center justify-between border-b bg-gray-50 shrink-0 gap-2">
              <h3 className="font-bold text-black text-[13px] sm:text-[15px] truncate">
                Preview — {device.toUpperCase()}
              </h3>

              {/* Device toggles */}
              <div className="flex items-center gap-[6px] sm:gap-[10px]">
                {[
                  { id: "computer", Icon: RiComputerLine, size: 20 },
                  { id: "tablet", Icon: FaTabletAlt, size: 18 },
                  { id: "mobile", Icon: ImMobile2, size: 16 },
                ].map(({ id, Icon, size }) => (
                  <div
                    key={id}
                    className={`icon cursor-pointer p-1.5 sm:p-2 rounded ${
                      device === id ? "bg-blue-600 text-white" : "text-gray-500"
                    }`}
                    onClick={() => setDevice(id)}
                  >
                    <Icon size={size} />
                  </div>
                ))}
              </div>

              {/* Close */}
              <div
                className="icon cursor-pointer"
                onClick={() => setIsInNewTab(false)}
              >
                <IoMdClose size={20} />
              </div>
            </div>

            {/* Modal iframe */}
            <iframe
              srcDoc={code}
              className="w-full flex-1 bg-white border-none"
              title="preview"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default App;