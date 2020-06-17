"use strict";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function GetShoppingAdminPanel(){
  let str="";
  let Shopping = {}
  str=localStorage.getItem("shopping");
  if (str==null){
    Shopping.sum=0
    Shopping.CNT=0
    Shopping.pos=[]
  } else {
    Shopping = JSON.parse(str);
  }
  let post_body  = JSON.stringify({sum:Shopping.sum,CNT:Shopping.CNT,pos:Shopping.pos});

  let xhttp = new XMLHttpRequest();
  let tempstr = '';
  let pagesstr = '';
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        let answer = JSON.parse(this.responseText)
        Shopping.sum=answer.sum
        Shopping.CNT=answer.CNT
        Shopping.pos=answer.pos
        localStorage.setItem("shopping",JSON.stringify(Shopping))
        document.getElementById("find_login_shopping_count").innerText=answer.CNT+" ("+answer.sum+" грн)"
        document.getElementById("find_login_shopping_count").href = '/shopping?filter='
      }
    }
  }
  xhttp.open("POST", "/shopping/check_shopping", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send((post_body));
}

function UpdateShoppingPage (filter) {
  if (filter == undefined){filter = ""}
  let str="";
  let Shopping = {}
  str=localStorage.getItem("shopping");
  if (str==null){
    Shopping.sum=0
    Shopping.CNT=0
    Shopping.pos=[]
  } else {
    Shopping = JSON.parse(str);
  }
  let post_body  = JSON.stringify({sum:Shopping.sum,CNT:Shopping.CNT,pos:Shopping.pos, filter:filter});

  let xhttp = new XMLHttpRequest();
  let tempstr = '';
  let pagesstr = '';
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        let answer = JSON.parse(this.responseText)

        tempstr =
          '<div class=\"content_grid_sub_tab\" id="content_grid_sub" style="border: 0">'+
          '<div class=\"content_grid_item_1_content\">'+
          '<input class="AddContentButton" type="button" value="Заказать" onclick="CreateOrder()">'+
          '</div>'+
          '</div>';

        tempstr = tempstr+
          '<div class=\"content_grid_sub_tab\" id="content_grid_sub" >'+
          '<div class=\"content_grid_item_1_shopping\">'+
          '<h3>Фото</h3>'+
          '  </div>'+
          '<div class=\"content_grid_item_2_shopping\" >'+
          '<h3>Название</h3>'+
          '</div>'+
          '<div class=\"content_grid_item_3_shopping\" >'+
          '<h3>Цена</h3>'+
          '</div>'+
          '<div class=\"content_grid_item_4_shopping\" >'+
          '<h3>Кол-во</h3>'+
          '</div>'+
          '<div class=\"content_grid_item_5_shopping\" >'+
          '<h3>Сумма</h3>'+
          '</div>'+
          '<div class=\"content_grid_item_6_shopping\" >'+
          '<h3></h3>'+
          '</div>'+
          '</div>';

        for (let i=0; i<answer.pos.length; i++) {
          if ((i<answer.pos.length)&&(answer.pos[0].posname.indexOf!=-1)) {
            tempstr = tempstr+
              '<div class=\"content_grid_sub_tab\" id="content_grid_sub" >'+
              '<div class=\"content_grid_item_1_shopping\">'+
              '<a class=\"content_grid_item_1_content_link\" align=\"center\">' +
              '<img class=\"content_grid_item_img\" src=\"../content/img/pos/pos_'+answer.pos[i].id+'.jpg\"> </a>'+
              '</div>'+
              '<div class=\"content_grid_item_2_shopping\" >'+
              '<a class=\"content_grid_item_1_content_link\"> '+answer.pos[i].posname+' </a>'+
              '</div>'+
              '<div class=\"content_grid_item_3_shopping\" >'+
              '<a class=\"content_grid_item_1_content_link\"> '+answer.pos[i].price+' </a>'+
              '</div>';

            let b=false
            let tempsum=0

            for (let j=0; j<Shopping.pos.length; j++) {
              if (Number(Shopping.pos[j].id) == Number(answer.pos[i].id)) {
                b=true
                tempstr = tempstr+'' +
                  '<div class=\"content_grid_item_4_shopping\" >'+
                  '<a class=\"content_grid_item_1_content_link\" id="count_link_'+answer.pos[i].id+'"> '+Shopping.pos[j].CNT+' </a> <a href="javascript:ShoppingCountUp('+Shopping.pos[j].id+')">  +</a>/<a href="javascript:ShoppingCountDown('+Shopping.pos[j].id+')">-</a>'+
                  '</div>';
                tempsum=Shopping.pos[j].CNT;
              }
            }
            if (b==false) {
              tempstr = tempstr+
                '<div class=\"content_grid_item_4_shopping\" >'+
                '<a class=\"content_grid_item_1_content_link\"> Нет на складе </a>'+
                '</div>';
            }
            tempstr = tempstr+
              '<div class=\"content_grid_item_5_shopping\" >'+
              '<a class=\"content_grid_item_1_content_link\" id="sum_link_'+answer.pos[i].id+'"> '+Number(tempsum)*Number(answer.pos[i].price)+' </a>'+
              '</div>'+
              '<div class=\"content_grid_item_6_shopping\" >'+
              '<input class="DeleteContentButton" type="button" value="Удалить" onclick="ShoppingDelete('+answer.pos[i].id+',\''+filter+'\')">    '+
              '</div>'+
              '</div>';
          }
        }
        document.getElementById("content_grid").innerHTML = '<div class="content_grid_loader" id="content_grid_loader"></div>'+tempstr
      }
       document.getElementById("loader").style.display = "none"
    }
  }
  xhttp.open("POST", "/shopping/check_shopping", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send((post_body));
}

