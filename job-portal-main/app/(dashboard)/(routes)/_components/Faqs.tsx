'use client'
import Tag from "@/components/tags";
import { AnimatePresence , motion} from "framer-motion";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const faqs = [
    {
        question: "How is Layers different from other design tools?",
        answer: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestiae, labore enim error fuga totam dicta quibusdam corrupti nemo, natus hic sed illo voluptates, explicabo alias. Repellat impedit culpa a! Quae!",
    },
    {
        question: "Is there a learning curve?",
        answer: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestiae, labore enim error fuga totam dicta quibusdam corrupti nemo, natus hic sed illo voluptates, explicabo alias. Repellat impedit culpa a! Quae!",
    },
    {
        question: "How do you handle version control?",
        answer: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestiae, labore enim error fuga totam dicta quibusdam corrupti nemo, natus hic sed illo voluptates, explicabo alias. Repellat impedit culpa a! Quae!",
    },
    {
        question: "Can I work offline?",
        answer: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestiae, labore enim error fuga totam dicta quibusdam corrupti nemo, natus hic sed illo voluptates, explicabo alias. Repellat impedit culpa a! Quae!",
    },
    {
        question: "How does Layers handle collaboration?",
        answer: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestiae, labore enim error fuga totam dicta quibusdam corrupti nemo, natus hic sed illo voluptates, explicabo alias. Repellat impedit culpa a! Quae!",
    },
];

export default function Faqs() {
    const [selectedIndex, setSelectedIndex] = useState(0)
    return (
        <section className="container py-24">
            <div className="flex justify-center">
                <Tag>
                    faqs
                </Tag>
            </div>
            <h2 className="text-6xl font-medium mt-6 text-center  max-w-xl mx-auto ">
                Questions? We&apos;ve got <span className="text-blue-400
                ">answers</span>
            </h2>
            <div className="mt-12 flex flex-col gap-6 max-w-xl mx-auto ">
                {faqs.map((faq, faqIndex) => (
                    <div key={faq.question} className="bg-slate-300 rounded-2xl border border-white/10 p-6">
                        <div className="flex justify-between items-center" onClick={() => setSelectedIndex(faqIndex)}>
                            <h3 className="font-medium">{faq.question}</h3>
                            <svg
                                xmlns="http://www.w3.org/2000/svg" width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={twMerge("feather feather-plus text-blue-400 flex-shrink-0 transtion duration-300", selectedIndex === faqIndex && 'rotate-45')}>
                                <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>

                        </div>
                        <AnimatePresence>
                            {selectedIndex === faqIndex && (
                                <motion.div 
                                initial={{
                                    height: 0,
                                    marginTop:0,
                                }}
                                animate={{
                                    height: 'auto',
                                    marginTop:24,
                                }} 
                                exit={{
                                    height: 0,
                                    marginTop:0,
                                }} 
                                className={
                                    twMerge("overflow-hidden"
                                    )}
                                >
                                    <p className="text-black">{faq.answer}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </section>
    )
}
