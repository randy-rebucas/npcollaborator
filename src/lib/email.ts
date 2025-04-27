import * as Brevo from '@getbrevo/brevo'

interface BrevoEmailOptions {
    to: { email: string; name?: string }[];
    subject: string;
    htmlContent: string;
    sender?: { email: string; name?: string };
}

export class EmailService {
    private readonly brevoClient: Brevo.TransactionalEmailsApi;
    
    constructor() {
        const apiInstance = new Brevo.TransactionalEmailsApi();
        apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY as string);
        this.brevoClient = apiInstance;
    }

    async sendEmail(options: BrevoEmailOptions) {
        const sendSmtpEmail = new Brevo.SendSmtpEmail();
        Object.assign(sendSmtpEmail, {
            to: options.to,
            subject: options.subject,
            htmlContent: options.htmlContent,
            sender: options.sender
        });

        try {
            await this.brevoClient.sendTransacEmail(sendSmtpEmail);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Failed to send email: ${error.message}`);
            }
            throw new Error('Failed to send email: Unknown error');
        }
    }
}
