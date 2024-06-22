var express = require('express');
var router = express.Router();

var dbCon = require('../module/db/con');
var db=require('../module/db/bdModule')
var auto_incriment=require('../module/db/autoIncriment');
var dotenv=require('dotenv').config();

const bcrypt = require('bcrypt');
const saltRounds = 10;

const moment=require('moment');

///////File upload////////
var aws = require('aws-sdk')
var multer = require('multer')
var multerS3 = require('multer-s3-transform')
const sharp = require('sharp');


const {S3_ENDPOINT, BUCKET_NAME}=process.env;

//console.log(S3_ENDPOINT, BUCKET_NAME);
var spaceEndpoint= new aws.Endpoint(S3_ENDPOINT)

var s3 = new aws.S3({ 
    endpoint:spaceEndpoint
})
//var storage = multer.memoryStorage()
var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: BUCKET_NAME,
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      shouldTransform: function (req, file, cb) {
        cb(null, /^image/i.test(file.mimetype))
      },
      transforms: [ {
        id: 'image',
        key: function (req, file, cb) {
          cb(null, Date.now().toString() + "-" + file.originalname)
        },
        transform: function (req, file, cb) {
          cb(null, sharp().resize(1200, 800,{ fit: sharp.fit.inside }))
        }
      }]
    })
  })

  var cpUpload = upload.fields([
    { name: 'QRcode', maxCount: 1 },
    { name: 'file2', maxCount: 1 },
    { name: 'file3', maxCount: 1 },
    { name: 'file4', maxCount: 1 },
    { name: 'file5', maxCount: 1 },
    { name: 'file6', maxCount: 1 }
])

//"sib-api-v3-sdk": "^8.3.0",







/* GET home page. */


router.get('/', async function(req, res, next) {
  try {
    var allredylogin=req.cookies.adminID
    res.render('admin/myadmin',{allredylogin:allredylogin})
  }catch (error) {
    console.log(error);
    return error;
  }
  
});


router.post('/checkuserexist', async function(req, res, next) {
  try {
  await dbCon.connectDB()

  const user= await db.user.findOne({$or: [{rootID:req.body.channelRoot},{email:req.body.regEmail}]})

  await dbCon.closeDB();
  //console.log("check done")
  res.json(user)
} catch (error) {
  console.log(error);
  return error;
}

});

router.post('/addModifyCountry', async function(req, res, next) {
  try {
  await dbCon.connectDB()
//////Check Exist//////
const country= await db.contry.findOne({country:req.body.countryName})
  if(country){
    const updatecountry= await db.contry.findOneAndUpdate({country:req.body.countryName},{$set:{
      country:req.body.countryName,
      countryCode:req.body.countryCode,
      currency:req.body.countryCurrency,
      currencySymbol:req.body.currencySymbol
    }})
    await dbCon.closeDB();
  }else{
    const newcountry= await db.contry({
      country:req.body.countryName,
      countryCode:req.body.countryCode,
      currency:req.body.countryCurrency,
      currencySymbol:req.body.currencySymbol
    });
    await newcountry.save();
    await dbCon.closeDB();
  }

  
  res.json(country)


} catch (error) {
  console.log(error);
  return error;
}

});



router.post('/uploadFundRecive', cpUpload, async function(req, res, next) {
  try {
  await dbCon.connectDB()
  const funfrecive= await db.fundrecive.find();
  if(funfrecive.length >0){
    const updatecountry= await db.fundrecive.findOneAndUpdate({virtualAddress:funfrecive[0].virtualAddress},{$set:{
      virtualAddress:req.body.virtualAddress,
      payNetworkChannel:req.body.networkChannel,
      cryptoCurrency:req.body.cryptoCurrency,
      qrCode:req.files.QRcode[0].transforms[0].location
    }})
    await dbCon.closeDB();
    res.json({});
  }else{
    const newfundrecive= await db.fundrecive({
      virtualAddress:req.body.virtualAddress,
      payNetworkChannel:req.body.networkChannel,
      cryptoCurrency:req.body.cryptoCurrency,
      qrCode:req.files.QRcode[0].transforms[0].location
    });
    await newfundrecive.save();
    await dbCon.closeDB();
    res.json({});
  }
  
} catch (error) {
  console.log(error);
  return error;
}

});

router.post('/getdipositRequest', async function(req, res, next) {
  try {
  await dbCon.connectDB()
  const tangen= await db.tangenLedger.find({status:"Request", transactionType:"Deposit"});
    await dbCon.closeDB();
    res.json(tangen);
  
  
} catch (error) {
  console.log(error);
  return error;
}

});




