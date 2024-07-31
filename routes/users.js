var express = require('express');
var router = express.Router();

var dbCon = require('../module/db/con');
var db=require('../module/db/bdModule')
var auto_incriment=require('../module/db/autoIncriment');

var smsotp=require('../module/smsotp');

var dotenv=require('dotenv').config();

const moment=require('moment');

const bcrypt = require('bcrypt');
const { ExplainVerbosity } = require('mongodb');
const saltRounds = 10;

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
    { name: 'fundDepositScrn', maxCount: 1 },
    { name: 'filekycId', maxCount: 1 },
    { name: 'fileSelfe', maxCount: 1 },
    { name: 'filekycVideo', maxCount: 1 },
    { name: 'file5', maxCount: 1 },
    { name: 'file6', maxCount: 1 }
])





// var cpUpload = function(){
//   var ii=0
// }

/* GET users listing. */

router.get('/test', async function(req, res, next) {
  try {
    res.render('user/test')
  }catch (error) {
    console.log(error);
    return error;
  }
  
});

// router.get('/test', async function(req, res, next) {
// res.send("jhdfjghjd")
// });


router.get('/', async function(req, res, next) {
  try {
    var allredylogin=req.cookies.userID
    res.render('user/user',{allredylogin:allredylogin})
  }catch (error) {
    console.log(error);
    return error;
  }
  
});



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

router.post('/checkExistuser', async function(req, res, next) {
  try {
  await dbCon.connectDB();
  const user= await db.user.findOne({$or: [{mobile:req.body.mobileNo},{email:req.body.email}]});
  await dbCon.closeDB();
  //console.log("check done")
  res.json(user)
} catch (error) {
  console.log(error);
  return error;
}

});

router.post('/newregister', async function(req, res, next) {
  try {

  
  bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
    auto_incriment.auto_incriment("userID").then(async function(inc_val){
      ////account no exist or not//////
      var accountNumber=new Date().getTime();
       await dbCon.connectDB();
      const user= await db.user.findOne({accountNumber:accountNumber})
      if(!user){
        const register= await db.user({
          userName:"AneyMonus",
          accountNumber:accountNumber,
          multyCurrencyPermition:"No",
          userID:inc_val,
          email:req.body.email,
          password:hash,
          mobile:req.body.mobileNo,
          country:req.body.country,
          countryCode:req.body.countryCode,
          currency:req.body.currency,
          currencySymbol:req.body.currencySymbol,
          varyficatinStatus:"NotVerify",
          accountBalance:"0",
          usdtBalance:"0",
        })
        await register.save();
          const newmyCurrency= await db.mycurrency({
          userID:inc_val,
          currency:req.body.currency,
          currencySymbol:req.body.currencySymbol,
          lastcheckBalance:'0.00',
          lastCheckUsdtAmount:'0.00',
          frzeeFiatAmount:'0.00',
          frzeeUsdtAmount:'0.00',
          lastCheckDate:moment().utc().toDate()
        });
        await newmyCurrency.save();
        await dbCon.closeDB();
        res.send("ok");
      }else{
        await dbCon.closeDB();
        res.send(null)
      }

    })
    

  })
 
} catch (error) {
  console.log(error);
  return error;
}

});


router.post('/loginUser', async function(req, res, next) {
  try {
    await dbCon.connectDB();
    const user= await db.user.findOne({email:req.body.loginEmail})
    ///console.log(user);
    await dbCon.closeDB();
    if(user){
      bcrypt.compare(req.body.loginPassword,user.password, async function(err,match){
        if(match){
          res.cookie("userID", user.userID, { maxAge:  24 * 60 * 60 * 1000 });
          res.json(user);
        }else{
          res.send(null);
        }
      })
    }else{
      res.send(null);
    }
    
    
  }catch (error) {
    console.log(error);
    return error;
  }
  
});










// ////////Profile/////////////
router.post('/logout', async function(req, res, next) {
  res.clearCookie("userID");
  res.send("ok")

})




