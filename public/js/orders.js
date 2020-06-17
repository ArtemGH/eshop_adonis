function HideEditOrderWindow() {
  document.getElementById("modal_container").style.display = "none"
  document.getElementById("modal_container").innerHTML = ""
}

function ShowEditOrderWindow(order_id, username, filter, page_n) {

  document.getElementById("loader").style.display = "block"
  let orderid = {order_id: order_id, username:username};
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let data  = JSON.parse(this.responseText)
      document.getElementById("modal_container").innerHTML = data.modal_form;
      let EditWindow=""
      EditWindow = EditWindow +'<dl><dt>Имя:</dt><dd>'+data.modal_data[0].user_first_name+'</dd></dl>'
      EditWindow = EditWindow +'<dl><dt>Фамилия:</dt><dd>'+data.modal_data[0].user_last_name+'</dd></dl>'
      EditWindow = EditWindow +'<dl><dt>Телефон:</dt><dd><a href="tel:'+data.modal_data[0].user_tel+'">'+data.modal_data[0].user_tel+'</a></dd></dl>'
      EditWindow = EditWindow +'<dl><dt>Mail:</dt><dd><a class="logo_contact_mail" href="mailto:'+data.modal_data[0].user_email+'">'+data.modal_data[0].user_email+'</a></dd></dl>'
      EditWindow = EditWindow +'<p></p>'
      EditWindow = EditWindow +'<dl><dt>Заказ дата:</dt><dd>'+data.modal_data[0].created_at+'</dd></dl>'
      EditWindow = EditWindow +'<dl><dt>Заказ сумма:</dt><dd>'+data.modal_data[0].order_sum+'</dd></dl>'
      EditWindow = EditWindow +'<dl><dt>Заказ статус:</dt><dd>'+data.modal_data[0].order_status+'</dd></dl>'
      if (data.modal_data[0].order_status=="Открыт"){
        EditWindow = EditWindow +'<input type="button" class="edit_order_btn_order_exec" id="edit_order_btn_order_exec" value="Выполнить" onclick="ExecOrder('+order_id+','+page_n+',\''+filter+'\',\''+username+'\')">'
        EditWindow = EditWindow +'<p></p>'
        EditWindow = EditWindow +'<input type="button" class="edit_order_btn_order_cancel" id="edit_order_btn_order_cancel" value="Отменить" onclick="CancelOrder('+order_id+','+page_n+',\''+filter+'\',\''+username+'\')">'
      }
      if (data.modal_data[0].order_status=="Отменен"){
        EditWindow = EditWindow +'<input type="button" class="edit_order_btn_order_return" id="edit_order_btn_order_return" value="Восстановить" onclick="ReturnOrder('+order_id+','+page_n+',\''+filter+'\',\''+username+'\')">'
      }
      document.getElementById("edit_order_left_side_box").innerHTML =EditWindow
      EditWindow=''
      EditWindow = EditWindow + '<div class=\"content_grid_sub_tab_o\" id="content_grid_sub" >'
      EditWindow = EditWindow + '<div class=\"content_grid_item_1_order\"><h3>Позиция</h3></div>'
      EditWindow = EditWindow + '<div class=\"content_grid_item_2_order\" ><h3>Цена</h3></div>'
      EditWindow = EditWindow + '<div class=\"content_grid_item_2_order\" ><h3>Кол-во</h3></div>'
      EditWindow = EditWindow + '<div class=\"content_grid_item_2_order\" ><h3>Сумма</h3></div>'
      EditWindow = EditWindow + '<div class=\"content_grid_item_2_order\" ><h3></h3></div>'
      EditWindow = EditWindow + '</div>';

      for (let i=0; i<data.modal_data.length; i++){
        EditWindow = EditWindow + '<div class=\"content_grid_sub_tab_o\" id="content_grid_sub" >'
        EditWindow = EditWindow + '<div class=\"content_grid_item_1_order\">'+data.modal_data[i].order_pos_name+'</div>'
        EditWindow = EditWindow + '<div class=\"content_grid_item_2_order\" >'+data.modal_data[i].order_pos_prise+'</div>'
        EditWindow = EditWindow + '<div class=\"content_grid_item_2_order\" >'+data.modal_data[i].order_pos_count+'</div>'
        EditWindow = EditWindow + '<div class=\"content_grid_item_2_order\" >'+data.modal_data[i].order_pos_sum+'</div>'
        EditWindow = EditWindow + '<div class=\"content_grid_item_2_order\" ></div>'
        EditWindow = EditWindow + '</div>';
      }
      document.getElementById("edit_order_right_side").innerHTML =EditWindow

    }
    if (this.readyState == 4) {
      document.getElementById("loader").style.display = "none"
    }
  };
  xhttp.open("POST", "/orders/get_edit_order_window", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(orderid));
  document.getElementById("modal_container").style.display = "block"
}

