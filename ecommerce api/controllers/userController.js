// Dependencies and Modules
const bcrypt = require("bcrypt");
const transporter = require("../nodemailer.js");

// The "User" variable is defined using a capitalized letter to indicate that what we are using is the "User" model for code readability
const User = require("../models/User.js");
const auth = require("../auth.js")

// User registration with email notification
module.exports.registerUser = (req, res) => {

	if (!req.body.email.includes("@")) {
		return res.status(400).send({ error: "Email invalid" });
	}

	else if (req.body.mobileNo.length !== 11) {
		return res.status(400).send({ error: "Mobile number invalid" });
	}
	
	else if (req.body.password.length < 8) {
		return res.status(400).send({ error: "Password must be atleast 8 characters" });
	}
	
	else {
        User.find({ email: req.body.email })
        .then(existingUser => {
            if (existingUser.length > 0) {
                return res.status(409).send({ error: "Duplicate Email Found" });
            }

            else {
                let newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    mobileNo: req.body.mobileNo,
                    password: bcrypt.hashSync(req.body.password, 10)
                })


                // Save the created object to our database
                return newUser.save()
                .then(registeredUser => {
            		// Client notification
	            	res.status(201).send({
	            		message: "Registered Successfully",
	            		registeredUser: registeredUser
	            	});

		            // Send email notification
		            transporter.sendMail({
		                from: 'group3lemueltoni@gmail.com',
		                to: req.body.email,
		                subject: 'Registration Successful',
		                text: 'Thank you for registering to our ECommerce Website. \n \n Regards: Lemuel & Toni'
		            }, (error, info) => {
		                if (error) {
		                    console.error('Error sending email:', error);
		                }

		                else {
		                    console.log('Email sent:', info.response);
		                }
                	});
            	})
            }
        })
        .catch(err => {
            console.error("Error in saving: ", err);
            return res.status(500).send({ error: "Error in save" });
        });
    }
};


// User authentication
module.exports.loginUser = (req, res) => {
	if(req.body.email.includes("@")) {
		User.findOne({ email : req.body.email })
		.then(result => {
			if(result == null) {
				return res.status(404).send({ error: "No Email Found" });
			}

			else {
				const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

				if (isPasswordCorrect) {
					return res.status(200).send({ access : auth.createAccessToken(result)})
				}

				else {
					return res.status(401).send({ message: "Email and password do not match" });
				}
			}
		})
		.catch(err => {
			console.error("Error in find: ", err)
			return res.status(500).send({ error: "Error in find"})
		})
	}
	
	else {
		return res.status(400).send({error: "Invalid Email"})
	}
};


// Retrieve user details
module.exports.getProfile = (req, res) => {
    const userId = req.user.id;

    User.findById(userId)
    .then(user => {
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Exclude sensitive information like password
        user.password = undefined;

        return res.status(200).send({ user });
    })
    .catch(err => {
    	console.error("Error in fetching user profile", err)
    	return res.status(500).send({ error: 'Failed to fetch user profile' })
    });
};


// Update User as Admin
module.exports.updateUser = (req, res) => {
	const userId = req.params.userId;

    let updateAdminField = {
        isAdmin: true
    }
    
    return User.findByIdAndUpdate(userId, updateAdminField)
    .then(updatedUser => {
        if (!updatedUser) {
        	return res.status(404).send({ error: 'User not found' });
        }
        return res.status(200).send({ 
        	message: 'User updated successfully', 
        	user: updatedUser
        });
    })
    .catch(err => {
    	console.error("Failed in updating the user: ", err)
    	return res.status(500).send({ error: 'Failed to update the user' })
    });
};


// Update Password
module.exports.updatePassword = (req , res) => {

    const { newPassword } = req.body;
    const { id } = req.user;

    User.findByIdAndUpdate(id)
    .then(user => {
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        else {
        	// Update the user's password
        	user.password = bcrypt.hashSync(newPassword, 10);

        	user.save()
        	.then(() => {
        	    // Send email notification
        	    transporter.sendMail({
        	        from: 'group3lemueltoni@gmail.com',
        	        to: user.email,
        	        subject: 'Password Updated',
        	        text: 'Your password has been successfully updated.'
        	    }, (error, info) => {
        	        if (error) {
        	            console.error('Error sending email:', error);
        	        }

        	        else {
        	            console.log('Email sent:', info.response);
        	        }
        	    });

        	    return res.status(200).send({ message: 'User password updated successfully' });
        	})
        	.catch(err => {
        	    console.error('Error updating password:', err);
        	    return res.status(500).send({ error: 'Failed to update password' });
        	});
        }
    })
    .catch(err => {
        console.error('Error finding user:', err);
        return res.status(500).send({ error: 'Failed to find user' });
    });
}