router.post('/getUser', async function(req, res, next) {
  try {
    await dbCon.connectDB();
    const user= await db.user.findOne({userID:req.body.userID});
    await dbCon.closeDB();
    res.json(user);
  }catch (error) {
    console.log(error);
    return error;
  }
})


router.post('/getDiposit', async function(req, res, next) {
  try {
  await dbCon.connectDB();
  const user= await db.fundrecive.findOne({});
  await dbCon.closeDB();
  res.json(user);
}catch (error) {
  console.log(error);
  return error;
}
})



router.post('/fundDeposit', cpUpload, async function(req, res, next) {
  try {
    var uid = (new Date().getTime()).toString(9)
     await dbCon.connectDB();
    const user= await db.user.findOne({userID:req.body.userID});
    if(user){
      const newDeposit= await db.tangenLedger({
        trasactionID:uid,
        transactionType:"Deposit",
        depositAmount:req.body.depositAmount,
        cryptoCurrency:"USDT",
        cryptoTransactionID:req.body.transactionid,
        screenSort:req.files.fundDepositScrn[0].transforms[0].location,
        userID:user.userID,
        accountNumber:user.accountNumber,
        email:user.email,
        mobile:user.mobile,
        countryCode:user.countryCode,
        status:"Request"
        });
      await newDeposit.save();
      await dbCon.closeDB();
      res.redirect("/user?uid="+uid+"");
    }
  }catch (error) {
    console.log(error);
    return error;
  }
  
});

router.use(function(error,req,res, next){
  console.log(console.log(error));
})

router.post('/kycUpload', cpUpload, async function(req, res, next) {
  //var regxAds = /^(?![ -.&,_'":?!/])(?!.*[- &_'":]$)(?!.*[-.#@&,:?!/]{2})[a-zA-Z0-9- .#@&,_'":.?!/]+$/;
  try {
  //console.log(req.files)
  if(req.files.filekycId && req.files.fileSelfe  && req.files.filekycVideo){
   
   await dbCon.connectDB();
   const newkyc= await db.verification({
    userName:req.body.kycName,
    userID:req.body.userID,
    selfyPicture:req.files.fileSelfe[0].transforms[0].location,
    idProof:req.body.kycID,
    idNo:req.body.kycIdNo,
    idProofPicture:req.files.filekycId[0].transforms[0].location,
    address1:req.body.kycAds1,
    address2:req.body.kycAds2,
    city:req.body.kycCity,
    country:req.body.kycCuntry,
    postCode:req.body.kycPincode,
    videoRecording:req.files.filekycVideo[0].location,
    varyficatinStatus:"inReview",
   });
   await newkyc.save();
   const user= await db.user.findOneAndUpdate({userID:req.body.userID},{$set:{varyficatinStatus:"inReview",userName:req.body.kycName}});
    
   await dbCon.closeDB();
   res.send("verificetion is Under review it will take up to 72hr.")
  }else{
    res.send("Please upload file and try again")
  }

}catch (error) {
  console.log(error);
  return error;
}

});

router.post('/updateMultiCurrencyBalance', async function(req, res, next) {
  try {
    await dbCon.connectDB()
  const multiCurrency= await db.mycurrency.find();
   await dbCon.closeDB();
  for(var i =0; i <  multiCurrency.length; i++){
    await dbCon.connectDB()
    var val= multiCurrency[i];
    var lastcheckBalance = val.lastcheckBalance;
    var lastCheckUsdtAmount = val.lastCheckUsdtAmount;

    const data= await ledgerBalanceCalculetor({currency:val.currency,userID:val.userID});
   
       if(Number(data[0].deposit) > 0){
          lastcheckBalance=Number(lastcheckBalance) + Number(data[0].deposit);
          lastCheckUsdtAmount=Number(lastCheckUsdtAmount) + Number(data[0].depositUsdt);

        }

        if(Number(data[0].withdral) > 0){
          lastcheckBalance=Number(lastcheckBalance) - Number(data[0].withdral);
          lastCheckUsdtAmount=Number(lastCheckUsdtAmount) - Number(data[0].withdralUsdt);
        }
      const myCurrency= await db.mycurrency.findOneAndUpdate({currency:val.currency,userID:val.userID},{$set:{
          lastcheckBalance:lastcheckBalance,
          lastCheckUsdtAmount:lastCheckUsdtAmount,
          lastCheckDate:moment().utc().toDate()
      }});
      await dbCon.closeDB();
        if (i === multiCurrency.length - 1) {
          await dbCon.connectDB()
          const multiCurrency2= await db.mycurrency.find();
          await dbCon.closeDB();
          res.json(multiCurrency2);
     }
  }

  }catch (error) {
    console.log(error);
    return error;
  }

});

