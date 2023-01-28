import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Header from '@/components/header'
import Head from 'next/head'
import Image from 'next/image'
import briefcasePic from '../public/briefcase.png'

interface Briefcase {
    caseNumber: number,
    caseValue: number
}

const cases: number[] = [1, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750, 1000, 5000, 10000, 25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000]
const caseNumber: number[] = Array.from({ length: cases.length }, (_, i) => i + 1)

const GamePage: React.FunctionComponent = () => {
    const [selectedCase, setSelectedCase] = useState<number | null>(null)
    const [casesLeft, setCasesLeft] = useState<number[]>(cases)
    const [offer, setOffer] = useState<number | null>(null)
    const [gameOver, setGameOver] = useState<boolean>(false)
    const [clickedCases, setClickedCases] = useState<number[]>([])
    const [chosenCase, setChosenCase] = useState<Briefcase | null>(null)

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

    const selectCase = (caseIndex: number, caseValue: number) => {
        if (clickedCases.includes(caseValue)) return
        setSelectedCase(caseValue)
        if (!chosenCase) setChosenCase(({ caseNumber: caseIndex, caseValue: caseValue } as Briefcase))

        if (chosenCase && chosenCase.caseNumber !== caseIndex) {
            setClickedCases([...clickedCases, caseValue])
            setCasesLeft(casesLeft.filter(c => c !== caseValue))
        }
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
        // router.push("/game-over")
    }

    return (
        <>
            <Head>
                <title>Take a Deal</title>
                <meta name="description" content="A Free, Simple, and Open Source Deal or No Deal simulator." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header></Header>
            {gameOver ? (
                <div>You picked case {(chosenCase?.caseNumber ?? 0) + 1}, which was worth {chosenCase?.caseValue}</div>
            ) : (
                <>
                    <h1 className='text-center text-2xl'>Select a case to reveal its value</h1>
                    <div className="grid grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
                        {caseNumber.map((c, i) => (
                            <div key={i} className="relative">
                                <button
                                    className={`py-3 px-1 text-lg ease-in duration-200
                                            ${clickedCases.includes(cases[i]) ? `text-red-600` :
                                            chosenCase?.caseNumber === i ? `text-green-700` :
                                                null
                                        }`}
                                    onClick={() => selectCase(i, cases[i])}
                                    disabled={clickedCases.includes(cases[i]) || chosenCase?.caseNumber === i}
                                >
                                    <Image
                                        src={briefcasePic}
                                        alt="Briefcase"
                                        className="w-full h-full relative object-cover"
                                        sizes="(min-width: 1280px) 14.3vw, (min-width: 1040px) calc(16.82vw - 10px), calc(25vw - 8px)"
                                        priority
                                    />
                                    <div className="absolute inset-0 flex justify-center items-center z-10 p-4 xl:text-3xl font-bold">
                                        {selectedCase === cases[i] || clickedCases.includes(cases[i]) ? cases[i] === chosenCase?.caseValue ? c : cases[i] : c}
                                    </div>

                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-around">
                        {offer ? (
                            <div>
                                <div className="text-4xl">Offer: {offer}</div>
                                <div className="mt-4">
                                    {chosenCase ? <div>Your chosen case: {chosenCase.caseNumber + 1}</div> : null}
                                </div>
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
