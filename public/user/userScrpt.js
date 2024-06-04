$( document ).ready(function() {
    var allredyloginuserID=$("#allredyloginuserID").val();
    if(allredyloginuserID){
      getUserprofile(allredyloginuserID);
        
    }else{
        loginClick();
    }
    ///////For Password Toggle/////////
    
    // const togglePassword = document.querySelector('#togglePassword');
    // const password = document.querySelector('#regPassword');
    // if(togglePassword && password ){
    //     togglePassword.addEventListener('click', function (e) {
    //         // toggle the type attribute
    //         const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    //         password.setAttribute('type', type);
    //         // toggle the eye slash icon
    //         this.classList.toggle('fa-eye-slash');
    //     });
    // }

 

  
})



// document.getElementById("formDeposit").addEventListener("click", function(event){
  
//   $.ajax( {
//           url: '/user/fundDeposit',
//           type: 'POST',
//           data: new FormData( this ),
//           processData: false,
//           contentType: false,
//           success: function(result){
//             console.log(result)
//               $("#offcanvasDeposit").html(' <div class="row">\
//                   <div  class="col">\
//                     <div class="card" style="">\
//                     <p>Deposit Request Submitted Successfully</br>Transaction ID : '+result.txnID+'</br>It will take Few Minuites</p>\
//                     </div>\
//                   </div>\
//                 </div>');
//           }
//       } );
// event.preventDefault()
// });



function loginClick(){
    $("#view").html('<div class="row mb-3">\
    <div style="text-align: center; margin-top: 15vh;" class="col">\
      <div style="font-size: 35px; font-weight:bold;">Log in</div>\
      <span>Fill the form to log in</span>\
    </div>\
  </div>\
  <div class="card mb-3" style="background-color: #ccdbe6;">\
    <div class="card-body">\
      <div class="mb-3">\
        <label for="loginEmail" class="form-label">Email address</label>\
        <input style=" text-decoration: none;"  type="email" class="form-control" id="loginEmail" aria-describedby="emailHelp">\
      </div>\
      <div class="mb-3">\
        <label for="loginPassword" class="form-label ">Password</label>\
        <input type="password" class="form-control" id="loginPassword">\
      </div>\
    </div>\
  </div>\
  <p onclick="regClick()" class="float-start">Register</p>\
  <p onclick="forgetpassword()" class="float-end">Forget Password</p>\
  <div class="fixed-bottom">\
      <div class="container-fluid mb-3">\
        <div  class="d-grid gap-2">\
          <button onclick="loginProcess()" class="btn btn-primary " type="button">Login</button>\
        </div>\
      </div>\
  </div>');
}

function regClick(){
    $("#view").html('<p onclick="loginClick()" class="mt-2 float-end">Login</p>\
    <div class="row mb-3">\
      <div style="text-align: center; margin-top: 15vh;" class="col">\
        <div style="font-size: 35px; font-weight:bold;">Register Now</div>\
        <span>Create an account</span>\
      </div>\
    </div>\
    <div class="card" style="background-color: #ccdbe6;">\
      <div class="card-body">\
        <div class="mb-3">\
          <label for="exampleInputEmail1" class="form-label">Email address</label>\
          <input style=" text-decoration: none;"  type="email" class="form-control" id="email" aria-describedby="emailHelp">\
\
        <div class="mb-3">\
          <label for="exampleInputEmail1" class="form-label">Mobile Number</label>\
          <div id="mobileGroup" class="input-group mb-3">\
          <span onclick="changeCountry()" class="input-group-text" id="basic-addon1">+91  <i style="font-size: xx-small;" class="fa fa-chevron-down" aria-hidden="true"></i></span>\
            <input type="number" class="form-control" id="mobileNo">\
            <input type="hidden" id="countryCode" value="+91" class="form-control">\
            <input type="hidden" id="currency" value="INR" class="form-control">\
            <input type="hidden" id="currencySymbol" value="&#8377" class="form-control">\
            <input type="hidden" id="country" value="India" class="form-control">\
          </div>\
          <ul id="countryList" style="display: none; height: 20vh; overflow-y: auto;" class="list-group">\
        </ul>\
        </div>\
\
        <div class="mb-3">\
          <label for="exampleInputPassword1" class="form-label">Password</label>\
          <input type="password" class="form-control" id="password">\
        </div>\
        \
      </div>\
    </div>\
      <div class="fixed-bottom">\
        <div class="container-fluid mb-3">\
          <div  class="d-grid gap-2">\
            <button onclick="newRegister()" class="btn btn-primary " type="button">Register</button>\
          </div>\
        </div>\
    </div>');
}


function changeCountry(){
  $.post('/user/getCountryList',{},function(data){
    if(data){
      $("#countryList").css({"display":"block"});
      $("#countryList").html('');
      data.forEach(val => {
        $("#countryList").append('<li onclick="setList(\''+val.country+'\',\''+val.countryCode+'\',\''+val.currency+'\',\''+val.currencySymbol+'\')" class="list-group-item">'+val.country+', '+val.countryCode+'</li>');
      });
    }
})
}

function setList(country,countryCode,currency,currencySymbol){
  $("#countryList").css({"display":"none"});
  $("#mobileGroup").html('<span onclick="changeCountry()" class="input-group-text" id="basic-addon1">'+countryCode+'  <i style="font-size: xx-small;" class="fa fa-chevron-down" aria-hidden="true"></i></span>\
  <input type="number" id="mobileNo" class="form-control">\
  <input type="hidden" id="countryCode" value="'+countryCode+'" class="form-control">\
  <input type="hidden" id="currency" value="'+currency+'" class="form-control">\
  <input type="hidden" id="currencySymbol" value="'+currencySymbol+'" class="form-control">\
  <input type="hidden" id="country" value="'+country+'" class="form-control">');
}


