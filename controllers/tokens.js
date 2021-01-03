const jwt=require('jsonwebtoken')
const guid=require('guid')
const {secret_access}=require('../config/keys')
const Token=require('../Models/tokens')
const bcrypt=require('bcrypt')

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
    // Refresh TOken
    const salt=bcrypt.genSaltSync(Math.round(Math.random()*10)+10)
    await Token.create({unique_id:uniqueId,token: bcrypt.hashSync(accessToken,salt) })
    return {accessToken: accessToken}       
}

//Check access token
async function tokenChecker(req,res,next){
    if(req.signedCookies && req.signedCookies.tokens && req.signedCookies.tokens.accessToken){
        try{
           const decodedAccess = jwt.verify(req.signedCookies.tokens.accessToken,secret_access)
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
       return res.redirect('/login')
    }
}

async function refreshToken(req,res,next){
    const token=jwt.decode(req.signedCookies.tokens.accessToken)
    const oldToken=req.signedCookies.tokens.accessToken
    const refreshToken=await Token.findOne({unique_id: token.unique_id})
    res.clearCookie('tokens')  
    if(refreshToken){
        const result= bcrypt.compareSync(oldToken,refreshToken.token)
            if(result){
                const user={
                    name: token.name,
                    email: token.email,
                    _id: token._id
                }
                await Token.deleteOne({unique_id: token.unique_id})
                const newTokens=await getTokens(user)
                res.cookie('tokens',newTokens,{signed:true,httpOnly:true,maxAge: 2*60*60*1000})
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