router.post('/acceptDipositRequest', async function(req, res, next) {
  try {
  await dbCon.connectDB()
 const tangen= await db.tangenLedger.findOneAndUpdate({trasactionID:req.body.trasactionID},{$set:{status:"Accept"}});
 //status:"Accept"
  const user= await db.user.findOne({userID:tangen.userID});
  const usdt= await db.usdtrate.findOne({country:user.country});
  var fiat=Number(tangen.depositAmount) * Number(usdt.usdtRate);
  var uid = (new Date().getTime()).toString(9)
  console.log(usdt);
  console.log(fiat.toFixed(2));
  const transLager= await db.transactionledger({
    userID:user.userID,
    trasactionID:uid,
    /////Transact from
    accountFrom:'',
    userNameFrom:"Top Up",
    /////Transact to/////
    accountTo:user.accountNumber,
    userNameTo:user.userName,
    transactionType:"Deposit",
    depositFaitAmount:fiat,
    dipositusdtAmount:tangen.depositAmount,
    cryptoCurrency:"USDT",
    fiatCurrency:user.currency,
    remarks:" Deposit for top-up account",
    transactionStatus:"Success"
   }) 
   await transLager.save();
   await dbCon.closeDB();
    res.json(tangen);

} catch (error) {
  console.log(error);
  return error;
}

});



router.post('/getWithdrawlRequest', async function(req, res, next) {
  try {
  await dbCon.connectDB()
  const tangen= await db.tangenLedger.find({status:"Request", transactionType:"Withdrawl"});
    await dbCon.closeDB();
    res.json(tangen);
  
  
} catch (error) {
  console.log(error);
  return error;
}

});


router.post('/acceptWithdrawlRequest', async function(req, res, next) {
  try {
  await dbCon.connectDB()
 const tangen= await db.tangenLedger.findOneAndUpdate({trasactionID:req.body.trasactionID},{$set:{status:"Accept"}});
 //status:"Accept"
  const user= await db.user.findOne({userID:tangen.userID});
  const transLager= await db.transactionledger({
    userID:user.userID,
    trasactionID:req.body.trasactionID,
    /////Transact from
    accountFrom:user.accountNumber,
    userNameFrom:user.userName,
    /////Transact to/////
    accountTo:user.accountNumber,
    userNameTo:user.userName,
    transactionType:"Withdrawl",
    withdralFaitAmount:tangen.fiatCurrency,
    withdralusdtAmount:tangen.withdralAmount,
    cryptoCurrency:"USDT",
    fiatCurrency:tangen.currency,
    remarks:"Withdrawl by Crypto Wallet",
    transactionStatus:"Success"
   }) 
   await transLager.save();
    //////Frize Amount  Update//////////
    const myCurrency= await db.mycurrency.findOne({userID:user.userID, currency: tangen.currency});
    if(myCurrency.frzeeFiatAmount && myCurrency.frzeeUsdtAmount){
     var frzeeAmt = Number(myCurrency.frzeeFiatAmount) - Number(tangen.fiatCurrency);
     var frzeeUsdt = Number(myCurrency.frzeeUsdtAmount) - Number(tangen.withdralAmount);
    }else{
     var frzeeAmt = Number(tangen.fiatCurrency);
     var frzeeUsdt = Number(tangen.withdralAmount);
    }

   const myCurrencyFrzee= await db.mycurrency.findOneAndUpdate({userID:user.userID, currency: tangen.currency},{$set:{
    frzeeFiatAmount:frzeeAmt,
    frzeeUsdtAmount:frzeeUsdt,
   }})
   await dbCon.closeDB();
    res.json(tangen);

} catch (error) {
  console.log(error);
  return error;
}

});



router.post('/getmerchantRequest', async function(req, res, next) {
  try {
  await dbCon.connectDB()
  const marchant =  await db.merchant.find({merchantStatus:"Request"})
    await dbCon.closeDB();
    res.json(marchant);
  
  
} catch (error) {
  console.log(error);
  return error;
}

});

router.post('/acceptmerchantRequest', async function(req, res, next) {
  try {
  await dbCon.connectDB()
  const marchant =  await db.merchant.findOneAndUpdate({merchantuserID:req.body.merchantuserID},{
    $set:{merchantStatus:"Accept"}
  })
    await dbCon.closeDB();
    res.json(marchant);
  
  
} catch (error) {
  console.log(error);
  return error;
}

});

router.post('/rejectmerchantRequest', async function(req, res, next) {
  try {
  await dbCon.connectDB()
  const marchant =  await db.merchant.deleteMany({merchantuserID:req.body.merchantuserID})
    await dbCon.closeDB();
    res.json(marchant);
  
  
} catch (error) {
  console.log(error);
  return error;
}

});





