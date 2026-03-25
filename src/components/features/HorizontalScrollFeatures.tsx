"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Zap, Shield, Search, Layers, FileText } from "lucide-react";
import { DisplayCard } from "@/components/ui/display-cards";

const features = [
  {
    icon: <Zap className="size-6 text-gold" />,
    title: "Instant Summarization",
    description: "Mindexa AI digests 100-page reports in seconds, rendering concise, actionable bullet points.",
    date: "Core Feature",
  },
  {
    icon: <Search className="size-6 text-gold" />,
    title: "Context-Aware Q&A",
    description: "Ask anything about your document. Our system understands the nuanced context to deliver exact answers.",
    date: "Interactive",
  },
  {
    icon: <Shield className="size-6 text-gold" />,
    title: "Precise Citations",
    description: "Every answer includes a direct reference to the exact page and paragraph it was sourced from.",
    date: "Accuracy",
  },
  {
    icon: <Layers className="size-6 text-gold" />,
    title: "Cross-Document Analytics",
    description: "Synthesize insights across multiple PDFs simultaneously to discover hidden patterns and trends.",
    date: "Analytics",
  },
  {
    icon: <FileText className="size-6 text-gold" />,
    title: "Format Preservation",
    description: "Extracts tables, charts, and complex formats perfectly intact, ready for your next presentation.",
    date: "Reliability",
  },
];

const HorizontalScrollFeatures = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section 
      id="features" 
      ref={containerRef} 
      className="relative bg-black border-y border-white/5 h-[500vh]"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden">
        
        {/* Header Section for Features */}
        <motion.div 
          initial={{ opacity: 0, filter: 'blur(10px)', y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0, scale: 1 }}
          viewport={{ margin: "-10% 0px -10% 0px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 px-6 relative z-50 w-full"
        >
          <h2 className="text-5xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto mb-6 leading-tight">
            Enterprise-Grade Document Intelligence
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Everything you need to read faster, comprehend deeper, and make better decisions from your data.
          </p>
        </motion.div>

        {/* Scroll-Driven Stack Container */}
        <div className="relative w-full max-w-7xl mx-auto h-[400px] lg:h-[300px] flex justify-center items-center perspective-1000 mt-10">
          
          {features.map((feature, index) => {
            const step = 1 / features.length;
            const start = index * step - step;
            const focus = index * step;
            const pushBack = index * step + step;

            const y = useTransform(
              scrollYProgress,
              [start, focus, pushBack, 1],
              [300, 0, -30 * (features.length - index), -60 * (features.length - index)]
            );

            const scale = useTransform(
              scrollYProgress,
              [start, focus, pushBack, 1],
              [0.8, 1, 0.9, 0.8]
            );

            const opacity = useTransform(
              scrollYProgress,
              [start, focus, pushBack, 1],
              [0, 1, 0.4, 0]
            );

            return (
              <motion.div
                key={index}
                style={{ y, scale, opacity, zIndex: 10 + index }}
                className="absolute shadow-2xl"
              >
                <DisplayCard 
                  {...feature} 
                  className="shadow-[0_0_50px_rgba(0,0,0,0.8)] border-white/10" 
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HorizontalScrollFeatures;