async function ledgerBalanceCalculetor(req,cb){
  try {
    var out=[];
    const myCurrency= await db.mycurrency.findOne({currency:req.currency,userID:req.userID});
    //console.log(myCurrency)
    var StartTime = "";
    var EndTime = "";
    var depositAmount = 0;
    var depositUsdt = 0;
    var withdralAmount = 0;
    var withdralUsdt = 0;
   

        StartTime = moment(myCurrency.lastCheckDate).utc();
        EndTime = moment().utc();
        console.log(StartTime,EndTime);
        const transacLadger= await db.transactionledger.find({
          date: { $gte: StartTime.toDate(), $lte: EndTime.toDate() },
          transactionStatus:"Success",
          userID:req.userID,
          fiatCurrency:req.currency
          });
          console.log(transacLadger)
          if(transacLadger.length > 0){
            transacLadger.forEach(function(val, indx, arry) {
              if(val.depositFaitAmount){

                depositAmount=Number(depositAmount) + Number(val.depositFaitAmount);
                depositUsdt=Number(depositUsdt) + Number(val.dipositusdtAmount);
                
               
              }

              if(val.withdralFaitAmount){
                withdralAmount=Number(withdralAmount) + Number(val.withdralFaitAmount);
                withdralUsdt=Number(withdralUsdt) + Number(val.withdralusdtAmount);
                
              }

              if (indx === arry.length - 1) {
                out.push({deposit:depositAmount, depositUsdt:depositUsdt,withdral:withdralAmount, withdralUsdt:withdralUsdt});
              }
            });
            

          }else{
           out.push({deposit:0, depositUsdt:0,withdral:0, withdralUsdt:0});
          }
          return out;
  } catch (error) {
    console.log(error);
    return error;
  }
}



router.post('/transactionMiniStatement', async function(req, res, next) {
  try {
  await dbCon.connectDB();
  const trns= await db.transactionledger.find({userID:req.body.userID}).sort({_id:-1}).limit(10);
  await dbCon.closeDB();
  res.json(trns);
}catch (error) {
  console.log(error);
  return error;
}
})

router.post('/getTransactionsDetails', async function(req, res, next) {
  try {
    const out=[]
  await dbCon.connectDB();
  const trns= await db.transactionledger.find({userID:req.body.userID,trasactionID:req.body.trasactionID,TransacFee: {$ne : "Yes"}});
  const mycuerrency= await db.mycurrency.findOne({userID:req.body.userID,currency:trns[0].fiatCurrency});
  const trnsFee= await db.transactionledger.findOne({userID:req.body.userID,trasactionID:req.body.trasactionID,TransacFee:"Yes"});
  await dbCon.closeDB();
  var fromAc=""
  if(trns[0].accountFrom){
   fromAc = trns[0].accountFrom;
  }
  
    console.log(trnsFee);

  var transactionAmt=0;

  if(trns[0].transactionType == "Withdrawl"){
    transactionAmt= trns[0].withdralFaitAmount;
  }else{
    if(trns[0].transactionType == "Deposit"){
    transactionAmt= trns[0].depositFaitAmount;
    }
  }

  var transactionFee=0;
  if(trnsFee){
    if(trnsFee.transactionType == "Withdrawl"){
      transactionFee= trnsFee.withdralFaitAmount;
    }else{
      if(trnsFee.transactionType == "Deposit"){
      transactionFee= trnsFee.depositFaitAmount;
      }
    }
  }
  
  

  res.json({
    status:trns[0].transactionStatus,
    amount:transactionAmt,
    symbol:mycuerrency.currencySymbol,
    fee:transactionFee,
    to:trns[0].userNameTo,
    toAccount:trns[0].accountTo,
    date:trns[0].date,
    referance:"USDT Sale",
    txid:trns[0].trasactionID,
    fromAccount:fromAc,
  })
}catch (error) {
  console.log(error);
  return error;
}
})