function newRegister(){
  var email=$("#email").val().replace(/\s/g, '');
  var mobileNo=$("#mobileNo").val().trim();
  var country=$("#country").val().trim();
  var countryCode=$("#countryCode").val().trim();
  var currency=$("#currency").val().trim();
  var currencySymbol=$("#currencySymbol").val().trim();
  var password=$("#password").val();

  

  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; 
    if (reg.test(email) == false) 
        {
            alert('Invalid Email Address');
            $("#email").focus();
            return 
        }

        if(mobileNo.length != 10){
          alert('Enter Valid Mobile Number');
          $("#mobileNo").focus()
          return
       }

        if(password.length < 8){
          alert('Password Must be 8 to 18 charecter Capital, small, spacial charc');
          $("#password").focus()
          return
      } 
      ////////Check Exist user///////
      $.post('/user/checkExistuser',{mobileNo:mobileNo,email:email},function(data){
        if(!data){
            //////Register///////////////
            $.post('/user/newregister',{
              email: email,
              mobileNo:mobileNo,
              country:country,
              countryCode:countryCode,
              currency:currency,
              currencySymbol:currencySymbol,
              password:password
            },function(data){
              
              if(data){
                alert("Registration Success")
                 location.replace("/user");
              }else{
                alert("Technical Error Try Again")
              }
          })
           
            }else{
              alert("You Id / Number is register with us")
            }
        })


     


}


function forgetpassword(){
  var loginEmail=$("#loginEmail").val().replace(/\s/g, '');
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; 
  if (reg.test(loginEmail) == false) 
      {
          alert('Invalid Email Address');
          $("#loginEmail").focus();
          return 
      }
     var newPasw = prompt("Enter New Password");

     if(newPasw.length < 6){
          alert('Password Must be 6 to 18 charecter');
          return
          
      } 
      $.post('/user/newPasswordRequest',{loginEmail:loginEmail,newPasw:newPasw},function(data){
          if(data){
              alert("Your Request to set New Password is successfully send to Admin Our executive call you soon" )
          }else{
              alert("User Id Not Match / Allredy has pending Request");
          }
      })


  
}

function logout(){
    $.post('/user/logout',{},function(data){
        if(data){
            location.replace("/user");
           
        }
    })

  }



// function forgetpassword(){
//     var loginEmail=$("#loginEmail").val().replace(/\s/g, '');
//     var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; 
//     if (reg.test(loginEmail) == false) 
//         {
//             alert('Invalid Email Address');
//             $("#loginEmail").focus();
//             return 
//         }
//        var newPasw = prompt("Enter New Password");

//        if(newPasw.length < 6){
//             alert('Password Must be 6 to 18 charecter');
//             return
            
//         } 
//         $.post('/user/newPasswordRequest',{loginEmail:loginEmail,newPasw:newPasw},function(data){
//             if(data){
//                 alert("Your Request to set New Password is successfully send to Admin Our executive call you soon" )
//             }else{
//                 alert("User Id Not Match / Allredy has pending Request");
//             }
//         })


    
// }



// var timerr
// function searchdown(){
//     clearTimeout(timerr);
//   }
//   function searchup(){
//     clearTimeout(timerr);
//     timerr=setTimeout(function(){
//         var sponsorID=$("#sponsorID").val().trim();
//         $("#SponsorName").val("")
//         $("#SponsorRootID").val("")
//         $.post('/user/checkSponsor',{sponsorID:sponsorID},function(data){
//            if(data){
//             //console.log(data)
//             $("#SponsorName").val(data.userName);
//             $("#SponsorRootID").val(data.rootID);

//            }else{
//             alert("Sponsor ID not Match");
//            }
//         });
//     },1000);
//   }


  

  function loginProcess(){
    var loginEmail=$("#loginEmail").val().replace(/\s/g, '');
    var loginPassword=$("#loginPassword").val().trim();

    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; 
      if (reg.test(loginEmail) == false) 
          {
              alert('Invalid Email Address');
              $("#loginEmail").focus();
              return 
          }
          if(loginPassword < 6){
            alert('Password Must be 6 to 18 charecter');
            $("#loginPassword").focus()
            return
        } 

        $.post('/user/loginUser',{loginPassword:loginPassword,loginEmail:loginEmail},function(user){
            if(user){
                location.replace("/user");
            }else{
                alert("Worng Credential")
            }
        })

  }

 async function getUserprofile(userID){
    $("#topnav").css({"display":"block"});
    $("#topBacground").css({"display":"block"});
    $("#footnav").css({"display":"block"});
    $("#topnav").html('<div class="container-fluid">\
      <a> <span style="background-color: #ccdbe6; " class="navbar-toggler-icon" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample"></span></a>\
      <a class="navbar-brand" href="#"><img src="/images/logo/logo.png" alt="Logo" width="120" height="40" class="d-inline-block align-text-top"> </a>\
      <a>\
        <i class="fa fa-bell" aria-hidden="true"></i>\
      </a>\
    </div>\
    \
    <div style="background-color: #3a5c74; color: antiquewhite; width: 80% !important;"  class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">\
      <div class="offcanvas-header">\
        <h5 class="offcanvas-title" id="offcanvasExampleLabel">Profile</h5>\
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>\
      </div>\
      <div id="profileOffcanvas" class="offcanvas-body">\
        <div>\
          Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists, etc.\
        </div>\
        <div class="dropdown mt-3">\
          <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">\
            Dropdown button\
          </button>\
          <ul class="dropdown-menu">\
            <li onclick="logout()"><a class="dropdown-item" data-bs-dismiss="offcanvas" aria-label="Close" href="#">Logout</a></li>\
            <li><a class="dropdown-item" href="#">Another action</a></li>\
            <li><a class="dropdown-item" href="#"  data-bs-dismiss="offcanvas" aria-label="Close">Something else here</a></li>\
          </ul>\
        </div>\
      </div>\
    </div>');
    $("#topBacground").css({"display":"block"});

    $("#view").html('<div style="margin-top: -15vh; background-color: rgb(78, 83, 83); color: antiquewhite;" class="card mb-3">\
        <div id="accounrBalance" class="card-header">\
        </div>\
        <div class="card-body">\
          <div class="row">\
            <div class="col" style="text-align: center;">\
              <button onclick="withdralInt('+userID+')" type="button" class="btn btn-danger"><i class="fa fa-arrow-down" aria-hidden="true"></i></button>\
              <br><span style="font-size:xx-small;" >Withdraw</span>\
            </div>\
            <div class="col"  style="text-align: center;" >\
              <button onclick="sendMoneylInt('+userID+')" type="button" class="btn btn-info"><i class="fa fa-arrow-right" aria-hidden="true"></i></button>\
              <br><span style="font-size:xx-small;" >Send</span>\
            </div>\
            <div class="col" style="text-align: center;">\
              <button type="button" class="btn btn-success"><i class="fa fa-qrcode" aria-hidden="true"></i></button>\
              <br><span style="font-size:xx-small;" >Secn</span>\
            </div>\
            <div class="col" style="text-align: center;">\
              <button type="button" class="btn btn-primary"><i class="fa fa-exchange" aria-hidden="true"></i></button>\
              <br><span style="font-size:xx-small;" >Convert</span>\
            </div>\
          </div>\
        </div>\
      </div>\
      \
    <div style="height: 70vh !important;" class="offcanvas offcanvas-bottom" tabindex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">\
  <div class="offcanvas-header">\
    <h5 class="offcanvas-title" id="offcanvasBottomLabel">Add Fund</h5>\
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>\
  </div>\
    <div id="offcanvasDeposit" class="offcanvas-body small">\
    </div>\
  </div>\
\
<div id="multiCurrency">\
</div>\
<ol id="last10Transaction" style="margin-bottom: 8vh;" class="list-group list-group-numbered list-group-item-dark">\
</ol>')

multiCurrency(userID)
}


