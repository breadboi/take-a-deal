import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Header from '@/components/header'

const cases: number[] = [1, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750, 1000, 5000, 10000, 25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000]
const caseNumber: number[] = Array.from({ length: cases.length }, (_, i) => i + 1)

const GamePage: React.FunctionComponent = () => {
    const [selectedCase, setSelectedCase] = useState<number | null>(null)
    const [casesLeft, setCasesLeft] = useState<number[]>(cases)
    const [offer, setOffer] = useState<number | null>(null)
    const [gameOver, setGameOver] = useState<boolean>(false)
    const [clickedCases, setClickedCases] = useState<number[]>([])

    const router = useRouter()

    useEffect(() => {
        setCasesLeft(shuffleCases(cases))
    }, [])

    const shuffleCases = (array: number[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const selectCase = (caseNumber: number) => {
        setSelectedCase(caseNumber)
        setCasesLeft(casesLeft.filter(c => c !== caseNumber))
        setClickedCases([...clickedCases, caseNumber])
    }

    const makeOffer = () => {
        // calculate the offer based on the remaining cases
        const remainingSum = casesLeft.reduce((acc, val) => acc + val, 0)
        const remainingCount = casesLeft.length
        const average = Math.round(remainingSum / remainingCount)
        setOffer(average)
    }

    const acceptOffer = () => {
        setGameOver(true)
        router.push("/game-over")
    }

    return (
        <>
            <Header></Header>
            {gameOver ? (
                <div>Game over!</div>
            ) : (
                <>
                    <div>Select a case to reveal its value:</div>
                    <div className="grid grid-cols-4 gap-4">
                        {caseNumber.map((c, i) => (
                            <button
                                className={`bg-gray-200 py-3 px-6 rounded-lg text-lg ${selectedCase === cases[i] || clickedCases.includes(cases[i]) ? `text-red-500` : null}`}
                                onClick={() => selectCase(cases[i])}
                                disabled={clickedCases.includes(cases[i])}
                            >
                                {selectedCase === cases[i] || clickedCases.includes(cases[i]) ? cases[i] : c}
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-around">
                        {offer ? (
                            <div>
                                <div className="text-4xl">Offer: {offer}</div>
                                <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600" onClick={acceptOffer}>Accept Offer</button>
                                <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600" onClick={makeOffer}>Make Offer</button>
                            </div>
                        ) : (
                            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600" onClick={makeOffer}>Make Offer</button>
                        )}
                    </div>

                </>
            )}
        </>
    )
}

export default GamePage
