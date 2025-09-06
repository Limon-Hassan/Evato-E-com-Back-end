const nodemailer = require('nodemailer');

async function sendEmailer(email, type, data, next) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.Auth_Email,
      pass: process.env.Auth_Password,
    },
  });
  let subject, html;
  if (type === 'otp') {
    subject = 'Evato e-com by limon ✔';
    html = `'<body style=font-family:Poppins,Arial,sans-serif><table cellpadding=0 cellspacing=0 border=0 width=100%><tr><td style=padding:20px align=center><table cellpadding=0 cellspacing=0 border=0 width=600 class=content style="border-collapse:collapse;border:1px solid #ccc"><tr><td style=background-color:#345c72;padding:40px;text-align:center;color:#fff;font-size:24px class=header>Evato E-com By Limon<tr><td style=padding:40px;text-align:center;font-size:16px;line-height:1.6 class=body>Hello ${data.name}<br>Lorem odio soluta quae dolores sapiente voluptatibus recusandae aliquam fugit ipsam.<br><br>otp is ${data.otp}.<tr><td style="padding:0 40px 0 40px;text-align:center"><table cellpadding=0 cellspacing=0 style=margin:auto><tr><td style="background-color:#345c72;padding:10px 20px;border-radius:5px"align=center><a href=https://www.yourwebsite.com style=color:#fff;text-decoration:none;font-weight:700 target=_blank>Book a Free Consulatation</a></table><tr><td style=padding:40px;text-align:left;font-size:16px;line-height:1.6 class=body>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam corporis sint eum nemo animi velit exercitationem impedit.<tr><td style=background-color:#333;padding:40px;text-align:center;color:#fff;font-size:14px class=footer>Copyright © 2024 | Evato E-com By Limon</table></table>'`;
  } else if (type === 'orderConfirmed') {
    subject = 'Order Confirmation';
    html = `'<body style=font-family:Poppins,Arial,sans-serif><table cellpadding=0 cellspacing=0 border=0 width=100%><tr><td style=padding:20px align=center><table cellpadding=0 cellspacing=0 border=0 width=600 class=content style="border-collapse:collapse;border:1px solid #ccc"><tr><td style=background-color:#345c72;padding:40px;text-align:center;color:#fff;font-size:24px class=header>Evato E-com By Limon<tr><td style=padding:40px;text-align:center;font-size:16px;line-height:1.6 class=body>Hello ${data.name}!<br>Your Order Has been Confirmed !.<br><br>Your OrderID is ${data.orderID}.<tr><td style="padding:0 40px 0 40px;text-align:center"><table cellpadding=0 cellspacing=0 style=margin:auto><tr><td style="background-color:#345c72;padding:10px 20px;border-radius:5px"align=center><a href=https://www.yourwebsite.com style=color:#fff;text-decoration:none;font-weight:700 target=_blank>Book a Free Consulatation</a></table><tr><td style=padding:40px;text-align:left;font-size:16px;line-height:1.6 class=body>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam corporis sint eum nemo animi velit exercitationem impedit.<tr><td style=background-color:#333;padding:40px;text-align:center;color:#fff;font-size:14px class=footer>Copyright © 2024 | Evato E-com by Limon</table></table>'`;
  } else if (type === 'orderDelivered') {
    subject = 'order Delivered';
    html = `'<body style=font-family:Poppins,Arial,sans-serif><table cellpadding=0 cellspacing=0 border=0 width=100%><tr><td style=padding:20px align=center><table cellpadding=0 cellspacing=0 border=0 width=600 class=content style="border-collapse:collapse;border:1px solid #ccc"><tr><td style=background-color:#345c72;padding:40px;text-align:center;color:#fff;font-size:24px class=header>Evato E-com By Limon<tr><td style=padding:40px;text-align:center;font-size:16px;line-height:1.6 class=body>Hello ${data.name}!<br>Your Order Has been successfully Delivered !.<br><br>Your OrderID is ${data.orderID}.<tr><td style="padding:0 40px 0 40px;text-align:center"><table cellpadding=0 cellspacing=0 style=margin:auto><tr><td style="background-color:#345c72;padding:10px 20px;border-radius:5px"align=center><a href=https://www.yourwebsite.com style=color:#fff;text-decoration:none;font-weight:700 target=_blank>Book a Free Consulatation</a></table><tr><td style=padding:40px;text-align:left;font-size:16px;line-height:1.6 class=body>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam corporis sint eum nemo animi velit exercitationem impedit.<tr><td style=background-color:#333;padding:40px;text-align:center;color:#fff;font-size:14px class=footer>Copyright © 2024 | Evato E-com By Limon</table></table>'`;
  } else if (type === 'orderCancel') {
    subject = 'Order Cancelation Update';
    html = `'<body style=font-family:Poppins,Arial,sans-serif><table cellpadding=0 cellspacing=0 border=0 width=100%><tr><td style=padding:20px align=center><table cellpadding=0 cellspacing=0 border=0 width=600 class=content style="border-collapse:collapse;border:1px solid #ccc"><tr><td style=background-color:#345c72;padding:40px;text-align:center;color:#fff;font-size:24px class=header>Evato E-com By Limon<tr><td style=padding:40px;text-align:center;font-size:16px;line-height:1.6 class=body>Hello ${data.name}!<br>Your Order Has been Canceled !.<br><br>Your OrderID is ${data.orderID}.<tr><td style="padding:0 40px 0 40px;text-align:center"><table cellpadding=0 cellspacing=0 style=margin:auto><tr><td style="background-color:#345c72;padding:10px 20px;border-radius:5px"align=center><a href=https://www.yourwebsite.com style=color:#fff;text-decoration:none;font-weight:700 target=_blank>Book a Free Consulatation</a></table><tr><td style=padding:40px;text-align:left;font-size:16px;line-height:1.6 class=body>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam corporis sint eum nemo animi velit exercitationem impedit.<tr><td style=background-color:#333;padding:40px;text-align:center;color:#fff;font-size:14px class=footer>Copyright © 2024 | Evato E-com By Limon</table></table>'`;
  } else if (type === 'orderReturn') {
    subject = 'Order Return Update';
    html = `'<body style=font-family:Poppins,Arial,sans-serif><table cellpadding=0 cellspacing=0 border=0 width=100%><tr><td style=padding:20px align=center><table cellpadding=0 cellspacing=0 border=0 width=600 class=content style="border-collapse:collapse;border:1px solid #ccc"><tr><td style=background-color:#345c72;padding:40px;text-align:center;color:#fff;font-size:24px class=header>Evato E-com By Limon<tr><td style=padding:40px;text-align:center;font-size:16px;line-height:1.6 class=body>Hello ${data.name}!<br>Your Order Has been Return !.<br><br>Your OrderID is ${data.orderID}.<tr><td style="padding:0 40px 0 40px;text-align:center"><table cellpadding=0 cellspacing=0 style=margin:auto><tr><td style="background-color:#345c72;padding:10px 20px;border-radius:5px"align=center><a href=https://www.yourwebsite.com style=color:#fff;text-decoration:none;font-weight:700 target=_blank>Book a Free Consulatation</a></table><tr><td style=padding:40px;text-align:left;font-size:16px;line-height:1.6 class=body>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam corporis sint eum nemo animi velit exercitationem impedit.<tr><td style=background-color:#333;padding:40px;text-align:center;color:#fff;font-size:14px class=footer>Copyright © 2024 | Evato E-com By Limon</table></table>'`;
  } else {
    subject = 'Notification from Evato E-com';
    html = `'<body style=font-family:Poppins,Arial,sans-serif><table cellpadding=0 cellspacing=0 border=0 width=100%><tr><td style=padding:20px align=center><table cellpadding=0 cellspacing=0 border=0 width=600 class=content style="border-collapse:collapse;border:1px solid #ccc"><tr><td style=background-color:#345c72;padding:40px;text-align:center;color:#fff;font-size:24px class=header>Evato E-com By Limon<tr><td style=padding:40px;text-align:center;font-size:16px;line-height:1.6 class=body>Hello ${data.name}!<br>Thanks for shopping.<tr><td style="padding:0 40px 0 40px;text-align:center"><table cellpadding=0 cellspacing=0 style=margin:auto><tr><td style="background-color:#345c72;padding:10px 20px;border-radius:5px"align=center><a href=https://www.yourwebsite.com style=color:#fff;text-decoration:none;font-weight:700 target=_blank>Book a Free Consulatation</a></table><tr><td style=padding:40px;text-align:left;font-size:16px;line-height:1.6 class=body>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam corporis sint eum nemo animi velit exercitationem impedit.<tr><td style=background-color:#333;padding:40px;text-align:center;color:#fff;font-size:14px class=footer>Copyright © 2024 | Evato E-com By Limon</table></table>'`;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Evato E-com by Limon" <${process.env.Auth_Email}>`,
      to: email,
      subject,
      html,
    });

    console.log('Email sent:', info.messageId);
  } catch (error) {
    next(error);
    console.error('Email sending failed:', error);
  }
}

module.exports = sendEmailer;