function UpDateOrdersPage(page_n,filter,username){
  let post_body  = JSON.stringify({post_type: 'UpDateOrdersPage', page_n: page_n, filter: filter, username: username});
  let xhttp = new XMLHttpRequest();
  let tempstr = '';
  let pagestr = '';

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        let answer = JSON.parse(this.responseText)

        tempstr ='';
        pagestr = '<div class="pages">'
        pagestr = pagestr + "Страница:    "

        if (page_n>1) {
          pagestr = pagestr + "<a class=\"page\" href=\"/orders?page=1&filter="+filter+"\" title=\"Первая\"> << </a>"
          pagestr = pagestr + "<a class=\"page\" href=\"/orders?page="+(page_n-1)+"&filter="+filter+"\" title=\"Предыдущая\"> < </a>"
        }
        for (let i = page_n-3; i<=page_n+3; i++)
        {
          if ((i>0) && (i<=answer.page_count)){
            if (i==page_n) {
              pagestr = pagestr + "<a class=\"page_activ\" href=\"/orders?page="+i+"&filter="+filter+"\" title=\"\"> "+i+" </a>"
            }
            if (i!=page_n) {
              pagestr = pagestr + "<a class=\"page\" href=\"/orders?page="+(i)+"&filter="+filter+"\" title=\"\"> "+i+" </a>"
            }
          }
        }
        if (page_n<answer.page_count) {
          pagestr = pagestr + "<a class=\"page\" href=\"/orders?page="+(page_n+1)+"&filter="+filter+"\" title=\"Следующая\"> > </a>"
          pagestr = pagestr + "<a class=\"page\" href=\"/orders?page="+answer.page_count+"&filter="+filter+"\" title=\"Последняя\"> >> </a>"
        }
        pagestr = pagestr+'</div>'

        tempstr =""
        tempstr = tempstr+
          '<div class=\"content_grid_sub_tab\" id="content_grid_sub" >'+
          '<div class=\"content_grid_item_1_orders\">'+
          '<h3>User</h3>'+
          '  </div>'+
          '<div class=\"content_grid_item_2_orders\" >'+
          '<h3>Дата</h3>'+
          '</div>'+
          '<div class=\"content_grid_item_3_orders\" >'+
          '<h3>Сумма</h3>'+
          '</div>'+
          '<div class=\"content_grid_item_4_orders\" >'+
          '<h3>Статус</h3>'+
          '</div>'+
          '</div>';

        for (let i=0; i<10; i++) {
          if (i<answer.data.length) {
            tempstr = tempstr+'<div class=\"content_grid_sub_tab\">'
            tempstr = tempstr+'<div class=\"content_grid_item_1_orders\">'
            tempstr = tempstr+'<a href=javascript:ShowEditOrderWindow('+answer.data[i].id+',\''+username+'\',\''+filter+'\','+page_n+') class=\"content_grid_item_1_users_link\" align=\"right\"> '+answer.data[i].user_login+' </a>'
            tempstr = tempstr +'</div>';
            tempstr = tempstr+'<div class=\"content_grid_item_2_orders\">'
            tempstr = tempstr+'<a href=javascript:ShowEditOrderWindow('+answer.data[i].id+',\''+username+'\',\''+filter+'\','+page_n+') class=\"content_grid_item_1_users_link\" align=\"right\"> '+answer.data[i].created_at+' </a>'
            tempstr = tempstr +'</div>';
            tempstr = tempstr+'<div class=\"content_grid_item_3_orders\">'
            tempstr = tempstr+'<a href=javascript:ShowEditOrderWindow('+answer.data[i].id+',\''+username+'\',\''+filter+'\','+page_n+') class=\"content_grid_item_1_users_link\" align=\"right\"> '+answer.data[i].order_sum+' </a>'
            tempstr = tempstr +'</div>';
            tempstr = tempstr+'<div class=\"content_grid_item_4_orders\" >'
            tempstr = tempstr+'<a href=javascript:ShowEditOrderWindow('+answer.data[i].id+',\''+username+'\',\''+filter+'\','+page_n+') class=\"content_grid_item_1_users_link\" align=\"right\"> '+answer.data[i].order_status+' </a>'
            tempstr = tempstr +'</div>';
            tempstr = tempstr +'</div>';
          }
        }
        document.getElementById("content_grid").innerHTML = '<div class="content_grid_loader" id="content_grid_loader"></div>'+pagestr+tempstr+pagestr
        document.getElementById("modal_container").style.display = "none"
      }
      document.getElementById("loader").style.display = "none"
    }
  }
  xhttp.open("POST", "/orders/UpDateOrdersPage", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(post_body);

}

function ExecOrder(order_id, page_n,filter,username){
  document.getElementById("loader").style.display="block"
  let post_body  = JSON.stringify({post_type: 'ExecOrder', order_id: order_id});
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        let answer = JSON.parse(this.responseText)
        document.getElementById("modal_container").style.display = "none"
      }
      UpDateOrdersPage(page_n,filter,username)
    }
  }
  xhttp.open("POST", "/orders/ExecOrder", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(post_body);
}

function CancelOrder(order_id, page_n,filter,username){
  document.getElementById("loader").style.display="block"

  let post_body  = JSON.stringify({post_type: 'CancelOrder', order_id: order_id});
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        let answer = JSON.parse(this.responseText)
        document.getElementById("modal_container").style.display = "none"
      }
      UpDateOrdersPage(page_n,filter,username)
    }
  }
  xhttp.open("POST", "/orders/CancelOrder", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(post_body);
}

function ReturnOrder(order_id, page_n,filter,username){
  document.getElementById("loader").style.display="block"

  let post_body  = JSON.stringify({post_type: 'ReturnOrder', order_id: order_id});
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        let answer = JSON.parse(this.responseText)
        document.getElementById("modal_container").style.display = "none"
      }
      UpDateOrdersPage(page_n,filter,username)
    }
  }
  xhttp.open("POST", "/orders/ReturnOrder", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(post_body);

}
