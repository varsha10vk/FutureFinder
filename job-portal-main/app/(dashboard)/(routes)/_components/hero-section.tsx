'use client'

import cursorYou from '@/assets/cursor-you.svg'
import { HomeSearchContainer } from '@/components/home-search-components'
import { Button } from "@/components/ui/button"

export default function HeroSection() {
    return (
        <section className="pt-24 overflow-x-clip" style={{
            cursor: `url(${cursorYou.src}), auto`
        }}>
            <div className="container pt-24 relative">
                <div className="flex justify-center">
                    <div className="inline-flex py-1 px-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full text-neutral-950 font-semibold">
                        ✨ $7.5 Annual Income
                    </div>
                </div>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-medium text-center mt-6">
                    Impactful Jobs, created efforlessly
                </h1>
                <div className="flex justify-center mt-10">
                    <HomeSearchContainer/>
                </div>
            </div>
        </section>
    )
}