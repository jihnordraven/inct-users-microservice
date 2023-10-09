type PasswRecoveryHTML = {
  HOST: string;
  code: string;
};

export const passwRecoveryHTML = (data: PasswRecoveryHTML): string => `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password recovery</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 20px;">

    <table align="center" bgcolor="#ffffff" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <h1 style="color: #333; font-size: 24px;">Password recovery</h1>
                <p style="color: #666; font-size: 16px; margin-top: 20px;">Please click the button below to recovery your password:</p>
                <a href="${data.HOST}/api/auth/password-recovery?code=${data.code}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 4px; font-size: 18px; margin-top: 20px;">Recovery password</a>
                <p>For further assistance, please contact our support team at <a href="mailto:jihnordraven@gmail.com">jihnordraven@gmail.com</a></p>
            </td>
        </tr>
    </table>

</body>
</html>
`;