router.post('/verifyPassword', async function(req, res, next) {
  try {
   
  await dbCon.connectDB();
  const user= await db.user.findOne({userID:req.body.userID})
   
  await dbCon.closeDB();
  if(user){
    bcrypt.compare(req.body.pasw,user.password, async function(err,match){
      
      if(match){
        res.send("match");
      }else{
        res.send("");
      }
    })
  }
  
}catch (error) {
  console.log(error);
  return error;
}
});

router.post('/setTpin', async function(req, res, next) {
  try {
  await dbCon.connectDB();
  const user= await db.user.findOneAndUpdate({userID:req.body.userID},{$set:{transactionPin:req.body.tpin}});
  res.send("ok");
  await dbCon.closeDB();
}catch (error) {
  console.log(error);
  return error;
}
})


router.post('/senderGetMycurrency', async function(req, res, next) {
  try {
  await dbCon.connectDB();
  const mycuerrency= await db.mycurrency.find({userID:req.body.userID})
  await dbCon.closeDB();
  res.json(mycuerrency);
  
}catch (error) {
  console.log(error);
  return error;
}
})

router.post('/verifyAccountno', async function(req, res, next) {
  try {
  await dbCon.connectDB();
  const reciveruser= await db.user.findOne({accountNumber:req.body.reciverAccountNo});
  if(reciveruser){
    const reciverCurrency= await db.mycurrency.findOne({userID:reciveruser.userID, currency:req.body.senderMyCurrency});
    if(reciverCurrency){
      const senderCurrency= await db.mycurrency.findOne({userID:req.body.senderuserID, currency:req.body.senderMyCurrency});
      await dbCon.closeDB();
      res.json({status:"success",senderCurrency:senderCurrency,reciveruser:reciveruser});
    }else{
      await dbCon.closeDB();
      res.json({status:"currencyNotAvailable"});
    }
  }else{
    await dbCon.closeDB();
    res.json({status:""});
  }
}catch (error) {
  console.log(error);
  return error;
}
})


router.post('/findCharges', async function(req, res, next) {
  try {
    var chargeAmt=0;
    var senderAmount=Number(req.body.senderAmount);
  await dbCon.connectDB();
  const user= await db.user.findOne({userID:req.body.userID})
  const charges= await db.charges.find({currency:user.currency}).sort({'limitAmount':1});
    for(var i=0; i < charges.length; i++){
      console.log(i);
      if(senderAmount <= charges[i].limitAmount){
        console.log(charges[i]);
        chargeAmt=charges[i].charges
        break;
      }
      
    }
  
  await dbCon.closeDB();
  res.send(chargeAmt);
  
}catch (error) {
  console.log(error);
  return error;
}
});

