type RegisterConfirmHTMLType = {
  HOST: string;
  code: string;
};

export const RegisterConfirmHTML = (data: RegisterConfirmHTMLType): string => `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 20px;">

    <table align="center" bgcolor="#ffffff" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <h1 style="color: #333; font-size: 24px;">Email Confirmation</h1>
                <p style="color: #666; font-size: 16px; margin-top: 20px;">Thank you for signing up! Please click the button below to confirm your email address:</p>
                <a href="${data.HOST}/api/auth/registration-confirmation?code=${data.code}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 4px; font-size: 18px; margin-top: 20px;">Confirm Email</a>
                <p>For further assistance, please contact our support team at <a href="mailto:jihnordraven@gmail.com">jihnordraven@gmail.com</a></p>
            </td>
        </tr>
    </table>

</body>
</html>
`;