function multiCurrency(userID){
  $.post('/user/updateMultiCurrencyBalance',{userID:userID},function(multicurrency){
      if(multicurrency.length > 0 ){
        $("#multiCurrency").html('<div class="row">\
          <div class="col mb-3 mb-sm-0">\
          <div style="background-color: #041b2b; color: #ccdbe6;" class="card">\
            <div class="card-body">\
              <h5 class="card-title">Euro</h5>\
              <p class="card-text">0</p>\
            </div>\
          </div>\
        </div>\
        <div class="col">\
          <div style="background-color: #041b2b; color: #ccdbe6;" class="card">\
            <div class="card-body">\
              <h5 class="card-title">Pound</h5>\
              <p class="card-text">0</p>\
            </div>\
          </div>\
        </div>\
        </div>\
        <div class="row">\
        <div class="col mb-3 mb-sm-0">\
          <div style="background-color: #041b2b; color: #ccdbe6;" class="card">\
            <div class="card-body">\
              <h5 class="card-title">Doller</h5>\
              <p class="card-text">0</p>\
            </div>\
          </div>\
        </div>\
        <div class="col">\
          <div style="background-color: #041b2b; color: #ccdbe6;" class="card">\
            <div class="card-body">\
              <h5 class="card-title">Taka</h5>\
              <p class="card-text">0</p>\
            </div>\
          </div>\
        </div>\
        </div>');

      profile(userID,multicurrency);
      }
    });
  

  
}

  

  function profile(userID,multicurrency){
    
    $.post('/user/getUser',{userID:userID},function(user){
      if(user){
        var aa={};
        multicurrency.forEach(val => {
          if(val.userID==user.userID && val.currency==user.currency){
            aa={fait:val.lastcheckBalance,usdt:val.lastCheckUsdtAmount,cSymbol:val.currencySymbol}
          }
        });
     //console.log(aa);  getUserprofile()
       
        //usdtBalance:String,
        $("#accounrBalance").html('<div  class="row">\
            <div class="col">\
              <p>Balance</p>\
              <p style="font-size: 20px; font-weight:bold;">'+aa.cSymbol+' '+Number(aa.fait).toFixed(2)+' &nbsp; &nbsp; <i onclick="getUserprofile('+userID+')" class="fa fa-refresh" aria-hidden="true"></i><br/><span style="font-size:small;">&#8771; '+Number(aa.usdt).toFixed(2)+' USDT</p>\
            </div>\
            <div class="col">\
              <button type="button" class="btn btn-dark float-end" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom">+</button>\
            </div>\
        </div>');
        var verifyStatus="inReview"
        if(user.varyficatinStatus=="Verified"){
          verifyStatus='<span style="color: green;"><strong>Verified</strong></span>'
        }else{
          if(user.varyficatinStatus=="NotVerify"){
            verifyStatus='<span onclick="verifyNow(\''+userID+'\')" data-bs-dismiss="offcanvas" style="color: red;"><strong>Verify now</strong></span>'
          }
        }

        $("#profileOffcanvas").html('<div class="accordion" id="accordionExample">\
        <div class="accordion-item">\
          <h2 class="accordion-header">\
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">\
              '+user.userName+' &nbsp; &nbsp; '+verifyStatus+'\
            </button>\
          </h2>\
          <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">\
            <div class="accordion-body">\
              <ul class="list-group">\
                <li onclick="copyContent('+user.accountNumber+')" class="list-group-item">\
                  <span>Account no:</span>\
                  <i class="fa fa-clone float-end" aria-hidden="true"></i>\
                  <p class="mt-2">'+user.accountNumber+'</p>\
                </li>\
                <li class="list-group-item">\
                  <span>Account Type:</span>\
                  <p class="mt-2">Crypto</p>\
                </li>\
              </ul>\
            </div>\
          </div>\
        </div>\
        <ul class="list-group mt-3">\
        <li class="list-group-item" onclick="setResetTpin('+userID+')"  data-bs-dismiss="offcanvas" aria-label="Close">Set / Re-set T-Pin</li>\
        <li class="list-group-item" onclick="logout()"  data-bs-dismiss="offcanvas" aria-label="Close">Logout</li>\
        </ul>\
        </div>')

        

        $.post('/user/getDiposit',{},function(diposit){
          if(diposit){
            
            $("#offcanvasDeposit").html('<div class="row">\
            <div  class="col">\
              <div class="card" style="">\
                <img style="width: 50%; margin-left: 25%;" src="'+diposit.qrCode+'" class="card-img-top" alt="QRCODE">\
                <div class="card-body">\
                  <div class="row">\
                    <div  class="col-10">\
                      <span>Network ></span>\
                      <p>BNB Smart Chain (BEP20)</p>\
                    </div>\
                    <div  class="col ">\
                      <i class="fa fa-exchange" aria-hidden="true"></i>\
                    </div>\
                  </div>\
                  <div class="row">\
                    <div  class="col-10">\
                      <span>Deposit Address ></span>\
                      <p>'+diposit.virtualAddress+'</p>\
                    </div>\
                    <div onclick="copyContent(\''+diposit.virtualAddress+'\')" class="col ">\
                      <i class="fa fa-clone" aria-hidden="true"></i>\
                    </div>\
                  </div>\
                  <form id="formDeposit" onsubmit="depositSubmit()" action="/user/fundDeposit"  enctype="multipart/form-data" method="post">\
                      <div class="mb-3">\
                        <label for="exampleInputText1" class="form-label">Transaction ID:</label>\
                        <input type="text" class="form-control" name="transactionid" aria-describedby="textHelp">\
                      </div>\
                      <div class="mb-3">\
                        <label for="exampleInputText1" class="form-label">Deposit USDT Amount: </label>\
                        <input type="text" class="form-control" name="depositAmount" aria-describedby="textHelp">\
                      </div>\
                      <div class="mb-3">\
                        <label for="formFile" class="form-label">Upload Trasactin screen sort:</label>\
                        <input class="form-control" type="file"  name="fundDepositScrn">\
                      </div>\
                      <input type="hidden" name="userID" value="'+userID+'"/>\
                      <div id="fundButton" class="d-grid gap-2">\
                        <button class="btn btn-primary" type="submit">Submit</button>\
                      </div>\
                    </form>\
                </div>\
              </div>\
            </div>\
            </div>');
            transectonList(userID);
            footer(userID);
          }
        });
       }
      })
      
  }

  

  

  function transectonList(userID){
    $("#last10Transaction").html('');
    $.post('/user/transactionMiniStatement',{userID:userID},function(trns){
      if(trns.length > 0){
        trns.forEach(val => {
          var amt=0
          if(val.transactionType=="Deposit"){
            amt=val.depositFaitAmount;
          }else{
            amt=val.withdralFaitAmount;
          }

          $("#last10Transaction").append('<li onclick="transactionDetails(\''+val.trasactionID+'\',\''+userID+'\')" class="list-group-item d-flex justify-content-between align-items-start mb-2">\
            <div class="ms-2 me-auto">\
              <div class="fw-bold">'+val.transactionType+'</div>\
              Txtd:'+val.trasactionID+'<br>Date: '+dateFormat(new Date(val.date),"dt")+'\
            </div>\
            <span class="badge text-bg-primary rounded-pill">'+val.fiatCurrency+' '+Number(amt).toFixed(2)+'</span>\
            </li>');
        });
        
      }else{
        $("#last10Transaction").append('<li class="list-group-item d-flex justify-content-between align-items-start mb-2">\
        <div class="ms-2 me-auto">\
          <div class="fw-bold">No Transaction </div>\
        </div>\
        </li>');
      }
    })
   
    
  }

  function transactionDetails(trasactionID,userID){

    $.post('/user/getTransactionsDetails',{ userID:userID, trasactionID:trasactionID},function(data){
      console.log(data)
      if(!data.TransacFee){
        $("#topBacground").css({"display":"none"});
      $("#view").html('<div class="card" style="margin-top: 8vh; margin-bottom: 8vh; overflow-y: auto; ">\
      <div class="card-body">\
        <div  class="card-header text-center mb-3">\
          <span class="mb-2 p-2">To '+data.to+'</span>\
          <p style="font-size: 30px;">'+data.symbol+' '+Number(data.amount).toFixed(2)+'</p>\
          <span style="border-radius: 10px; border: 1px solid #041b2b; color: #d9e3db; background-color: #0c892b;" class="p-2 h6 ">Fast Transfer</span>\
         </div>\
        <ul  class="list-group">\
          <li class="list-group-item mb-3 p-3 bg-success active" aria-current="true">\
             <span style="font-size: medium;" class="badge float-end">'+data.status+'</span>\
            Status\
          </li>\
          <li class="list-group-item mb-2 p-3">\
            <span style="font-size: medium; color: #000;" class="badge float-end">'+data.toAccount+'</span>\
            To Account No\
          </li>\
          <li class="list-group-item mb-2 p-3">\
            <span style="font-size: medium; color: #000;" class="badge float-end">'+dateFormat(new Date(data.date),"dt")+'</span>\
            Date\
          </li>\
          <li class="list-group-item mb-2 p-3">\
            <span style="font-size: medium; color: #000;" class="badge float-end">'+data.referance+'</span>\
            Referance\
          </li>\
          <li class="list-group-item mb-2 p-3">\
            <span style="font-size: medium; color: #000;" class="badge float-end">'+data.txid+'</span>\
            Transaction ID\
          </li>\
          <li class="list-group-item mb-3 p-3">\
            <span style="font-size: medium; color: #000;" class="badge float-end">'+data.symbol+' '+Number(data.fee).toFixed(2)+'</span>\
            Fee\
          </li>\
          <li class="list-group-item mb-3 p-3">\
            <span style="font-size: medium; color: #000;" class="badge float-end">'+data.fromAccount+'</span>\
            From Account No\
          </li>\
          <li class="list-group-item mb-3 p-3">\
            <button onclick="getUserprofile('+userID+')" type="button" class="btn btn-success">Done</button>\
          </li>\
        </ul>\
      </div>\
    </div>')
      }else{
        alert('This Are the Fee Of TrxnID : '+trasactionID+'')
      }
    })

    
  }


  function dateFormat(date,frmat){  
    var year=date.getFullYear();  
    var month=date.getMonth() + 1; 
    var day=date.getDate();
    var hours=date.getHours();
    var minutes=date.getMinutes();
    if(frmat=="d"){
      return ''+day+'-'+month+'-'+year+''
    }else{
      return ''+day+'-'+month+'-'+year+' '+hours+':'+minutes+''
    }
  }
