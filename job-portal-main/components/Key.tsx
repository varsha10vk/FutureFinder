import { HtmlHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export default function Key(props: HtmlHTMLAttributes<HTMLDivElement>){
    const {className, children, ...otherProps} = props;
    return(
        <div className={twMerge("size-14 bg-neutral-300 inline-flex items-center justify-center rounded-2xl text-xl font-medium text-neutral-950 w-full", className)} {...otherProps}>
            {children}
        </div>
    )
}