router.post('/sentAmountToReceverAccount', async function(req, res, next) {
  try {
    await dbCon.connectDB();
   
    const senduser = await db.user.findOne({userID:req.body.userID});
    const sendusdtrate = await db.usdtrate.findOne({currency:req.body.senderCurrency});
    const reciveruser = await db.user.findOne({userID:req.body.reciveruserID});
    const symbolcurrency = await db.contry.findOne({currency:req.body.senderCurrency});
    var senderAmount=req.body.senderAmount;
    var senderUsdt=Number(senderAmount) / Number(sendusdtrate.usdtRate);
    var senderCharges=req.body.charge
    var senderusdtChargs=Number(senderCharges) / Number(sendusdtrate.usdtRate);
    var uid = (new Date().getTime()).toString(9);

    if(req.body.txnPin==senduser.transactionPin){
     
      ////////Update Transaction Ledger for Sender ////////////
      const trxLdrWithdral = await db.transactionledger({
        userID:senduser.userID,
        trasactionID:uid,
        /////Transact from
        accountFrom:senduser.accountNumber,
        userNameFrom:senduser.userName,
        /////Transact to/////
        accountTo:reciveruser.accountNumber,
        userNameTo:reciveruser.userName,
        transactionType:"Withdrawl",
        withdralFaitAmount:senderAmount,
        withdralusdtAmount:senderUsdt,
        cryptoCurrency:"USDT",
        fiatCurrency:req.body.senderCurrency,
        remarks:"Transfer",
        transactionStatus:"Success"
      });
      await trxLdrWithdral.save();
     
  
      const trxLdrwithdralchg = await db.transactionledger({
        userID:senduser.userID,
        trasactionID:uid,
        /////Transact from
        accountFrom:senduser.accountNumber,
        userNameFrom:senduser.userName,
        /////Transact to/////
        accountTo:reciveruser.accountNumber,
        userNameTo:reciveruser.userName,
        transactionType:"Withdrawl",
        withdralFaitAmount:senderCharges,
        withdralusdtAmount:senderusdtChargs,
        TransacFee:"Yes",
        cryptoCurrency:"USDT",
        fiatCurrency:req.body.senderCurrency,
        remarks:"Transfer Charges",
        transactionStatus:"Success"
      });
      await trxLdrwithdralchg.save();
  
       ////////Update Transaction Ledger for Recever ////////////
      const trxLdrdeposit = await db.transactionledger({
        userID:reciveruser.userID,
        trasactionID:uid,
        /////Transact from
        accountFrom:senduser.accountNumber,
        userNameFrom:senduser.userName,
        /////Transact to/////
        accountTo:reciveruser.accountNumber,
        userNameTo:reciveruser.userName,
        transactionType:"Deposit",
        depositFaitAmount:senderAmount,
        dipositusdtAmount:senderUsdt,
        cryptoCurrency:"USDT",
        fiatCurrency:req.body.senderCurrency,
        remarks:" Transfer - Deposit ",
        transactionStatus:"Success"
      });
      await trxLdrdeposit.save();
  
      await dbCon.closeDB();
  
      res.json({
        tpin:"Varified",
        status:"Success",
        amount:senderAmount,
        symbol:symbolcurrency.currencySymbol,
        fee:senderCharges,
        to:reciveruser.userName,
        toAccount:reciveruser.accountNumber,
        date:new Date(),
        referance:"USDT Sale",
        txid:uid,
        fromAccount:senduser.accountNumber
      })

    }else{
      res.json({tpin:"fail"})
    }

   
  
}catch (error) {
  console.log(error);
  return error;
}
})




router.post('/getWithdrawlparameter', async function(req, res, next) {
  try {
  await dbCon.connectDB();
  const mycuerrency= await db.mycurrency.find({userID:req.body.userID})
  await dbCon.closeDB();
  res.json(mycuerrency);
  
}catch (error) {
  console.log(error);
  return error;
}
});

