"use client";

import { useState } from "react";

const questions = [
  { question: "¿Qué objeto se usa como aparato aéreo circular?", options: ["Lira", "Clava", "Rola bola"], answer: 0, note: "La lira, también llamada aro aéreo, se suspende y combina fuerza, equilibrio y secuencias coreográficas." },
  { question: "¿Qué conviene hacer antes de probar una disciplina de circo?", options: ["Improvisar en altura", "Aprender con guía y elementos seguros", "Copiar un video sin preparación"], answer: 1, note: "El aprendizaje acompañado, la progresión técnica y el equipamiento adecuado son parte central de una práctica responsable." },
  { question: "¿El circo puede funcionar también como archivo cultural?", options: ["Sí, conserva técnicas, relatos y memorias", "No, sólo existe en escena", "Únicamente si se filma"], answer: 0, note: "La memoria circense también vive en relatos, cuerpos, fotografías, objetos, prensa, técnicas y transmisión oral." },
] as const;

export function CircusQuiz() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [complete, setComplete] = useState(false);
  const current = questions[index];
  function answer(optionIndex: number) {
    const correct = optionIndex === current.answer;
    setScore((value) => value + (correct ? 1 : 0));
    setFeedback(`${correct ? "¡Exacto!" : "Casi."} ${current.note}`);
    window.setTimeout(() => { if (index === questions.length - 1) setComplete(true); else { setIndex((value) => value + 1); setFeedback(""); } }, 900);
  }
  function restart() { setIndex(0); setScore(0); setFeedback(""); setComplete(false); }
  if (complete) return <div className="quiz" aria-live="polite"><p className="quiz-progress">Recorrido completo</p><h2 className="quiz-question">{score} de {questions.length} pistas encontradas.</h2><p>Este juego es una primera pieza liviana. El archivo real podrá alimentar nuevas preguntas desde el panel.</p><button className="button button-primary" type="button" onClick={restart}>Volver a jugar</button></div>;
  return <div className="quiz"><p className="quiz-progress">Pista {index + 1} de {questions.length} · Puntaje {score}</p><h2 className="quiz-question">{current.question}</h2><div className="quiz-options">{current.options.map((option, optionIndex) => <button className="quiz-option" type="button" onClick={() => answer(optionIndex)} disabled={Boolean(feedback)} key={option}>{option}</button>)}</div><p className="quiz-feedback" aria-live="polite">{feedback}</p></div>;
}