//console.log(dateFormat(new Date(),"dt"))

  function withdralInt(userID){
    $("#topBacground").css({"display":"none"});
    $("#view").html('<div class="card" style="height: 80vh; margin-top: 10vh; background-color: rgb(78, 83, 83); color: antiquewhite; margin-bottom: 10vh; overflow: auto;">\
    <div class="card-header">\
      <button onclick="closeWithdral()" type="button" class="btn-close float-end"></button>\
      <p class="h1">Withdrawl</p>\
    </div>\
    <div id="withdralTotalBody"  class="card-body">\
    <div class="mb-1 p-3">\
      <label for="formFile" class="form-label">Currency</label>\
      <select id="withdrawlMyCurrency" onchange="changeWithdralCurrency(this.value)"  class="form-select" aria-label="Default select example">\
        <option value="INR">Select Currency</option>\
      </select>\
      <ul id="withdrawalCurrencydetails" class="list-group mt-3">\
        \
      </ul>\
    </div>\
    <div id="withdrawlChannel" style="display:none;" class="mb-1 p-3">\
      <label for="formFile" class="form-label">Select Withdral Channel</label>\
      <select onchange="selectWithdral(this.value,'+userID+')"  class="form-select" aria-label="Default select example">\
        <option selected>Select Option</option>\
        <option value="1">Through Crypto Wallet</option>\
        <option value="2">To Bank Account</option>\
        <option value="3">Cash Collection</option>\
      </select>\
    </div>\
    <div id="withdralBody"  class="card-body">\
    </div>\
    </div>\
   </div>');
   getWidthrawlMycurrency(userID)
  }

  function getWidthrawlMycurrency(userID){
    $("#withdrawlMyCurrency").html('<option value="">Select Currency</option>')
      $.post('/user/senderGetMycurrency',{userID:userID},function(currency){
      if(currency.length > 0 ){
        currency.forEach(val => {
          if(val.frzeeFiatAmount && val.frzeeUsdtAmount){
            var selectValue=''+val.currency+','+val.currencySymbol+','+val.lastcheckBalance+','+val.lastCheckUsdtAmount+','+val.frzeeFiatAmount+','+val.frzeeUsdtAmount+''
          }else{
            var selectValue=''+val.currency+','+val.currencySymbol+','+val.lastcheckBalance+','+val.lastCheckUsdtAmount+',0,0'
          }
          
          $("#withdrawlMyCurrency").append('<option value="'+selectValue+'">'+val.currency+'</option>');
        });
        }
      });
  }

  function changeWithdralCurrency(currency){
    var currency=currency.split(",");
    $("#withdrawlChannel").css({"display":"block"});
     $("#withdrawalCurrencydetails").html('<li class="list-group-item active  bg-gradient" aria-current="true">\
      <span style="font-size: large;" class="badge bg-secondary float-end">USDT '+(Number(currency[3]) - (Number(currency[5]))).toFixed(2)+'</span>\
      '+currency[1]+' '+(Number(currency[2]) - Number(currency[4])).toFixed(2)+'\
      <input id="myCurrency" type="hidden" value="'+currency[0]+'">\
      <input id="myBalance" type="hidden" value="'+currency[2]+'">\
      <input id="myUsdtBalance" type="hidden" value="'+currency[3]+'"></input>\
      </li>')
  }

  function selectWithdral(val,userID){
    var myCurrency=$("#myCurrency").val();
    var myBalance=$("#myBalance").val();
    var myUsdtBalance=$("#myUsdtBalance").val();
   
    switch (val) {
      case "1":
       $("#withdralBody").html(' <div class="mb-3">\
          <label for="exampleInputText1" class="form-label">USDT Token Address</label>\
          <input type="text" class="form-control" id="usdtTokenAddress" aria-describedby="textHelp">\
          <div id="textHelp" class="text">BEP-20 Network Chennel</div>\
        </div>\
        <div class="mb-3">\
          <label for="exampleInputText1" class="form-label">USDT</label>\
          <input type="text" class="form-control" id="UsdtWithdrawl" aria-describedby="textHelp">\
        </div>\
        <div class="mb-3">\
        <label style="width: 50%; margin-left: 25%;" class="form-label text-center">T-Pin</label>\
        <input id="txnPin" type="text" class="form-control text-center" style="width: 50%; margin-left: 25%;">\
        </div>\
        <div class="d-grid gap-2">\
          <button onclick="withdrawlCrypto('+userID+')" class="btn btn-primary" type="button">Submit</button>\
        </div>')
        break;

        case "2":
        $("#withdralBody").html('Please Wait')
        break;

        case "3":
        $("#withdralBody").html('Please Wait')
        
        break;
    
      default:
        break;
    }
  }



  function withdrawlCrypto(userID){
    var myCurrency=$("#myCurrency").val();
    var myBalance=$("#myBalance").val();
    var myUsdtBalance=$("#myUsdtBalance").val();
    var UsdtWithdrawl=$("#UsdtWithdrawl").val().trim();
    var usdtTokenAddress=$("#usdtTokenAddress").val().trim();
    var txnPin=$("#txnPin").val();
    if(Number(myUsdtBalance) >= Number(UsdtWithdrawl) && Number(UsdtWithdrawl)!=0){

      if (usdtTokenAddress.length < 10 ) 
        {
            alert('Enter USDT Token');
            $("#usdtTokenAddress").focus();
            return 
        }

    if (txnPin.length == 0) 
      {
          alert('Enter T-Pin');
          $("#txnPin").focus();
          return 
      }

     $.post('/user/withdrawlByCrypto',{
      userID:userID,
      myCurrency:myCurrency,
      myBalance:myBalance,
      myUsdtBalance:myUsdtBalance,
      UsdtWithdrawlAmt:UsdtWithdrawl,
      usdtTokenAddress:usdtTokenAddress,
      txnPin:txnPin
     },function(data){
      console.log(data)
      if(data.stutas=="200"){
        $("#withdralTotalBody").html('<div class="mb-3">\
        <p>Your Withdrawl is Successfull<br>\
        Transaction Ref Id: '+data.uid+'\
        </P>\
         </div>');
      }else{
        alert('Worng T-Pin Try again');
        $("#txnPin").focus();
      }
     
      });
    }else{
      alert("Worng USDT Amount");
      $("#UsdtWithdrawl").focus();
    }
    

  }

  function closeWithdral(){
    var allredyloginuserID=$("#allredyloginuserID").val();
    if(allredyloginuserID){
      getUserprofile(allredyloginuserID);
        
    }
  }

  function sendMoneylInt(userID){
    $.post('/user/getUser',{userID:userID},function(user){
      if(user.varyficatinStatus=="Verified"){
        $("#topBacground").css({"display":"none"});
          $("#view").html('<div class="card" style="height: 90vh; margin-top: 9vh; background-color: rgb(78, 83, 83); color: antiquewhite;">\
          <div class="card-header">\
            <button onclick="closeWithdral()" type="button" class="btn-close float-end"></button>\
            <p class="h3">Send Money to Crypto Bank</p>\
          </div>\
          <div id="sendAccountDetails" class="mb-3 p-3">\
          <div class="mb-1 p-2">\
            <label for="formFile" class="form-label">Currency</label>\
            <select id="senderMyCurrency" class="form-select" aria-label="Default select example">\
              <option value="INR">Select Currency</option>\
            </select>\
            </div>\
            <div class="mb-3 p-2">\
            <label for="" class="form-label">Account No:</label>\
            <div class="input-group">\
              <input id="reciverAccountNo" type="text" class="form-control" aria-label="" aria-describedby="button-addon2">\
              <button onclick="verifysendAccount('+userID+')" style="color: rgb(27, 201, 109);" class="btn btn-outline-secondary" type="button" id="button-addon2">Verify</button>\
            </div>\
            </div>\
          </div>\
          <div id="sendaccountBody" class="card-body">\
        </div>')
      getMycurrency(userID);

      }else{
        alert("You Need to Your Verify Your Account ")
      }
    })
    
  }

   function getMycurrency(userID){
    $("#senderMyCurrency").html('')
      $.post('/user/senderGetMycurrency',{userID:userID},function(currency){
      if(currency.length > 0 ){
        currency.forEach(val => {
          $("#senderMyCurrency").append('<option value="'+val.currency+'">'+val.currency+'</option>')
        });
        }
      });
  }

  function recentPayment(){
    $("#sendaccountBody").html('<ul class="list-group">\
      <li class="list-group-item active" aria-current="true">Recents</li>\
      <li class="list-group-item">\
        Sukanta Sardar.. 1234567890987\
      </li>\
    </ul>')
  }

  function verifysendAccount(userID){
    var reciverAccountNo=$("#reciverAccountNo").val().trim();
    var senderMyCurrency=$("#senderMyCurrency").val();
    if(reciverAccountNo && senderMyCurrency){
      $.post('/user/verifyAccountno',{reciverAccountNo:reciverAccountNo,senderMyCurrency:senderMyCurrency, senderuserID:userID},function(res){
      if(res.status){
          if(res.status=="success"){
            var senderBalance=Number(res.senderCurrency.lastcheckBalance) - Number(res.senderCurrency.frzeeFiatAmount);
            $("#sendAccountDetails").css({"display":"none"})
            $("#sendaccountBody").html('<p class="h6">Reciver Account Details:<br>Account No: '+res.reciveruser.accountNumber+'</p>\
            <p class="h6">Name: '+res.reciveruser.userName+'</p><hr>\
            <div id="sendDetails" class="mb-3">\
              <label for="exampleInputText1" class="form-label float-end">Blance : '+Number(senderBalance).toFixed(2)+'</label>\
              <input id="senderCurrency" type="hidden" value ="'+senderMyCurrency+'">\
              <input id="senderBalance" type="hidden" value ="'+senderBalance+'">\
              <input id="reciverAccountno" type="hidden" value ="'+res.reciveruser.accountNumber+'">\
              <input id="reciveruserID" type="hidden" value ="'+res.reciveruser.userID+'">\
              <label  for="exampleInputText1" class="form-label">Amount</label>\
              <input id="senderAmount" type="text" class="form-control mb-2" id="exampleInputText1" aria-describedby="textHelp"> \
            </div>\
          <div id="sendBtn" class="d-grid gap-2">\
                  <button onclick="verifyTpin('+userID+')" class="btn btn-primary " type="button">Next</button>\
          </div>');
          }else{
            alert("Reciver Account Not Able to Recive this Currency")
          }
  
          }else{
            alert("Worng Account Number");
          }
        });
    }else{
      alert("Enter Reciver Account Number")
    }
     
 
  }

  function verifyTpin(userID){
    var senderBalance=$("#senderBalance").val();
    var senderAmount=$("#senderAmount").val();

    $.post('/user/findCharges',{senderAmount:senderAmount,userID:userID},function(charge){
      if(charge){
        if(Number(senderBalance) >= Number(senderAmount) + Number(charge)){
          $("#sendDetails").append('<label  class="form-label float-end">Transaction Charge : '+Number(charge).toFixed(2)+'</label>\
          <label style="width: 50%; margin-left: 25%; "  class="form-label text-center">T-Pin</label>\
          <input id="txnPin" type="text" class="form-control text-center" style="width: 50%; margin-left: 25%;">');
          $("#sendBtn").html('<button onclick="sentToReceverAccount('+userID+','+charge+')" class="btn btn-primary " type="button">Send</button>');
          $("#senderAmount").attr('disabled','disabled');
        }else{
          alert("Amount Must Less then Balance");
        }
        }else{
          alert("Error Code :102, Charges Not Apply")
        }
      });
    
    
    
    
  }

  function sentToReceverAccount(userID,charge){
    var senderAmount=$("#senderAmount").val();
    var senderCurrency=$("#senderCurrency").val();

    var reciverAccountno=$("#reciverAccountno").val();
    var reciveruserID=$("#reciveruserID").val();

    var txnPin=$("#txnPin").val();

    if (txnPin.length == 0) 
      {
          alert('Enter T-Pin');
          $("#txnPin").focus();
          return 
      }

    
    $.post('/user/sentAmountToReceverAccount',{
      userID:userID,
      senderAmount:senderAmount,
      senderCurrency:senderCurrency,
      charge:charge,
      reciverAccountno:reciverAccountno,
      reciveruserID:reciveruserID,
      txnPin:txnPin
    },function(data){
      if(data.tpin=="Varified"){
      //<img style="width: 60%; margin-left: 20%;" src="/images/logo/logo.png" class="card-img-top mt-2" alt="...">\
      $("#topBacground").css({"display":"none"});
      $("#view").html('<div class="card" style="margin-top: 8vh; margin-bottom: 8vh; overflow-y: auto; ">\
      <div class="card-body">\
        <div  class="card-header text-center mb-3">\
          <span class="mb-2 p-2">To '+data.to+'</span>\
          <p style="font-size: 30px;">'+data.symbol+' '+Number(data.amount).toFixed(2)+'</p>\
          <span style="border-radius: 10px; border: 1px solid #041b2b; color: #d9e3db; background-color: #0c892b;" class="p-2 h6 ">Fast Transfer</span>\
         </div>\
        <ul  class="list-group">\
          <li class="list-group-item mb-3 p-3 bg-success active" aria-current="true">\
             <span style="font-size: medium;" class="badge float-end">'+data.status+'</span>\
            Status\
          </li>\
          <li class="list-group-item mb-2 p-3">\
            <span style="font-size: medium; color: #000;" class="badge float-end">'+data.toAccount+'</span>\
            To Account No\
          </li>\
          <li class="list-group-item mb-2 p-3">\
            <span style="font-size: medium; color: #000;" class="badge float-end">'+dateFormat(new Date(data.date),"dt")+'</span>\
            Date\
          </li>\
          <li class="list-group-item mb-2 p-3">\
            <span style="font-size: medium; color: #000;" class="badge float-end">'+data.referance+'</span>\
            Referance\
          </li>\
          <li class="list-group-item mb-2 p-3">\
            <span style="font-size: medium; color: #000;" class="badge float-end">'+data.txid+'</span>\
            Transaction ID\
          </li>\
          <li class="list-group-item mb-3 p-3">\
            <span style="font-size: medium; color: #000;" class="badge float-end">'+data.symbol+' '+Number(data.fee).toFixed(2)+'</span>\
            Fee\
          </li>\
          <li class="list-group-item mb-3 p-3">\
            <span style="font-size: medium; color: #000;" class="badge float-end">'+data.fromAccount+'</span>\
            From Account No\
          </li>\
          <li class="list-group-item mb-3 p-3">\
            <button onclick="getUserprofile('+userID+')" type="button" class="btn btn-success">Done</button>\
          </li>\
        </ul>\
      </div>\
    </div>')
      }else{
        alert("Transaction PIN (T-PIN) Varification Fail")
      }

    })

    

  }

