'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Checkbox } from './ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { SENTENCES } from '../lib/sentences' // Add this import

// Remove the hardcoded SENTENCES array since we're importing it

const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'
const NUMBERS = '0123456789'

const TIME_OPTIONS = [
  { value: 15, label: '15s' },
  { value: 30, label: '30s' },
  { value: 60, label: '1 min' },
  { value: 120, label: '2 min' },
  { value: 300, label: '5 min' },
]

export default function TypingTest() {
  const { theme } = useTheme() // Add this line at the top with other state declarations
  const [mounted, setMounted] = useState(false)
  const [text, setText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [wpm, setWPM] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [isFinished, setIsFinished] = useState(false)
  const [selectedTime, setSelectedTime] = useState(30) // Changed from 60 to 30
  const [error, setError] = useState<string | null>(null)
  const [progressData, setProgressData] = useState<
    { time: number; wpm: number; accuracy: number }[]
  >([])
  const [showCapitals, setShowCapitals] = useState(true)
  const [showPunctuation, setShowPunctuation] = useState(true)
  const [showNumbers, setShowNumbers] = useState(false)
  const [showSymbols, setShowSymbols] = useState(false)
  const [typingMode, setTypingMode] = useState<'moving' | 'static'>('static')
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  const DISPLAY_BUFFER = 100 // Number of characters ahead to display

  const generateText = useCallback(() => {
    let selectedSentences = [...SENTENCES]
    let generatedText = ''

    while (generatedText.length < 500) {
      if (selectedSentences.length === 0) {
        selectedSentences = [...SENTENCES]
      }
      const randomIndex = Math.floor(Math.random() * selectedSentences.length)
      let sentence = selectedSentences.splice(randomIndex, 1)[0]

      if (!showCapitals) {
        sentence = sentence.toLowerCase()
      }
      if (!showPunctuation) {
        sentence = sentence.replace(/[.,!?]/g, '')
      }
      if (showNumbers) {
        sentence = sentence.replace(/[a-zA-Z]/g, (char) =>
          Math.random() < 0.1
            ? NUMBERS[Math.floor(Math.random() * NUMBERS.length)]
            : char
        )
      }
      if (showSymbols) {
        sentence = sentence.replace(/[a-zA-Z]/g, (char) =>
          Math.random() < 0.05
            ? SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
            : char
        )
      }

      generatedText += sentence + ' '
    }

    return generatedText.trim()
  }, [showCapitals, showPunctuation, showNumbers, showSymbols])

  const calculateStats = useCallback(() => {
    try {
      if (startTime && timeLeft !== null) {
        const timeElapsed = (selectedTime - timeLeft) / 60 // in minutes
        const wordsTyped = userInput.trim().split(/\s+/).length
        const newWPM = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0
        setWPM(newWPM)

        const accuracyPercent =
          userInput.length > 0
            ? Math.round((charCount / userInput.length) * 100)
            : 100
        setAccuracy(accuracyPercent)

        setProgressData((prevData) => [
          ...prevData,
          {
            time: selectedTime - timeLeft,
            wpm: newWPM,
            accuracy: accuracyPercent,
          },
        ])
      }
    } catch (err) {
      console.error('Error calculating stats:', err)
      setError(
        'An error occurred while calculating stats. Please try refreshing the page.'
      )
    }
  }, [startTime, timeLeft, userInput, charCount, selectedTime])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      setText(generateText())
    }
  }, [mounted, generateText])

  useEffect(() => {
    if (startTime && timeLeft !== null) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(timer)
            setIsFinished(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [startTime, timeLeft])

  // Add a new effect to focus the input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Update the handleInputChange function
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    try {
      const value = e.target.value;
      // Start test on ANY keystroke when not active
      if (!startTime || timeLeft === null) {
        setStartTime(Date.now());
        setTimeLeft(selectedTime);
        setUserInput(value);
        setWPM(0);
        setAccuracy(100);
        setWordCount(0);
        setCharCount(0);
        setProgressData([]);
      } else {
        setUserInput(value);
      }
    } catch (err) {
      console.error('Error handling input:', err);
      setError('An error occurred while processing your input. Please try again.');
    }
  };

  useEffect(() => {
    if (!mounted) return

    let correctChars = 0
    let words = 0
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === text[i]) {
        correctChars++
      }
      if (userInput[i] === ' ' && text[i] === ' ') {
        words++
      }
    }
    setCharCount(correctChars)
    setWordCount(words)

    calculateStats()

    // Generate more text if needed
    if (text.length - userInput.length < DISPLAY_BUFFER) {
      setText((prevText) => prevText + ' ' + generateText())
    }

    // Move the text as the user types in moving mode
    if (typingMode === 'moving' && textRef.current) {
      const inputWidth = inputRef.current?.offsetWidth || 0
      const offset = Math.max(0, userInput.length * 14 - inputWidth / 2)
      textRef.current.style.transform = `translateX(-${offset}px)`
    }
  }, [
    userInput,
    text,
    calculateStats,
    generateText,
    typingMode,
    mounted
  ])

  // Update the restart function to focus the input
  const restartTest = () => {
    setUserInput('')
    setStartTime(null)
    setTimeLeft(null)
    setWordCount(0)
    setCharCount(0)
    setWPM(0)
    setAccuracy(100)
    setIsFinished(false)
    setError(null)
    setProgressData([])
    setText(generateText()) // Only generate new text on restart
    if (textRef.current) {
      textRef.current.style.transform = 'translateX(0)'
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  // Calculate the text to display based on userInput and DISPLAY_BUFFER
  const displayText = text.slice(0, userInput.length + DISPLAY_BUFFER)

  // Return early if not mounted
  if (!mounted) return null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
      {/* Controls */}
      <div className="mb-4 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-4">
          <div className="flex items-center">
            <Checkbox
              id="capitals"
              checked={showCapitals}
              onCheckedChange={() => setShowCapitals(!showCapitals)}
            />
            <label
              htmlFor="capitals"
              className="ml-2 text-sm font-medium leading-none cursor-pointer"
            >
              Show Capitals
            </label>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="punctuation"
              checked={showPunctuation}
              onCheckedChange={() => setShowPunctuation(!showPunctuation)}
            />
            <label
              htmlFor="punctuation"
              className="ml-2 text-sm font-medium leading-none cursor-pointer"
            >
              Show Punctuation
            </label>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="numbers"
              checked={showNumbers}
              onCheckedChange={() => setShowNumbers(!showNumbers)}
            />
            <label
              htmlFor="numbers"
              className="ml-2 text-sm font-medium leading-none cursor-pointer"
            >
              Show Numbers
            </label>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="symbols"
              checked={showSymbols}
              onCheckedChange={() => setShowSymbols(!showSymbols)}
            />
            <label
              htmlFor="symbols"
              className="ml-2 text-sm font-medium leading-none cursor-pointer"
            >
              Show Symbols
            </label>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="movingText"
              checked={typingMode === 'moving'}
              onCheckedChange={() =>
                setTypingMode(typingMode === 'moving' ? 'static' : 'moving')
              }
            />
            <label
              htmlFor="movingText"
              className="ml-2 text-sm font-medium leading-none cursor-pointer"
            >
              Moving Text
            </label>
          </div>
        </div>
        <Button onClick={restartTest}>Restart</Button>
        <Select
          defaultValue="30" // Add this line to set default selection
          onValueChange={(value) => {
            setSelectedTime(Number(value))
            restartTest()
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            {TIME_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Progress Bar */}
      <div className="mb-4">
        <Progress
          value={timeLeft ? (timeLeft / selectedTime) * 100 : 100}
          className="w-full"
        />
      </div>
      {/* Typing Area */}
      {typingMode === 'moving' ? (
        <div className="relative mb-4 h-24 overflow-hidden bg-muted rounded-lg">
          <motion.div
            ref={textRef}
            className="absolute top-0 left-0 whitespace-nowrap p-4 text-2xl typing-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {displayText.split('').map((char, index) => (
              <span
                key={index}
                className={
                  index < userInput.length
                    ? char === userInput[index]
                      ? 'text-emerald-700 dark:text-emerald-400' // Updated color
                      : 'text-red-700 dark:text-red-400' // Updated color
                    : ''
                }
              >
                {char}
              </span>
            ))}
          </motion.div>
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-default"
            value={userInput}
            onChange={handleInputChange}
            disabled={isFinished}
            autoFocus // Add autoFocus
            placeholder="Type to start..."
          />
        </div>
      ) : (
        <>
          <div className="relative mb-4 h-64 overflow-y-auto bg-muted rounded-lg p-4">
            <motion.div
              ref={textRef}
              className="whitespace-pre-wrap text-2xl typing-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {displayText.split('').map((char, index) => (
                <span
                  key={index}
                  className={
                    index < userInput.length
                      ? char === userInput[index]
                        ? 'text-emerald-700 dark:text-emerald-400' // Updated color
                        : 'text-red-700 dark:text-red-400' // Updated color
                      : ''
                  }
                >
                  {char}
                </span>
              ))}
            </motion.div>
          </div>
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            className="w-full h-32 p-4 text-2xl typing-text bg-transparent resize-none border-t border-gray-300 focus:outline-none"
            value={userInput}
            onChange={handleInputChange}
            disabled={isFinished}
            autoFocus // Add autoFocus
            placeholder="Type to start..."
          />
        </>
      )}
      {/* Stats */}
      <div className="flex justify-between mb-4">
        <div>Words: {wordCount}</div>
        <div>WPM: {wpm}</div>
        <div>Accuracy: {accuracy}%</div>
        <div>Time Left: {timeLeft ?? selectedTime}s</div>
      </div>
      
      {/* Results */}
      {isFinished && (
        <div className="mt-8 mb-20"> {/* Add bottom margin */}
          <h2 className="text-2xl font-bold mb-4">Test Results</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Final WPM</h3>
              <p className="text-3xl font-bold">{wpm}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Accuracy</h3>
              <p className="text-3xl font-bold">{accuracy}%</p>
            </div>
          </div>
          <div className="h-64 mb-16"> {/* Increase bottom margin */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={progressData} 
                className="result-chart"
                margin={{ top: 20, right: 30, left: 20, bottom: 25 }} // Increase bottom margin
                barGap={0} // Reduce gap between bar groups
                barSize={30} // Make bars thicker
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  strokeOpacity={0.3} 
                  strokeWidth={2}
                  stroke={theme === 'dark' ? '#374151' : '#E5E7EB'}
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  stroke={theme === 'dark' ? '#E5E7EB' : '#374151'}
                  label={{
                    value: 'Time (s)',
                    position: 'insideBottom', // Change position
                    offset: -15, // Adjust offset
                    style: { 
                      fontWeight: 600,
                      fill: theme === 'dark' ? '#E5E7EB' : '#374151'
                    }
                  }}
                  tick={{ 
                    fontSize: 12, 
                    fontWeight: 500,
                    fill: theme === 'dark' ? '#E5E7EB' : '#374151'
                  }}
                />
                <YAxis
                  yAxisId="left"
                  stroke={theme === 'dark' ? '#E5E7EB' : '#374151'}
                  label={{ 
                    value: 'WPM', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { 
                      fontWeight: 600,
                      fill: theme === 'dark' ? '#E5E7EB' : '#374151'
                    }
                  }}
                  tick={{ 
                    fontSize: 12, 
                    fontWeight: 500,
                    fill: theme === 'dark' ? '#E5E7EB' : '#374151'
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke={theme === 'dark' ? '#E5E7EB' : '#374151'}
                  label={{
                    value: 'Accuracy (%)',
                    angle: 90,
                    position: 'insideRight',
                    style: { 
                      fontWeight: 600,
                      fill: theme === 'dark' ? '#E5E7EB' : '#374151'
                    }
                  }}
                  tick={{ 
                    fontSize: 12, 
                    fontWeight: 500,
                    fill: theme === 'dark' ? '#E5E7EB' : '#374151'
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1F2937' : 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '12px',
                    color: theme === 'dark' ? '#E5E7EB' : '#374151'
                  }}
                  itemStyle={{ 
                    fontWeight: 500,
                    color: theme === 'dark' ? '#E5E7EB' : '#374151'
                  }}
                  labelStyle={{ 
                    fontWeight: 600, 
                    marginBottom: '4px',
                    color: theme === 'dark' ? '#E5E7EB' : '#374151'
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="wpm"
                  name="WPM"
                  fill={theme === 'dark' ? '#818CF8' : '#4F46E5'}
                  opacity={0.9}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={60}
                />
                <Bar
                  yAxisId="right"
                  dataKey="accuracy"
                  name="Accuracy"
                  fill={theme === 'dark' ? '#34D399' : '#10B981'}
                  opacity={0.9}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}

