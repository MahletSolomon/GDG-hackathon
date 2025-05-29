'use client';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { GitBranch } from "lucide-react"

const SKILLS_API = "http://localhost:3001/skills"
const QUIZZES_API = "http://localhost:3001/quizzes"

const QuizPage = () => {
  const [skills, setSkills] = useState([])
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(false)
  const [answers, setAnswers] = useState([])
    const [isOpen, setIsOpen] = useState(false)
  const [showScore, setShowScore] = useState(false)

  // Fetch all skills on mount
  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true)
      try {
        const res = await fetch(SKILLS_API)
        const data = await res.json()
        console.log("Fetched skills:", data)
        setSkills(data)
      } catch (e) {
        setSkills([])
      }
      setLoading(false)
    }
    fetchSkills()
  }, [])

  // Fetch quiz for selected skill
  useEffect(() => {
    if (!selectedSkill) return;
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        // Fetch the skill by ID, which returns the quiz for that skill
        const skillRes = await fetch(`${QUIZZES_API}/${selectedSkill}`);
        const skillData = await skillRes.json();
        // If the response has a questions array, use it
        setQuestions(skillData.questions || []);
        setCurrent(0);
        setAnswers([]);
        setShowScore(false);
      } catch (e) {
        setQuestions([]);
      }
      setLoading(false);
    };
    fetchQuiz();
  }, [selectedSkill])

  const handlePrev = () => setCurrent((c) => Math.max(0, c - 1))
  const handleNext = () => setCurrent((c) => Math.min(questions.length - 1, c + 1))
  const handleOptionClick = (idx) => {
    const updated = [...answers]
    updated[current] = idx
    setAnswers(updated)
  }
  const handleViewScore = () => setShowScore(true)
  const handleSkillSelect = (id) => {
    setSelectedSkill(id)
    setIsOpen(false)
}

  const handleRestart = () => {
    setShowScore(false)
    setCurrent(0)
    setAnswers([])
  }

  const score = questions.reduce((acc, q, idx) => {
    if (answers[idx] === q.correct_answer_index) return acc + 1
    return acc
  }, 0)

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: '#0a0a0a',
        color: '#f3e8ff',
      }}
    >
      {/* Gradient patches ... */}
      <div className="absolute top-0 left-0 w-60 h-60 rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #a259f7 0%, transparent 70%)',
          opacity: 0.6,
          zIndex: 0,
        }}
      />
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full"
        style={{
          background: 'radial-gradient(circle at 70% 70%, #7c3aed 0%, transparent 70%)',
          opacity: 0.5,
          zIndex: 0,
        }}
      />
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full"
        style={{
          background: 'radial-gradient(circle at 80% 20%, #c084fc 0%, transparent 70%)',
          opacity: 0.4,
          zIndex: 0,
        }}
      />

    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-fit space-y-2 absolute top-4 right-4  rounded-lg shadow-lg border border-purple-900" 
    >
        <div className="flex justify-end px-4 pt-4">
  <CollapsibleTrigger asChild>
    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
      <GitBranch className="h-5 w-5" />
      <span className="sr-only">Toggle Skills</span>
    </Button>
  </CollapsibleTrigger>
</div>

        <CollapsibleContent className="p-4 space-y-2">
        <div className="flex flex-col gap-3">
              {skills.map((skill) => (
                <Button
                  key={skill.id}
                  variant="ghost"
                  className="justify-start bg-zinc-900 hover:bg-purple-900 text-purple-100 border border-purple-900"
                  onClick={() => handleSkillSelect(skill.id)}
                >
                  {skill.name || skill.id}
                </Button>
              ))}
            </div>
        </CollapsibleContent>
            
    </Collapsible>

      <Card className="relative z-10 bg-black/80 border-none shadow-2xl max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-purple-200">
            {selectedSkill ? "Quiz Time!" : "Choose a Skill"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-purple-100">Loading...</p>
          ) : !selectedSkill ? (
            <div className="flex flex-col gap-3">
              {skills.map((skill) => (
                <Button
                  key={skill.id}
                  variant="ghost"
                  className="justify-start bg-zinc-900 hover:bg-purple-900 text-purple-100 border border-purple-900"
                  onClick={() => handleSkillSelect(skill.id)}
                >
                  {skill.name || skill.id}
                </Button>
              ))}
            </div>
          ) : questions.length === 0 ? (
            <p className="text-red-300">No questions found for this skill.</p>
          ) : showScore ? (
            <div className="text-center">
              <div className="text-2xl font-bold mb-2 text-purple-100">Your Score</div>
              <div className="text-4xl font-extrabold mb-4 text-purple-300">
                {score} / {questions.length}
              </div>
              <Button onClick={handleRestart}>
                Restart Quiz
              </Button>
              <Button variant="ghost" className="ml-2" onClick={() => setSelectedSkill(null)}>
                Choose Another Skill
                Choose a Skill
              </Button>
            </div>
          ) : (
            <div>
              <div className="mb-4 text-purple-100">
                <span className="font-semibold">Question {current + 1} of {questions.length}</span>
                <div className="mt-2 font-medium">{questions[current].question_text}</div>
                <div className="mt-1 text-xs text-purple-400 capitalize">
                  Difficulty: {questions[current].difficulty}
                </div>
              </div>
              <div className="flex flex-col gap-3 mb-4">
                {questions[current].options.map((opt, idx) => {
                  const isSelected = answers[current] === idx
                  let btnColor = isSelected
                    ? "bg-purple-800 text-white"
                    : "bg-zinc-900 hover:bg-purple-900 text-purple-100"
                  return (
                    <Button
                      key={idx}
                      variant="ghost"
                      className={`justify-start ${btnColor} border border-purple-900`}
                      onClick={() => handleOptionClick(idx)}
                    >
                      {opt}
                    </Button>
                  )
                })}
              </div>
              <div className="flex justify-between items-center">
                <Button
                  variant="ghost"
                  onClick={handlePrev}
                  disabled={current === 0}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </Button>
                {current === questions.length - 1 ? (
                  <Button
                    variant="default"
                    onClick={handleViewScore}
                    disabled={answers.length !== questions.length || answers.includes(undefined)}
                  >
                    View Score
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={handleNext}
                    className="flex items-center gap-1"
                    disabled={current === questions.length - 1}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default QuizPage