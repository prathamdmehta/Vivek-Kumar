"use client";
import { useEffect, useRef } from "react";

export default function PencilCursor() {
  const canvasRef = useRef(null);
  const cursorRef = useRef(null); // The orange ball

  // We use refs to store data without triggering re-renders
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  
  // This array stores the "trail" of points
  const history = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 1. Set Canvas to Full Screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // 2. Track Mouse
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 3. Animation Loop
    const animate = () => {
      // --- Smooth Movement Logic ---
      // This makes the ball "float" rather than snap instantly
      const dx = mouse.current.x - pos.current.x;
      const dy = mouse.current.y - pos.current.y;
      
      pos.current.x += dx * 0.25; // 0.25 is the speed/smoothness
      pos.current.y += dy * 0.25;

      // Update the Orange Ball position
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }

      // --- Trail / Pencil Logic ---
      
      // A. Add current position to history
      history.current.push({ x: pos.current.x, y: pos.current.y });

      // B. Limit the trail length (The "Erase" effect)
      // Change '40' to make the tail longer or shorter
      if (history.current.length > 40) {
        history.current.shift(); // Remove the oldest point
      }

      // C. Clear the canvas (Erase the old frame completely)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // D. Draw the line connecting all points in history
      if (history.current.length > 1) {
        ctx.beginPath();
        ctx.lineWidth = 2; // Thickness of the pencil
        ctx.lineCap = "round"; // Smooth ends
        ctx.lineJoin = "round"; // Smooth corners
        ctx.strokeStyle = "rgba(80, 80, 80, 0.6)"; // Dark Grey Color

        // Start at the oldest point
        ctx.moveTo(history.current[0].x, history.current[0].y);

        // Connect to every subsequent point
        for (let i = 1; i < history.current.length; i++) {
          const point = history.current[i];
          ctx.lineTo(point.x, point.y);
        }
        
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    };

    // Initialize positions
    pos.current.x = mouse.current.x;
    pos.current.y = mouse.current.y;
    
    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      {/* 1. Canvas Layer (The Pencil Trail) */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9998]"
      />

      {/* 2. Cursor Layer (The Orange Ball) */}
      {/* -ml-1.5 -mt-1.5 ensures the ball is centered on the tip of the line */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] h-3 w-3 -ml-1.5 -mt-1.5 rounded-full bg-orange-400 shadow-sm pointer-events-none"
      />
    </>
  );
}