$( document ).ready(function() {
    var allredyloginuserID=$("#allredyloginuserID").val();
    

    $('#formId' ).submit(
   
        function( e ) {
            $.ajax( {
                url: '/admin/uploadFundRecive',
                type: 'POST',
                data: new FormData( this ),
                processData: false,
                contentType: false,
                success: function(result){
                    console.log(result);
                    //$("#div1").html(str);
                }
            } );
            e.preventDefault();
        } 
        
    );

    getdipositRequest();
   

})

function addModifyCountry(){
    var countryName=$("#countryName").val().trim();
    var countryCode=$("#countryCode").val().trim();
    var countryCurrency=$("#countryCurrency").val().trim();
    var currencySymbol=$("#currencySymbol").val().trim();
    $.post('/admin/addModifyCountry',{
        countryName:countryName,
        countryCode:countryCode,
        countryCurrency:countryCurrency,
        currencySymbol:currencySymbol
    },function(user){
       console.log(user)
    })


}

function submitTransactionCharges(){
    var currencyFee=$("#currencyFee").val().trim();
    var limitAmount=$("#limitAmount").val().trim();
    var transactionCgarge=$("#transactionCgarge").val().trim();

    $.post('/admin/addCgargesList',{
        currencyFee:currencyFee,
        limitAmount:limitAmount,
        transactionCgarge:transactionCgarge
    },function(user){
       console.log(user)
       alert("fee Add")
    })

}

function chargestList(){
    $.post('/admin/usdtList',{},function(data){
        $("#usdtList").html('')
        data.forEach(val => {
            $("#usdtList").append('<li class="list-group-item">\
            <p class="">Country : '+val.country+' ['+val.currency+'] <br> USDT Rate: '+val.usdtRate+'</p>\
           </li>');

            }); 
    })
   

}

function getdipositRequest(){
    $.post('/admin/getdipositRequest',{},function(data){
       
        $("#dipositRequestList").html('')
        data.forEach(val => {
            $("#dipositRequestList").append(' <li class="list-group-item">\
            <span style="font-size: medium;" class="badge bg-secondary float-end">'+val.depositAmount+' USDT</span>\
            <P class="">Account no: '+val.accountNumber+' <br>Mobile: '+val.countryCode+'-'+val.mobile+'<br>'+val.email+'</P>\
            <img onclick="imageZoom('+val.trasactionID+')" id="'+val.trasactionID+'" style="width: 20%; height: 20%;" class=" img-thumbnail float-end " src="'+val.screenSort+'" alt="scrn">\
            <P class="">Paa Txid: '+val.trasactionID+'<br>Crypto txid: '+val.cryptoTransactionID+'<br>Date: '+val.date+'</P>\
            <button onclick="acceptDipositRequest(\''+val.trasactionID+'\')" type="button" class="btn btn-success btn-sm">Accept</button>\
            <button type="button" class="btn btn-danger btn-sm">Reject</button>\
          </li>');
        });

        
        getverificationRequest()
        
    });
}

function acceptDipositRequest(trasactionID){
    $.post('/admin/acceptDipositRequest',{trasactionID:trasactionID},function(data){
        getdipositRequest();
    });
}

function getverificationRequest(){
    $.post('/admin/getverificationRequest',{},function(data){
       
        $("#accountVerification").html('')
        data.forEach(val => {
            $("#accountVerification").append(' <li class="list-group-item">\
            <P class="">Name: '+val.userName+' <br>UserID: '+val.userID+' <br>Gov ID: '+val.idProof+' [ '+val.idNo+' ]<br>Address : '+val.address1+','+val.address2+', pin- '+val.postCode+', '+val.city+', '+val.country+', <br>Date: '+dateFormat(new Date(val.date),"dt")+'</P>\
            <img onclick="imageZoom(1'+val.userID+')" id="1'+val.userID+'" style="width: 20%; height: 20%;" class=" img-thumbnail float-end " src="'+val.selfyPicture+'" alt="scrn">\
            <img onclick="imageZoom(2'+val.userID+')" id="2'+val.userID+'" style="width: 20%; height: 20%;" class=" img-thumbnail float-end " src="'+val.idProofPicture+'" alt="scrn">\
            <button onclick="completeVerification(\''+val.userID+'\')" type="button" class="btn btn-success btn-sm ">Verified</button>\
            <button type="button" class="btn btn-danger btn-sm ">Reject</button>\
            <div class="">\
               <br><video class="float-end" width="160" height="120" controls>\
                 <source src="'+val.videoRecording+'" type="video/mp4">\
               </video>\
            </div>\
          </li>')
        });

        getCountryList();

    });
}


