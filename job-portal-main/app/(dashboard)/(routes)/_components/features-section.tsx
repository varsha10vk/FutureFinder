import FeatureCard from "@/components/FeatureCard";
import Tag from "@/components/tags";
import avatar1 from "@/assets/avatar1.jpg";
import avatar2 from "@/assets/avatar2.jpg";
import avatar3 from "@/assets/avatar3.jpg";
// import avatar4 from "@/assets/images/avatar4.jpg"
import Image from "next/image";
import Avatar from "@/components/Avatar";
import Key from "@/components/Key";

const features = [
    "Asset Library",
    "Code Preview",
    "Flow Mode",
    "Smart Sync",
    "Auto Layout",
    "Fast Search",
    "Smart Guides",
];

export default function Features() {
    return (
        <section >
            <div className="container">
                <div className="flex justify-center">
                    <Tag>
                        Featuring
                    </Tag>
                </div>
                <h2 className="text-6xl font-medium text-center mt-6 max-w-2xl mx-auto">
                    where power meets <span className="text-blue-400
                    ">simplicity</span>
                </h2>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-8 px-3">
                    <FeatureCard
                        title="real-time collaboration"
                        description="work together seamlessly with conflict-free team"
                        className='md:col-span-2 lg:col-span-1'
                    >
                        <div className="aspect-video flex items-center justify-center">
                            <Avatar className="z-40">
                                <Image
                                    src={avatar1} alt="avatar1" className="rounded-full " />
                            </Avatar>
                            <Avatar className="-ml-6 border-indigo-500 z-30">
                                <Image src={avatar2} alt="avatar2" className="rounded-full " />
                            </Avatar>
                            <Avatar className="-ml-6 border-yellow-500 z-20">
                                <Image src={avatar3} alt="avatar3" className="rounded-full " />
                            </Avatar>
                            {/* <Avatar>
                                <Image src={avatar4} alt="avatar4" className="rounded-full "/>
                            </Avatar> */}
                            <Avatar className="-ml-6 border-transparent">
                                <div className="size-full bg-neutral-700 rounded-full inline-flex items-center justify-center gap-1">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <span className="size-1.5 rounded-full bg-white inline-flex" key={i}>
                                        </span>
                                    ))}
                                </div>
                            </Avatar>
                        </div>
                    </FeatureCard>
                    <FeatureCard
                        title="Interactive Activity"
                        description="Enagage yourself make your voice bring noise"
                        className="md:col-span-1 lg:col-span-1'"
                    >
                        <div className="aspect-video flex items-center justify-center">
                            <p className="text-4xl font-extrabold text-slate-600 text-center ">We&apos;ve achieved <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">incredible</span>growth this year</p>
                        </div>
                    </FeatureCard>
                    <FeatureCard
                        title="Be quick"
                        description="work together seamlessly with conflict-free team"
                        className="md:col-span-2 md:col-start-2 lg:col-span-1 lg:col-start-auto"
                    >
                        <div className="aspect-video flex items-center justify-center gap-4">
                            <Key>Voice</Key>
                            <Key>Network</Key>
                            <Key>C&apos;mon</Key>
                        </div>
                    </FeatureCard>
                </div>
                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                    {features.map(features => (
                        <div key={features} className="bg-slate-200 border border-white/10 inline-flex px-3 py-1.5 md:px-5 md:py-2 rounded-2xl gap-3 items-center hover:scale-105 transition duration-500 group">

                            <span className="bg-blue-400 text-neutral-950 size-5 rounded-full inline-flex items-center justify-center text-xl group-hover:rotate-45 transition duration-500">&#10038;</span>
                            <span className="font-medium md:text-lg ">{features}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section >
    )
}
