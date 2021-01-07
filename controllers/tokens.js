const jwt=require('jsonwebtoken')
const guid=require('guid')
const {secret_access}=require('../config/keys')
const Token=require('../Models/tokens')
const bcrypt=require('bcrypt')
const User=require('../Models/user')

async function getTokens(user){
// Access Token
const uniqueId=guid.create().value
    const payload={
        name: user.name,
        email: user.email,
        _id: user._id,
        unique_id: uniqueId
    }
    const accessToken=jwt.sign(payload,secret_access,{expiresIn:3600})
    // Refresh Token
    const salt=bcrypt.genSaltSync(10)
    const newRefreshHash=bcrypt.hashSync(accessToken,salt)
    const newRefresh=new Token( {
        unique_id:uniqueId,
        token: bcrypt.hashSync(accessToken,salt)
    })
    await newRefresh.save()
    return {accessToken: accessToken}       
}

//Check access token
async function tokenChecker(req,res,next){
    console.log('Start Checking')
    if(req.signedCookies && req.signedCookies.tokens && req.signedCookies.tokens.accessToken){
        if(req.url=='/login'){
            return res.redirect('/')
        }
        try{
           const decodedAccess = jwt.verify(req.signedCookies.tokens.accessToken,secret_access)
           req.user=await User.findById(decodedAccess._id,{password:0}) 
           next()
        }catch(err){
           if(err.message=='jwt expired'){
               refreshToken(req,res,next)
           }else{
                    res.clearCookie('tokens')
              return  res.redirect('/login') 
                }
            }
    }else{
        if(req.url=='/login'){
            console.log(req.url)
            return next()
        }
      return res.redirect('/login')
    }
}

async function refreshToken(req,res,next){
    console.time('refreshing')
    if(!req.signedCookies || !req.signedCookies.tokens || !req.signedCookies.tokens.accessToken){
        res.clearCookie('tokens')
        return res.redirect('/login')
    }
    const token=jwt.decode(req.signedCookies.tokens.accessToken)
    const oldToken=req.signedCookies.tokens.accessToken
    const refreshToken=await Token.findOne({unique_id: token.unique_id})
    res.clearCookie('tokens')  
    if(refreshToken){
        const result= bcrypt.compareSync(oldToken,refreshToken.token)
            if(result){
               Token.deleteOne({unique_id: token.unique_id},(err,del) => {
                    console.log("Deleted")
                })
                const user={
                    name: token.name,
                    email: token.email,
                    _id: token._id
                }
                const newTokens=await getTokens(user)
                req.user=await User.findById(token._id,{password:0}) 
                res.cookie('tokens',newTokens,{signed:true,httpOnly:true,maxAge: 2*60*60*1000})
                console.timeEnd('refreshing')
                return next()
            }else{
                        res.clearCookie('tokens')
                return res.status(404).send("WT* ????.Don't even try.")
            }
    }else{
        res.clearCookie('tokens')
        return res.redirect('/login')
    }   
}

async function deleteMyToken(req,res){
    const token=jwt.decode(req.signedCookies.tokens.accessToken)
    await Token.deleteOne({unique_id: token.unique_id})
    res.clearCookie('tokens')
    res.redirect('/login')
}
module.exports={getTokens,tokenChecker,deleteMyToken}