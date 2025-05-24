import nodemailer from "nodemailer"
import handlebars from "handlebars"
import toast from "react-hot-toast";
import { ThankyouTemplate } from "./designs/thankyou";
import { SendSelectedTemplate } from "./designs/sendSelected";
import { SendRejectedTemplate } from "./designs/sendRejected";

export const sendMail = async ({
    to,
    name,
    subject,
    body,
}: {
    to: string;
    name: string;
    subject: string;
    body: string;
}) => {
    const {SMTP_PASSWORD, SMTP_EMAIL} = process.env;

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth :{
            user: SMTP_EMAIL,
            pass : SMTP_PASSWORD
        }
    })

    try {
        const textResult = await transport.verify();
        // console.log(text)

    } catch (error) {
        console.log(error)
        toast.error((error as Error)?.message)
        return
    }

    try {
        const sendResult = await transport.sendMail({
            from : SMTP_EMAIL,
            to,
            subject,
            html:body,
        })
        return sendResult;
    } catch (error) {
        console.log(error)
        toast.error((error as Error)?.message)
    }
}

export const compileThankyouEmailTemplate = (name : string) => {
    const template = handlebars.compile(ThankyouTemplate)

    const htmlBody = template({
        name : name
    })

    return htmlBody
}
export const compileSendSelectedTemplate = (name : string) => {
    const template = handlebars.compile(SendSelectedTemplate)

    const htmlBody = template({
        name : name
    })

    return htmlBody
}
export const compileSendRejectedTemplate = (name : string) => {
    const template = handlebars.compile(SendRejectedTemplate)

    const htmlBody = template({
        name : name
    })

    return htmlBody
}