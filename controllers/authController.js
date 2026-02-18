const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin')
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const sendEmail = require('../utils/sendEmail')


const MaxAttempt = 3;
const lockDuration = {
    1: 30 * 60* 1000, //30 min
    2: 60 * 60 * 1000,//1 hour
}

//@route GET api/auth
//desc Get logged in user
//access private
exports.getLoginUser = async(req, res) => {

    try{
        const admin = await Admin.findById(req.admin.id).select('-password');
     

        if(!admin){
            return res.status(404).json({msg: 'User not found'})
        }
        res.json({
            succes:true,
            _id: admin._id,
            email:admin.email,
            role:admin.role,
            name: admin.name
        })

    }catch(err){
        console.error(err.message);
        res.status(500).json('Server Error')

    }
}

//@route POST api/auth
//desc auth user & get token
//access private

exports.AuthUserToken = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        res.status(400).json({errors : errors.array()});
    }

    const {email, password } = req.body;
    if(! password || !email ){
        return res.status(400).json({msg: 'All fields are required'})
    }
    try{
        const admin = await Admin.findOne({ email }).select('+password');
        if(!admin){
            return res.status(404).json({msg: 'Invalid Credentials'})
        }
        //check manual lock 
        if(admin.lockedManually){
           return res.status(423).json({msg: 'Account locked'})
        }

        //check time locked
       if(admin.lockUntil && admin.lockUntil > new Date()){
        const wait = Math.ceil((admin.lockUntil.getTime() - Date.now()) / 60000)
        return res.status(423).json({
        msg: `Account locked. Try again in ${wait} minute(s)`
         })
        }
        //clear expired lock
        if(admin.lockUntil && admin.lockUntil  <= new Date()){
            admin.lockUntil = null;
            admin.loginAttempts = 0;
            admin.lockLevel = 0
            await admin.save()
        }

        const isMatch = await bcrypt.compare(password,admin.password)

        if(!isMatch){
            admin.loginAttempts +=1;

            if(admin.loginAttempts >= MaxAttempt){
                admin.lockLevel +=1;
                admin.loginAttempts = 0;
            }

            if(admin.lockLevel >=3){
                admin.lockedManually = true;
                admin.lockUntil = null

                 const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #d32f2f;">Account Locked</h2>
              <p>Hello,</p>
              <p>We noticed multiple unsuccessful login attempts on your account associated with this email address.</p>
              <p>As a result, your account has been temporarily locked for security reasons.</p>
              <p>If you believe this was a mistake or you require urgent access, please use the unlock route under the login form to unlock your account!.</p>
              <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #d32f2f;">
                <strong>Status:</strong> Locked after too many failed attempts<br>
                <strong>Next step:</strong> Contact admin or wait if this is your 1st or 2nd lock.
              </div>
              <p>If this activity was not initiated by you, we recommend resetting your password after regaining access.</p>
              <p>Thank you,<br>InvenFlow</p>
            </div>
          `;
                // Send mail to locked account
          try {
            await sendEmail({
              to: email,
              subject: 'Account Locked',
              html,
            });
          } catch (emailErr) {
            console.error('Failed to send lock email:', emailErr);
          }
            }else if(admin.lockLevel > 0) {
                const duration = lockDuration[admin.lockLevel];
                admin.lockUntil = new Date(Date.now() + duration);
            }

            await admin.save();
            return res.status(400).json({msg : 'Invalid Credentials'})
        }

        //password is correct - reset everything and proceed to login

        if(admin.loginAttempts > 0 || admin.lockLevel > 0 ){
            admin.loginAttempts =0;
            admin.lockLevel = 0;
            admin.lockUntil = null;
            admin.lastLogin = Date.now()
            await admin.save()
        }

        const payload = {
            admin : {
                id: admin.id,
                role: admin.role,
                name: admin.name
            }
        }

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: '1d'},
            (err, token) => {
                if(err) throw err;
                res.cookie('token',token,{
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict', // CSRF protection
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                }).json({
                    role:admin.role,
                    adminId:admin.id,
                    name: admin.name
                })
            }

        );

    }catch(err){
        console.error(err.message)
        res.status(500).json({msg: 'Server error'})
    }
}

//@route POST api/auth
//desc register user
//access private

exports.registerAdmin = async (req,res) => {
 const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }

    const {name, email, password, role } = req.body
    try{
        let admin = await Admin.findOne({ email })
        if(admin){
            return res.status(400).json({msg : "User already exists"})
        }
        admin = new Admin({ name,email , password, role});
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password,salt);
        await admin.save();

          const payload = {
            admin : {
                id: admin.id,
                role: admin.role,
                name: admin.name
            }
        }

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: '1d'},
            (err, token) => {
                if(err) throw err;
                res.cookie('token',token,{
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict', // CSRF protection
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                }).json({
                    role:admin.role,
                    adminId:admin.id,
                    name: admin.name
                })
            }

        );


    }catch(err){
        console.error(err.message)
        res.status(500).json({ msg:'Server error'})
    }
}

//forgot password
exports.forgotPassword = async (req, res) => {
    try{
        const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }

    const generateResetToken = async () => {
        const resetToken = crypto.randomBytes(3).toString('hex').toUpperCase();
        const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

        return { resetToken, hashedToken};
    }

   


    const { email } = req.body;
    const admin = await Admin.findOne({ email })
    
    if(!admin){
        await new Promise(resolve => setTimeout(resolve,1000));
        return res.json({ msg: 'If a user with this email exits, a verification code will be sent'})
    }
    const { resetToken, hashedToken } = await generateResetToken();
    admin.resetToken = hashedToken;
    admin.resetTokenExpiry = Date.now() + 3600000;
    await admin.save();
    
    await sendEmail({
        to: email,
        subject: 'Password Reset Verification Code',
        html: `
         <div style="font-family: Arial, sans-serif; background-color: #f9fafc; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; border: 1px solid #e5e7eb;">
  <h2 style="color: #FF3B30; text-align: center; margin-bottom: 10px;">InvenFlow</h2>
  
  <p style="font-size: 16px; color: #333;">Hello,</p>
  <p style="font-size: 16px; color: #333;">
    We received a request to reset your password.  
    Please use the verification code below to proceed:
  </p>

  <div style="text-align: center; margin: 20px 0;">
    <h1 style="font-size: 28px; letter-spacing: 4px; color: #FF3B30; margin: 0;">${resetToken}</h1>
  </div>

  <p style="font-size: 14px; color: #555; text-align: center;">
    ⏳ This code will expire in <strong>1 hour</strong>.
  </p>

  <p style="font-size: 14px; color: #555;">
    If you did not request a password reset, please ignore this email.  
    Your account will remain secure.
  </p>

  <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />

  <p style="font-size: 12px; color: #999; text-align: center;">
    &copy; ${new Date().getFullYear()} InvenFlow. All rights reserved.
  </p>
</div>

        `
    });
    res.json({
        message: 'Verification code sent successfully',
        email: admin.email,
    })

    }catch(err){
        console.error(err.message)
        res.status(500).json({ Error : 'An error occurred while processing your request'})

    }

}

// reset password
exports.ResetPassword = async (req, res) => {
    try{
        const { email, token, newPassword} = req.body;
        if(!email || !token || !newPassword){
            return res.status(400).json({ error: 'All fields are required'})
        }

        const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

        const admin = await Admin.findOne({
            email: email,
            resetToken: hashedToken,
            resetTokenExpiry: { $gt: Date.now()}
        });

        if(!admin){
            return res.status(400).json({ error: 'Invalid or expired verification code'});
        }
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);
        admin.resetToken = undefined;
        admin.resetTokenExpiry = undefined;
        admin.tokenVersion = (admin.tokenVersion || 0) + 1;
        

        await admin.save();

        res.json({
            success: true,
            message: 'Password reset Successful'
        });




    }catch(err){
        console.error('Reset password error' ,err);
        res.status(500).json({ error: 'An error occurred while resetting the password!'});

    }

}

const generateOTP = async () => {
        const OTP = crypto.randomBytes(3).toString('hex').toUpperCase();
        const hashedOTP = crypto
        .createHash('sha256')
        .update(OTP)
        .digest('hex')

        return { OTP, hashedOTP};
    }


exports.RequestOTP =  async (req, res) => {

    try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }

        const { email } = req.body;
        const { OTP, hashedOTP } = await generateOTP()

        const admin = await Admin.findOne({ email});

        if(!admin){
        await new Promise(resolve => setTimeout(resolve,1000));
        return res.json({ msg: 'If a user with this email exits, an OTP  will be sent'})

        }
        admin.OTP = hashedOTP;
        admin.resetOTPExpiry = Date.now() + 3600000;
         await admin.save();


         await sendEmail({
        to: email,
        subject: 'One Time Passcode',
        html: `
         <div style="font-family: Arial, sans-serif; background-color: #f9fafc; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; border: 1px solid #e5e7eb;">
            <h2 style="color: #FF3B30; text-align: center; margin-bottom: 10px;">InvenFlow</h2>
            
            <p style="font-size: 16px; color: #333;">Hello,</p>
            <p style="font-size: 16px; color: #333;">
                We received a request to reset your password.  
                Please use the OTP below to proceed:
            </p>

            <div style="text-align: center; margin: 20px 0;">
                <h1 style="font-size: 28px; letter-spacing: 4px; color: #FF3B30; margin: 0;">${OTP}</h1>
            </div>

            <p style="font-size: 14px; color: #555; text-align: center;">
                ⏳ This code will expire in <strong>1 hour</strong>.
            </p>

            <p style="font-size: 14px; color: #555;">
                If you did not request a password reset, please ignore this email.  
                Your account will remain secure.
            </p>

            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />

            <p style="font-size: 12px; color: #999; text-align: center;">
                &copy; ${new Date().getFullYear()} InvenFlow. All rights reserved.
            </p>
            </div>

        `
    });
    res.json({
        message: 'OTP code sent successfully',
        email: admin.email,
    })

         

    }catch(err){
        console.error(err.messase)
    }
}



//unlock blocked users
exports.unlockUser = async (req, res) => {
  try {
    const { email, OTP } = req.body;
   if(!OTP){
    return res.status(400).json({ error: 'OTP required'})
   }

    const hashedOTP = crypto
        .createHash('sha256')
        .update(OTP)
        .digest('hex');

        const admin = await Admin.findOne({
            email: email,
            OTP : hashedOTP,
            resetOTPExpiry : { $gt: Date.now()}
        });

        if (!admin){
             return res.status(400).json({ error: 'Invalid or expired OTP code'});
        }

  
    // Store previous lock state 
    const wasLocked = admin.lockedManually || (admin.lockUntil && admin.lockUntil > new Date());

    admin.lockedManually = false;
    admin.lockLevel = 0;
    admin.lockUntil = null;
    admin.loginAttempts = 0;

    await admin.save();
    
    await sendEmail({
      to: admin.email,
      subject: 'Account Unlocked',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9fafc; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; border: 1px solid #e5e7eb;">
          <h2 style="color: #007AFF; text-align: center; margin-bottom: 10px;">InvenFlow</h2>
          <p style="font-size: 16px; color: #333;">Hello,</p>
          <p style="font-size: 16px; color: #333;">
            Your account has been unlocked. You can now log in to your account.
          </p>
          <p style="font-size: 14px; color: #555;">
            If you have any questions or concerns, please contact our support team.
          </p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="font-size: 12px; color: #999; text-align: center;">
            &copy; ${new Date().getFullYear()} InvenFlow. All rights reserved.
          </p>
        </div>
      `
    });


  

    res.json({ 
      success: true, 
      message: `User account ${admin.email} unlocked successfully`,
      wasLocked 
    });
  } catch (error) {
    console.error('Error unlocking user:', error);
    res.status(500).json({ 
      success: false,
      error: 'An error occurred while unlocking the user account' 
    });
  }
};





