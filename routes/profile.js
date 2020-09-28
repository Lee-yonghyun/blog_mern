const express = require('express')
const router = express.Router()
const profileModel = require('../models/profile')
const passport  = require('passport')
const checkAuth = passport.authenticate("jwt", {session : false})



//프로필 등록
//  http://localhost:6000/profiles/register
router.post('/register',checkAuth, (req, res) => {

    const profileFields = {};

    profileFields.user = req.user.id //

    if(req.body.introduce) profileFields.introduce = req.body.introduce;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.gender) profileFields.gender = req.body.gender;
    if(req.body.githubUsername) profileFields.githubUsername = req.body.githubUsername;

    if(typeof req.body.skills !== "undefined" || req.body.skills.length !==0) {
        profileFields.skills = req.body.skills.split(",");
    }

    profileModel
        .findOne({user:req.user.id})
        .then(profile => {
            //profile이 있다면? -> 수정
            if(profile) {

                profileModel
                    .findOneAndUpdate(
                        {user:req.user.id},
                        {$set: profileFields},
                        {new: true}
                    )
                    .then(profile => {
                        res.status(200).json(profile)
                    })
                    .catch(err => {
                        res.status(404).json({
                            message:err.message
                        })
                    })

            }

            //profile이 없다면? -> 추가
            else{
                new profileModel(profileFields)
                    .save()
                    .then(profile => res.status(200).json(profile))
                    .catch(err => {
                        res.status(400).json({
                            message:err.message
                        })
                    })
            }


        })
        .catch(err => {
            res.json({
                message:err.message
            })
        })



})


//프로필 가져오기 (사용자)
router.get('/',checkAuth, (req,res) => {

    profileModel
        .findOne({user:req.user.id})
        .then(profile => {
            if(!profile) {
                return res.status(200).json({
                    message: "no profile"
                })
            }
            else {
                res.status(200).json(profile)
            }
        })
        .catch(err => {
            res.json({
                messgae:err.message
            })
        })
})


//프로필 가져오기 (모든 사용자가 가능하도록)
router.get('/total', (req,res) => {

    profileModel
        .find()
        .populate("user" , "name email avatar")
        .then(profiles => {

            if(profiles.length === 0 ){
                return res.status(200).json({
                    message:"profile not exist"
                })
            }

            else {
                res.status(200).json({
                    count:profiles.length,
                    profiles:profiles
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message:err.message
            })
        })
})


//프로필 삭제하기 (개인)
router.delete('/',checkAuth, (req,res) => {

    profileModel
        .findOneAndDelete({user:req.user.id})
        .then(() => {
            res.status(200).json({
                message:"delete profile"
            })
        } )
        .catch(err => {
            res.status(500).json({
                message:err.message
            })
        })
})


//Add experience
//@route    POST http://localhost:6000/profiles/experience
//@desc     Add experience to profile
//@access   Private
router.post('/experience',checkAuth,(req,res) => {

    profileModel
        .findOne({user:req.user.id})
        .then(profile => {

            const newExperience = {
                title : req.body.title,
                company : req.body.company,
                location : req.body.location,
                from : req.body.from,
                to : req.body.to,
                current : req.body.current,
                description : req.body.description
            };

            profile.experience.unshift(newExperience)

            profile
                .save() //profile을 save한다
                .then(profile => {
                    res.status(200).json(profile)
                })
                .catch(err => {
                    res.status(404).json({
                        message:err.message
                    })
                })

        })
        .catch(err => {
            res.status(404).json({
                message:err.message
            })
        })
})


//Add education
//@route    POST http://localhost:6000/profiles/education
//@desc     Add education to profile
//@access   Private
router.post('/education',checkAuth,(req,res) => {

    profileModel
        .findOne({user:req.user.id})
        .then(profile => {

            const newEducation ={
                school : req.body.school,
                degree : req.body.degree,
                fieldOfStudy : req.body.fieldOfStudy,
                from : req.body.from,
                to : req.body.to,
                current : req.body.current,
                description : req.body.description
            }

            profile.education.unshift(newEducation)

            profile
                .save()
                .then(profile => {
                    res.status(200).json(profile)
                })
                .catch(err => {
                    res.status(404).json({
                        message:err.message
                    })
                })
        })
        .catch(err => {
            res.status(404).json({
                message:err.message
            })
        })
})


module.exports = router