router.post('/withdrawlByCrypto', async function(req, res, next) {
  try {
    var usdtrate = Number(req.body.myBalance) / Number(req.body.myUsdtBalance);
    var fait = Number(req.body.UsdtWithdrawlAmt) * Number(usdtrate);
  await dbCon.connectDB();
  const user = await db.user.findOne({userID:req.body.userID});
  var uid = (new Date().getTime()).toString(9);
 
 if(user){
      if(Number(req.body.txnPin) == Number(user.transactionPin)){
       
        const newWithdrawl= await db.tangenLedger({
          trasactionID:uid,
          transactionType:"Withdrawl",
          withdralAmount:req.body.UsdtWithdrawlAmt,
          cryptoWalletAddress:req.body.usdtTokenAddress,
          cryptoCurrency:"USDT",
          fiatCurrency:fait,
          currency:req.body.myCurrency,
          userID:user.userID,
          accountNumber:user.accountNumber,
          email:user.email,
          mobile:user.mobile,
          countryCode:user.countryCode,
          status:"Request"
          });
       await newWithdrawl.save();
       //////Frize Amount  To Lock //////////
       const myCurrency= await db.mycurrency.findOne({userID:req.body.userID, currency: req.body.myCurrency});
       if(myCurrency.frzeeFiatAmount && myCurrency.frzeeUsdtAmount){
        var frzeeAmt=Number(fait)+ Number(myCurrency.frzeeFiatAmount);
        var frzeeUsdt=Number(req.body.UsdtWithdrawlAmt)+ Number(myCurrency.frzeeUsdtAmount);
       }else{
        var frzeeAmt=Number(fait);
        var frzeeUsdt=Number(req.body.UsdtWithdrawlAmt);
       }
       const myCurrencyFrzee= await db.mycurrency.findOneAndUpdate({userID:req.body.userID, currency: req.body.myCurrency},{$set:{
        frzeeFiatAmount:frzeeAmt,
        frzeeUsdtAmount:frzeeUsdt,
       }})
        await dbCon.closeDB();
        res.json({stutas:"200",uid:uid})
      }else{
        await dbCon.closeDB();
        res.json({stutas:"404"})
      }
 }else{
  console.log("UserID Not Found");
 }
}catch (error) {
  console.log(error);
  return error;
}
});


router.post('/newPasswordRequest', async function(req, res, next) {
  try {
    await dbCon.connectDB();
    const user= await db.user.findOne({email:req.body.loginEmail})
    if(user){
      ///////Check previous request/////////
      const fgprexist= await db.forgetPassword.findOne({userID:user.userID,status:"New"});
      if(!fgprexist){
        const forgetPasswor= await db.forgetPassword({
          userName:user.userName,
          userID:user.userID,
          rootID:user.rootID,
          email:user.email,
          mobile:user.mobile,
          newPassword:req.body.newPasw,
          countryCode:user.countryCode,
          status:"New"
        })
        await forgetPasswor.save();
        await dbCon.closeDB();
        res.send("ok")
      }else{
        await dbCon.closeDB();
        res.send(null);
      }

    }else{
      await dbCon.closeDB();
      res.send(null);
    }
  }catch (error) {
    console.log(error);
    return error;
  }
})



router.post('/getmerchant', async function(req, res, next) {
  try {
  await dbCon.connectDB();
  const user= await db.merchant.findOne({merchantuserID:req.body.userID});
  await dbCon.closeDB();
  res.json(user)
} catch (error) {
  console.log(error);
  return error;
}

});


router.post('/becomemerchant', async function(req, res, next) {
  try {
  await dbCon.connectDB();
  const user= await db.user.findOne({userID:req.body.userID});
  const verify= await db.verification.findOne({userID:req.body.userID});
  const merchant= await db.merchant({
    merchantName:user.userName,
    merchantNickname:user.userName,
    merchantuserID:user.userID,
    feedback:100,
    OrderTime:15,
    limitFrom:100,
    limitTo:100000,
    totalFund:100000,
    merchantType:"Bank Tranfer",
    onlineOffline:0,
    postCode:verify.postCode,
    merchantStatus:"Request",
    usdtRate:"88.00",
    mobile:user.mobile,
    countryCode:user.countryCode,
    currency:user.currency,
    currencySymbol:user.currencySymbol
  });
  await merchant.save();
  await dbCon.closeDB();
  res.json(user)
} catch (error) {
  console.log(error);
  return error;
}

});