function completeVerification(userID){
    $.post('/admin/completeVerification',{userID:userID},function(data){
        getverificationRequest()
    });
}


function dateFormat(date,frmat){  
    var year=date.getFullYear();  
    var month=date.getMonth()+1; 
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

function getCountryList(){
    $.post('/admin/getCountryList',{},function(data){
        
        $("#countryList").html('');
        $("#currencyFee").html('');
        data.forEach(val => {
            $("#countryList").append('<option value="'+val.country+','+val.currency+'">'+val.country+'</option>');
            $("#currencyFee").append('<option value="'+val.currency+'">'+val.currency+'</option>')
            });

            usdtList();
        });
        
}

function updateUsdtRate(){
    var datas=$("#countryList").val().split(",");
    var country=datas[0]
    var currency=datas[1]
    var usdtRate=$("#usdtRate").val();
    $.post('/admin/updateUsdtRate',{country:country,currency:currency,usdtRate:usdtRate},function(result){
        usdtList()
    })
}

function usdtList(){
    $.post('/admin/usdtList',{},function(data){
        $("#usdtList").html('')
        data.forEach(val => {
            $("#usdtList").append('<li class="list-group-item">\
            <p class="">Country : '+val.country+' ['+val.currency+'] <br> USDT Rate: '+val.usdtRate+'</p>\
           </li>');

            }); 
    })
   

}


function forgetpasswordInit(){
    // $("#forgetpassword").css({"display":"block"});
    // $("#forgetpassword").html('<div  class="col-xs-12 col-sm-12">\
    // <div class="panel panel-danger">\
    //     <div class="panel-heading">\
    //             <h3 class="panel-title">Forget Password List</h3>\
    //     </div>\
    //     <div class="panel-body">\
    //           <ul class="list-group" id="forgetList">\
    //           </ul>\
    //     </div>\
    // </div>')
    $.post('/admin/forgetpasswordlist',{},function(fgpwlist){
        $("#forgetList").html('');
        if(fgpwlist.length >0 ){
            fgpwlist.forEach(val => {
                $("#forgetList").append('\
                <li class="list-group-item">\
               <p>Name: '+val.userName+' <br>Mobile:'+val.countryCode+' '+val.mobile+' \
                <br>Email : '+val.email+'</p>\
                <span onclick="setNewPassword(\'' +val.userID + '\',\'' + val.newPassword + '\')" class="badge bg-success">Accept</span>\
                <span onclick="setNewPasswordCancel(\'' +val.userID + '\',\'' + val.newPassword + '\')" class="badge bg-danger">Reject</span>\
               </li>')  
            });
          
        }else{
            $("#forgetList").html('');
        }
    })

}

function setNewPassword(userID,newPassword){
$.post('/admin/setNewPassword',{userID:userID,newPassword:newPassword},function(data){
    forgetpasswordInit();
})
}

function setNewPasswordCancel(userID,newPassword){
    $.post('/admin/setNewPasswordCalcel',{userID:userID},function(data){
        forgetpasswordInit();
    })
}


// function addFundRecive(e){
//     e.preventDefault();
//     var virtualAddress=$("#virtualAddress").val().trim();
//     var networkChannel=$("#networkChannel").val().trim();
//     var cryptoCurrency=$("#cryptoCurrency").val().trim();
//     var currencySymbol=$("#currencySymbol").val().trim();

//     alert(virtualAddress)
//     // $.post('/admin/addModifyCountry',{
//     //     countryName:countryName,
//     //     countryCode:countryCode,
//     //     countryCurrency:countryCurrency,
//     //     currencySymbol:currencySymbol
//     // },function(user){
//     //    console.log(user)
//     // })
   
// }

