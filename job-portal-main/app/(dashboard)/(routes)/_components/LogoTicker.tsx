'use client'
import quantumLogo from "@/assets/company/quantum.svg";
import acmeLogo from "@/assets/company/acme-corp.svg";
import echoValleyLogo from "@/assets/company/echo-valley.svg";
import pulseLogo from "@/assets/company/pulse.svg";
import outsideLogo from "@/assets/company/outside.svg";
import apexLogo from "@/assets/company/apex.svg";
import celestialLogo from "@/assets/company/celestial.svg";
import twiceLogo from "@/assets/company/twice.svg";
import Image from "next/image";
import { Fragment } from "react";
import { motion } from "framer-motion";

const logos = [
    { name: "Quantum", image: quantumLogo },
    { name: "Acme Corp", image: acmeLogo },
    { name: "Echo Valley", image: echoValleyLogo },
    { name: "Pulse", image: pulseLogo },
    { name: "Outside", image: outsideLogo },
    { name: "Apex", image: apexLogo },
    { name: "Celestial", image: celestialLogo },
    { name: "Twice", image: twiceLogo },
];

export default function LogoTicker() {
    return (
        <section className="py-24 overflow-x-clip bg-slate-600 m-10 rounded-lg">
            <div className="container">
                <h3 className="text-center text-white/20 text-3xl">
                    Companies!
                </h3>
                <div className="flex overflow-hidden mt-12 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                    <motion.div 
                    animate={{
                        x:'-50%',
                    }}
                    transition={{
                        duration:30,
                        ease:"linear",
                        repeat:Infinity,
                    }}
                    className="flex flex-none gap-24 pr-24"
                    >
                        {Array.from({ length: 2 }).map((_, i) => (
                            <Fragment key={i}>
                                {logos.map((logo) => (
                                    <Image
                                        src={logo.image}
                                        key={logo.name}
                                        alt={logo.name} />
                                ))}
                            </Fragment>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