/////////Account Verification///////
  function verifyNow(userID){
    $("#topBacground").css({"display":"none"});
    $("#view").html(' <form id="formIdkyc" onsubmit="desebleSubmitBtn()" action="/user/kycUpload"  enctype="multipart/form-data" method="post">\
    <div class="card" style="height: 81vh; margin-top: 9vh; margin-bottom: 10vh; overflow-y: auto; background-color: rgb(78, 83, 83); color: antiquewhite;">\
     <div class="accordion" id="accordionPanelsStayOpenExample">\
       <div class="accordion-item">\
         <h2 class="accordion-header" id="panelsStayOpen-headingOne">\
           <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">\
             KYC Verification:\
           </button>\
         </h2>\
         <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">\
           <div class="accordion-body">\
             <div class="mb-3">\
               <label for="exampleInputText1" class="form-label">Full Name: </label>\
               <input onkeyup="nameUpdate(this.value)" type="text" class="form-control" name="kycName" aria-describedby="textHelp">\
               <div id="textHelp" class="form-text">Name as per Govt ID card</div>\
             </div>\
             <div class="mb-3">\
               <label for="exampleInputText1" class="form-label">Address</label>\
               <input type="text" class="form-control" name="kycAds1" aria-describedby="textHelp">\
               <div id="textHelp" class="form-text">Address Line 1</div>\
             </div>\
             <div class="mb-3">\
               <input type="text" class="form-control" name="kycAds2" aria-describedby="textHelp">\
               <div id="textHelp" class="form-text">Address Line 2</div>\
             </div>\
             <div class="mb-3">\
               <label for="exampleInputText1" class="form-label">Pin / Post Code: </label>\
               <input type="text" class="form-control" name="kycPincode" aria-describedby="textHelp">\
             </div>\
             <div class="mb-3">\
               <label for="exampleInputText1" class="form-label">City :</label>\
               <input type="text" class="form-control" name="kycCity" aria-describedby="textHelp">\
             </div>\
             <div class="mb-3">\
               <label for="exampleInputText1" class="form-label">Country :</label>\
               <select name="kycCuntry" id="kycCuntry" class="form-select" id="kycCountry">\
                 <option value="India">India</option>\
                 <option value="2">Two</option>\
                 <option value="3">Three</option>\
               </select>\
             </div>\
           </div>\
         </div>\
       </div>\
       <div class="accordion-item">\
         <h2 class="accordion-header" id="panelsStayOpen-headingTwo">\
           <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">\
             Document Upload:\
           </button>\
         </h2>\
         <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">\
           <div class="accordion-body">\
             <div class="mb-3">\
               <label class="btn btn-default ">Selfe Photo &nbsp; <span style="color: darkblue;" ><i class="fa fa-camera" aria-hidden="true"></i></span> \
                 <input name="fileSelfe" type="file" accept="image/*" capture="camera" style="width: 1px; height: 1px;">\
             </label>\
             <div id="textHelp" class="form-text">Image should be Clear</div>\
             </div>\
             <select name="kycID" class="form-select" aria-label="Default select example">\
               <option value="PAN CARD">PAN CARD</option>\
               <option value="Aadhar card">Aadhar card</option>\
               <option value="Driving Licence">Driving Licence</option>\
               <option value="Passport">Passport</option>\
               <option value="National ID Card">National ID Card</option>\
             </select>\
             <div class="mb-3">\
               <input type="text" class="form-control" name="kycIdNo" aria-describedby="textHelp">\
             </div>\
             <div class="mb-3">\
               <label class="btn btn-default">Govt ID Card &nbsp; <span style="color: darkblue;" ><i class="fa fa-camera" aria-hidden="true"></i></span> \
                 <input name="filekycId" type="file" accept="image/*" capture="camera" style="width: 1px; height: 1px;">\
             </label>\
               <div id="textHelp" class="form-text">Image should be Clear</div>\
             </div>\
           </div>\
         </div>\
       </div>\
       <div class="accordion-item">\
         <h2 class="accordion-header" id="panelsStayOpen-headingThree">\
           <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">\
            Record Video:\
           </button>\
         </h2>\
         <div id="panelsStayOpen-collapseThree" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingThree">\
           <div class="accordion-body">\
             <label for="exampleInputText1" id="videoContent" class="form-label">Record a Video : <br/> </label>\
             <label class="btn btn-default">Record Video &nbsp; <span style="color: darkblue;" ><i class="fa fa-camera" aria-hidden="true"></i></span>\
               <input name="filekycVideo" type="file" accept="video/*" capture="camcorder" style="width: 1px; height: 1px;">\
           </label>\
           <input  name="userID" value="'+userID+'" type="hidden">\
           <div id="kycsubmitArea" class="mb-3">\
               <button  type="submit"  class="btn btn-secondary">Submit</button>\
           </div>\
         </div> \
       </div>\
     </div>\
     </div>\
     </div>\
   </form>')
   cuntryList();
  }

  function cuntryList(){
    $.post('/user/getCountryList',{},function(data){
    if(data){
      $("#kycCuntry").html('');
      data.forEach(val => {
        $("#kycCuntry").append('<option value="'+val.country+'">'+val.country+'</option>');
          });
        }
      })
}



  function nameUpdate(name){
    $("#videoContent").html('Record a Video : <br/>Hi , My Name is '+name+' my date of birth dd/mm/yyyy. I like to open paa crypto bank account')
  }


  function setResetTpin(userID){

    $("#topBacground").css({"display":"none"});
    $("#view").html('<div class="card" style="margin-top: 20vh; background-color: #2e353a; color: rgb(164, 199, 119);">\
    <div class="card-header">\
      <button onclick="closeWithdral()" type="button" class="btn-close btn-close-white float-end" aria-label="Close"></button>\
      <h5>Set / Re-Set Transaction Pin</h5>\
    </div>\
    <div id="tpinBody" class="card-body">\
      <div class="mb-3">\
        <label for="formFile" class="form-label">Login Password</label>\
        <input class="form-control text-center" type="password" id="passw">\
         <label id="msgtpin" style="display:none; color:#dd8aa4" class="form-label">Password Not Matvh Try Again</label>\
      </div>\
      <button onclick="tpinVeryfyPassword('+userID+')" type="button" class="btn btn-success">Veryfy</button>\
    </div>\
  </div>')
  }

  function tpinVeryfyPassword(userID){
    var pasw=$("#passw").val();
    $.post('/user/verifyPassword',{pasw:pasw,userID:userID},function(data){
        if(data){
          $("#tpinBody").html('<div class="mb-3">\
            <label for="exampleInputText1" class="form-label">New T Pin</label>\
            <input type="number" class="form-control text-center" id="tpin1" aria-describedby="textHelp">\
            <div id="textHelp" class="form-text">4 Digit Transaction Pin</div>\
          </div>\
          <div class="mb-3">\
            <label for="exampleInputText1" class="form-label">Re-Type T Pin</label>\
            <input type="number" class="form-control text-center" id="tpin2" aria-describedby="textHelp">\
          </div>\
          <button onclick="setTPin('+userID+')" type="button" class="btn btn-success">Set Pin</button>')
        }else{
          $("#msgtpin").css({"display":"block"})
        }
    })
  }


  function setTPin(userID){
    var tpin1=$("#tpin1").val();
    var tpin2=$("#tpin2").val();
    if(tpin1==tpin2 && tpin1.length > 0 && tpin2.length > 0 ){
      $.post('/user/setTpin',{tpin:tpin1,userID:userID},function(data){
        if(data){
          getUserprofile(userID);
        }
      })
    }else{
      alert("Pin not Match");
    }
   
  }


  function footer(userID){
    $("#footnav").css({"display":"block"});
    
    
  }

  function copyContent(content){
    navigator.clipboard.writeText(content);
  }

  function desebleSubmitBtn(){
    
    $("#kycsubmitArea").html('<img style="height: 30px; width: 30px;" src="/images/gif/progress.gif">')
  }

  function depositSubmit(){
    $("#fundButton").html('<img style="height: 30px; width: 30px;" src="/images/gif/progress.gif">')
  }

  

  
 
  


  






  

  
  