router.post('/onlineOfflinemMerchant', async function(req, res, next) {
  try {
  await dbCon.connectDB();
  const user= await db.merchant.findOneAndUpdate({merchantuserID:req.body.userID},{$set:{onlineOffline:req.body.onoff}});
  await dbCon.closeDB();
  res.json(user)
} catch (error) {
  console.log(error);
  return error;
}

});

router.post('/mrchSavechanges', async function(req, res, next) {
  try {
  await dbCon.connectDB();
  const user= await db.merchant.findOneAndUpdate({merchantuserID:req.body.userID},{$set:{
    totalFund:req.body.mrchTotalAmt,
      usdtRate:req.body.mrchUsdtRate,
      OrderTime:req.body.mrchOrderTime,
      limitFrom:req.body.mrchLimitFrom,
      limitTo:req.body.mrchLimitTo,
      merchantType:req.body.mrchType
  }});
  await dbCon.closeDB();
  res.json(user)
} catch (error) {
  console.log(error);
  return error;
}

});


router.post('/editmerchantNickname', async function(req, res, next) {
  try {
  await dbCon.connectDB();
  const user= await db.merchant.findOneAndUpdate({merchantuserID:req.body.userID},{$set:{
    merchantNickname:req.body.merchantNickName
  }});
  await dbCon.closeDB();
  res.json(user)
} catch (error) {
  console.log(error);
  return error;
}

});

router.post('/getBankMerchant', async function(req, res, next) {
  try {
  await dbCon.connectDB();
  const user= await db.merchant.find({onlineOffline:1, merchantType: 'Bank Transfer', currency:req.body.myCurrency});
  const usdt = await db.usdtrate.find({});
  const paymentMethod = await db.paymentmethod.findOne({currency:req.body.myCurrency, userID:req.body.userID});
  await dbCon.closeDB();
  console.log("paymentMethod",paymentMethod)
  res.json({user:user,usdt:usdt,payMethod:paymentMethod});
} catch (error) {
  console.log(error);
  return error;
}

});

router.post('/updatePaymentMethod', async function(req, res, next) {
  try {
  await dbCon.connectDB();
  const paymentMethod = await db.paymentmethod.findOne({userID:req.body.userID,paymentMethod:"Bank Transfer"});
  if(paymentMethod){
    const paymentMethodUpdate = await db.paymentmethod.findOneAndUpdate({userID:req.body.userID,paymentMethod:"Bank Transfer"},{
      $set:{
          userID:req.body.userID,
          paymentMethod:req.body.paymentMethod,
          currency:req.body.currency,
          bankName:req.body.bankName,
          accountNo:req.body.accountNo,
          ifscCode:req.body.ifscCode,
          branch:req.body.branch,
          branchDistrict:req.body.branchDistrict,
          sortCode:req.body.sortCode,
          IBAN:req.body.sortCode
      }
    })
    await dbCon.closeDB();
    res.send("ok")
  }else{
    const paymentMethodsave = await db.paymentmethod({
      userID:req.body.userID,
      paymentMethod:req.body.paymentMethod,
      currency:req.body.currency,
      bankName:req.body.bankName,
      accountNo:req.body.accountNo,
      ifscCode:req.body.ifscCode,
      branch:req.body.branch,
      branchDistrict:req.body.branchDistrict,
      sortCode:req.body.sortCode,
      IBAN:req.body.sortCode
    })
    await paymentMethodsave.save();
    await dbCon.closeDB();
    res.send("ok")
  }
} catch (error) {
  console.log(error);
  return error;
}

});

