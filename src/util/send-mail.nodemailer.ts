import * as nodemailer from 'nodemailer';
import { EmployeeDTO } from 'src/employee/dto/employee.dto';
import { NoticeMailDTO } from 'src/employee/dto/notice-mail.dto';
// async..await is not allowed in global scope, must use a wrapper
export const sendMail = async (dto: NoticeMailDTO) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'picturestorageofliu@gmail.com', // generated ethereal user
      pass: 'kid14422000', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Alter the dev 👻" <alter@example.com>', // sender address
    to: dto.email, // list of receivers
    subject: 'Account manipulation', // Subject line
    text: 'We are here to inform you that ', // plain text body
    html: '<b>Hello world?</b>', // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};
