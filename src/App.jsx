import { useState } from 'react'
import NavBar from './component/NavBar';
import './App.css'
import { MdOutlineArrowUpward } from "react-icons/md";
import { ImNewTab } from "react-icons/im";
import { IoMdDownload } from 'react-icons/io';
import { BiSolidShow } from "react-icons/bi";
import { FaEyeSlash } from "react-icons/fa";
import Editor from '@monaco-editor/react';
import { RiComputerLine } from "react-icons/ri";
import { FaTabletAlt } from "react-icons/fa";
import { ImMobile2 } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import { GoogleGenAI } from "@google/genai";
import { FadeLoader } from 'react-spinners';

import { API_KEY } from './helper';







function App() {

   const [prompt, setPrompt] = useState("");
   const [isShowCode, setIsShowCode] = useState(false);
   const [isInNewTab, setIsInNewTab] = useState(false);
   const [loading, setLoading] = useState(false);
   const [device, setDevice] = useState("computer"); 
   const [code, setcode] = useState(
      `
      <!doctype html>
      <html lang="en">
      <head>
      <meta charset="UTF-8" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>web-builder</title>
      <script src="https://cdn.tailwindcss.com"></script>
     </head>
     <body>
    <div id="root"></div>
    <h1 class="text-[30px] font-[700]">Web-builder</h1>
    <script type="module" src="/src/main.jsx"></script>
     </body>
    </html>

      `
   );

   const ai = new GoogleGenAI({apiKey:API_KEY});


    // ✅ Extract code safely
  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  };


  const downloadCode = () =>{

    let filename = "webBuilderCode.html";
    let blob = new Blob([code], {type: "text/plain"});
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

  }

   async function getResponse() {

          if(prompt === " ")
          {
            toast.error("Please enter a prompt !");
            return;
          }

      setLoading(true)

      
      const text_prompt = `You are an expert frontend developer and UI/UX designer. The user will provide a detailed prompt describing what kind of website they want. Based on the user’s description, generate a fully working, production-ready website as a **single HTML file**. Use only **HTML, Tailwind CSS (via CDN)**, vanilla JavaScript, and GSAP (via CDN).  

Strict output rules:
- Return the website as a single fenced Markdown code block with the language tag.  
- Do NOT include any explanations, text, or extra code blocks outside that single block. Only the HTML file content.  

Technical requirements:
1. **Stack**: HTML + Tailwind CSS (via CDN) + vanilla JavaScript + GSAP (via CDN). Everything in one file.  
2. **Responsive**: Must be fully responsive (mobile, tablet, desktop) with modern grid and flex layouts.  
3. **Theme**: Default **dark mode**, but if the website type fits better in light mode, auto-select light mode. Include a **toggle button** to switch between dark and light themes.  
4. **Animations & Interactions**:  
   - GSAP scroll-based animations (fade, slide, stagger, parallax).  
   - Smooth hover effects with scale, shadow, and gradient transitions.  
   - Sticky navbar with subtle shadow on scroll.  
   - Animated gradient backgrounds or floating decorative shapes.  
5. **Visual richness**:  
   - Use high-quality **royalty-free images** (Unsplash via direct URLs).  
   - Apply **soft shadows, glassmorphism, or neumorphism** effects where suitable.  
   - Modern cards, rounded corners, gradient buttons, hover animations.  
6. **UI Sections** (as per user request):  
   - Sticky **Navbar** with logo + links + theme toggle.  
   - **Hero section** with headline, subheadline, CTA button, and background image/gradient.  
   - **Main content**: features grid, product showcase, gallery, blog cards, or whatever fits user’s request.  
   - **Call to Action** with strong button.  
   - **Footer** with the text: "Made with WebBuilder"  
7. **Code quality**: Clean, semantic HTML5, ARIA labels for accessibility, well-indented, professional Tailwind usage.  
8. **Performance**: Optimized. No external CSS/JS frameworks beyond Tailwind + GSAP. Use responsive images, gradients, inline SVGs, or Unsplash placeholders.  

Final instruction: Output only the single fenced Markdown code block with the full HTML file content. Nothing else.  

Website prompt: ${prompt}`
      const response = await ai.models.generateContent({

         model: "gemini-2.5-flash",
         contents:text_prompt
      });

      setcode(extractCode(response.text));
      setLoading(false);
      console.log(response.text);
   }
    



   
   return (
      <>
         <NavBar />
         <div className="container">

            <h3 className='text-[30px] font-[700]'>Create beautiful websites with <span className='bg-gradient-to-br from-violet-400  to-purple-600 bg-clip-text text-transparent'>WebBuilder</span></h3>
            <p className=' mt-2 text-[16px] text-[#b3b3b3]'>Describe your website and ai will code for you.</p>

            <div className="inputBox">
               <textarea
                  onChange={(e) => { setPrompt(e.target.value) }}
                  value={prompt}
                  name="" id="" placeholder='describe your website in detail'></textarea>


               {
                  prompt != "" ?
                     <>
                        <i onClick={getResponse}
                        className='sendIcon text-[20px] w-[30px] h-[30px] flex items-center justify-center bg-[#9933ff] rounded-[50%] transition-all duration-300 hover:opacity-[.8]'>
                           <MdOutlineArrowUpward />
                        </i>
                     </> :
                     ""

               }
            </div>

            <div className="preview">


               <div className="header w-full h-[70px]">

                  <h3 className='font-bold text-[16px]'>
                     Live Preview

                  </h3>

                  <div className='icons flex items-center gap-[15px]'>


                     <div className="icon !w-[auto] !p-[12px] flex items-center gap-1[10px]"

                        onClick={(e) => { setIsInNewTab(!isInNewTab) }}

                     >

                        Open in new tab<ImNewTab />

                     </div>

                     <div className='icon icon !w-[auto] !p-[12px] flex items-center gap-1[10px]'
                     
                           onClick={downloadCode}
                     >
                        Download
                        <IoMdDownload />
                     </div>

                     <div
                        onClick={(e) => { setIsShowCode(!isShowCode) }}
                        className='icon icon !w-[auto] !p-[12px] flex items-center gap-1[10px]'>

                        {

                           isShowCode ? "Hide Code" : "Show Code"

                        }

                        {

                           isShowCode ? <FaEyeSlash /> : <BiSolidShow />

                        }

                     </div>
                  </div>


               </div>


               {

                  isShowCode ?

                     <>

                        <Editor height="100%"

                           theme='vs-dark'

                           defaultLanguage="html" value={code} />

                     </> :

                     <>

                        {
                          loading ?
                         <div className='w-full h-full flex items-center justify-center flex-col'>
                         <FadeLoader color='#9933ff'/>
                         <h3 className='text-[23px] mt-4 font-semibold'><span className='bg-gradient-to-br from-violet-400  to-purple-600 bg-clip-text text-transparent'>Generating</span> your website...</h3>
                         </div> :
                          <>
                         <iframe srcDoc={code} className='w-full bg-[white] newTabIframe'></iframe>
                         </>
                       }
                     </>



               }









            </div>

         </div>

         {

            isInNewTab ?
               <>
      {/* Main Wrapper: 'mx-auto' center karne ke liye aur 'w-full' ko fix width se override karein */}
<div className={`modelCon transition-all duration-500 mx-auto bg-white shadow-2xl overflow-hidden flex flex-col ${
    device === 'mobile' ? 'w-[375px] h-[667px] border-[12px] border-black rounded-[40px] my-5' : 
    device === 'tablet' ? 'w-[768px] h-[90vh] border-[10px] border-black rounded-[25px] my-5' : 
    'w-full h-screen'
}`} style={{ width: device === 'mobile' ? '375px' : device === 'tablet' ? '768px' : '100%' }}>
    
    <div className="modelBox h-full flex flex-col">
        {/* Header - Isse 'w-full' hi rehne dein taaki icons sahi jagah rahein */}
        <div className="header w-full px-[20px] md:px-[30px] h-[60px] flex items-center justify-between border-b bg-gray-50 shrink-0">
            <h3 className='font-bold text-black'>Preview - {device.toUpperCase()}</h3>

            <div className="icons flex items-center gap-[10px]">
                <div 
                    className={`icon cursor-pointer p-2 rounded ${device === 'computer' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}  
                    onClick={() => setDevice('computer')}
                >
                    <RiComputerLine size={20} />
                </div>
                <div 
                    className={`icon cursor-pointer p-2 rounded ${device === 'tablet' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}  
                    onClick={() => setDevice('tablet')}
                >
                    <FaTabletAlt size={18} />
                </div>
                <div 
                    className={`icon cursor-pointer p-2 rounded ${device === 'mobile' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}  
                    onClick={() => setDevice('mobile')}
                >
                    <ImMobile2 size={16} />
                </div>
            </div>
              <div className="icons">
                    <div className="icon" onClick={() => { setIsInNewTab(false) }}><IoMdClose /></div>
                  </div>
        </div>

        {/* Iframe: Iski width parent (768px) ke hisaab se auto adjust hogi */}
        <iframe 
            srcDoc={code} 
            className='w-full flex-1 bg-white border-none' 
            title="preview"
        ></iframe>
    </div>
</div>


</>


 :
               " "


         }

      </>
   );
}

export default App
