// PDFCanvasViewer.jsx
import React, { useEffect, useRef } from "react";
import { getDocument, GlobalWorkerOptions, version as pdfjsVersion  } from "pdfjs-dist";
import "./PDFCanvasViewer.css";

// Configurar el worker de PDF.js
GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

const PDFCanvasViewer = ({ pdfUrl }) => {
    const containerRef = useRef(null);
  
    useEffect(() => {
      const renderPDF = async () => {
        if (!pdfUrl) return;
  
        try {
          const loadingTask = getDocument(pdfUrl);
          const pdf = await loadingTask.promise;

          const container = containerRef.current;
          container.innerHTML = "";
  
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.3 });
  
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
  
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvas.style.marginBottom = "2rem";
  
            await page.render({
              canvasContext: context,
              viewport,
            }).promise;
  
            container.appendChild(canvas);
          }
  
        } catch (error) {
          console.error("Error renderizando el PDF:", error);
        }
      };
  
      renderPDF();
    }, [pdfUrl]);
  
    return <div ref={containerRef} className="w-full border shadow-md rounded" />;
  };
  
  export default PDFCanvasViewer;