router.post('/createMarchantOrder', async function(req, res, next) {
  try {
  await dbCon.connectDB();
  const marchant= await db.merchant.findOne({merchantuserID:req.body.marchantID});
  const myCurrency = await db.mycurrency.findOne({userID:req.body.userID});
  const user = await db.user.findOne({userID:req.body.userID});
  var marchantPaytoCust = Number(req.body.orderAmt) * Number(req.body.CurrencyRate);
  var frzeUSDT=Number(req.body.orderAmt) / (Number(myCurrency.lastcheckBalance) / Number(myCurrency.lastCheckUsdtAmount))
  var uid = (new Date().getTime()).toString(9)
  
  if(Number(req.body.orderAmt) < (Number(myCurrency.lastcheckBalance) - Number(myCurrency.frzeeFiatAmount))){
  const order = await db.merchantorder({
  userName:user.userName,
  userID:req.body.userID,
  merchantNickname:marchant.merchantNickname,
  merchantuserID:req.body.marchantID,
  OrderID:uid,
  merchantType:marchant.merchantType,
  orderAmount:req.body.orderAmt,
  marchantPaytoCust:marchantPaytoCust,
  orderTime:req.body.orderTime,
  frzeeFiatAmount:req.body.orderAmt,
  frzeeUsdtAmount:frzeUSDT,
  usdtRate:req.body.usdtRate,
  currencyRate:req.body.CurrencyRate,
  currency:req.body.currency,
  currencySymbol:req.body.currencySymbol,
  orderStatus:"Pending"
  });
  await order.save();
  const myCurrencyUpdate = await db.mycurrency.findOneAndUpdate({userID:req.body.userID},{$set:{
  frzeeFiatAmount:Number(myCurrency.frzeeFiatAmount) + Number(req.body.orderAmt),
  frzeeUsdtAmount:Number(myCurrency.frzeeUsdtAmount) + Number(frzeUSDT)
  }});
  const marchantUpdate = await db.merchant.findOneAndUpdate({merchantuserID:req.body.marchantID},{$set:{
    totalFund:Number(marchant.totalFund) - Number(marchantPaytoCust)
    }});

  await dbCon.closeDB();
   res.send("pass")
  }else{
   res.send("fall")
  }

} catch (error) {
  console.log(error);
  return error;
}

});



router.post('/orderList', async function(req, res, next) {
  try {
  await dbCon.connectDB();
  const user = await db.merchantorder.find({userID:req.body.userID,orderStatus:"Pending"});
  await dbCon.closeDB();
  res.json(user);
} catch (error) {
  console.log(error);
  return error;
}

});

router.post('/marchentOrderList', async function(req, res, next) {
  try {
  await dbCon.connectDB();
  const user = await db.merchantorder.find({merchantuserID:req.body.userID, orderStatus:req.body.type});
  await dbCon.closeDB();
  res.json(user);
} catch (error) {
  console.log(error);
  return error;
}
});

router.post('/getBankdetails', async function(req, res, next) {
  try {
  await dbCon.connectDB();
  const user = await db.paymentmethod.findOne({userID:req.body.userID,paymentMethod: "Bank Transfer"});
  await dbCon.closeDB();
  res.json(user);
} catch (error) {
  console.log(error);
  return error;
}
});

router.post('/marchantOrdrtComplete', async function(req, res, next) {
  try {

  await dbCon.connectDB();
  const Order = await db.merchantorder.findOneAndUpdate({OrderID:req.body.OrderID},{$set:{orderStatus:"Complete"}});
  await dbCon.closeDB();
  res.json(Order);
} catch (error) {
  console.log(error);
  return error;
}
});












//db.cashwalletusers.findOneAndUpdate({mobile:'8509239522'},{$set:{userName:'Sukanta Sardar'}})

//{ "_id" : ObjectId("6673b97ffa820251f5d846b2"), "userName" : "CHONDON CHOKROBORTTY", "userID" : 9, "accountNumber" : "1718860159792", "multyCurrencyPermition" : "No", "password" : "$2b$10$8I7LxDi1b9NmiyOsboBiZ.CBjinKDODHd8geZd1gBSO1lRnYz538S", "email" : "chondon36@gmail.com", "mobile" : "9064104132", "varyficatinStatus" : "inReview", "country" : "India", "countryCode" : "+91", "currency" : "INR", "currencySymbol" : "₹", "accountBalance" : "0", "usdtBalance" : "0", "regdate" : ISODate("2024-06-20T05:09:19.800Z"), "__v" : 0 }




module.exports = router;