router.post('/getverificationRequest', async function(req, res, next) {
  try {
  await dbCon.connectDB()
  const verification= await db.verification.find({varyficatinStatus: 'inReview'});
  //console.log(verification);
    await dbCon.closeDB();
    res.json(verification);
} catch (error) {
  console.log(error);
  return error;
}

});

router.post('/completeVerification', async function(req, res, next) {
  try {
  await dbCon.connectDB();
  const verification= await db.verification.findOneAndUpdate({userID:req.body.userID},{$set:{varyficatinStatus:"Verified"}});
  const user= await db.user.findOneAndUpdate({userID:req.body.userID},{$set:{varyficatinStatus:"Verified"}});
    await dbCon.closeDB();
    res.json(verification);
} catch (error) {
  console.log(error);
  return error;
}

});




router.post('/addCgargesList', async function(req, res, next) {
  try {
  await dbCon.connectDB();
  const cgarg= await db.charges.findOne({limitAmount: Number(req.body.limitAmount),currency: req.body.currencyFee});
  if(cgarg){
        const cgargedd = await db.charges.findOneAndUpdate({limitAmount: Number(req.body.limitAmount),currency: req.body.currencyFee},{$set:{
          charges: req.body.transactionCgarge,
            limitAmount: Number(req.body.limitAmount),
            currency: req.body.currencyFee
        }});
        await dbCon.closeDB();
        res.send("ok")

  }else{
 const cgarge = await db.charges({
    charges: req.body.transactionCgarge,
    limitAmount: Number(req.body.limitAmount),
    currency: req.body.currencyFee
  });
  await cgarge.save();
  await dbCon.closeDB();
  res.send("ok")
  }

 
} catch (error) {
  console.log(error);
  return error;
}

})


router.post('/getCountryList', async function(req, res, next) {
  try {
  await dbCon.connectDB();
  const country= await db.contry.find();
  await dbCon.closeDB();
  //console.log("check done")
  res.json(country)
} catch (error) {
  console.log(error);
  return error;
}

})

router.post('/getCurrencyList', async function(req, res, next) {
  try {
  await dbCon.connectDB();
  const currency= await db.contry.find({}).distinct('currency');
  await dbCon.closeDB();
  res.json(currency)
} catch (error) {
  console.log(error);
  return error;
}

})





router.post('/updateUsdtRate',  async function(req, res, next) {
  try {
    console.log(req.body)
  await dbCon.connectDB()
  const usdtRate= await db.usdtrate.findOne({country:req.body.country});
  if(usdtRate){
    const updateusdtRate= await db.usdtrate.findOneAndUpdate({country:req.body.country},{$set:{
      usdtRate:req.body.usdtRate
    }})
    await dbCon.closeDB();
    res.json({});
  }else{
    const newusdtRate= await db.usdtrate({
      country:req.body.country,
      currency:req.body.currency,
      usdtRate:req.body.usdtRate
    });
    await newusdtRate.save();
    await dbCon.closeDB();
    res.json({});
  }
  
} catch (error) {
  console.log(error);
  return error;
}

});

router.post('/usdtList',  async function(req, res, next) {
  try {
  await dbCon.connectDB()
  const usdtRate= await db.usdtrate.find({});
    await dbCon.closeDB();
    res.json(usdtRate);
} catch (error) {
  console.log(error);
  return error;
}

});



router.post('/forgetpasswordlist', async function(req, res, next) {
  try {
    await dbCon.connectDB();
    const fgpsw= await db.forgetPassword.find({status:"New"});
  await dbCon.closeDB();
  res.json(fgpsw);
  }catch (error) {
    console.log(error);
    return error;
  }
  
});

router.post('/setNewPassword', async function(req, res, next) {
  bcrypt.hash(req.body.newPassword, saltRounds, async function(err, hash) {
    await dbCon.connectDB();
    const user= await db.user.findOneAndUpdate({userID:req.body.userID},{$set:{password:hash}});
    const fgpsw= await db.forgetPassword.findOneAndUpdate({userID:Number(req.body.userID),status:"New"},{$set:{status:"Resolve"}});
   //console.log(fgpsw)
    await dbCon.closeDB();
    if(user){
      res.send("ok")
    }else{
      res.send("error")
    }

  });
});


router.post('/setNewPasswordCalcel', async function(req, res, next) {
  bcrypt.hash(req.body.newPassword, saltRounds, async function(err, hash) {
    await dbCon.connectDB();
    const fgpsw= await db.forgetPassword.findOneAndUpdate({userID:Number(req.body.userID),status:"New"},{$set:{status:"Cancel"}});
   
    await dbCon.closeDB();
    res.send("ok")
  

  });
});





module.exports = router;
