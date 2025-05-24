import Image from "next/image"

const Logo = () => {
  return (
   <div className="flex items-center gap-2"> 
     <Image 
    height={60}
    width={60}
    alt="logo"
    src="/icons/512-512.png"
    />
    <h1>
        JOB_PORTAL
    </h1>
   </div>
  )
}

export default Logo