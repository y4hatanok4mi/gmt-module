"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Volume2, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import "react-quill/dist/quill.bubble.css";

const ReadText = ({ value }: { value: string }) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState(1); // Default speed
  const [pitch, setPitch] = useState(1); // Default pitch

  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

  useEffect(() => {
    if (synth) {
      const loadVoices = () => {
        const availableVoices = synth.getVoices();
        setVoices(availableVoices);
        if (availableVoices.length > 0) {
          setSelectedVoice(availableVoices[0].name);
        }
      };

      synth.onvoiceschanged = loadVoices;
      loadVoices();
    }
  }, [synth]);

  const extractPlainText = (html: string) => {
    if (typeof document === "undefined") return html;
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText || "";
  };

  const handleSpeak = () => {
    if (!synth) return;

    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
    } else {
      const textToRead = extractPlainText(value);
      const utterance = new SpeechSynthesisUtterance(textToRead);
      const voice = voices.find((v) => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
      utterance.rate = rate; // Set speed
      utterance.pitch = pitch; // Set pitch

      utterance.onend = () => setIsSpeaking(false);
      synth.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Display text content */}
      <ReactQuill theme="bubble" value={value} readOnly />

      {/* Control Panel */}
      <div className="flex flex-wrap gap-4 items-center justify-center mt-3">
        {/* Voice Selection */}
        <Select onValueChange={(val) => setSelectedVoice(val)} value={selectedVoice}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Select Voice" />
          </SelectTrigger>
          <SelectContent>
            {voices.map((voice) => (
              <SelectItem key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Speed Selection */}
        <Select onValueChange={(val) => setRate(Number(val))} value={rate.toString()}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Speed" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0.5">0.5x</SelectItem>
            <SelectItem value="0.75">0.75x</SelectItem>
            <SelectItem value="1">1x (Normal)</SelectItem>
            <SelectItem value="1.25">1.25x</SelectItem>
            <SelectItem value="1.5">1.5x</SelectItem>
            <SelectItem value="2">2x</SelectItem>
          </SelectContent>
        </Select>

        {/* Read Button */}
        <Button
          variant="outline"
          onClick={handleSpeak}
          className="p-2 rounded-full"
        >
          {isSpeaking ? <StopCircle size={24} /> : <Volume2 size={24} />}
        </Button>
      </div>
    </div>
  );
};

export default ReadText;
