const express = require('express')
const router = express.Router()
const postModel = require('../models/post')

const passport = require('passport')
const checkAuth = passport.authenticate("jwt",{session:false})


//@route    POST http://localhost:6000/post/register
//@desc     Register post
//@access   Private
router.post('/register' ,checkAuth, (req,res) => {

    const newPost = new postModel({
        text : req.body.text,
        user : req.user.id,
        name : req.user.name,
        avatar : req.user.avatar
    })

    newPost
        .save()
        .then(post => {
            res.status(200).json(post)
        })
        .catch(err => {
            res.status(500).json({
                message:err.message
            })
        })
})


//retrieve all post
//@route    GET http://localhost:6000/post/
//@desc     Retrieve all post
//@access   Public
router.get('/',(req,res) => {

    postModel
        .find()
        .sort({date : -1}) //최신날짜로 정렬한다(내림차순 정렬, 1이면 오름차순 정렬)
        .then(posts => {
            if(posts.length ===0) {
                return res.status(200).json({
                    message:"게시물이 없습니다."
                })
            }
            res.status(200).json({
                count : posts.length,
                postInfo : posts
            })
        })
        .catch(err => {
            res.status(500).json({
                message:err.message
            })
        })
})



//get detail post
//@route    GET http://localhost:6000/post/:post_id
//@desc     Retrieve detail post
//@access   Public
router.get('/:post_id',(req,res) => {

    const id = req.params.post_id

    postModel
        .findById(id)
        .then(post => {
            return res.status(200).json(post)
        })
        .catch(err => {
            res.status(500).json({
                message : err.message
            })
        })
})



//update post
//@route    Patch http://localhost:6000/post/:post_id
//@desc     Update detil post
//@access   Private
router.patch('/:post_id',checkAuth, (req,res) => {

})



//delete post
//@route    Delete http://localhost:6000/post/:post_id
//@desc     delete detil post
//@access   Private
router.delete('/:post_id',checkAuth,(req,res) => {

    const id = req.params.post_id

    postModel
        .findById(id)
        .then(post => {
          //사용자 식별(작성한 사람과 현재 접속한 사람이 같은지)

          console.log(post)

          if(post.user.toString() !== req.user.id) {
              return res.status(400).json({
                  message:"user not authorized this post"
              })
          }
          post
              .remove()
              .then(() => {
                  res.status(200).json({success : true})
              })
              .catch(err => {
                  res.status(500).json({
                      message:err.message
                  })
              })
        })
        .catch(err => {
            res.status(500).json({
                message : err.message
            })
        })
})




//@route    POST http://localhost:6000/post/like/:post_id
//@desc     Like post
//@access   Private
router.post('/like/:post_id',checkAuth, (req,res) => {

    const id = req.params.post_id

    postModel
        .findById(id)
        .then(post => {
            if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                return res.status(200).json({
                    message: 'user already liked this post'
                })
            }
            else {
                post.likes.unshift({user: req.user.id})
                post
                    .save()
                    .then(post => res.status(200).json(post))
                    .catch(err => {
                        res.status(400).json({
                            message: err.message
                        })
                    })
            }
        })
        .catch(err => {
            res.status(400).json({
                message: err.message
            })
        })
})


//@route    DElete http://localhost:6000/post/unlike/:post_id (좋아요 취소하기)
//@desc     UnLike post
//@access   Private
router.delete('/unlike/:post_id',checkAuth,(req,res) => {

    const id = req.params.post_id

    postModel
        .findById(id)
        .then(post => {
            console.log(post)
            console.log(req.user)
            if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                return res.status(400).json({
                    message: "you have not liked this post"
                })
            }
            else {
                //get Remove index
                const removeIndex = post.likes
                    .map(item => item.user.toString())
                    .indexOf(req.user.id)

                post.likes.splice(removeIndex, 1)

                post
                    .save()
                    .then(post => res.status(200).json(post))
                    .catch(err => {
                        res.status(400).json({
                            message: err.message
                        })
                    })
            }
        })
        .catch(err => {
            res.status(400).json({
                message: err.message
            })
        })
})


module.exports = router