async function AddToShopping(id,CNT,price, posname) {
  document.getElementById("loader").style.display = "block"
  await sleep(600)
  let str='';
  let Shopping = {}
  let ShPos = {id:id, CNT:CNT, price:price, posname: posname}
  let b=false

  str=localStorage.getItem("shopping");
  if (str==null){
    Shopping.sum=0
    Shopping.CNT=0
    Shopping.pos= new Array()

  } else {
    Shopping = JSON.parse(str);
  }

  b=false
  for ( let i = 0; i < Shopping.pos.length; i++) {
    if (ShPos.id==Shopping.pos[i].id){
      b=true
      Shopping.pos[i].CNT=Number(Shopping.pos[i].CNT)+Number(ShPos.CNT)
      Shopping.pos[i].price=Number(Shopping.pos[i].price)+Number(ShPos.price)
    }
  }
  if (b==false) {
    Shopping.pos[Number(Shopping.pos.length)]=ShPos
  }
  Shopping.sum=0
  Shopping.CNT=Shopping.pos.length
  for (let i=0; i<Shopping.pos.length; i++)
  {
    Shopping.sum=Number(Shopping.sum)+Number(Shopping.pos[i].price)
  }
  localStorage.setItem("shopping",JSON.stringify(Shopping))
  document.getElementById("find_login_shopping_count").innerText=Shopping.CNT+" ("+Shopping.sum+" грн)"
  document.getElementById("loader").style.display = "none"
}

async function ShoppingCountUp(id){
  let str='';
  let Shopping = {}
  let b=false

  str=localStorage.getItem("shopping");
  if (str==null){
    Shopping.sum=0
    Shopping.CNT=0
    Shopping.pos= new Array()

  } else {
    Shopping = JSON.parse(str);
  }

  b=false
  for ( let i = 0; i < Shopping.pos.length; i++) {
    if (id==Shopping.pos[i].id){
      b=true

      Shopping.pos[i].price=Number(Shopping.pos[i].price)+Number(Shopping.pos[i].price/Shopping.pos[i].CNT)
      Shopping.pos[i].CNT=Number(Shopping.pos[i].CNT)+Number(1)
      document.getElementById("count_link_"+id).innerText=Shopping.pos[i].CNT
      document.getElementById("sum_link_"+id).innerText=Shopping.pos[i].price
    }
  }

  Shopping.sum=0
  Shopping.CNT=Shopping.pos.length
  for (let i=0; i<Shopping.pos.length; i++)
  {
    Shopping.sum=Shopping.sum+Shopping.pos[i].price
  }
  localStorage.setItem("shopping",JSON.stringify(Shopping))
  document.getElementById("find_login_shopping_count").innerText=Shopping.CNT+" ("+Shopping.sum+" грн)"
}

