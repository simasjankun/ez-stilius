import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await resend.emails.send({
      from: 'EŽ Stilius <noreply@ezstilius.lt>',
      to: ['info@ezstilius.lt'],
      replyTo: email,
      subject: `[EŽ Stilius] ${subject || 'Nauja žinutė'}: ${name}`,
      html: `
        <h2>Nauja žinutė iš svetainės</h2>
        <p><strong>Vardas:</strong> ${name}</p>
        <p><strong>El. paštas:</strong> ${email}</p>
        <p><strong>Tema:</strong> ${subject || 'Nenurodyta'}</p>
        <p><strong>Žinutė:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
