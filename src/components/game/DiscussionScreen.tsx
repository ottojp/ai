import { useState, useEffect, useRef, useMemo } from "react";
import { useGame } from "@/context/GameContext";
import { MessageCircle, ArrowRight, Vote } from "lucide-react";

export default function DiscussionScreen() {
const { players, settings, setPhase, applyScores } = useGame();
const totalSeconds = settings.timerMinutes * 60;
const [timeLeft, setTimeLeft] = useState(totalSeconds);
const timerRef = useRef();

const speakingOrder = useMemo(() => {
const arr = [...players];
for (let i = arr.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[arr[i], arr[j]] = [arr[j], arr[i]];
}
return arr;
}, [players]);

useEffect(() => {
if (settings.timerMinutes === 0) return;
setTimeLeft(totalSeconds);
timerRef.current = setInterval(() => {
setTimeLeft(prev => {
if (prev <= 1) { clearInterval(timerRef.current); return 0; }
return prev - 1;
});
}, 1000);
return () => clearInterval(timerRef.current);
}, [settings.timerMinutes, totalSeconds]);

const mins = Math.floor(timeLeft / 60);
const secs = timeLeft % 60;

const handleProceed = () => {
if (settings.votingMode === "live") {
applyScores();
setPhase("results");
} else {
setPhase("voting");
}
};

return (

    <div>
        <h1>Discussion Time</h1>
        <p>Each player gives a one-word clue about the secret word. The imposter must bluff!</p>
        {settings.timerMinutes > 0 && (
            <span>{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</span>
        )}
        <h2>Speaking order:</h2>
        <ul>
            {speakingOrder.map((p, i) => (
                <li key={i}>{i + 1}. {p.name}</li>
            ))}
        </ul>
        {settings.votingMode === "live" ? (
            <button onClick={handleProceed}>Reveal Results</button>
        ) : (
            <button onClick={handleProceed}>Proceed to Voting</button>
        )}
        {settings.votingMode === "live" && (
            <p>Vote in real life by pointing at who you think is the imposter!</p>
        )}
    </div>
);
}