async function ShoppingCountDown(id){
  let str='';
  let Shopping = {}
  let b=false

  str=localStorage.getItem("shopping");
  if (str==null){
    Shopping.sum=0
    Shopping.CNT=0
    Shopping.pos= new Array()

  } else {
    Shopping = JSON.parse(str);
  }

  b=false
  for ( let i = 0; i < Shopping.pos.length; i++) {
    if (id==Shopping.pos[i].id){
      b=true
      if (Shopping.pos[i].CNT>1) {
        Shopping.pos[i].price = Number(Shopping.pos[i].price) - Number(Shopping.pos[i].price / Shopping.pos[i].CNT)
        Shopping.pos[i].CNT = Number(Shopping.pos[i].CNT) - Number(1)
        document.getElementById("count_link_" + id).innerText = Shopping.pos[i].CNT
        document.getElementById("sum_link_" + id).innerText = Shopping.pos[i].price
      }
    }
  }

  Shopping.sum=0
  Shopping.CNT=Shopping.pos.length
  for (let i=0; i<Shopping.pos.length; i++)
  {
    Shopping.sum=Shopping.sum+Shopping.pos[i].price
  }
  localStorage.setItem("shopping",JSON.stringify(Shopping))
  document.getElementById("find_login_shopping_count").innerText=Shopping.CNT+" ("+Shopping.sum+" грн)"
}

async function ShoppingDelete(id, filter){
  document.getElementById("loader").style.display = "block"
  let str='';
  let Shopping = {}
  let ShoppingNew = {}
  let b=0

  ShoppingNew.sum=0
  ShoppingNew.CNT=0
  ShoppingNew.pos= new Array()

  str=localStorage.getItem("shopping");
  if (str==null){
    Shopping.sum=0
    Shopping.CNT=0
    Shopping.pos= new Array()

  } else {
    Shopping = JSON.parse(str);
  }

  for ( let i = 0; i < Shopping.pos.length; i++) {
    if (id!=Shopping.pos[i].id){
      b = b + 1
      ShoppingNew.pos.length = b
      ShoppingNew.pos[b-1]=Shopping.pos[i]
    }
  }

  ShoppingNew.sum=0
  ShoppingNew.CNT=ShoppingNew.pos.length
  for (let i=0; i<ShoppingNew.pos.length; i++)
  {
    ShoppingNew.sum=ShoppingNew.sum + ShoppingNew.pos[i].price
  }

  localStorage.setItem("shopping",JSON.stringify(ShoppingNew))
  GetShoppingAdminPanel()
  UpdateShoppingPage(filter)

}

async function CreateOrder() {
  document.getElementById("loader").style.display = "block"
  let str='';
  let Shopping = {}
  str=localStorage.getItem("shopping");
  if (str==null){
    Shopping.sum=0
    Shopping.CNT=0
    Shopping.pos=[]
  } else {
    Shopping = JSON.parse(str);
  }
  let post_body  = JSON.stringify({post_type:'CreateOrder',sum:Shopping.sum, CNT:Shopping.CNT,pos:Shopping.pos});

  let xhttp = new XMLHttpRequest();
  let tempstr = '';
  let pagesstr = '';
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        let answer = JSON.parse(this.responseText)
      }
      UpdateShoppingPage("")
    }
  }
  xhttp.open("POST", "/orders/create_order", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send((post_body));
}

