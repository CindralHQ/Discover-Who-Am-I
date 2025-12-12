import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
    try {
        const { name, number, email, subject, country, description } = await req.json()

        // Basic validation
        if (!name || !email || !subject || !description) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Configure transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        })

        const mailOptions = {
            from: process.env.SMTP_USER || '"Discover Who Am I" <noreply@example.com>',
            to: 'shibani.sachdeva@gmail.com',
            subject: `Contact Request: ${subject}`,
            text: `
        Name: ${name}
        Number: ${number}
        Email: ${email}
        Country: ${country}
        
        Message:
        ${description}
      `,
            html: `
        <h3>New Contact Request</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Number:</strong> ${number}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p>${description.replace(/\n/g, '<br>')}</p>
      `,
        }

        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log('SMTP credentials not found. Logging email to console:')
            console.log(JSON.stringify(mailOptions, null, 2))
            return NextResponse.json({ message: 'Message logged (SMTP not configured)' }, { status: 200 })
        }

        await transporter.sendMail(mailOptions)

        return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 })
    } catch (error) {
        console.error('Error sending email:', error)
        return NextResponse.json(
            { message: 'Failed to send message' },
            { status: 500 }
        )
    }
}
